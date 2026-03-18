CREATE TABLE watchlist (
                           user_id BIGINT NOT NULL,
                           movie_id BIGINT NOT NULL,
                           PRIMARY KEY (user_id, movie_id),
                           CONSTRAINT fk_watchlist_user FOREIGN KEY (user_id) REFERENCES users(id),
                           CONSTRAINT fk_watchlist_movie FOREIGN KEY (movie_id) REFERENCES movies(id)
);