import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthPayload } from '@/lib/auth';
import { ensureProjectsTable } from '@/lib/projects';

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
    const { status } = body;

    const allowedStatuses = ['Pending', 'In Progress', 'Completed'];
    if (!status || !allowedStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status. Must be Pending, In Progress, or Completed' }, { status: 400 });
    }

    // Ensure database tables are created
    await ensureProjectsTable(pool);

    // 2. Fetch task details & verify owner/contractor authority
    const [tasks] = await pool.query(`
      SELECT t.*, p.contractor_id 
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
    // - If Worker: must be the assigned worker
    // - If Contractor: must be the contractor assigned to the parent project
    // - If Admin: always allowed
    let authorized = false;

    if (userRoleId === 1) {
      authorized = true;
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

    return NextResponse.json({ 
      message: 'Task status updated successfully',
      taskId,
      status
    }, { status: 200 });

  } catch (error) {
    console.error('Update task status error:', error);
    return NextResponse.json({ error: 'Failed to update task status' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  return PUT(request, { params });
}
