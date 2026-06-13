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

    // 2. Fetch projects assigned to this worker
    const [rows] = await pool.query(`
      SELECT 
        p.*,
        pw.role_on_site,
        pw.status as worker_site_status,
        u_contractor.username as contractor_username,
        r_contractor.full_name as contractor_full_name
      FROM projects p
      JOIN project_workers pw ON p.id = pw.project_id
      LEFT JOIN users u_contractor ON p.contractor_id = u_contractor.id
      LEFT JOIN (
        SELECT r1.*
        FROM role_requests r1
        JOIN (
          SELECT user_id, MAX(created_at) as max_date
          FROM role_requests
          WHERE requested_role = 'contractor' AND status = 'accepted'
          GROUP BY user_id
        ) r2 ON r1.user_id = r2.user_id AND r1.created_at = r2.max_date
      ) r ON u_contractor.id = r.user_id
      WHERE pw.worker_id = ? AND pw.status = 'Active'
      ORDER BY pw.assigned_at DESC
    `, [payload.userId]);

    // 3. Map projects to response format matching the UI expectations
    const sites = rows.map((row) => {
      let status = 'Upcoming';
      if (row.status === 'Ongoing') {
        status = 'Active';
      } else if (row.status === 'Completed') {
        status = 'Completed';
      }

      return {
        id: row.id,
        name: row.name,
        location: row.location || 'Plot TBD',
        supervisor: row.contractor_full_name || row.contractor_username || 'Site Admin',
        role: row.role_on_site || 'Technician',
        status: status,
        progress: row.progress || 0,
      };
    });

    return NextResponse.json({ sites }, { status: 200 });
  } catch (error) {
    console.error('Fetch worker projects error:', error);
    return NextResponse.json({ error: 'Failed to fetch assigned projects' }, { status: 500 });
  }
}
