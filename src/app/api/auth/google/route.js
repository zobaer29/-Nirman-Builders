import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { SignJWT } from 'jose';
import bcrypt from 'bcrypt';

export async function POST(request) {
  try {
    const { email, name, photoUrl } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    let [users] = await pool.query(
      'SELECT id, photoUrl, username, email, role_id, is_active FROM users WHERE email = ?',
      [email]
    );

    let user;

    if (users.length === 0) {
      // Create new user, default role_id is 2 ('User')
      const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
      const username = name || email.split('@')[0];

      const [result] = await pool.query(
        'INSERT INTO users (photoUrl, username, email, password_hash) VALUES (?, ?, ?, ?)',
        [photoUrl, username, email, randomPassword]
      );

      user = {
        id: result.insertId,
        photoUrl: photoUrl,
        username: username,
        email: email,
        role_id: 2, // Default role
        is_active: 1
      };
    } else {
      user = users[0];
      if (!user.is_active) {
        return NextResponse.json(
          { error: 'Your account has been deactivated' },
          { status: 403 }
        );
      }
    }

    // Create JWT token
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'fallback_secret_key_change_in_production'
    );

    const token = await new SignJWT({
      userId: user.id,
      username: user.username,
      email: user.email,
      roleId: user.role_id,
      photoUrl: photoUrl || null,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);

    const response = NextResponse.json(
      { message: 'Google Login successful', roleId: user.role_id },
      { status: 200 }
    );

    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Google Auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error during Google auth' },
      { status: 500 }
    );
  }
}
