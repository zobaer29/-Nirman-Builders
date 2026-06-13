import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthPayload } from '@/lib/auth';
import { ensureProjectsTable } from '@/lib/projects';

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

    // 2. Query stats
    const [[{ count: activeProjects }]] = await pool.query(
      'SELECT COUNT(*) as count FROM projects WHERE contractor_id = ? AND status = \'Ongoing\'',
      [payload.userId]
    );

    const [[{ count: workforce }]] = await pool.query(`
      SELECT COUNT(DISTINCT pw.worker_id) as count 
      FROM project_workers pw
      JOIN projects p ON pw.project_id = p.id
      WHERE p.contractor_id = ? AND pw.status = 'Active'
    `, [payload.userId]);

    // 3. Query active project lists
    const [ongoingProjects] = await pool.query(`
      SELECT 
        p.*,
        (SELECT COUNT(*) FROM project_workers pw WHERE pw.project_id = p.id AND pw.status = 'Active') as active_labor
      FROM projects p
      WHERE p.contractor_id = ? AND p.status = 'Ongoing'
      ORDER BY p.updated_at DESC
      LIMIT 3
    `, [payload.userId]);

    // 4. Query team roster status
    const [team] = await pool.query(`
      SELECT 
        u.id, 
        u.username,
        r.full_name,
        r.specialization as role,
        pw.status as worker_status
      FROM users u
      JOIN project_workers pw ON u.id = pw.worker_id AND pw.status = 'Active'
      JOIN projects p ON pw.project_id = p.id
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
      WHERE p.contractor_id = ?
      LIMIT 3
    `, [payload.userId]);

    // 5. Query contractor name
    const [[user]] = await pool.query(`
      SELECT u.username, r.full_name 
      FROM users u
      LEFT JOIN role_requests r ON u.id = r.user_id AND r.status = 'accepted'
      WHERE u.id = ?
      ORDER BY r.created_at DESC LIMIT 1
    `, [payload.userId]);
    const contractorName = user?.full_name || user?.username || 'Contractor';

    return NextResponse.json({
      name: contractorName,
      activeProjects,
      workforce,
      projects: ongoingProjects.map(p => ({
        id: p.id,
        name: p.name,
        phase: p.description || 'General Site Work',
        status: p.status,
        progress: p.progress || 0,
        labor: p.active_labor || 0,
        deadline: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'TBD',
        milestone: 'Active Phase'
      })),
      crew: team.map((member, idx) => ({
        name: member.full_name || member.username,
        role: member.role || 'Technician',
        img: String(10 + (idx * 12)),
        status: member.worker_status === 'Active' ? 'Active' : 'Away'
      }))
    }, { status: 200 });

  } catch (error) {
    console.error('Fetch contractor dashboard error:', error);
    return NextResponse.json({ error: 'Failed to load dashboard data' }, { status: 500 });
  }
}
