import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt.js";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../models/userModel.js";

// Register
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  const hashed = await bcrypt.hash(password, 10);

  createUser({ name, email, password: hashed }, (err) => {
    if (err) return res.status(400).json({ message: "Email already exists" });
    res.json({ message: "Registered successfully" });
  });
};

// Login
export const login = (req, res) => {
  const { email, password } = req.body;

  findUserByEmail(email, async (err, users) => {
    if (!users.length)
      return res.status(400).json({ message: "User not found" });

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token });
  });
};

// Profile
export const profile = (req, res) => {
  findUserById(req.user.id, (err, users) => {
    if (!users.length)
      return res.status(404).json({ message: "User not found" });
    res.json(users[0]);
  });
};
