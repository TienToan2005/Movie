CREATE TABLE category (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          name VARCHAR(255) NOT NULL UNIQUE,
                          created_at DATETIME NULL,
                          updated_at DATETIME NULL,
                          deleted_at DATETIME NULL,
                          created_by VARCHAR(255) NULL,
                          updated_by VARCHAR(255) NULL,
                          deleted_by VARCHAR(255) NULL
);

CREATE TABLE movie_category (
                                category_id BIGINT NOT NULL,
                                movie_id BIGINT NOT NULL,
                                PRIMARY KEY (category_id, movie_id),
                                CONSTRAINT fk_movcat_on_category FOREIGN KEY (category_id) REFERENCES category (id),
                                CONSTRAINT fk_movcat_on_movie FOREIGN KEY (movie_id) REFERENCES movies (id)
);