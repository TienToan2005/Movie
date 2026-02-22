CREATE TABLE users(
    id BIGINT PRIMARY KEY AUTO_INCREMENT ,
    fullName VARCHAR(255) NOT NULL ,
    email VARCHAR(255) NOT NULL UNIQUE ,
    password_hash VARCHAR(255) not null ,
    role enum('ADMIN','CUSTOMER') not null ,
    is_active boolean not null default true ,
    deleted_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE movies(
    id bigint primary key auto_increment ,
    title varchar(255) not null ,
    status enum('COMING_SOON','AVAILABLE','ARCHIVED') not null,
    type ENUM('MOVIE','SERIES') not null,
    director varchar(255),
    condition_status ENUM('ONGOING','COMPLETED'),
    description text,
    duration_minutes int,
    total_episodes int,
    language varchar(255),
    year int,
    country varchar(255),
    category varchar(255),
    actor varchar(255),
    poster_url varchar(500),
    trailer_url varchar(500),
    stream_url VARCHAR(1000) NOT NULL,
    deleted_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);