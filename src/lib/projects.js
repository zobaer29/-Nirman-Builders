const DEFAULT_IMAGES = {
  Residential:
    "https://images.unsplash.com/photo-1600585154340-be6199f7d009?q=80&w=2070&auto=format&fit=crop",
  Commercial:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
  Industrial:
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop",
  Infrastructure:
    "https://images.unsplash.com/photo-1545459720-aac273a27b3d?q=80&w=2070&auto=format&fit=crop",
  Renovation:
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2070&auto=format&fit=crop",
};

export function getDefaultProjectImage(type) {
  return DEFAULT_IMAGES[type] || DEFAULT_IMAGES.Residential;
}

export function formatBudget(amount) {
  if (amount == null || Number.isNaN(Number(amount))) return "—";
  const n = Number(amount);
  if (n >= 10000000) return `৳${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `৳${(n / 100000).toFixed(1)}L`;
  return `৳${n.toLocaleString("en-BD")}`;
}

export async function ensureProjectsTable(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      project_type VARCHAR(50) NOT NULL DEFAULT 'Residential',
      location VARCHAR(255) NULL,
      description TEXT NULL,
      budget DECIMAL(15, 2) NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'Pending',
      progress INT NOT NULL DEFAULT 0,
      image_url VARCHAR(500) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_projects_user_id (user_id)
    )
  `);
}

export function mapProjectRow(row, clientName) {
  return {
    id: row.id,
    name: row.name,
    client: clientName || "You",
    status: row.status,
    progress: row.progress,
    image: row.image_url || getDefaultProjectImage(row.project_type),
    type: row.project_type,
    budget: formatBudget(row.budget),
    location: row.location,
    description: row.description,
    createdAt: row.created_at,
  };
}
