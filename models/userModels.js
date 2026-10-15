import pool from "../config/db.js";
import { randomUUID } from "node:crypto";

class User {
  static async findById(id) {
    const [result] = await pool.execute(
      `
        SELECT user_id, email, name FROM users WHERE user_id = ?
      `,
      [id],
    );

    return result[0] ?? null;
  }

  static async findByEmail(email) {
    const [result] = await pool.execute(
      `
        SELECT user_id, email, name, password FROM users WHERE email = ?
      `,
      [email],
    );

    return result[0] ?? null;
  }

  static async create(user) {
    const id = randomUUID();

    await pool.execute(
      `
        INSERT INTO users (user_id, email, name, password) VALUES (?, ?, ?, ?)
      `,
      [id, user.email, user.name, user.password],
    );

    return id;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      `
        DELETE FROM users WHERE user_id = ?
      `,
      [id],
    );

    return result.affectedRows > 0;
  }

  static async edit(id, fields) {
    const keys = Object.keys(fields);
    const values = Object.values(fields);

    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    values.push(id);

    const [result] = await pool.execute(
      `
        UPDATE users
        SET ${setClause}
        WHERE user_id = ?
      `,
      values,
    );

    return result.affectedRows > 0;
  }
}

export default User;
