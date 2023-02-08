const pool = require('../utils/pool');

module.exports = class Post {
  id;
  name;
  description;
  rating;
  city;
  state;
  address;
  pictures;
  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.description = row.description;
    this.rating = row.rating;
    this.city = row.city;
    this.state = row.state;
    this.address = row.address;
    this.pictures = row.pictures;
  }

  static async insert({
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
      INSERT INTO posts (name, description, rating, city, state, address, pictures)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `,
      [name, description, rating, city, state, address, pictures]
    );
    return new Post(rows[0]);
  }
};
