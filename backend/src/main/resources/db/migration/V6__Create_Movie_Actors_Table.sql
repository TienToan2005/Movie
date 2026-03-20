CREATE TABLE movie_actors (
                              movie_id BIGINT NOT NULL,
                              name VARCHAR(255),
                              profile_url VARCHAR(1000),
                              CONSTRAINT fk_movie_actors_movie FOREIGN KEY (movie_id) REFERENCES movies (id)
);