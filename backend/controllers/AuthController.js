import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/UserModel.js";
import { Patient } from "../models/PatientModel.js";
import { HospitalAdmin } from "../models/HospitalModel.js"; 

/**
 * register
 * Public registration – used by regular App Users (patients/doctors).
 * Accepts an optional hospitalId so the user is linked to the correct hospital.
 */
export const register = async (req, res) => {
  const { name, email, password, role, hospitalId, gender, age, phone, cnic } = req.body;

  try {
    const existingUsers = await User.find({ email });
    if (existingUsers.length > 0)
      return res.status(400).json({ message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);

    // Security: public registration can ONLY create patient roles.
    // Doctors/Admins must be created securely from the backend by authorized roles.
    const userRole = "patient";

    console.log("Registering user:", name, email, userRole);

    // Insert user with hospital_id and demographic info
    const user = await User.create({
      name,
      email,
      cnic: cnic || null,
      password: hash,
      role: userRole,
      hospital_id: hospitalId || null,
      gender: gender || 'Male',
      age: age || 30,
      phone: phone || '03000000000'
    });
    const userId = user._id;
    console.log("User created with ID:", userId);

    // Only create patient model context
    if (userRole === "patient") {
      await Patient.create({ user_id: userId, contact_info: "", medical_history: "", hospital_id: hospitalId || null });
    }

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Critical Registration Error:", err);
    res.status(500).json({
      message: "Backend Error: " + err.message,
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
  console.log("Login Attempt:", email);

  try {

    // ── Step 1: Check if this email belongs to a hospital_admin ─────────────
    const hospitalAdmins = await HospitalAdmin.find({ email }).populate('hospital_id', 'name');
    console.log("Hospital Admins found:", hospitalAdmins.length);

    if (hospitalAdmins.length > 0) {
      const ha = hospitalAdmins[0];
      console.log("HA Found, checking activity...");

      if (!ha.is_active) {
        console.log("HA Inactive");
        return res.status(403).json({ message: "This account has been disabled by Super Admin." });
      }

      console.log("Comparing password for HA...");
      const isMatch = await bcrypt.compare(password, ha.password);
      console.log("Password Match:", isMatch);
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
          id: ha._id,
          role: "hospital_admin",
          hospitalId: ha.hospital_id,
          hospitalAdminId: ha._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({
        token,
        user: {
          id: ha._id,
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
    console.log("Checking Users collection...");
    const users = await User.find({ email });
    console.log("Users found:", users.length);
    if (users.length === 0) {
      console.log("User NOT found in DB");
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];
    console.log("User Found:", user.role, "Checking password...");
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password Match:", isMatch);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const tokenPayload = {
      id: user._id,
      role: user.role,
      cnic: user.cnic || null,
      phone: user.phone || null,
      name: user.name || null,
    };

    // Attach hospitalId to token if user is scoped to a hospital
    if (user.hospital_id) {
      tokenPayload.hospitalId = user.hospital_id;
    }

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    console.log("Login Successful for", user.role);
    return res.json({
      token,
      user: {
        id: user._id,
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
