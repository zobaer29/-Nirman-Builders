import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAuthPayload } from "@/lib/auth";
import { userCanAccessConversation } from "@/lib/chat";

async function getConversationId(params) {
  const resolved = await params;
  return Number(resolved.conversationId);
}

export async function GET(request, { params }) {
  try {
    const payload = await getAuthPayload(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversationId = await getConversationId(params);
    if (!conversationId) {
      return NextResponse.json(
        { error: "Invalid conversation id" },
        { status: 400 }
      );
    }

    const currentUserId = Number(payload.userId);
    const canAccess = await userCanAccessConversation(
      pool,
      currentUserId,
      conversationId
    );

    if (!canAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await pool.query(
      `UPDATE messages
       SET is_read = 1
       WHERE conversation_id = ? AND sender_id <> ?`,
      [conversationId, currentUserId]
    );

    const [rows] = await pool.query(
      `SELECT 
         m.id,
         m.conversation_id,
         m.sender_id,
         m.body,
         m.is_read,
         m.created_at,
         u.username,
         u.photoUrl
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.conversation_id = ?
       ORDER BY m.created_at ASC, m.id ASC`,
      [conversationId]
    );

    const messages = rows.map((row) => ({
      id: row.id,
      conversationId: row.conversation_id,
      senderId: row.sender_id,
      body: row.body,
      isMine: Number(row.sender_id) === currentUserId,
      isRead: Boolean(row.is_read),
      createdAt: row.created_at,
      sender: {
        username: row.username,
        photoUrl: row.photoUrl,
      },
    }));

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Fetch messages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const payload = await getAuthPayload(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversationId = await getConversationId(params);
    if (!conversationId) {
      return NextResponse.json(
        { error: "Invalid conversation id" },
        { status: 400 }
      );
    }

    const currentUserId = Number(payload.userId);
    const canAccess = await userCanAccessConversation(
      pool,
      currentUserId,
      conversationId
    );

    if (!canAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const message = (body.body || body.message || "").trim();

    if (!message) {
      return NextResponse.json(
        { error: "Message cannot be empty" },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      `INSERT INTO messages (conversation_id, sender_id, body, is_read)
       VALUES (?, ?, ?, 0)`,
      [conversationId, currentUserId, message]
    );

    const [rows] = await pool.query(
      `SELECT id, conversation_id, sender_id, body, is_read, created_at
       FROM messages
       WHERE id = ?`,
      [result.insertId]
    );

    const row = rows[0];

    return NextResponse.json(
      {
        message: {
          id: row.id,
          conversationId: row.conversation_id,
          senderId: row.sender_id,
          body: row.body,
          isMine: true,
          isRead: Boolean(row.is_read),
          createdAt: row.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
