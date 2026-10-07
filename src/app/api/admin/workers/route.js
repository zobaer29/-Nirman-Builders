import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthPayload } from '@/lib/auth';
import { ensureProjectsTable } from '@/lib/projects';

export async function GET(request) {
  try {
    // 1. Verify token & authorize (Admin only)
    const payload = await getAuthPayload(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (Number(payload.roleId) !== 1) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Ensure database tables are created
    await ensureProjectsTable(pool);

    // 2. Fetch workers (role_id = 4) and their site assignments
    const [rows] = await pool.query(`
      SELECT 
        u.id, 
        u.username, 
        u.email, 
        u.photoUrl,
        r.full_name,
        r.phone,
        r.specialization as trade,
        (
          SELECT GROUP_CONCAT(p.name SEPARATOR ', ')
          FROM project_workers pw
          JOIN projects p ON pw.project_id = p.id
          WHERE pw.worker_id = u.id AND pw.status = 'Active'
        ) as current_assignment,
        (
          SELECT pw.status
          FROM project_workers pw
          WHERE pw.worker_id = u.id AND pw.status = 'Active'
          LIMIT 1
        ) as assignment_status
      FROM users u
      LEFT JOIN (
        SELECT r1.user_id, r1.full_name, r1.phone, r1.specialization
        FROM role_requests r1
        JOIN (
          SELECT user_id, MAX(id) as max_id
          FROM role_requests
          WHERE requested_role = 'worker' AND status = 'accepted'
          GROUP BY user_id
        ) r2 ON r1.id = r2.max_id
      ) r ON u.id = r.user_id
      WHERE u.role_id = 4
      ORDER BY u.created_at DESC
    `);

    // 3. Format the workers for presentation
    const workers = rows.map((row) => {
      let status = 'Off Duty';
      if (row.assignment_status === 'Active') {
        status = 'On Site';
      } else if (row.assignment_status === 'On Leave') {
        status = 'On Leave';
      }

      return {
        id: `W-${row.id}`,
        dbId: row.id,
        name: row.full_name || row.username,
        email: row.email,
        photoUrl: row.photoUrl || null,
        phone: row.phone || null,
        trade: row.trade || 'General Labor',
        site: row.current_assignment || '-',
        status: status,
      };
    });

    return NextResponse.json({ workers }, { status: 200 });
  } catch (error) {
    console.error('Fetch admin workers error:', error);
    return NextResponse.json({ error: 'Failed to load workers' }, { status: 500 });
  }
}
