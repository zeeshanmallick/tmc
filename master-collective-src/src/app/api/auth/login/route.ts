import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getCloudflareContext } from '@/lib/cloudflare';
import { User } from '@/lib/db/schema';
import { getSession, createSessionResponse, SessionData } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get Cloudflare context for database access
    const { env } = getCloudflareContext();

    // Find user by email, including the password hash
    const userRecord = await env.DB.prepare(
      'SELECT id, email, password, role, created_at, updated_at FROM Users WHERE email = ?'
    ).bind(email).first<User & { password?: string }>();

    if (!userRecord || !userRecord.password) {
      // User not found or password hash is missing
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, userRecord.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Remove password hash before returning user data
    const { password: _, ...user } = userRecord;

    // Create session
    const session = await getSession(request);
    session.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    session.isLoggedIn = true;

    // Return user data in response, saving the session
    return await createSessionResponse({ user }, 200, session);

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to log in' },
      { status: 500 }
    );
  }
}
