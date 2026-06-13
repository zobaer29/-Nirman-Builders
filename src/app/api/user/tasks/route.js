import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthPayload } from '@/lib/auth';
import { ensureProjectsTable } from '@/lib/projects';

export async function GET(request) {
  try {
    // 1. Verify token & authorize (Client/User only)
    const payload = await getAuthPayload(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (Number(payload.roleId) !== 2) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Ensure database tables are created
    await ensureProjectsTable(pool);

    // 2. Fetch tasks for projects created by this user
    const [rows] = await pool.query(`
      SELECT 
        t.*, 
        p.name as project_name,
        u.username as worker_name,
        r.full_name as worker_full_name
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      LEFT JOIN users u ON t.worker_id = u.id
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
      WHERE p.user_id = ?
      ORDER BY t.created_at DESC
    `, [payload.userId]);

    // 3. Map rows to response format
    const tasks = rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description || '',
      site: row.project_name,
      projectId: row.project_id,
      status: row.status,
      priority: row.priority,
      time: row.due_date || 'Flexible',
      worker: row.worker_full_name || row.worker_name || 'Unassigned',
      workerId: row.worker_id,
    }));

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error('Fetch client tasks error:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}
