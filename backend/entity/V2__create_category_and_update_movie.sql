-- 1. Tạo bảng category trước
CREATE TABLE category
(
    id         BIGINT AUTO_INCREMENT NOT NULL,
    name       VARCHAR(255)          NOT NULL,
    created_at datetime              NULL,
    updated_at datetime              NULL,
    CONSTRAINT pk_category PRIMARY KEY (id)
);

-- 2. Tạo bảng trung gian
CREATE TABLE movie_category
(
    category_id BIGINT NOT NULL,
    movie_id    BIGINT NOT NULL,
    CONSTRAINT pk_movie_category PRIMARY KEY (category_id, movie_id)
);

-- 3. Thêm Constraint
ALTER TABLE movie_category
    ADD CONSTRAINT fk_movcat_on_category FOREIGN KEY (category_id) REFERENCES category (id);

ALTER TABLE movie_category
    ADD CONSTRAINT fk_movcat_on_movie FOREIGN KEY (movie_id) REFERENCES movies (id);

-- 4. Cập nhật bảng movies (Dùng cú pháp cơ bản nhất)
ALTER TABLE movies ADD condition_status VARCHAR(255) NULL;
ALTER TABLE movies ADD status VARCHAR(255) DEFAULT 'ACTIVE';
ALTER TABLE movies ADD type VARCHAR(255) DEFAULT 'MOVIE';

ALTER TABLE movies MODIFY created_at datetime NULL;
ALTER TABLE movies MODIFY updated_at datetime NULL;