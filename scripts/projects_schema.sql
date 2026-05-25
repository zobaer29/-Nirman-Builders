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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_projects_user_id (user_id)
);
