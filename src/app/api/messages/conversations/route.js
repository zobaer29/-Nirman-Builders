import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAuthPayload } from "@/lib/auth";
import { ensureDirectConversation, formatChatTime } from "@/lib/chat";

const ROLE_LABELS = {
  1: "Admin",
  2: "Client",
  3: "Contractor",
  4: "Worker",
};

function displayName(row) {
  return row.full_name || row.username || row.email || "Unknown User";
}

function mergeContact(map, row, role) {
  const id = Number(row.id);
  if (!id || map.has(id)) return;

  map.set(id, {
    id,
    name: displayName(row),
    role,
    avatar: row.photoUrl || null,
    online: true,
  });
}

async function getAllContacts(payload) {
  const userId = Number(payload.userId);
  const contacts = new Map();

  const [rows] = await pool.query(
    `SELECT u.id, u.username, u.email, u.photoUrl, u.role_id, r.full_name
     FROM users u
     LEFT JOIN (
       SELECT r1.*
       FROM role_requests r1
       JOIN (
         SELECT user_id, MAX(created_at) AS max_date
         FROM role_requests
         WHERE status = 'accepted'
         GROUP BY user_id
       ) r2 ON r1.user_id = r2.user_id AND r1.created_at = r2.max_date
     ) r ON u.id = r.user_id
     WHERE u.id <> ? AND COALESCE(u.is_active, 1) = 1
     ORDER BY 
       CASE u.role_id
         WHEN 1 THEN 1
         WHEN 3 THEN 2
         WHEN 4 THEN 3
         WHEN 2 THEN 4
         ELSE 5
       END,
       u.username ASC`,
    [userId]
  );

  rows.forEach((row) =>
    mergeContact(contacts, row, ROLE_LABELS[Number(row.role_id)] || "Team")
  );

  return [...contacts.values()];
}

async function hydrateConversation(contact, currentUserId) {
  const conversationId = await ensureDirectConversation(
    pool,
    currentUserId,
    contact.id
  );

  const [latestRows] = await pool.query(
    `SELECT body, sender_id, created_at
     FROM messages
     WHERE conversation_id = ?
     ORDER BY created_at DESC
     LIMIT 1`,
    [conversationId]
  );

  const [[unread]] = await pool.query(
    `SELECT COUNT(*) AS count
     FROM messages
     WHERE conversation_id = ?
       AND sender_id <> ?
       AND COALESCE(is_read, 0) = 0`,
    [conversationId, currentUserId]
  );

  const latest = latestRows[0];

  return {
    ...contact,
    conversationId,
    lastMessage: latest?.body || "Start a conversation",
    time: latest ? formatChatTime(latest.created_at) : "",
    lastCreatedAt: latest?.created_at || null,
    unread: unread?.count || 0,
  };
}

export async function GET(request) {
  try {
    const payload = await getAuthPayload(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUserId = Number(payload.userId);
    const contacts = await getAllContacts(payload);
    const conversations = [];

    for (const contact of contacts) {
      conversations.push(await hydrateConversation(contact, currentUserId));
    }

    conversations.sort((a, b) => {
      const aTime = a.lastCreatedAt ? new Date(a.lastCreatedAt).getTime() : 0;
      const bTime = b.lastCreatedAt ? new Date(b.lastCreatedAt).getTime() : 0;
      if (aTime !== bTime) return bTime - aTime;
      return a.conversationId - b.conversationId;
    });

    return NextResponse.json({ conversations }, { status: 200 });
  } catch (error) {
    console.error("Fetch conversations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
