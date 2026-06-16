import { NextResponse } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';
import pool from '@/lib/db';

export async function GET(request) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'fallback_secret_key_change_in_production'
    );

    const { payload } = await jwtVerify(token, secret);

    // Fetch latest user details from DB
    const [users] = await pool.query('SELECT username, email, photoUrl, role_id FROM users WHERE id = ?', [payload.userId]);
    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const dbUser = users[0];
    let roleId = dbUser.role_id;

    // Fetch professional details from role_requests if Contractor (3) or Worker (4)
    let details = null;
    if (roleId === 3 || roleId === 4) {
      const requestedRole = roleId === 3 ? 'contractor' : 'worker';
      const [requests] = await pool.query(
        `SELECT id, full_name, phone, nid, experience, specialization, trade_license, address, documents_url 
         FROM role_requests 
         WHERE user_id = ? AND requested_role = ? AND status = 'accepted'
         ORDER BY created_at DESC LIMIT 1`,
        [payload.userId, requestedRole]
      );
      if (requests.length > 0) {
        details = requests[0];
      }
    }

    let response;
    
    if (dbUser.role_id !== payload.roleId) {
      // Role has changed in the database, issue a new token
      const newToken = await new SignJWT({
        ...payload,
        roleId: roleId,
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(secret);

      response = NextResponse.json({
        user: {
          id: payload.userId,
          username: dbUser.username,
          email: dbUser.email,
          roleId: roleId,
          photoUrl: dbUser.photoUrl,
        },
        details
      }, { status: 200 });

      response.cookies.set({
        name: 'auth_token',
        value: newToken,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 24 hours
      });
    } else {
      // Role hasn't changed, return as normal
      response = NextResponse.json({
        user: {
          id: payload.userId,
          username: dbUser.username,
          email: dbUser.email,
          roleId: roleId,
          photoUrl: dbUser.photoUrl,
        },
        details
      }, { status: 200 });
    }

    return response;

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PUT(request) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'fallback_secret_key_change_in_production'
    );
    const { payload } = await jwtVerify(token, secret);
    const userId = Number(payload.userId);

    // Fetch current user from DB to know current role
    const [users] = await pool.query('SELECT role_id FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const roleId = Number(users[0].role_id);

    const body = await request.json();
    const { username, email, photoUrl, fullName, phone, nid, experience, specialization, tradeLicense, address } = body;

    // 1. Update basic user details in users table
    const updateFields = [];
    const updateParams = [];
    if (username !== undefined) {
      updateFields.push('username = ?');
      updateParams.push(username.trim());
    }
    if (email !== undefined) {
      updateFields.push('email = ?');
      updateParams.push(email.trim());
    }
    if (photoUrl !== undefined) {
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

    // 2. Update role-specific details in role_requests if Contractor (3) or Worker (4)
    if (roleId === 3 || roleId === 4) {
      const requestedRole = roleId === 3 ? 'contractor' : 'worker';
      
      const [requests] = await pool.query(
        `SELECT id FROM role_requests 
         WHERE user_id = ? AND requested_role = ? AND status = 'accepted'
         ORDER BY created_at DESC LIMIT 1`,
        [userId, requestedRole]
      );

      if (requests.length > 0) {
        await pool.query(
          `UPDATE role_requests 
           SET full_name = ?, phone = ?, nid = ?, experience = ?, specialization = ?, trade_license = ?, address = ?
           WHERE id = ?`,
          [
            fullName !== undefined ? fullName : null,
            phone !== undefined ? phone : null,
            nid !== undefined ? nid : null,
            experience !== undefined ? Number(experience) : null,
            specialization !== undefined ? specialization : null,
            tradeLicense !== undefined ? tradeLicense : null,
            address !== undefined ? address : null,
            requests[0].id
          ]
        );
      } else {
        await pool.query(
          `INSERT INTO role_requests 
           (user_id, requested_role, status, full_name, phone, nid, experience, specialization, trade_license, address)
           VALUES (?, ?, 'accepted', ?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            requestedRole,
            fullName !== undefined ? fullName : null,
            phone !== undefined ? phone : null,
            nid !== undefined ? nid : null,
            experience !== undefined ? Number(experience) : null,
            specialization !== undefined ? specialization : null,
            tradeLicense !== undefined ? tradeLicense : null,
            address !== undefined ? address : null
          ]
        );
      }
    }

    return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });

  } catch (error) {
    console.error('Profile update error:', error);
    if (error?.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Username or email already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

export async function POST(request) {
  return GET(request);
}
