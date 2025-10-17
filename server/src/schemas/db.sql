-- @ts-nocheck
-- $ will be replaced with database name at runtime, ignore error
CREATE DATABASE IF NOT EXISTS $ CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE $;

CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    reset_token CHAR(64) DEFAULT NULL,
    reset_expires DATETIME DEFAULT NULL
);