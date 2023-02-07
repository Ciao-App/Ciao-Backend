const pool = require('../utils/pool');

module.exports = class User {
  id;
  email;
  firstName;
  lastName;
  #passwordHash; // private class field: hides it from anything outside of this class definition

  constructor(row) {
    this.id = row.id;
    this.email = row.email;
    this.firstName = row.first_name;
    this.lastName = row.last_name;
    this.#passwordHash = row.password_hash;
  }

  static async insert({ email, firstName, lastName, passwordHash }) {
    const { rows } = await pool.query(
      `
      INSERT INTO users (email, first_name, last_name, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
      [email, firstName, lastName, passwordHash]
    );

    return new User(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM users');

    return rows.map((row) => new User(row));
  }

  static async getByEmail(email) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM users
      WHERE email=$1
      `,
      [email]
    );
    if (!rows[0]) return null;
    return new User(rows[0]);
  }
  // alternative for get user in case user decides to change email in the future - just a backup option set in place
  static async getById(id) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM users
      WHERE id=$1
      `,
      [id]
    );
    if (!rows[0]) return null;
    return new User(rows[0]);
  }

  // adding friends feature - inserting user id into friends_list column
  //   static async addFriend(id, userId) {
  //     const user = await User.getById(id);
  //     if (!user) return null;
  //     const updatedFriendsList = [...user.friendsList, userId];
  //     const { rows } = await pool.query(
  //       `
  //     INSERT INTO users (friends_list)
  //     VALUES ($2)
  //     WHERE id = $1
  //     RETURNING *
  //     `,
  //       [id, updatedFriendsList.userId]
  //     );
  //     return new User(rows[0]);
  //   }

  // future feature where user can update their profile - currently not MVP
  // When ready to build out, test -> controller
  static async updateProfile(id, newAttr) {
    const user = await User.getById(id);
    if (!user) return null;
    const updateData = { ...user, ...newAttr };
    const { rows } = await pool.query(
      `
    update users
    set email = $2, first_name = $3, last_name = $4, password_hash = $5
    where id = $1
    returning *
    `,
      [
        id,
        updateData.email,
        updateData.firstName,
        updateData.lastName,
        updateData.passwordHash,
      ]
    );
    return new User(rows[0]);
  }

  get passwordHash() {
    return this.#passwordHash;
  }
};
