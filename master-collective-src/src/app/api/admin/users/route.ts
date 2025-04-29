import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@/lib/cloudflare';
import { User } from '@/lib/db/schema';
import { adminMiddleware } from '@/lib/auth-middleware';

// GET handler to list all users (admin only)
async function listUsers(request: NextRequest, user: any) {
  try {
    const { env } = getCloudflareContext();

    // Get all users
    const users = await env.DB.prepare(`
      SELECT id, email, role, created_at, updated_at FROM Users
      ORDER BY created_at DESC
    `).all<User>();

    return NextResponse.json({ users: users.results }, { status: 200 });
  } catch (error) {
    console.error('List users error:', error);
    return NextResponse.json(
      { error: 'Failed to list users' },
      { status: 500 }
    );
  }
}

// Wrap handler with adminMiddleware
export const GET = (req: NextRequest) => adminMiddleware(req, listUsers);
