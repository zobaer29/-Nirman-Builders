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

    let roleId = payload.roleId;

    // Fetch latest user details from DB to ensure roleId is up-to-date
    const [users] = await pool.query('SELECT role_id FROM users WHERE id = ?', [payload.userId]);
    
    let response;
    
    if (users.length > 0 && users[0].role_id !== payload.roleId) {
      // Role has changed in the database, issue a new token
      roleId = users[0].role_id;
      
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
          username: payload.username,
          email: payload.email,
          roleId: roleId,
          photoUrl: payload.photoUrl,
        }
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
          username: payload.username,
          email: payload.email,
          roleId: roleId,
          photoUrl: payload.photoUrl,
        }
      }, { status: 200 });
    }

    return response;

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request) {
  // Support POST as well just in case
  return GET(request);
}
