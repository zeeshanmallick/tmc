import { NextRequest, NextResponse } from 'next/server';
import { getSession, getCurrentUser } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    // Get the current user from session
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json({ isLoggedIn: false }, { status: 200 });
    }
    
    return NextResponse.json({ 
      isLoggedIn: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { error: 'Failed to check session' },
      { status: 500 }
    );
  }
}
