import db from "../config/db.js";

// Create user in `users` table
export const createUser = async (data) => {
  const sql = "INSERT INTO users (name, email, password) VALUES (?,?,?)";
  return await db.query(sql, data);
};

// Find user by email in `users` table
export const findUserByEmail = async (email) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  const [rows] = await db.query(sql, [email]);
  return rows;
};
