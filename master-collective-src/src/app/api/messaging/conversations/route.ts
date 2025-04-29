import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@/lib/cloudflare";
import { v4 as uuidv4 } from "uuid";
import { authMiddleware } from "@/lib/auth-middleware";
import { z } from "zod";

// Input schema for creating a conversation
const createConversationSchema = z.object({
  participantId: z.string().uuid(),
  initialMessage: z.string().optional(),
});

// GET handler to list conversations for the current user
async function listConversations(request: NextRequest, user: any) {
  try {
    const userId = user.id;
    const { env } = getCloudflareContext();

    // Get all conversations where the user is a participant
    const conversations = await env.DB.prepare(
      `
      SELECT c.id, c.created_at, 
             u.id as other_user_id, u.email as other_user_email, u.role as other_user_role,
             (SELECT content FROM Messages WHERE conversation_id = c.id ORDER BY sent_at DESC LIMIT 1) as last_message,
             (SELECT sent_at FROM Messages WHERE conversation_id = c.id ORDER BY sent_at DESC LIMIT 1) as last_message_time,
             (SELECT COUNT(*) FROM Messages WHERE conversation_id = c.id AND recipient_id = ? AND read_at IS NULL) as unread_count
      FROM Conversations c
      JOIN ConversationParticipants cp ON c.id = cp.conversation_id
      JOIN ConversationParticipants cp2 ON c.id = cp2.conversation_id AND cp2.user_id != ?
      JOIN Users u ON cp2.user_id = u.id
      WHERE cp.user_id = ?
      ORDER BY last_message_time DESC
    `
    )
      .bind(userId, userId, userId)
      .all();

    return NextResponse.json(
      { conversations: conversations.results },
      { status: 200 }
    );
  } catch (error) {
    console.error("List conversations error:", error);
    return NextResponse.json(
      { error: "Failed to list conversations" },
      { status: 500 }
    );
  }
}

// POST handler to create a new conversation
async function createConversation(request: NextRequest, user: any) {
  try {
    const userId = user.id;
    const rawData = await request.json();

    // Validate input
    const validationResult = createConversationSchema.safeParse(rawData);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid input data",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }
    const { participantId, initialMessage } = validationResult.data;

    const { env } = getCloudflareContext();

    // Check if participant exists
    const participant = await env.DB.prepare(
      "SELECT id, role FROM Users WHERE id = ?"
    )
      .bind(participantId)
      .first();

    if (!participant) {
      return NextResponse.json(
        { error: "Participant not found" },
        { status: 404 }
      );
    }

    // Check if conversation already exists between these users
    const existingConversation = await env.DB.prepare(
      `
      SELECT c.id
      FROM Conversations c
      JOIN ConversationParticipants cp1 ON c.id = cp1.conversation_id AND cp1.user_id = ?
      JOIN ConversationParticipants cp2 ON c.id = cp2.conversation_id AND cp2.user_id = ?
      LIMIT 1
    `
    )
      .bind(userId, participantId)
      .first();

    let conversationId;

    if (existingConversation) {
      conversationId = existingConversation.id;
    } else {
      // Create new conversation
      conversationId = uuidv4();
      const now = new Date().toISOString();

      await env.DB.prepare(
        "INSERT INTO Conversations (id, created_at) VALUES (?, ?)"
      )
        .bind(conversationId, now)
        .run();

      // Add participants
      await env.DB.prepare(
        "INSERT INTO ConversationParticipants (conversation_id, user_id, joined_at) VALUES (?, ?, ?)"
      )
        .bind(conversationId, userId, now)
        .run();

      await env.DB.prepare(
        "INSERT INTO ConversationParticipants (conversation_id, user_id, joined_at) VALUES (?, ?, ?)"
      )
        .bind(conversationId, participantId, now)
        .run();
    }

    // Add initial message if provided
    if (initialMessage) {
      const messageId = uuidv4();
      const now = new Date().toISOString();

      await env.DB.prepare(
        "INSERT INTO Messages (id, conversation_id, sender_id, recipient_id, content, sent_at) VALUES (?, ?, ?, ?, ?, ?)"
      )
        .bind(messageId, conversationId, userId, participantId, initialMessage, now)
        .run();
    }

    return NextResponse.json({ conversationId }, { status: 201 });
  } catch (error) {
    console.error("Create conversation error:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}

// Wrap handlers with authMiddleware
export const GET = (req: NextRequest) => authMiddleware(req, listConversations);
export const POST = (req: NextRequest) => authMiddleware(req, createConversation);

