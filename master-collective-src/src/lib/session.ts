import { getIronSession, createResponse, IronSession, IronSessionOptions } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { User } from './db/schema';

// Define the session data structure
export interface SessionData {
  user?: {
    id: string;
    email: string;
    role: 'COMPANY' | 'INVESTOR' | 'ADMIN';
  };
  isLoggedIn: boolean;
}

// Session configuration
export const sessionOptions: IronSessionOptions = {
  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long',
  cookieName: 'master-collective-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
};

// Get session from request
export async function getSession(req: NextRequest): Promise<IronSession<SessionData>> {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  
  // Initialize session if needed
  if (!session.isLoggedIn) {
    session.isLoggedIn = false;
  }
  
  return session;
}

// Create a response with session
export async function createSessionResponse(
  data: any,
  status: number,
  session: IronSession<SessionData>
): Promise<NextResponse> {
  const response = NextResponse.json(data, { status });
  
  // Save session to cookies
  await session.save();
  
  return response;
}

// Helper to get the current user from session
export async function getCurrentUser(req: NextRequest): Promise<SessionData['user'] | null> {
  const session = await getSession(req);
  return session.isLoggedIn ? session.user : null;
}
