import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import pool from '@/lib/db';

export async function GET(request) {
  try {
    // 1. Verify token
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'fallback_secret_key_change_in_production'
    );
    const { payload } = await jwtVerify(token, secret);

    // 2. Authorize (Admin only)
    if (Number(payload.roleId) !== 1) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 3. Fetch all contractors (role_id = 3)
    // We join with role_requests to get the latest accepted application details
    const [contractors] = await pool.query(
      `SELECT 
        u.id, 
        u.username, 
        u.email, 
        u.photoUrl,
        r.full_name,
        r.phone,
        r.specialization,
        r.experience,
        r.status as application_status
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
      ORDER BY u.created_at DESC`
    );

    return NextResponse.json({ contractors }, { status: 200 });
  } catch (error) {
    console.error('Fetch contractors error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
