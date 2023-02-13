const pool = require('../utils/pool');

module.exports = class Friend {
  user_id;
  friend_id;
  added;

  constructor(row) {
    this.user_id = row.user_id;
    this.friend_id = row.friend_id;
    this.added = row.added;
  }

  static async addFriend(user_id, friend_id) {
    const { rows } = await pool.query(
      'INSERT INTO friends_list (user_id, friend_id) VALUES ($1, $2) RETURNING *',
      [user_id, friend_id]
    );
    return new Friend(rows[0]);
  }

  // need an update route to change the boolean to true once the friend accepts the request

  //   static async delete(user_id, post_id) {
  //     const { rows } = await pool.query(
  //       `
  //       DELETE FROM favorites
  //       WHERE user_id = $1 AND post_id = $2
  //       RETURNING *
  //       `,
  //       [user_id, post_id]
  //     );
  //     return new Favorites(rows[0]);
  //   }
};
