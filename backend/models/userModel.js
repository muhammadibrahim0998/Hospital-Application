import db from "../config/db.js";

export const createUser = (user, cb) => {
  const sql = "INSERT INTO users (name, email, password) VALUES (?,?,?)";
  db.query(sql, [user.name, user.email, user.password], cb);
};

export const findUserByEmail = (email, cb) => {
  db.query("SELECT * FROM users WHERE email=?", [email], cb);
};

export const findUserById = (id, cb) => {
  db.query("SELECT id, name, email FROM users WHERE id=?", [id], cb);
};
