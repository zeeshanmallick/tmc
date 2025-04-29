import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@/lib/cloudflare';
import { InvestorProfile } from '@/lib/db/schema';
import { authMiddleware } from '@/lib/auth-middleware';
import { investorProfileInputSchema } from '@/lib/validations';

// GET handler to fetch investor profile
async function getInvestorProfile(request: NextRequest, user: any) {
  try {
    const userId = user.id;
    const { env } = getCloudflareContext();

    const profile = await env.DB.prepare(
      'SELECT * FROM InvestorProfiles WHERE user_id = ?'
    ).bind(userId).first<InvestorProfile>();

    if (!profile) {
      return NextResponse.json({ profile: null }, { status: 200 });
    }

    return NextResponse.json({ profile }, { status: 200 });

  } catch (error) {
    console.error('Get investor profile error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch investor profile' },
      { status: 500 }
    );
  }
}

// PUT handler to update investor profile
async function updateInvestorProfile(request: NextRequest, user: any) {
  try {
    const userId = user.id;
    const rawData = await request.json();

    // Validate input data
    const validationResult = investorProfileInputSchema.safeParse(rawData);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid profile data', details: validationResult.error.errors },
        { status: 400 }
      );
    }
    const profileData = validationResult.data;

    const { env } = getCloudflareContext();
    const now = new Date().toISOString();

    const fields = Object.keys(profileData);
    const setClauses = fields.map(key => `${key.replace(/([A-Z])/g, '_$1').toLowerCase()} = ?`).join(', ');
    const values = fields.map(key => (profileData as any)[key]);

    if (fields.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    // Use UPSERT logic (INSERT ON CONFLICT...DO UPDATE)
    const insertValues = [userId, ...values, now, now];

    await env.DB.prepare(
        `INSERT INTO InvestorProfiles (user_id, ${fields.map(key => key.replace(/([A-Z])/g, '_$1').toLowerCase()).join(', ')}, created_at, updated_at)
         VALUES (?, ${fields.map(() => '?').join(', ')}, ?, ?)
         ON CONFLICT(user_id) DO UPDATE SET
         ${setClauses}, updated_at = excluded.updated_at`
    ).bind(...insertValues).run();

    // Fetch the updated profile to return it
    const updatedProfile = await env.DB.prepare(
      'SELECT * FROM InvestorProfiles WHERE user_id = ?'
    ).bind(userId).first<InvestorProfile>();

    return NextResponse.json({ profile: updatedProfile }, { status: 200 });

  } catch (error) {
    console.error('Update investor profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update investor profile' },
      { status: 500 }
    );
  }
}

// Wrap handlers with authMiddleware
export const GET = (req: NextRequest) => authMiddleware(req, getInvestorProfile);
export const PUT = (req: NextRequest) => authMiddleware(req, updateInvestorProfile);
