CREATE TABLE users (
                       id BIGINT PRIMARY KEY AUTO_INCREMENT,
                       username VARCHAR(255) NOT NULL UNIQUE ,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password_hash VARCHAR(255) NOT NULL,
                       role VARCHAR(50) NOT NULL, -- Chuyển sang VARCHAR để linh hoạt
                       is_active BOOLEAN NOT NULL DEFAULT TRUE,
                       created_at DATETIME NULL,
                       updated_at DATETIME NULL,
                       deleted_at DATETIME NULL,
                       created_by VARCHAR(255) NULL,
                       updated_by VARCHAR(255) NULL,
                       deleted_by VARCHAR(255) NULL
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
                        average_rating DOUBLE DEFAULT 0.0,
                        total_reviews INT DEFAULT 0,
                        stream_url VARCHAR(1000) NOT NULL,
                        created_at DATETIME NULL,
                        updated_at DATETIME NULL,
                        deleted_at DATETIME NULL,
                        created_by VARCHAR(255) NULL,
                        updated_by VARCHAR(255) NULL,
                        deleted_by VARCHAR(255) NULL
);