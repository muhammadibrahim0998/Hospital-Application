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

  try {
    const existingUsers = await findUserByEmail(email);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await createUser({ name, email, password: hashed });
    res.json({ message: "Registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const users = await findUserByEmail(email);
    if (!users.length)
      return res.status(400).json({ message: "User not found" });

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Profile
export const profile = async (req, res) => {
  try {
    const users = await findUserById(req.user.id);
    if (!users.length)
      return res.status(404).json({ message: "User not found" });
    res.json(users[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
