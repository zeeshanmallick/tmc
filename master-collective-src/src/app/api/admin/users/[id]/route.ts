import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@/lib/cloudflare";
import { User } from "@/lib/db/schema";
import { adminMiddleware } from "@/lib/auth-middleware";
import { z } from "zod";

// Input schema for updating user role
const updateUserSchema = z.object({
  role: z.enum(["COMPANY", "INVESTOR", "ADMIN"]),
});

// GET handler to get a specific user (admin only)
async function getUser(
  request: NextRequest,
  user: any,
  { params }: { params: { id: string } }
) {
  try {
    const targetUserId = params.id;
    const { env } = getCloudflareContext();

    // Get user details
    const userData = await env.DB.prepare(
      `
      SELECT id, email, role, created_at, updated_at FROM Users
      WHERE id = ?
    `
    ).bind(targetUserId).first<User>();

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get additional profile data based on role
    let profileData = null;
    if (userData.role === "COMPANY") {
      profileData = await env.DB.prepare(
        "SELECT * FROM CompanyProfiles WHERE user_id = ?"
      )
        .bind(targetUserId)
        .first();
    } else if (userData.role === "INVESTOR") {
      profileData = await env.DB.prepare(
        "SELECT * FROM InvestorProfiles WHERE user_id = ?"
      )
        .bind(targetUserId)
        .first();
    }

    return NextResponse.json({ user: userData, profile: profileData }, { status: 200 });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Failed to get user details" },
      { status: 500 }
    );
  }
}

// PUT handler to update a user (admin only)
async function updateUser(
  request: NextRequest,
  adminUser: any,
  { params }: { params: { id: string } }
) {
  try {
    const targetUserId = params.id;
    const rawData = await request.json();

    // Validate input
    const validationResult = updateUserSchema.safeParse(rawData);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid input data",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }
    const { role } = validationResult.data;

    const { env } = getCloudflareContext();

    // Check if user exists
    const existingUser = await env.DB.prepare(
      "SELECT 1 FROM Users WHERE id = ?"
    )
      .bind(targetUserId)
      .first();

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user
    const now = new Date().toISOString();
    await env.DB.prepare(
      "UPDATE Users SET role = ?, updated_at = ? WHERE id = ?"
    )
      .bind(role, now, targetUserId)
      .run();

    // Get updated user
    const updatedUser = await env.DB.prepare(
      "SELECT id, email, role, created_at, updated_at FROM Users WHERE id = ?"
    )
      .bind(targetUserId)
      .first<User>();

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE handler to delete a user (admin only)
async function deleteUser(
  request: NextRequest,
  adminUser: any,
  { params }: { params: { id: string } }
) {
  try {
    const targetUserId = params.id;

    // Prevent deleting yourself
    if (targetUserId === adminUser.id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    const { env } = getCloudflareContext();

    // Check if user exists
    const existingUser = await env.DB.prepare(
      "SELECT 1 FROM Users WHERE id = ?"
    )
      .bind(targetUserId)
      .first();

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete user (cascade should handle related records if foreign keys are set up correctly)
    await env.DB.prepare("DELETE FROM Users WHERE id = ?")
      .bind(targetUserId)
      .run();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

// Wrap handlers with adminMiddleware
export const GET = (req: NextRequest, context: { params: { id: string } }) =>
  adminMiddleware(req, (r, u) => getUser(r, u, context));
export const PUT = (req: NextRequest, context: { params: { id: string } }) =>
  adminMiddleware(req, (r, u) => updateUser(r, u, context));
export const DELETE = (req: NextRequest, context: { params: { id: string } }) =>
  adminMiddleware(req, (r, u) => deleteUser(r, u, context));

