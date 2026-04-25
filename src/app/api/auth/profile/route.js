import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

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

    return NextResponse.json({
      user: {
        id: payload.userId,
        username: payload.username,
        email: payload.email,
        roleId: payload.roleId,
        photoUrl: payload.photoUrl,
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request) {
  // Support POST as well just in case
  return GET(request);
}
