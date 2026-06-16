import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAuthPayload } from "@/lib/auth";
import { ensureContactMessagesTable } from "@/lib/contactMessages";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request) {
  try {
    await ensureContactMessagesTable(pool);

    const body = await request.json();
    const fullName = body.fullName?.trim() || body.name?.trim();
    const email = body.email?.trim();
    const phone = body.phone?.trim() || null;
    const message = body.message?.trim();

    if (!fullName || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters" },
        { status: 400 }
      );
    }

    await pool.query(
      `INSERT INTO contact_messages (full_name, email, phone, message)
       VALUES (?, ?, ?, ?)`,
      [fullName, email, phone, message]
    );

    return NextResponse.json(
      { message: "Your message has been sent to admin" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create contact message error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const payload = await getAuthPayload(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (Number(payload.roleId) !== 1) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await ensureContactMessagesTable(pool);

    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 25, 100);

    const [messages] = await pool.query(
      `SELECT id, full_name, email, phone, message, status, created_at
       FROM contact_messages
       ORDER BY created_at DESC
       LIMIT ?`,
      [limit]
    );

    const [[{ unreadCount }]] = await pool.query(
      `SELECT COUNT(*) AS unreadCount
       FROM contact_messages
       WHERE status = 'Unread'`
    );

    return NextResponse.json(
      { messages, unreadCount: unreadCount || 0 },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch contact messages error:", error);
    return NextResponse.json(
      { error: "Failed to load contact messages" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const payload = await getAuthPayload(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (Number(payload.roleId) !== 1) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await ensureContactMessagesTable(pool);

    const body = await request.json();
    const id = Number(body.id);

    if (!id) {
      return NextResponse.json(
        { error: "Message id is required" },
        { status: 400 }
      );
    }

    await pool.query(
      "UPDATE contact_messages SET status = 'Read' WHERE id = ?",
      [id]
    );

    return NextResponse.json(
      { message: "Contact message marked as read" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update contact message error:", error);
    return NextResponse.json(
      { error: "Failed to update contact message" },
      { status: 500 }
    );
  }
}
