import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/UserModel.js";
import { createDoctor } from "../models/DoctorModel.js";
import { createPatient } from "../models/PatientModel.js";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUsers = await findUserByEmail(email);
    if (existingUsers.length > 0)
      return res.status(400).json({ message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);
    const userRole = role || 'patient'; // Default to patient if not provided
    console.log("Registering user:", name, email, userRole);

    const [userResult] = await createUser([name, email, hash, userRole]);
    const userId = userResult.insertId;
    console.log("User created with ID:", userId);

    if (userRole === 'doctor') {
      await createDoctor([userId, '', '']); // Create empty doctor profile
      console.log("Doctor profile created");
    } else if (userRole === 'patient') {
      await createPatient([userId, '', '']); // Create empty patient profile
      console.log("Patient profile created");
    }

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const users = await findUserByEmail(email);
    if (users.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};
