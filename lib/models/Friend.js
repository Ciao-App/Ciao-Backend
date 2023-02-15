const pool = require('../utils/pool');

module.exports = class Friend {
  sender_id;
  receiver_id;
  added;

  constructor(row) {
    this.sender_id = row.sender_id;
    this.receiver_id = row.receiver_id;
    this.added = row.added;
  }

  static async addFriend(sender_id, receiver_id) {
    const { rows } = await pool.query(
      'INSERT INTO friends_list (sender_id, receiver_id) VALUES ($1, $2) RETURNING *',
      [sender_id, receiver_id]
    );
    return new Friend(rows[0]);
  }

  static async getFriendRequest(receiver_id, sender_id) {
    const { rows } = await pool.query(
      `
    SELECT * 
    FROM friends_list
    WHERE receiver_id = $1 AND sender_id = $2
    `,
      [receiver_id, sender_id]
    );
    return new Friend(rows[0]);
  }

  static async acceptFriendRequest(object) {
    const request = await Friend.getFriendRequest(
      object.receiver_id,
      object.sender_id
    );
    if (!request) return null;
    const { receiver_id, sender_id, added } = {
      ...request,
      ...object,
      added: true,
    };
    const { rows } = await pool.query(
      `
    UPDATE friends_list
    SET added = $3
    WHERE receiver_id = $1 AND sender_id = $2
    RETURNING *
    `,
      [receiver_id, sender_id, added]
    );
    return new Friend(rows[0]);
  }

  static async getAllFriends(id) {
    const { rows } = await pool.query(
      `
    SELECT *
    FROM friends_list
    WHERE sender_id = $1 OR receiver_id = $1 AND added = true
    `,
      [id]
    );
    return rows.map((row) => new Friend(row));
  }

  static async deleteFriend(receiver_id, sender_id) {
    const { rows } = await pool.query(
      `
    DELETE FROM friends_list
    WHERE (receiver_id = $1 AND sender_id = $2) OR (sender_id = $1 AND receiver_id = $2)
    RETURNING *
    `,
      [receiver_id, sender_id]
    );
    return new Friend(rows[0]);
  }
};
