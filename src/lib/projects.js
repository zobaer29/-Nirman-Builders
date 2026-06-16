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
      material_request_id INT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_tasks_project_id (project_id),
      INDEX idx_tasks_worker_id (worker_id),
      INDEX idx_tasks_material_request_id (material_request_id)
    )
  `);

  // Ensure tasks material_request_id column upgrade
  try {
    const [tasksCols] = await pool.query(`
      SHOW COLUMNS FROM tasks LIKE 'material_request_id'
    `);
    if (tasksCols.length === 0) {
      await pool.query(`
        ALTER TABLE tasks 
        ADD COLUMN material_request_id INT NULL,
        ADD INDEX idx_tasks_material_request_id (material_request_id)
      `);
    }
  } catch (error) {
    console.error("Error upgrading tasks table for material_request_id:", error);
  }

  // 4. Ensure material_requests table exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS material_requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      project_id INT NOT NULL,
      worker_id INT NOT NULL,
      material_name VARCHAR(255) NOT NULL,
      quantity DECIMAL(10, 2) NOT NULL,
      unit VARCHAR(50) NOT NULL,
      urgency VARCHAR(50) NOT NULL DEFAULT 'Normal (End of Day)',
      reason TEXT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'Pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_material_requests_project_id (project_id),
      INDEX idx_material_requests_worker_id (worker_id)
    )
  `);

  // 5. Ensure materials table exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS materials (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      stock INT NOT NULL DEFAULT 0,
      unit VARCHAR(50) NOT NULL,
      threshold INT NOT NULL DEFAULT 0,
      site VARCHAR(255) NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'OK',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Seed default materials if empty
  const [mCount] = await pool.query('SELECT COUNT(*) as count FROM materials');
  if (mCount[0].count === 0) {
    const defaultMats = [
      ['Portland Cement (OPC 53)', 'Cement', 340, 'Bags', 200, 'Emerald Heights', 'OK'],
      ['TMT Rebar – Fe 500D', 'Steel', 18, 'MT', 25, 'Central Plaza', 'Low'],
      ['Marble Tiles (Italian White)', 'Finishing', 0, 'Sq.ft', 500, 'Central Plaza', 'Out'],
      ['River Sand (M Sand)', 'Aggregate', 620, 'Cu.ft', 300, 'Sector 14', 'OK'],
      ['Ready Mix Concrete M30', 'Concrete', 45, 'Cu.m', 30, 'Green Valley', 'OK'],
      ['Electrical Conduit Pipes', 'Electrical', 80, 'Pcs', 150, 'Green Valley', 'Low'],
    ];
    for (const mat of defaultMats) {
      await pool.query(
        'INSERT INTO materials (name, category, stock, unit, threshold, site, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        mat
      );
    }
  }
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

export async function updateMaterialStock(pool, materialName, quantity, siteName) {
  let queryName = materialName;
  if (materialName.includes('Cement')) {
    queryName = 'Portland Cement (OPC 53)';
  } else if (materialName.includes('Steel') || materialName.includes('Rebar')) {
    queryName = 'TMT Rebar – Fe 500D';
  } else if (materialName.includes('Marble') || materialName.includes('Tiles')) {
    queryName = 'Marble Tiles (Italian White)';
  } else if (materialName.includes('Sand')) {
    queryName = 'River Sand (M Sand)';
  } else if (materialName.includes('Concrete')) {
    queryName = 'Ready Mix Concrete M30';
  } else if (materialName.includes('Conduit') || materialName.includes('Pipe')) {
    queryName = 'Electrical Conduit Pipes';
  }

  // Find if a material with this name exists in the database
  const [mats] = await pool.query(
    'SELECT id, stock, threshold FROM materials WHERE name = ?',
    [queryName]
  );

  if (mats.length > 0) {
    const newStock = Number(mats[0].stock) + Number(quantity);
    const threshold = Number(mats[0].threshold);
    const newStatus = newStock === 0 ? 'Out' : (newStock < threshold ? 'Low' : 'OK');
    
    await pool.query(
      'UPDATE materials SET stock = ?, status = ? WHERE id = ?',
      [newStock, newStatus, mats[0].id]
    );
  } else {
    // If it doesn't exist, create it!
    await pool.query(
      'INSERT INTO materials (name, category, stock, unit, threshold, site, status) VALUES (?, ?, ?, ?, 10, ?, "OK")',
      [materialName, 'General', Number(quantity), 'Pcs', siteName]
    );
  }
}
