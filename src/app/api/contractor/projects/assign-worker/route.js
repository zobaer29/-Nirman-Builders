import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthPayload } from '@/lib/auth';
import { ensureProjectsTable } from '@/lib/projects';

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
    const { projectId, workerId, roleOnSite, shift, attendance } = body;

    if (!projectId || !workerId) {
      return NextResponse.json({ error: 'Project ID and Worker ID are required' }, { status: 400 });
    }

    const finalShift = ['Morning', 'Evening', 'Night'].includes(shift) ? shift : 'Morning';
    const finalAttendance = (attendance !== undefined && !Number.isNaN(Number(attendance)))
      ? Number(attendance)
      : Math.floor(Math.random() * 16) + 85; // Default random attendance between 85% and 100%

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

    // 3. Verify worker exists and has Worker role (role_id = 4)
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

    // 4. Assign worker to project
    // Using ON DUPLICATE KEY UPDATE in case they were previously assigned and status changed
    await pool.query(`
      INSERT INTO project_workers (project_id, worker_id, role_on_site, status, shift, attendance)
      VALUES (?, ?, ?, 'Active', ?, ?)
      ON DUPLICATE KEY UPDATE status = 'Active', role_on_site = ?, shift = ?, attendance = ?
    `, [
      projectId,
      workerId,
      roleOnSite || 'Technician',
      finalShift,
      finalAttendance,
      roleOnSite || 'Technician',
      finalShift,
      finalAttendance
    ]);

    return NextResponse.json({ 
      message: 'Worker assigned to project successfully',
      projectId,
      workerId,
      roleOnSite: roleOnSite || 'Technician',
      shift: finalShift,
      attendance: finalAttendance
    }, { status: 200 });

  } catch (error) {
    console.error('Assign worker error:', error);
    return NextResponse.json({ error: 'Failed to assign worker' }, { status: 500 });
  }
}
