-- Nirman Builders - Full MySQL Database Schema & Seed Data
-- Database Name: nirman

CREATE DATABASE IF NOT EXISTS `nirman` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `nirman`;

SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------
-- 1. Roles Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 2. Users Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NULL,
  `role_id` INT NOT NULL DEFAULT 2,
  `photoUrl` VARCHAR(500) NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_role_id` (`role_id`),
  CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 3. Role Requests Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `role_requests` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `requested_role` VARCHAR(50) NOT NULL,
  `full_name` VARCHAR(255) NULL,
  `phone` VARCHAR(50) NULL,
  `nid` VARCHAR(100) NULL,
  `experience` VARCHAR(100) NULL,
  `specialization` VARCHAR(100) NULL,
  `trade_license` VARCHAR(100) NULL,
  `address` TEXT NULL,
  `documents_url` TEXT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_role_requests_user_id` (`user_id`),
  INDEX `idx_role_requests_status` (`status`),
  CONSTRAINT `fk_role_requests_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 4. Projects Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `projects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `project_type` VARCHAR(50) NOT NULL DEFAULT 'Residential',
  `location` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `budget` DECIMAL(15, 2) NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'Pending',
  `progress` INT NOT NULL DEFAULT 0,
  `image_url` VARCHAR(500) NULL,
  `contractor_id` INT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_projects_user_id` (`user_id`),
  INDEX `idx_projects_contractor_id` (`contractor_id`),
  CONSTRAINT `fk_projects_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 5. Project Workers Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `project_workers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL,
  `worker_id` INT NOT NULL,
  `role_on_site` VARCHAR(100) NULL,
  `shift` VARCHAR(50) NOT NULL DEFAULT 'Morning',
  `attendance` INT NOT NULL DEFAULT 95,
  `status` VARCHAR(20) NOT NULL DEFAULT 'Active',
  `assigned_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_project_worker` (`project_id`, `worker_id`),
  INDEX `idx_project_workers_worker_id` (`worker_id`),
  CONSTRAINT `fk_pw_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pw_worker` FOREIGN KEY (`worker_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 6. Material Requests Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `material_requests` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL,
  `worker_id` INT NOT NULL,
  `material_name` VARCHAR(255) NOT NULL,
  `quantity` DECIMAL(10, 2) NOT NULL,
  `unit` VARCHAR(50) NOT NULL,
  `urgency` VARCHAR(50) NOT NULL DEFAULT 'Normal (End of Day)',
  `reason` TEXT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'Pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_material_requests_project_id` (`project_id`),
  INDEX `idx_material_requests_worker_id` (`worker_id`),
  CONSTRAINT `fk_mr_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_mr_worker` FOREIGN KEY (`worker_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 7. Tasks Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL,
  `worker_id` INT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'Pending',
  `priority` VARCHAR(20) NOT NULL DEFAULT 'Medium',
  `due_date` VARCHAR(100) NULL,
  `material_request_id` INT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_tasks_project_id` (`project_id`),
  INDEX `idx_tasks_worker_id` (`worker_id`),
  INDEX `idx_tasks_material_request_id` (`material_request_id`),
  CONSTRAINT `fk_tasks_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 8. Materials Inventory Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `materials` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `unit` VARCHAR(50) NOT NULL,
  `threshold` INT NOT NULL DEFAULT 0,
  `site` VARCHAR(255) NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'OK',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 9. Contact Messages Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NULL,
  `message` TEXT NOT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'Unread',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_contact_messages_status` (`status`),
  INDEX `idx_contact_messages_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 10. Conversations Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `conversations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 11. Conversation Participants Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `conversation_participants` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `conversation_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `joined_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_conv_user` (`conversation_id`, `user_id`),
  INDEX `idx_cp_user_id` (`user_id`),
  CONSTRAINT `fk_cp_conversation` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cp_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 12. Messages Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `conversation_id` INT NOT NULL,
  `sender_id` INT NOT NULL,
  `body` TEXT NOT NULL,
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_messages_conversation_id` (`conversation_id`),
  INDEX `idx_messages_sender_id` (`sender_id`),
  CONSTRAINT `fk_msg_conversation` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_msg_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------
-- Seed Initial Data
-- --------------------------------------------------------

-- Insert Roles
INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'Admin'),
(2, 'Client'),
(3, 'Contractor'),
(4, 'Worker')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Insert Default Materials Inventory
INSERT INTO `materials` (`name`, `category`, `stock`, `unit`, `threshold`, `site`, `status`) VALUES
('Portland Cement (OPC 53)', 'Cement', 340, 'Bags', 200, 'Emerald Heights', 'OK'),
('TMT Rebar – Fe 500D', 'Steel', 18, 'MT', 25, 'Central Plaza', 'Low'),
('Marble Tiles (Italian White)', 'Finishing', 0, 'Sq.ft', 500, 'Central Plaza', 'Out'),
('River Sand (M Sand)', 'Aggregate', 620, 'Cu.ft', 300, 'Sector 14', 'OK'),
('Ready Mix Concrete M30', 'Concrete', 45, 'Cu.m', 30, 'Green Valley', 'OK'),
('Electrical Conduit Pipes', 'Electrical', 80, 'Pcs', 150, 'Green Valley', 'Low')
ON DUPLICATE KEY UPDATE `stock` = VALUES(`stock`), `status` = VALUES(`status`);
-- ========================================================
-- Nirman Builders - Complete MySQL Database Schema & Seed Data
-- Database Name: nirman
-- ========================================================

CREATE DATABASE IF NOT EXISTS `nirman` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `nirman`;

SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------
-- 1. Roles Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 2. Users Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NULL,
  `role_id` INT NOT NULL DEFAULT 2,
  `photoUrl` VARCHAR(500) NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_role_id` (`role_id`),
  CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 3. Role Requests Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `role_requests` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `requested_role` VARCHAR(50) NOT NULL,
  `full_name` VARCHAR(255) NULL,
  `phone` VARCHAR(50) NULL,
  `nid` VARCHAR(100) NULL,
  `experience` VARCHAR(100) NULL,
  `specialization` VARCHAR(100) NULL,
  `trade_license` VARCHAR(100) NULL,
  `address` TEXT NULL,
  `documents_url` TEXT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_role_requests_user_id` (`user_id`),
  INDEX `idx_role_requests_status` (`status`),
  CONSTRAINT `fk_role_requests_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 4. Projects Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `projects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `project_type` VARCHAR(50) NOT NULL DEFAULT 'Residential',
  `location` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `budget` DECIMAL(15, 2) NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'Pending',
  `progress` INT NOT NULL DEFAULT 0,
  `image_url` VARCHAR(500) NULL,
  `contractor_id` INT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_projects_user_id` (`user_id`),
  INDEX `idx_projects_contractor_id` (`contractor_id`),
  CONSTRAINT `fk_projects_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 5. Project Workers Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `project_workers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL,
  `worker_id` INT NOT NULL,
  `role_on_site` VARCHAR(100) NULL,
  `shift` VARCHAR(50) NOT NULL DEFAULT 'Morning',
  `attendance` INT NOT NULL DEFAULT 95,
  `status` VARCHAR(20) NOT NULL DEFAULT 'Active',
  `assigned_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_project_worker` (`project_id`, `worker_id`),
  INDEX `idx_project_workers_worker_id` (`worker_id`),
  CONSTRAINT `fk_pw_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pw_worker` FOREIGN KEY (`worker_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 6. Material Requests Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `material_requests` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL,
  `worker_id` INT NOT NULL,
  `material_name` VARCHAR(255) NOT NULL,
  `quantity` DECIMAL(10, 2) NOT NULL,
  `unit` VARCHAR(50) NOT NULL,
  `urgency` VARCHAR(50) NOT NULL DEFAULT 'Normal (End of Day)',
  `reason` TEXT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'Pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_material_requests_project_id` (`project_id`),
  INDEX `idx_material_requests_worker_id` (`worker_id`),
  CONSTRAINT `fk_mr_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_mr_worker` FOREIGN KEY (`worker_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 7. Tasks Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL,
  `worker_id` INT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'Pending',
  `priority` VARCHAR(20) NOT NULL DEFAULT 'Medium',
  `due_date` VARCHAR(100) NULL,
  `material_request_id` INT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_tasks_project_id` (`project_id`),
  INDEX `idx_tasks_worker_id` (`worker_id`),
  INDEX `idx_tasks_material_request_id` (`material_request_id`),
  CONSTRAINT `fk_tasks_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 8. Materials Inventory Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `materials` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `unit` VARCHAR(50) NOT NULL,
  `threshold` INT NOT NULL DEFAULT 0,
  `site` VARCHAR(255) NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'OK',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 9. Contact Messages Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NULL,
  `message` TEXT NOT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'Unread',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_contact_messages_status` (`status`),
  INDEX `idx_contact_messages_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 10. Conversations Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `conversations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 11. Conversation Participants Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `conversation_participants` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `conversation_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `joined_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_conv_user` (`conversation_id`, `user_id`),
  INDEX `idx_cp_user_id` (`user_id`),
  CONSTRAINT `fk_cp_conversation` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cp_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 12. Messages Table
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `conversation_id` INT NOT NULL,
  `sender_id` INT NOT NULL,
  `body` TEXT NOT NULL,
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_messages_conversation_id` (`conversation_id`),
  INDEX `idx_messages_sender_id` (`sender_id`),
  CONSTRAINT `fk_msg_conversation` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_msg_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------
-- Seed Initial Data
-- --------------------------------------------------------

-- Roles Data
INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'Admin'),
(2, 'Client'),
(3, 'Contractor'),
(4, 'Worker')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Default Inventory Data
INSERT INTO `materials` (`name`, `category`, `stock`, `unit`, `threshold`, `site`, `status`) VALUES
('Portland Cement (OPC 53)', 'Cement', 340, 'Bags', 200, 'Emerald Heights', 'OK'),
('TMT Rebar – Fe 500D', 'Steel', 18, 'MT', 25, 'Central Plaza', 'Low'),
('Marble Tiles (Italian White)', 'Finishing', 0, 'Sq.ft', 500, 'Central Plaza', 'Out'),
('River Sand (M Sand)', 'Aggregate', 620, 'Cu.ft', 300, 'Sector 14', 'OK'),
('Ready Mix Concrete M30', 'Concrete', 45, 'Cu.m', 30, 'Green Valley', 'OK'),
('Electrical Conduit Pipes', 'Electrical', 80, 'Pcs', 150, 'Green Valley', 'Low')
ON DUPLICATE KEY UPDATE `stock` = VALUES(`stock`), `status` = VALUES(`status`);