import { NextRequest, NextResponse } from 'next/server';
import { getSession, createSessionResponse } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    
    // Destroy the session
    session.destroy();
    
    // Return success response, saving the destroyed session (clears cookie)
    return await createSessionResponse({ message: 'Logged out successfully' }, 200, session);

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to log out' },
      { status: 500 }
    );
  }
}
