import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/UserModel.js";
import { createDoctor } from "../models/DoctorModel.js";
import { createPatient } from "../models/PatientModel.js";
import { findHospitalAdminByEmail } from "../models/HospitalModel.js";
import db from "../config/db.js";

/**
 * register
 * Public registration – used by regular App Users (patients/doctors).
 * Accepts an optional hospitalId so the user is linked to the correct hospital.
 */
export const register = async (req, res) => {
  const { name, email, password, role, hospitalId, gender, age, phone, cnic } = req.body;

  try {
    const existingUsers = await findUserByEmail(email);
    if (existingUsers.length > 0)
      return res.status(400).json({ message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);

    // Security: public registration can ONLY create patient roles.
    // Doctors/Admins must be created securely from the backend by authorized roles.
    const userRole = "patient";

    console.log("Registering user:", name, email, userRole);

    // Insert user with hospital_id and demographic info
    const [userResult] = await db.query(
      "INSERT INTO users (name, email, cnic, password, role, hospital_id, gender, age, phone) VALUES (?,?,?,?,?,?,?,?,?)",
      [name, email, cnic || null, hash, userRole, hospitalId || null, gender || 'Male', age || 30, phone || '03000000000']
    );
    const userId = userResult.insertId;
    console.log("User created with ID:", userId);

    // Only create patient model context
    if (userRole === "patient") {
      await createPatient([userId, "", ""]);
      if (hospitalId) {
        await db.query("UPDATE patients SET hospital_id = ? WHERE user_id = ?", [hospitalId, userId]);
      }
    }

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Critical Registration Error:", err);
    res.status(500).json({
      message: "Backend Error: " + (err.sqlMessage || err.message),
      error: err.code
    });
  }
};

/**
 * login
 * Unified login endpoint.
 * Handles: super_admin, hospital_admin, doctor, patient.
 *
 * For hospital_admin: checks hospital_admins table (NOT users table).
 * For all others: checks users table.
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // ── Step 1: Check if this email belongs to a hospital_admin ─────────────
    const hospitalAdmins = await findHospitalAdminByEmail(email);

    if (hospitalAdmins.length > 0) {
      const ha = hospitalAdmins[0];

      if (!ha.is_active) {
        return res.status(403).json({ message: "This account has been disabled by Super Admin." });
      }

      const isMatch = await bcrypt.compare(password, ha.password);
      if (!isMatch) return res.status(400).json({ message: "Wrong password" });

      // Parse modules from JSON
      let modules = {};
      try {
        modules = typeof ha.modules === "string" ? JSON.parse(ha.modules) : ha.modules;
      } catch {
        modules = {};
      }

      const token = jwt.sign(
        {
          id: ha.id,
          role: "hospital_admin",
          hospitalId: ha.hospital_id,
          hospitalAdminId: ha.id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({
        token,
        user: {
          id: ha.id,
          name: ha.name,
          email: ha.email,
          role: "hospital_admin",
          hospitalId: ha.hospital_id,
          hospitalName: ha.hospital_name,
          modules,
        },
      });
    }

    // ── Step 2: Check users table (super_admin, doctor, patient) ─────────────
    const users = await findUserByEmail(email);
    if (users.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const tokenPayload = {
      id: user.id,
      role: user.role,
      cnic: user.cnic || null,
    };

    // Attach hospitalId to token if user is scoped to a hospital
    if (user.hospital_id) {
      tokenPayload.hospitalId = user.hospital_id;
    }

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        cnic: user.cnic || null,
        hospitalId: user.hospital_id || null,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};
