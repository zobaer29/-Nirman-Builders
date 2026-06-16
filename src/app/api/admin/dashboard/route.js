import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthPayload } from '@/lib/auth';
import { ensureProjectsTable } from '@/lib/projects';
import { ensureContactMessagesTable } from '@/lib/contactMessages';

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
    await ensureContactMessagesTable(pool);

    // 2. Query Statistics
    const [[{ count: totalProjects }]] = await pool.query('SELECT COUNT(*) as count FROM projects');
    const [[{ count: ongoingProjects }]] = await pool.query('SELECT COUNT(*) as count FROM projects WHERE status = \'Ongoing\'');
    const [[{ count: completedProjects }]] = await pool.query('SELECT COUNT(*) as count FROM projects WHERE status = \'Completed\'');
    const [[{ count: pendingRequests }]] = await pool.query('SELECT COUNT(*) as count FROM projects WHERE status = \'Pending\'');
    const [[{ count: unreadContactMessages }]] = await pool.query('SELECT COUNT(*) as count FROM contact_messages WHERE status = \'Unread\'');

    // 3. Query Recent Project Requests
    const [recentRequests] = await pool.query(`
      SELECT p.*, u.username as client_name
      FROM projects p
      LEFT JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT 5
    `);

    // 4. Query Milestones (Ongoing projects progress)
    const [milestones] = await pool.query(`
      SELECT id, name, progress 
      FROM projects 
      WHERE status = 'Ongoing' 
      ORDER BY updated_at DESC
      LIMIT 3
    `);

    // 5. Query Contractors
    const [contractors] = await pool.query(`
      SELECT 
        u.id, 
        u.username, 
        u.photoUrl,
        r.full_name,
        r.status as role_status
      FROM users u
      LEFT JOIN (
        SELECT r1.*
        FROM role_requests r1
        JOIN (
          SELECT user_id, MAX(created_at) as max_date
          FROM role_requests
          WHERE requested_role = 'contractor' AND status = 'accepted'
          GROUP BY user_id
        ) r2 ON r1.user_id = r2.user_id AND r1.created_at = r2.max_date
      ) r ON u.id = r.user_id
      WHERE u.role_id = 3
      LIMIT 3
    `);

    const [contactMessages] = await pool.query(`
      SELECT id, full_name, email, phone, message, status, created_at
      FROM contact_messages
      ORDER BY created_at DESC
      LIMIT 5
    `);

    return NextResponse.json({
      stats: {
        totalProjects: String(totalProjects).padStart(2, '0'),
        ongoingProjects: String(ongoingProjects).padStart(2, '0'),
        completedProjects: String(completedProjects).padStart(2, '0'),
        pendingRequests: String(pendingRequests).padStart(2, '0'),
        unreadContactMessages: String(unreadContactMessages).padStart(2, '0'),
      },
      recentRequests,
      milestones,
      contractors,
      contactMessages,
    }, { status: 200 });

  } catch (error) {
    console.error('Fetch admin dashboard error:', error);
    return NextResponse.json({ error: 'Failed to load dashboard data' }, { status: 500 });
  }
}
