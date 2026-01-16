import db from "../config/db.js";

export const createUser = async (user) => {
  const sql = "INSERT INTO users (name, email, password) VALUES (?,?,?)";
  const [result] = await db.query(sql, [user.name, user.email, user.password]);
  return result;
};

export const findUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email=?", [email]);
  return rows;
};

export const findUserById = async (id) => {
  const [rows] = await db.query("SELECT id, name, email FROM users WHERE id=?", [id]);
  return rows;
};
