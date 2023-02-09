const pool = require('../utils/pool');

module.exports = class Post {
  id;
  user_id;
  name;
  description;
  rating;
  city;
  state;
  address;
  pictures;
  constructor(row) {
    this.id = row.id;
    this.user_id = row.user_id;
    this.name = row.name;
    this.description = row.description;
    this.rating = row.rating;
    this.city = row.city;
    this.state = row.state;
    this.address = row.address;
    this.pictures = row.pictures;
  }
  // creating a new post
  static async insert({
    user_id,
    name,
    description,
    rating,
    city,
    state,
    address,
    pictures,
  }) {
    const { rows } = await pool.query(
      `
    INSERT INTO posts (user_id, name, description, rating, city, state, address, pictures)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
      `,
      [user_id, name, description, rating, city, state, address, pictures]
    );
    return new Post(rows[0]);
  }

  // retrieving posts - by id/ all
  static async getById(id) {
    const { rows } = await pool.query(
      `
      SELECT * 
      FROM posts 
      WHERE id = $1`,
      [id]
    );
    if (!rows[0]) {
      return null;
    }
    return new Post(rows[0]);
  }

  static async getAllByUserId(user_id) {
    const { rows } = await pool.query(
      `
    SELECT *
    FROM posts
    WHERE user_id = $1
    ORDER BY created_at
    DESC`,
      [user_id]
    );
    return rows.map((row) => new Post(row));
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * from posts');
    return rows.map((row) => new Post(row));
  }
};
