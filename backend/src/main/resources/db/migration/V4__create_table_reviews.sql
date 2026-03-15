CREATE TABLE reviews (
                         id BIGINT AUTO_INCREMENT PRIMARY KEY,
                         rating INTEGER NOT NULL,
                         content TEXT NOT NULL,
                         movie_id BIGINT NOT NULL,
                         user_id BIGINT NOT NULL,
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                         created_by VARCHAR(255),
                         updated_by VARCHAR(255),

                         CONSTRAINT fk_reviews_movie FOREIGN KEY (movie_id) REFERENCES movies(id),

                         CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(id),

                         CONSTRAINT uc_user_movie UNIQUE (user_id, movie_id)
);


ALTER TABLE movies ADD COLUMN average_rating DOUBLE DEFAULT 0.0;
ALTER TABLE movies ADD COLUMN total_reviews INTEGER DEFAULT 0;