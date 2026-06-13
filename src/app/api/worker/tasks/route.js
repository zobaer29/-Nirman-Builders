import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthPayload } from '@/lib/auth';
import { ensureProjectsTable } from '@/lib/projects';

export async function GET(request) {
  try {
    // 1. Verify token & authorize (Worker only)
    const payload = await getAuthPayload(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (Number(payload.roleId) !== 4) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Ensure database tables are created
    await ensureProjectsTable(pool);

    // 2. Fetch tasks assigned to this worker
    const [rows] = await pool.query(`
      SELECT 
        t.*,
        p.name as project_name
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE t.worker_id = ?
      ORDER BY t.created_at DESC
    `, [payload.userId]);

    // 3. Map tasks to response format matching the UI expectations
    const tasks = rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description || '',
      site: row.project_name,
      projectId: row.project_id,
      status: row.status, // 'Pending', 'In Progress', 'Completed'
      priority: row.priority, // 'Low', 'Medium', 'High'
      time: row.due_date || 'Flexible',
    }));

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error('Fetch worker tasks error:', error);
    return NextResponse.json({ error: 'Failed to fetch assigned tasks' }, { status: 500 });
  }
}
