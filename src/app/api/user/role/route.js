import { NextResponse } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';
import pool from '@/lib/db';

export async function POST(request) {
  console.log('Received role update request');
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

    // 2. Parse request
    const body = await request.json();
    const { role, formData } = body; // role should be 'contractor' or 'worker'

    if (!role || !['contractor', 'worker'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role requested' }, { status: 400 });
    }

    // 3. Insert into database
    const [result] = await pool.query(
      `INSERT INTO role_requests 
        (user_id, requested_role, full_name, phone, nid, experience, specialization, trade_license, address, documents_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.userId,
        role,
        formData.fullName || null,
        formData.phone || null,
        formData.nid || null,
        formData.experience || null,
        formData.specialization || null,
        formData.tradeLicense || null,
        formData.address || null,
        formData.documents || null
      ]
    );

    return NextResponse.json(
      { message: 'Role request submitted successfully', requestId: result.insertId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Role update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
