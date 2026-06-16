import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthPayload } from '@/lib/auth';
import { ensureProjectsTable } from '@/lib/projects';

// GET: Fetch worker profile details and stats
export async function GET(request) {
  try {
    const payload = await getAuthPayload(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (Number(payload.roleId) !== 4) {
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

    // Fetch professional details from role_requests (accepted worker request)
    const [requests] = await pool.query(
      `SELECT id, full_name, phone, nid, experience, specialization, address, documents_url 
       FROM role_requests 
       WHERE user_id = ? AND requested_role = 'worker' AND status = 'accepted'
       ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );

    const details = requests[0] || {
      full_name: user.username,
      phone: '',
      nid: '',
      experience: 0,
      specialization: 'General Worker',
      address: '',
      documents_url: null
    };

    // Calculate worker stats
    // A. Projects count (assigned sites)
    const [[{ count: projectsCount }]] = await pool.query(
      'SELECT COUNT(*) as count FROM project_workers WHERE worker_id = ? AND status = "Active"',
      [userId]
    );

    // B. Total Tasks count
    const [[{ count: tasksCount }]] = await pool.query(
      'SELECT COUNT(*) as count FROM tasks WHERE worker_id = ?',
      [userId]
    );

    // C. Completed Tasks count
    const [[{ count: completedTasksCount }]] = await pool.query(
      'SELECT COUNT(*) as count FROM tasks WHERE worker_id = ? AND status = "Completed"',
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
        tasks: tasksCount || 0,
        completedTasks: completedTasksCount || 0
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Fetch worker profile error:', error);
    return NextResponse.json({ error: 'Failed to load worker profile' }, { status: 500 });
  }
}

// PUT: Save/update worker details
export async function PUT(request) {
  try {
    const payload = await getAuthPayload(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (Number(payload.roleId) !== 4) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { username, email, photoUrl, fullName, phone, nid, experience, specialization, address } = body;

    const userId = Number(payload.userId);

    // 1. Update users table if basic details are passed
    const updateFields = [];
    const updateParams = [];
    if (username) {
      updateFields.push('username = ?');
      updateParams.push(username.trim());
    }
    if (email) {
      updateFields.push('email = ?');
      updateParams.push(email.trim());
    }
    if (photoUrl) {
      updateFields.push('photoUrl = ?');
      updateParams.push(photoUrl.trim());
    }

    if (updateFields.length > 0) {
      updateParams.push(userId);
      await pool.query(
        `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
        updateParams
      );
    }

    // 2. Update role_requests details
    const [requests] = await pool.query(
      `SELECT id FROM role_requests 
       WHERE user_id = ? AND requested_role = 'worker' AND status = 'accepted'
       ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );

    if (requests.length > 0) {
      await pool.query(
        `UPDATE role_requests 
         SET full_name = ?, phone = ?, nid = ?, experience = ?, specialization = ?, address = ?
         WHERE id = ?`,
        [
          fullName || null,
          phone || null,
          nid || null,
          experience !== undefined ? Number(experience) : null,
          specialization || null,
          address || null,
          requests[0].id
        ]
      );
    } else {
      await pool.query(
        `INSERT INTO role_requests 
         (user_id, requested_role, status, full_name, phone, nid, experience, specialization, address)
         VALUES (?, 'worker', 'accepted', ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          fullName || null,
          phone || null,
          nid || null,
          experience !== undefined ? Number(experience) : null,
          specialization || null,
          address || null
        ]
      );
    }

    return NextResponse.json({ message: 'Profile details updated successfully' }, { status: 200 });

  } catch (error) {
    console.error('Update worker profile error:', error);
    return NextResponse.json({ error: 'Failed to update worker profile' }, { status: 500 });
  }
}
