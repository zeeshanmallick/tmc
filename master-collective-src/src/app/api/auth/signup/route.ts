import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { getCloudflareContext } from '@/lib/cloudflare';
import { User } from '@/lib/db/schema';
import { getSession, createSessionResponse, SessionData } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json();

    // Basic validation
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Email, password, and role are required' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['COMPANY', 'INVESTOR'].includes(role)) {
      return NextResponse.json(
        { error: 'Role must be either COMPANY or INVESTOR' },
        { status: 400 }
      );
    }

    // Get Cloudflare context for database access
    const { env } = getCloudflareContext();
    
    // Check if user already exists
    const existingUser = await env.DB.prepare(
      'SELECT id FROM Users WHERE email = ?'
    ).bind(email).first();

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const userId = uuidv4();
    const now = new Date().toISOString();

    await env.DB.prepare(
      'INSERT INTO Users (id, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(userId, email, hashedPassword, role, now, now).run();

    // Return user data (excluding password)
    const user: Partial<User> = {
      id: userId,
      email,
      role: role as 'COMPANY' | 'INVESTOR' | 'ADMIN',
      createdAt: new Date(now),
      updatedAt: new Date(now)
    };

    // Create session
    const session = await getSession(request);
    session.user = {
      id: userId,
      email,
      role: role as 'COMPANY' | 'INVESTOR' | 'ADMIN',
    };
    session.isLoggedIn = true;

    // Return user data in response, saving the session
    return await createSessionResponse({ user }, 201, session);
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
