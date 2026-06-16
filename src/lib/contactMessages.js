export async function ensureContactMessagesTable(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      full_name VARCHAR(150) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NULL,
      message TEXT NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'Unread',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_contact_messages_status (status),
      INDEX idx_contact_messages_created_at (created_at)
    )
  `);
}
