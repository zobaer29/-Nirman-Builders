import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthPayload } from '@/lib/auth';
import { ensureProjectsTable, mapProjectRow } from '@/lib/projects';

export async function GET(request) {
  try {
    // 1. Verify token & authorize (Contractor only)
    const payload = await getAuthPayload(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (Number(payload.roleId) !== 3) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Ensure database tables are created
    await ensureProjectsTable(pool);

    // 2. Fetch projects assigned to this contractor
    const [rows] = await pool.query(`
      SELECT 
        p.*,
        u_client.username as client_username,
        u_client.email as client_email,
        (SELECT COUNT(*) FROM project_workers pw WHERE pw.project_id = p.id AND pw.status = 'Active') as active_labor
      FROM projects p
      LEFT JOIN users u_client ON p.user_id = u_client.id
      WHERE p.contractor_id = ?
      ORDER BY p.created_at DESC
    `, [payload.userId]);

    // 3. Map projects to response format
    const projects = rows.map((row) => {
      const base = mapProjectRow(row, row.client_username, payload.username);
      return {
        ...base,
        labor: Number(row.active_labor || 0),
      };
    });

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error('Fetch contractor projects error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
