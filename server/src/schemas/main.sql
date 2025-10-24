CREATE DATABASE IF NOT EXISTS [db] CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE [db];

CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    reset_token CHAR(64) DEFAULT NULL,
    reset_expires DATETIME DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
    booking_id VARCHAR(8) PRIMARY KEY,
    people_count INT UNSIGNED NOT NULL,
    special_instructions TEXT,
    table_number INT UNSIGNED NOT NULL,
    booking_dt DATETIME NOT NULL,
    id INT UNSIGNED NOT NULL,
    FOREIGN KEY (id) REFERENCES users(id)
);

-- this will add an admin account automatically
INSERT INTO users(email, password_hash) SELECT "admin@admin.admin", "$2b$10$qgZ4d.ObEUBo7ubE0TV5d.J94G82UlshF6IQe1wSv7stL61m36A9G" WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = "admin@admin.admin");