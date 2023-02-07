const pool = require('../utils/pool');

module.exports = class User {
  id;
  email;
  firstName;
  lastName;
  friends;
  #passwordHash; // private class field: hides it from anything outside of this class definition

  constructor(row) {
    this.id = row.id;
    this.email = row.email;
    this.firstName = row.first_name;
    this.lastName = row.last_name;
    this.#passwordHash = row.password_hash;
    this.friends = row.friends;
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

  get passwordHash() {
    return this.#passwordHash;
  }
};
