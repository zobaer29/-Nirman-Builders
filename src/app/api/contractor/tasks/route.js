import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthPayload } from '@/lib/auth';
import { ensureProjectsTable, recalculateProjectProgress } from '@/lib/projects';

export async function POST(request) {
  try {
    // 1. Verify token & authorize (Contractor only)
    const payload = await getAuthPayload(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (Number(payload.roleId) !== 3) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { projectId, workerId, title, description, priority, dueDate } = body;

    if (!projectId || !title) {
      return NextResponse.json({ error: 'Project ID and Title are required' }, { status: 400 });
    }

    // Ensure database tables are created
    await ensureProjectsTable(pool);

    // 2. Verify project exists and belongs to this contractor
    const [projects] = await pool.query(
      'SELECT id, contractor_id FROM projects WHERE id = ?',
      [projectId]
    );

    if (projects.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (Number(projects[0].contractor_id) !== Number(payload.userId)) {
      return NextResponse.json({ error: 'Forbidden: You are not the contractor for this project' }, { status: 403 });
    }

    // 3. Verify worker (if assigned) is valid & has Worker role (role_id = 4)
    let dbWorkerId = null;
    if (workerId) {
      const [users] = await pool.query(
        'SELECT id, role_id FROM users WHERE id = ?',
        [workerId]
      );

      if (users.length === 0) {
        return NextResponse.json({ error: 'Selected worker does not exist' }, { status: 400 });
      }

      if (Number(users[0].role_id) !== 4) {
        return NextResponse.json({ error: 'Selected user is not a worker' }, { status: 400 });
      }

      // Verify worker is assigned to this project (active in project_workers)
      const [assignments] = await pool.query(
        'SELECT id FROM project_workers WHERE project_id = ? AND worker_id = ? AND status = \'Active\'',
        [projectId, workerId]
      );

      if (assignments.length === 0) {
        return NextResponse.json({ error: 'Selected worker is not assigned to this project' }, { status: 400 });
      }

      dbWorkerId = Number(workerId);
    }

    // Validate priority
    const finalPriority = ['Low', 'Medium', 'High'].includes(priority) ? priority : 'Medium';

    // 4. Create task
    const [result] = await pool.query(`
      INSERT INTO tasks (project_id, worker_id, title, description, priority, due_date, status)
      VALUES (?, ?, ?, ?, ?, ?, 'Pending')
    `, [
      projectId,
      dbWorkerId,
      title.trim(),
      description?.trim() || null,
      finalPriority,
      dueDate?.trim() || 'Flexible'
    ]);

    const projectProgress = await recalculateProjectProgress(pool, projectId);

    return NextResponse.json({ 
      message: 'Task created successfully',
      taskId: result.insertId,
      projectId,
      workerId: dbWorkerId,
      title,
      priority: finalPriority,
      dueDate: dueDate || 'Flexible',
      project: projectProgress
    }, { status: 201 });

  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
