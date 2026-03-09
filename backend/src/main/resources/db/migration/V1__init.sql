CREATE TABLE users (
                       id BIGINT PRIMARY KEY AUTO_INCREMENT,
                       full_name VARCHAR(255) NOT NULL,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password_hash VARCHAR(255) NOT NULL,
                       role VARCHAR(50) NOT NULL, -- Chuyển sang VARCHAR để linh hoạt
                       is_active BOOLEAN NOT NULL DEFAULT TRUE,
                       deleted_at DATETIME NULL,
                       created_by VARCHAR(255) NULL,
                       updated_by VARCHAR(255) NULL,
                       created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE movies (
                        id BIGINT PRIMARY KEY AUTO_INCREMENT,
                        title VARCHAR(255) NOT NULL,
                        status VARCHAR(255) NOT NULL,
                        type VARCHAR(255) NOT NULL,
                        condition_status VARCHAR(255) NULL,
                        director VARCHAR(255),
                        description TEXT,
                        duration_minutes INT,
                        total_episodes INT,
                        language VARCHAR(255),
                        year INT,
                        country VARCHAR(255),
                        actor VARCHAR(255),
                        poster_url VARCHAR(500),
                        trailer_url VARCHAR(500),
                        stream_url VARCHAR(1000) NOT NULL,
                        deleted_at DATETIME NULL,
                        created_by VARCHAR(255) NULL,
                        updated_by VARCHAR(255) NULL,
                        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);