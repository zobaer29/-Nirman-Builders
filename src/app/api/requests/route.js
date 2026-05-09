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

    // 2. Check role and determine which requests to fetch
    let requestedRoleType = '';
    const roleId = Number(payload.roleId);
    
    // roleId 1 is Admin, roleId 3 is Contractor
    if (roleId === 1) {
      requestedRoleType = 'contractor';
    } else if (roleId === 3) {
      requestedRoleType = 'worker';
    } else {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 3. Fetch requests
    const [requests] = await pool.query(
      `SELECT r.*, u.email as user_email, u.username as user_username 
       FROM role_requests r
       JOIN users u ON r.user_id = u.id
       WHERE r.requested_role = ? AND r.status = 'pending'
       ORDER BY r.created_at DESC`,
      [requestedRoleType]
    );

    return NextResponse.json({ requests }, { status: 200 });
  } catch (error) {
    console.error('Fetch requests error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
