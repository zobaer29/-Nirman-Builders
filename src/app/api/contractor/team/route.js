import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthPayload } from '@/lib/auth';
import { ensureProjectsTable } from '@/lib/projects';

// 1. GET: Fetch contractor team, projects, and available workers
export async function GET(request) {
  try {
    const payload = await getAuthPayload(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (Number(payload.roleId) !== 3) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await ensureProjectsTable(pool);

    const contractorId = Number(payload.userId);

    // Fetch contractor's active team members
    const [teamRows] = await pool.query(`
      SELECT 
        u.id, 
        u.username, 
        u.email, 
        u.photoUrl,
        r.full_name,
        r.phone,
        r.specialization as trade,
        pw.project_id,
        pw.role_on_site,
        pw.status as assignment_status,
        pw.shift,
        pw.attendance,
        p.name as project_name,
        (SELECT COUNT(*) FROM tasks t WHERE t.worker_id = u.id AND t.project_id = p.id) as task_count
      FROM project_workers pw
      JOIN projects p ON pw.project_id = p.id
      JOIN users u ON pw.worker_id = u.id
      LEFT JOIN (
        SELECT r1.*
        FROM role_requests r1
        JOIN (
          SELECT user_id, MAX(created_at) as max_date
          FROM role_requests
          WHERE requested_role = 'worker' AND status = 'accepted'
          GROUP BY user_id
        ) r2 ON r1.user_id = r2.user_id AND r1.created_at = r2.max_date
      ) r ON u.id = r.user_id
      WHERE p.contractor_id = ? AND pw.status IN ('Active', 'Away', 'Off Duty')
      ORDER BY pw.assigned_at DESC
    `, [contractorId]);

    // Format the team roster
    const team = teamRows.map(row => ({
      id: row.id,
      projectId: row.project_id,
      name: row.full_name || row.username,
      email: row.email,
      phone: row.phone || null,
      photoUrl: row.photoUrl || null,
      role: row.role_on_site || row.trade || 'Technician',
      site: row.project_name,
      status: row.assignment_status, // Active, Away, Off Duty
      shift: row.shift || 'Morning',
      attendance: row.attendance || 95,
      tasks: row.task_count || 0,
      img: String((row.id % 70) + 1) // Dynamic gravatar/avatar helper identifier
    }));

    // Fetch contractor's projects list
    const [projectRows] = await pool.query(`
      SELECT id, name, project_type 
      FROM projects 
      WHERE contractor_id = ?
      ORDER BY name ASC
    `, [contractorId]);

    const projects = projectRows.map(row => ({
      id: row.id,
      name: row.name,
      type: row.project_type
    }));

    // Fetch all worker role users to be available for assignment
    const [workerRows] = await pool.query(`
      SELECT 
        u.id, 
        u.username, 
        u.email, 
        u.photoUrl,
        r.full_name,
        r.phone,
        r.specialization as trade,
        p.name as current_assignment,
        pw.status as assignment_status
      FROM users u
      LEFT JOIN (
        SELECT r1.*
        FROM role_requests r1
        JOIN (
          SELECT user_id, MAX(created_at) as max_date
          FROM role_requests
          WHERE requested_role = 'worker' AND status = 'accepted'
          GROUP BY user_id
        ) r2 ON r1.user_id = r2.user_id AND r1.created_at = r2.max_date
      ) r ON u.id = r.user_id
      LEFT JOIN project_workers pw ON u.id = pw.worker_id AND pw.status = 'Active'
      LEFT JOIN projects p ON pw.project_id = p.id
      WHERE u.role_id = 4
      ORDER BY u.created_at DESC
    `);

    const availableWorkers = workerRows.map(row => ({
      id: row.id,
      name: row.full_name || row.username,
      email: row.email,
      trade: row.trade || 'General Labor',
      currentSite: row.current_assignment || null,
      status: row.assignment_status === 'Active' ? 'On Site' : 'Available',
      photoUrl: row.photoUrl || null
    }));

    return NextResponse.json({ team, projects, availableWorkers }, { status: 200 });

  } catch (error) {
    console.error('Fetch contractor team error:', error);
    return NextResponse.json({ error: 'Failed to fetch team data' }, { status: 500 });
  }
}

// 2. PUT: Update a team member's shift, role on site, or status
export async function PUT(request) {
  try {
    const payload = await getAuthPayload(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (Number(payload.roleId) !== 3) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { projectId, workerId, roleOnSite, shift, status } = body;

    if (!projectId || !workerId) {
      return NextResponse.json({ error: 'Project ID and Worker ID are required' }, { status: 400 });
    }

    // Verify project belongs to contractor
    const [projectRows] = await pool.query(
      'SELECT id, contractor_id FROM projects WHERE id = ?',
      [projectId]
    );

    if (projectRows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (Number(projectRows[0].contractor_id) !== Number(payload.userId)) {
      return NextResponse.json({ error: 'Forbidden: You do not manage this project' }, { status: 403 });
    }

    // Prepare fields to update
    const updates = [];
    const params = [];

    if (roleOnSite !== undefined) {
      updates.push('role_on_site = ?');
      params.push(roleOnSite);
    }
    if (shift !== undefined) {
      updates.push('shift = ?');
      params.push(shift);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields provided for update' }, { status: 400 });
    }

    params.push(projectId, workerId);

    const query = `
      UPDATE project_workers 
      SET ${updates.join(', ')} 
      WHERE project_id = ? AND worker_id = ?
    `;

    await pool.query(query, params);

    return NextResponse.json({ message: 'Crew member updated successfully' }, { status: 200 });

  } catch (error) {
    console.error('Update crew member error:', error);
    return NextResponse.json({ error: 'Failed to update crew member' }, { status: 500 });
  }
}

// 3. DELETE: Unassign / remove a crew member from a project
export async function DELETE(request) {
  try {
    const payload = await getAuthPayload(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (Number(payload.roleId) !== 3) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const workerId = searchParams.get('workerId');

    if (!projectId || !workerId) {
      return NextResponse.json({ error: 'Project ID and Worker ID are required' }, { status: 400 });
    }

    // Verify project belongs to contractor
    const [projectRows] = await pool.query(
      'SELECT id, contractor_id FROM projects WHERE id = ?',
      [projectId]
    );

    if (projectRows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (Number(projectRows[0].contractor_id) !== Number(payload.userId)) {
      return NextResponse.json({ error: 'Forbidden: You do not manage this project' }, { status: 403 });
    }

    // Delete project_workers record to fully release the worker
    await pool.query(
      'DELETE FROM project_workers WHERE project_id = ? AND worker_id = ?',
      [projectId, workerId]
    );

    return NextResponse.json({ message: 'Crew member removed from project successfully' }, { status: 200 });

  } catch (error) {
    console.error('Remove crew member error:', error);
    return NextResponse.json({ error: 'Failed to remove crew member' }, { status: 500 });
  }
}
