CREATE TABLE refresh_tokens (
                                id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                token VARCHAR(255) NOT NULL UNIQUE,
                                user_id BIGINT NOT NULL,
                                expiry_date TIMESTAMP NOT NULL,
                                revoked BOOLEAN DEFAULT FALSE,
                                parent_id BIGINT,
                                created_at DATETIME NULL,
                                updated_at DATETIME NULL,
                                deleted_at DATETIME NULL,
                                created_by VARCHAR(255) NULL,
                                updated_by VARCHAR(255) NULL,
                                deleted_by VARCHAR(255) NULL,

                                CONSTRAINT fk_refresh_user
                                    FOREIGN KEY (user_id)
                                        REFERENCES users(id)
                                        ON DELETE CASCADE,

                                CONSTRAINT fk_parent_token
                                    FOREIGN KEY (parent_id)
                                        REFERENCES refresh_tokens(id)
);

CREATE INDEX idx_refresh_token_token
    ON refresh_tokens(token);

CREATE INDEX idx_refresh_token_user
    ON refresh_tokens(user_id);

CREATE INDEX idx_refresh_token_expiry
    ON refresh_tokens(expiry_date);