import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';

// Middleware to check if user is authenticated
export async function authMiddleware(
  request: NextRequest,
  handler: (req: NextRequest, user: any) => Promise<NextResponse>
): Promise<NextResponse> {
  // Get current user from session
  const user = await getCurrentUser(request);
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Call the handler with the authenticated user
  return handler(request, user);
}

// Middleware to check if user is admin
export async function adminMiddleware(
  request: NextRequest,
  handler: (req: NextRequest, user: any) => Promise<NextResponse>
): Promise<NextResponse> {
  // Get current user from session
  const user = await getCurrentUser(request);
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  if (user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Admin access required' },
      { status: 403 }
    );
  }
  
  // Call the handler with the authenticated admin user
  return handler(request, user);
}
