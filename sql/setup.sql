-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS users CASCADE;

DROP TABLE IF EXISTS posts CASCADE;

DROP TABLE IF EXISTS favorites CASCADE;

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR NOT NULL,
  first_name VARCHAR,
  last_name VARCHAR,
  password_hash VARCHAR NOT NULL,
  friends_list BIGINT
);

CREATE TABLE posts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR NOT NULL,
  description VARCHAR,
  rating VARCHAR,
  city VARCHAR,
  pictures VARCHAR
);

CREATE TABLE favorites (
  users_id BIGINT,
  posts_id BIGINT,
  FOREIGN KEY (users_id) REFERENCES users(id),
  FOREIGN KEY (posts_id) REFERENCES posts(id)
);