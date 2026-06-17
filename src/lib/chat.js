export const CHAT_ROLE_PAIRS = [
  [1, 2], // Admin <-> Client
  [1, 3], // Admin <-> Contractor
  [2, 4], // Client <-> Worker
  [3, 4], // Contractor <-> Worker
];

export function canRolesChat(leftRoleId, rightRoleId) {
  const left = Number(leftRoleId);
  const right = Number(rightRoleId);

  if (!left || !right || left === right) return false;

  return CHAT_ROLE_PAIRS.some(([a, b]) => (
    (a === left && b === right) || (a === right && b === left)
  ));
}

export function getAllowedChatRoleIds(roleId) {
  const currentRoleId = Number(roleId);
  const allowed = new Set();

  CHAT_ROLE_PAIRS.forEach(([left, right]) => {
    if (left === currentRoleId) allowed.add(right);
    if (right === currentRoleId) allowed.add(left);
  });

  return [...allowed];
}

export async function ensureDirectConversation(pool, userId, contactId) {
  const leftId = Number(userId);
  const rightId = Number(contactId);

  if (!leftId || !rightId || leftId === rightId) return null;

  const lockName = `direct_chat_${Math.min(leftId, rightId)}_${Math.max(leftId, rightId)}`;
  const connection = await pool.getConnection();
  try {
    await connection.query("SELECT GET_LOCK(?, 5)", [lockName]);
    await connection.beginTransaction();

    const [existing] = await connection.query(
      `SELECT conversation_id
       FROM conversation_participants
       GROUP BY conversation_id
       HAVING COUNT(*) = 2
          AND SUM(CASE WHEN user_id = ? THEN 1 ELSE 0 END) = 1
          AND SUM(CASE WHEN user_id = ? THEN 1 ELSE 0 END) = 1
       ORDER BY conversation_id ASC`,
      [leftId, rightId]
    );

    if (existing.length > 0) {
      const canonicalId = existing[0].conversation_id;
      const duplicateIds = existing
        .slice(1)
        .map((row) => row.conversation_id)
        .filter((id) => Number(id) !== Number(canonicalId));

      if (duplicateIds.length > 0) {
        await connection.query(
          "UPDATE messages SET conversation_id = ? WHERE conversation_id IN (?)",
          [canonicalId, duplicateIds]
        );
        await connection.query(
          "DELETE FROM conversation_participants WHERE conversation_id IN (?)",
          [duplicateIds]
        );
        await connection.query("DELETE FROM conversations WHERE id IN (?)", [
          duplicateIds,
        ]);
      }

      await connection.commit();
      return canonicalId;
    }

    const [conversation] = await connection.query(
      "INSERT INTO conversations (project_id) VALUES (NULL)"
    );

    await connection.query(
      `INSERT INTO conversation_participants (conversation_id, user_id)
       VALUES (?, ?), (?, ?)`,
      [conversation.insertId, leftId, conversation.insertId, rightId]
    );

    await connection.commit();
    return conversation.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.query("SELECT RELEASE_LOCK(?)", [lockName]);
    connection.release();
  }
}

export async function userCanAccessConversation(pool, userId, conversationId) {
  const [rows] = await pool.query(
    `SELECT id
     FROM conversation_participants
     WHERE conversation_id = ? AND user_id = ?
     LIMIT 1`,
    [conversationId, userId]
  );

  return rows.length > 0;
}

export async function userCanAccessAllowedConversation(pool, userId, conversationId) {
  const [rows] = await pool.query(
    `SELECT u.id, u.role_id
     FROM conversation_participants cp
     JOIN users u ON cp.user_id = u.id
     WHERE cp.conversation_id = ?`,
    [conversationId]
  );

  if (rows.length !== 2) return false;

  const currentUser = rows.find((row) => Number(row.id) === Number(userId));
  const otherUser = rows.find((row) => Number(row.id) !== Number(userId));

  return Boolean(
    currentUser &&
    otherUser &&
    canRolesChat(currentUser.role_id, otherUser.role_id)
  );
}

export function formatChatTime(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
