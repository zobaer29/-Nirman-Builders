-- Run in MySQL (database: nirman) if projects table does not exist yet.
-- The API also runs CREATE TABLE IF NOT EXISTS on first use.

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
);

CREATE TABLE IF NOT EXISTS project_workers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  worker_id INT NOT NULL,
  role_on_site VARCHAR(100) NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Active',
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_project_worker (project_id, worker_id),
  INDEX idx_project_workers_worker_id (worker_id)
);

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
);
