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
  // 1. Ensure projects table exists
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
      contractor_id INT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_projects_user_id (user_id),
      INDEX idx_projects_contractor_id (contractor_id)
    )
  `);

  // Ensure contractor_id column upgrade
  try {
    const [columns] = await pool.query(`
      SHOW COLUMNS FROM projects LIKE 'contractor_id'
    `);
    if (columns.length === 0) {
      await pool.query(`
        ALTER TABLE projects 
        ADD COLUMN contractor_id INT NULL,
        ADD INDEX idx_projects_contractor_id (contractor_id)
      `);
    }
  } catch (error) {
    console.error("Error upgrading projects table for contractor_id:", error);
  }

  // 2. Ensure project_workers table exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS project_workers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      project_id INT NOT NULL,
      worker_id INT NOT NULL,
      role_on_site VARCHAR(100) NULL,
      shift VARCHAR(50) NOT NULL DEFAULT 'Morning',
      attendance INT NOT NULL DEFAULT 95,
      status VARCHAR(20) NOT NULL DEFAULT 'Active',
      assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_project_worker (project_id, worker_id),
      INDEX idx_project_workers_worker_id (worker_id)
    )
  `);

  // Ensure project_workers shift and attendance columns upgrade
  try {
    const [shiftCol] = await pool.query(`
      SHOW COLUMNS FROM project_workers LIKE 'shift'
    `);
    if (shiftCol.length === 0) {
      await pool.query(`
        ALTER TABLE project_workers 
        ADD COLUMN shift VARCHAR(50) NOT NULL DEFAULT 'Morning'
      `);
    }
  } catch (error) {
    console.error("Error upgrading project_workers table for shift:", error);
  }

  try {
    const [attCol] = await pool.query(`
      SHOW COLUMNS FROM project_workers LIKE 'attendance'
    `);
    if (attCol.length === 0) {
      await pool.query(`
        ALTER TABLE project_workers 
        ADD COLUMN attendance INT NOT NULL DEFAULT 95
      `);
    }
  } catch (error) {
    console.error("Error upgrading project_workers table for attendance:", error);
  }

  // 3. Ensure tasks table exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      project_id INT NOT NULL,
      worker_id INT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'Pending',
      priority VARCHAR(20) NOT NULL DEFAULT 'Medium',
      due_date VARCHAR(100) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_tasks_project_id (project_id),
      INDEX idx_tasks_worker_id (worker_id)
    )
  `);
}

export function mapProjectRow(row, clientName, contractorName) {
  return {
    id: row.id,
    name: row.name,
    client: clientName || "You",
    contractor: contractorName || null,
    contractorId: row.contractor_id || null,
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
