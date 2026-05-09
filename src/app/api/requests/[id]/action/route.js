import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import pool from '@/lib/db';

export async function POST(request, { params }) {
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

    // 2. Authorize
    if (Number(payload.roleId) !== 1 && Number(payload.roleId) !== 3) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const { action } = await request.json(); // 'accept' or 'reject'

    if (!['accept', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // 3. Get the request
    const [requests] = await pool.query(
      'SELECT * FROM role_requests WHERE id = ?',
      [id]
    );

    if (requests.length === 0) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    const roleRequest = requests[0];

    if (roleRequest.status !== 'pending') {
      return NextResponse.json({ error: 'Request already processed' }, { status: 400 });
    }

    // Additional check: Admin can only process 'contractor', Contractor can only process 'worker'
    if (Number(payload.roleId) === 1 && roleRequest.requested_role !== 'contractor') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (Number(payload.roleId) === 3 && roleRequest.requested_role !== 'worker') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 4. Start Transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      if (action === 'accept') {
        // Role IDs: 3 for Contractor, 4 for Worker
        const newRoleId = roleRequest.requested_role === 'contractor' ? 3 : 4;

        await connection.query(
          'UPDATE users SET role_id = ? WHERE id = ?',
          [newRoleId, roleRequest.user_id]
        );

        await connection.query(
          'UPDATE role_requests SET status = ? WHERE id = ?',
          ['accepted', id]
        );
      } else {
        await connection.query(
          'UPDATE role_requests SET status = ? WHERE id = ?',
          ['rejected', id]
        );
      }

      await connection.commit();
      connection.release();

      return NextResponse.json({ message: `Request ${action}ed successfully` }, { status: 200 });
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (error) {
    console.error('Request action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
