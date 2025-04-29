import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@/lib/cloudflare';
import { Message } from '@/lib/db/schema';

// TODO: Implement actual authentication check (Step 006)
async function getAuthenticatedUserId(request: NextRequest): Promise<string | null> {
  // Placeholder: Replace with actual session/token validation
  return 'mock-admin-user-id'; // Replace with real logic
}

// Helper to check if user is admin
async function isAdmin(userId: string): Promise<boolean> {
  const { env } = getCloudflareContext();
  const user = await env.DB.prepare(
    'SELECT role FROM Users WHERE id = ?'
  ).bind(userId).first<{ role: string }>();
  
  return user?.role === 'ADMIN';
}

// GET handler to monitor messages (admin only)
export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    if (!(await isAdmin(userId))) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { env } = getCloudflareContext();

    // Get recent messages with user details
    const messages = await env.DB.prepare(`
      SELECT m.*, 
             s.email as sender_email, s.role as sender_role,
             r.email as recipient_email, r.role as recipient_role
      FROM Messages m
      JOIN Users s ON m.sender_id = s.id
      JOIN Users r ON m.recipient_id = r.id
      ORDER BY m.sent_at DESC
      LIMIT 100
    `).all<Message & { 
      sender_email: string; 
      sender_role: string;
      recipient_email: string;
      recipient_role: string;
    }>();

    return NextResponse.json({ messages: messages.results }, { status: 200 });
  } catch (error) {
    console.error('Monitor messages error:', error);
    return NextResponse.json(
      { error: 'Failed to monitor messages' },
      { status: 500 }
    );
  }
}
