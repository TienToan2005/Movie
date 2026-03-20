CREATE TABLE episodes (
                                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                        movie_id BIGINT NOT NULL,
                                        episode_number INT NOT NULL,
                                        video_url TEXT,
                                        server_name VARCHAR(50),
                                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                        deleted_at DATETIME NULL,
                                        created_by VARCHAR(255) NULL,
                                        updated_by VARCHAR(255) NULL,
                                        deleted_by VARCHAR(255) NULL,
                                        CONSTRAINT fk_episode_movie FOREIGN KEY (movie_id) REFERENCES movies(id)
                                        );

-- Thêm cột tmdb_id nếu chưa có
ALTER TABLE movies ADD COLUMN tmdb_id INT;

-- Tạo index unique (Dùng CREATE UNIQUE INDEX thường an toàn hơn ADD CONSTRAINT trong một số bản MySQL)
CREATE UNIQUE INDEX uc_tmdb_id ON movies(tmdb_id);