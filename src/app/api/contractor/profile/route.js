import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthPayload } from '@/lib/auth';
import { ensureProjectsTable } from '@/lib/projects';

// 1. GET: Fetch contractor profile details and stats
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

    const userId = Number(payload.userId);

    // Fetch base user details
    const [users] = await pool.query(
      'SELECT id, username, email, photoUrl, role_id FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = users[0];

    // Fetch professional details from role_requests (accepted contractor request)
    const [requests] = await pool.query(
      `SELECT id, full_name, phone, nid, experience, specialization, trade_license, address, documents_url 
       FROM role_requests 
       WHERE user_id = ? AND requested_role = 'contractor' AND status = 'accepted'
       ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );

    const details = requests[0] || {
      full_name: user.username,
      phone: '',
      nid: '',
      experience: 0,
      specialization: 'General Contractor',
      trade_license: '',
      address: '',
      documents_url: null
    };

    // Calculate contractor stats
    // A. Projects count
    const [[{ count: projectsCount }]] = await pool.query(
      'SELECT COUNT(*) as count FROM projects WHERE contractor_id = ?',
      [userId]
    );

    // B. Active workers count
    const [[{ count: activeWorkersCount }]] = await pool.query(
      `SELECT COUNT(DISTINCT pw.worker_id) as count 
       FROM project_workers pw 
       JOIN projects p ON pw.project_id = p.id 
       WHERE p.contractor_id = ? AND pw.status = 'Active'`,
      [userId]
    );

    // C. Tasks count
    const [[{ count: tasksCount }]] = await pool.query(
      `SELECT COUNT(*) as count 
       FROM tasks t 
       JOIN projects p ON t.project_id = p.id 
       WHERE p.contractor_id = ?`,
      [userId]
    );

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        photoUrl: user.photoUrl,
        roleId: user.role_id
      },
      details,
      stats: {
        projects: projectsCount || 0,
        workforce: activeWorkersCount || 0,
        tasks: tasksCount || 0
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Fetch contractor profile error:', error);
    return NextResponse.json({ error: 'Failed to load contractor profile' }, { status: 500 });
  }
}

// 2. PUT: Save/update contractor details
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
    const { fullName, phone, nid, experience, specialization, tradeLicense, address } = body;

    const userId = Number(payload.userId);

    // Check if an accepted contractor role request exists
    const [requests] = await pool.query(
      `SELECT id FROM role_requests 
       WHERE user_id = ? AND requested_role = 'contractor' AND status = 'accepted'
       ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );

    if (requests.length > 0) {
      // Update existing record
      await pool.query(
        `UPDATE role_requests 
         SET full_name = ?, phone = ?, nid = ?, experience = ?, specialization = ?, trade_license = ?, address = ?
         WHERE id = ?`,
        [
          fullName || null,
          phone || null,
          nid || null,
          experience !== undefined ? Number(experience) : null,
          specialization || null,
          tradeLicense || null,
          address || null,
          requests[0].id
        ]
      );
    } else {
      // Insert new record since none exists
      await pool.query(
        `INSERT INTO role_requests 
         (user_id, requested_role, status, full_name, phone, nid, experience, specialization, trade_license, address)
         VALUES (?, 'contractor', 'accepted', ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          fullName || null,
          phone || null,
          nid || null,
          experience !== undefined ? Number(experience) : null,
          specialization || null,
          tradeLicense || null,
          address || null
        ]
      );
    }

    return NextResponse.json({ message: 'Profile details updated successfully' }, { status: 200 });

  } catch (error) {
    console.error('Update contractor profile error:', error);
    return NextResponse.json({ error: 'Failed to update contractor profile' }, { status: 500 });
  }
}
