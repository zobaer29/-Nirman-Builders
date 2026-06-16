import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthPayload } from '@/lib/auth';
import { ensureProjectsTable, mapProjectRow } from '@/lib/projects';

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

    // 2. Ensure table schema is up to date (run migrations)
    await ensureProjectsTable(pool);

    // 3. Fetch all projects with client and contractor details
    const [rows] = await pool.query(`
      SELECT 
        p.*,
        u_client.username as client_username,
        u_client.email as client_email,
        u_contractor.username as contractor_username,
        u_contractor.email as contractor_email,
        r.full_name as contractor_full_name
      FROM projects p
      LEFT JOIN users u_client ON p.user_id = u_client.id
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
      ORDER BY p.created_at DESC
    `);

    // 4. Map the database rows to response objects
    const projects = rows.map((row) =>
      mapProjectRow(
        row, 
        row.client_username, 
        row.contractor_full_name || row.contractor_username || null
      )
    );

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error('Fetch admin projects error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
