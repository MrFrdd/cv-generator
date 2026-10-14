-- Inisialisasi Database CV Generator
CREATE DATABASE IF NOT EXISTS cv_generator_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE cv_generator_db;

-- 1. Tabel Users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    headline VARCHAR(150),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Tabel Templates
CREATE TABLE IF NOT EXISTS templates (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    thumbnail VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Tabel Master CVs
CREATE TABLE IF NOT EXISTS cvs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    template_id VARCHAR(50) NOT NULL DEFAULT 'modern',
    title VARCHAR(150) NOT NULL DEFAULT 'Curriculum Vitae',
    summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (template_id) REFERENCES templates(id) ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 4. Tabel Personal Information (1:1 dengan CV)
CREATE TABLE IF NOT EXISTS personal_information (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cv_id INT NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    job_title VARCHAR(100),
    photo_url VARCHAR(255),
    email VARCHAR(150),
    phone VARCHAR(30),
    address TEXT,
    city VARCHAR(100),
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255),
    portfolio_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Tabel Educations (1:N)
CREATE TABLE IF NOT EXISTS educations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cv_id INT NOT NULL,
    institution VARCHAR(150) NOT NULL,
    degree VARCHAR(100),
    major VARCHAR(100),
    start_year VARCHAR(10),
    end_year VARCHAR(10),
    gpa VARCHAR(20),
    description TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Tabel Work Experiences (1:N)
CREATE TABLE IF NOT EXISTS work_experiences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cv_id INT NOT NULL,
    company VARCHAR(150) NOT NULL,
    position VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    start_date VARCHAR(20),
    end_date VARCHAR(20),
    is_current TINYINT(1) DEFAULT 0,
    description TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Tabel Internships (1:N)
CREATE TABLE IF NOT EXISTS internships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cv_id INT NOT NULL,
    company VARCHAR(150) NOT NULL,
    position VARCHAR(100) NOT NULL,
    period VARCHAR(50),
    description TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Tabel Organizations (1:N)
CREATE TABLE IF NOT EXISTS organizations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cv_id INT NOT NULL,
    organization_name VARCHAR(150) NOT NULL,
    role VARCHAR(100) NOT NULL,
    period VARCHAR(50),
    description TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. Tabel Skills (1:N)
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cv_id INT NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    category ENUM('hard', 'soft') DEFAULT 'hard',
    level ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert') DEFAULT 'Intermediate',
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. Tabel Certifications (1:N)
CREATE TABLE IF NOT EXISTS certifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cv_id INT NOT NULL,
    certificate_name VARCHAR(150) NOT NULL,
    issuer VARCHAR(150),
    issue_year VARCHAR(10),
    credential_url VARCHAR(255),
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 11. Tabel Languages (1:N)
CREATE TABLE IF NOT EXISTS languages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cv_id INT NOT NULL,
    language_name VARCHAR(100) NOT NULL,
    proficiency VARCHAR(50) DEFAULT 'Fluent',
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 12. Tabel Achievements (1:N)
CREATE TABLE IF NOT EXISTS achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cv_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    issuer VARCHAR(150),
    year VARCHAR(10),
    description TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 13. Tabel Projects (1:N)
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cv_id INT NOT NULL,
    project_name VARCHAR(150) NOT NULL,
    tech_stack VARCHAR(200),
    github_link VARCHAR(255),
    demo_link VARCHAR(255),
    description TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Seed Data Templates Standar
INSERT INTO templates (id, name, description, thumbnail) VALUES
('professional', 'Professional (Classic Corporate)', 'Format 1 kolom formal dengan garis batas elegan, palet navy, cocok untuk BUMN, perbankan, dan korporat.', '/templates/professional.png'),
('modern', 'Modern (Tech & Creative)', 'Format 2 kolom asimetris dengan sidebar info profil & keahlian, cocok untuk IT, tech, dan startup.', '/templates/modern.png'),
('minimalist', 'Minimalist (Clean ATS-Friendly)', 'Format ultra-bersih tanpa ornamen grafis berat, fokus pada keterbacaan teks dan lolos screening ATS.', '/templates/minimalist.png')
ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description);
