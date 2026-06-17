import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthPayload } from '@/lib/auth';
import { ensureProjectsTable, recalculateProjectProgress, updateMaterialStock } from '@/lib/projects';

export async function PUT(request, { params }) {
  try {
    // 1. Verify token
    const payload = await getAuthPayload(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const taskId = Number(id);
    if (Number.isNaN(taskId)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    // Parse request body
    const body = await request.json();
    const { status, result } = body;

    const allowedStatuses = ['Pending', 'In Progress', 'Completed'];
    if (!status || !allowedStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status. Must be Pending, In Progress, or Completed' }, { status: 400 });
    }

    // Ensure database tables are created
    await ensureProjectsTable(pool);

    // 2. Fetch task details & verify owner/contractor authority
    const [tasks] = await pool.query(`
      SELECT t.*, p.contractor_id, p.user_id 
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE t.id = ?
    `, [taskId]);

    if (tasks.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const task = tasks[0];
    const userRoleId = Number(payload.roleId);
    const userId = Number(payload.userId);

    // Authorization checks:
    // - If Client/User: must be the project owner
    // - If Worker: must be the assigned worker
    // - If Contractor: must be the contractor assigned to the parent project
    // - If Admin: always allowed
    let authorized = false;

    if (userRoleId === 1) {
      authorized = true;
    } else if (userRoleId === 2) {
      if (Number(task.user_id) === userId) {
        authorized = true;
      }
    } else if (userRoleId === 3) {
      if (Number(task.contractor_id) === userId) {
        authorized = true;
      }
    } else if (userRoleId === 4) {
      if (Number(task.worker_id) === userId) {
        authorized = true;
      }
    }

    if (!authorized) {
      return NextResponse.json({ error: 'Forbidden: You do not have permission to update this task' }, { status: 403 });
    }

    // 3. Update task status
    await pool.query(
      'UPDATE tasks SET status = ? WHERE id = ?',
      [status, taskId]
    );

    // If marked as Completed, check if it's linked to a material request and update that request
    if (status === 'Completed' && task.material_request_id) {
      const targetStatus = result === 'Rejected' ? 'Rejected' : 'Received';
      const [reqs] = await pool.query(
        `SELECT mr.*, p.name as project_name 
         FROM material_requests mr
         JOIN projects p ON mr.project_id = p.id
         WHERE mr.id = ?`,
        [task.material_request_id]
      );
      if (reqs.length > 0) {
        const reqItem = reqs[0];
        if (targetStatus === 'Received') {
          await updateMaterialStock(pool, reqItem.material_name, reqItem.quantity, reqItem.project_name);
        }
      }
      await pool.query(
        'UPDATE material_requests SET status = ? WHERE id = ?',
        [targetStatus, task.material_request_id]
      );
    } else if (status === 'Completed' && (task.title.startsWith('Verify Order:') || task.title.startsWith('Receive:'))) {
      // Direct order with no material_request_id
      const materialName = task.title.replace('Verify Order:', '').replace('Receive:', '').trim();
      if (result !== 'Rejected') {
        const [proj] = await pool.query('SELECT name FROM projects WHERE id = ?', [task.project_id]);
        const siteName = proj.length > 0 ? proj[0].name : 'Project site';
        await updateMaterialStock(pool, materialName, 50, siteName);
      }
    }

    const projectProgress = await recalculateProjectProgress(pool, task.project_id);

    return NextResponse.json({ 
      message: 'Task status updated successfully',
      taskId,
      status,
      project: projectProgress
    }, { status: 200 });

  } catch (error) {
    console.error('Update task status error:', error);
    return NextResponse.json({ error: 'Failed to update task status' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  return PUT(request, { params });
}
