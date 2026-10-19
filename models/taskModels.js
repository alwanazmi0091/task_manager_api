import pool from "../config/db.js";

class Tasks {
  static async findById(taskId, userId) {
    const [result] = await pool.execute(
      `
        SELECT task_id, task_content
        FROM tasks
        WHERE task_owner = ? AND task_id = ?
      `,
      [userId, taskId],
    );

    return result[0] ?? null;
  }

  static async get(userId, query) {
    const likeClause = query ? "AND task_content LIKE ?" : "";

    const params = [userId];

    if (query) {
      params.push(`%${query}%`);
    }

    const [result] = await pool.execute(
      `
        SELECT task_id, task_content
        FROM tasks
        WHERE task_owner = ? ${likeClause}
      `,
      params,
    );

    return result;
  }

  static async create(task, userId) {
    const [result] = await pool.execute(
      `
        INSERT INTO tasks (task_content, task_owner) VALUES (?, ?)
      `,
      [task, userId],
    );
    return result.insertId;
  }

  static async edit(task, taskId, userId) {
    const [result] = await pool.execute(
      `
        UPDATE tasks
        SET task_content = ?
        WHERE task_id = ? AND task_owner = ?
      `,
      [task, taskId, userId],
    );

    return result.affectedRows > 0;
  }

  static async delete(taskId, userId) {
    const [result] = await pool.execute(
      `
        DELETE FROM tasks
        WHERE task_id = ? AND task_owner = ?
      `,
      [taskId, userId],
    );

    return result.affectedRows > 0;
  }
}

export default Tasks;
