const pool = require('../utils/pool');

module.exports = class Favorites {
  user_id;
  post_id;

  constructor(row) {
    this.user_id = row.user_id;
    this.post_id = row.post_id;
  }

  static async addFavorites(user_id, post_id) {
    const { rows } = await pool.query(
      'INSERT INTO favorites (user_id, post_id) VALUES ($1, $2) RETURNING *',
      [user_id, post_id]
    );
    return new Favorites(rows[0]);
  }

  static async delete(user_id, post_id) {
    const { rows } = await pool.query(
      `
      DELETE FROM favorites
      WHERE user_id = $1 AND post_id = $2
      RETURNING *
      `,
      [user_id, post_id]
    );
    return new Favorites(rows[0]);
  }
};
