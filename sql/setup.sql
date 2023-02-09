-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS users CASCADE;

DROP TABLE IF EXISTS posts CASCADE;

DROP TABLE IF EXISTS favorites CASCADE;

DROP TABLE IF EXISTS friends_list CASCADE;

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR NOT NULL,
  first_name VARCHAR,
  last_name VARCHAR,
  password_hash VARCHAR NOT NULL
);

CREATE TABLE posts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT,
  name VARCHAR NOT NULL,
  description VARCHAR,
  rating VARCHAR,
  city VARCHAR,
  state VARCHAR,
  address VARCHAR,
  pictures VARCHAR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE favorites (
  user_id BIGINT,
  post_id BIGINT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (post_id) REFERENCES posts(id)
);

CREATE TABLE friends_list (
  user_id BIGINT,
  friend_id BIGINT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (friend_id) REFERENCES users(id),
  added BOOLEAN
);