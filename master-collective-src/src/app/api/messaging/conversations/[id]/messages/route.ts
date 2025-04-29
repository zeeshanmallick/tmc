import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@/lib/cloudflare";
import { v4 as uuidv4 } from "uuid";
import { Message } from "@/lib/db/schema";
import { authMiddleware } from "@/lib/auth-middleware";
import { messageInputSchema } from "@/lib/validations";

// GET handler to fetch messages for a specific conversation
async function getMessages(
  request: NextRequest,
  user: any,
  { params }: { params: { id: string } }
) {
  try {
    const userId = user.id;
    const conversationId = params.id;
    const { env } = getCloudflareContext();

    // Check if user is a participant in this conversation
    const isParticipant = await env.DB.prepare(
      "SELECT 1 FROM ConversationParticipants WHERE conversation_id = ? AND user_id = ?"
    )
      .bind(conversationId, userId)
      .first();

    if (!isParticipant) {
      return NextResponse.json(
        { error: "You are not a participant in this conversation" },
        { status: 403 }
      );
    }

    // Get messages for this conversation
    const messages = await env.DB.prepare(
      `
      SELECT m.*, u.email as sender_email
      FROM Messages m
      JOIN Users u ON m.sender_id = u.id
      WHERE m.conversation_id = ?
      ORDER BY m.sent_at ASC
    `
    ).bind(conversationId).all<Message & { sender_email: string }>();

    // Mark unread messages as read
    await env.DB.prepare(
      `
      UPDATE Messages
      SET read_at = CURRENT_TIMESTAMP
      WHERE conversation_id = ? AND recipient_id = ? AND read_at IS NULL
    `
    )
      .bind(conversationId, userId)
      .run();

    return NextResponse.json({ messages: messages.results }, { status: 200 });
  } catch (error) {
    console.error("Get messages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST handler to send a new message in a conversation
async function sendMessage(
  request: NextRequest,
  user: any,
  { params }: { params: { id: string } }
) {
  try {
    const userId = user.id;
    const conversationId = params.id;
    const rawData = await request.json();

    // Validate input
    const validationResult = messageInputSchema.safeParse(rawData);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid message content",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }
    const { content } = validationResult.data;

    const { env } = getCloudflareContext();

    // Check if user is a participant in this conversation
    const participant = await env.DB.prepare(
      `
      SELECT cp.user_id
      FROM ConversationParticipants cp
      WHERE cp.conversation_id = ? AND cp.user_id = ?
    `
    )
      .bind(conversationId, userId)
      .first();

    if (!participant) {
      return NextResponse.json(
        { error: "You are not a participant in this conversation" },
        { status: 403 }
      );
    }

    // Find the recipient (the other participant)
    const recipient = await env.DB.prepare(
      `
      SELECT cp.user_id
      FROM ConversationParticipants cp
      WHERE cp.conversation_id = ? AND cp.user_id != ?
      LIMIT 1
    `
    ).bind(conversationId, userId).first<{ user_id: string }>();

    if (!recipient) {
      return NextResponse.json(
        { error: "Recipient not found" },
        { status: 404 }
      );
    }

    // Create the message
    const messageId = uuidv4();
    const now = new Date().toISOString();

    await env.DB.prepare(
      "INSERT INTO Messages (id, conversation_id, sender_id, recipient_id, content, sent_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
      .bind(messageId, conversationId, userId, recipient.user_id, content, now)
      .run();

    // Get the created message
    const message = await env.DB.prepare(
      "SELECT * FROM Messages WHERE id = ?"
    )
      .bind(messageId)
      .first<Message>();

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

// Wrap handlers with authMiddleware
export const GET = (req: NextRequest, context: { params: { id: string } }) =>
  authMiddleware(req, (r, u) => getMessages(r, u, context));
export const POST = (req: NextRequest, context: { params: { id: string } }) =>
  authMiddleware(req, (r, u) => sendMessage(r, u, context));

