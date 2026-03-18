CREATE TABLE reviews (
                         id BIGINT AUTO_INCREMENT PRIMARY KEY,
                         rating INTEGER NOT NULL,
                         content TEXT NOT NULL,
                         movie_id BIGINT NOT NULL,
                         user_id BIGINT NOT NULL,
                         created_at DATETIME NULL,
                         updated_at DATETIME NULL,
                         deleted_at DATETIME NULL,
                         created_by VARCHAR(255) NULL,
                         updated_by VARCHAR(255) NULL,
                         deleted_by VARCHAR(255) NULL,

                         CONSTRAINT fk_reviews_movie FOREIGN KEY (movie_id) REFERENCES movies(id),

                         CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(id),

                         CONSTRAINT uc_user_movie UNIQUE (user_id, movie_id)
);
