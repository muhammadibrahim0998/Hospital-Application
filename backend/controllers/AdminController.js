import { createUser } from "../models/UserModel.js";
import {
  createDoctor,
  getAllDoctors,
  updateDoctorStatus,
  getDoctorById,
  deleteDoctor,
} from "../models/DoctorModel.js";
import { updateUser, deleteUser } from "../models/UserModel.js";
import { getAllPatients } from "../models/PatientModel.js";
import { getAllAppointments } from "../models/AppointmentModel.js";
import bcrypt from "bcryptjs";
import db from "../config/db.js";

export const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      specialization,
      contact_info,
      departmentId,
      fieldId,
      phone,
      fee,
      whatsappNumber,
    } = req.body;

    const hash = await bcrypt.hash(password, 10);

    // Determine hospital_id from the acting admin
    const hospitalId = req.hospitalId || null;

    // Insert user with hospital_id
    const [userInsert] = await db.query(
      "INSERT INTO users (name, email, password, role, hospital_id) VALUES (?,?,?,?,?)",
      [name, email, hash, "doctor", hospitalId]
    );
    const userId = userInsert.insertId;

    const imagePath = req.file ? `/uploads/doctors/${req.file.filename}` : null;

    // Insert doctor with hospital_id
    await db.query(
      `INSERT INTO doctors (user_id, specialization, contact_info, image, department_id, field_id, phone, fee, whatsapp_number, hospital_id) VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [userId, specialization, contact_info, imagePath, departmentId, fieldId, phone, fee || 500, whatsappNumber, hospitalId]
    );

    res.status(201).json({ message: "Doctor added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const editDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      specialization,
      contact_info,
      departmentId,
      fieldId,
      phone,
      fee,
      whatsappNumber,
    } = req.body;

    const imagePath = req.file ? `/uploads/doctors/${req.file.filename}` : null;

    await updateDoctor(id, [
      specialization,
      contact_info,
      imagePath,
      departmentId,
      fieldId,
      phone,
      fee,
      whatsappNumber,
    ]);

    res.json({ message: "Doctor updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

export const removeDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteDoctor(id);
    res.json({ message: "Doctor deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

export const getDoctors = async (req, res) => {
  try {
    const doctors = await getAllDoctors();
    res.json(doctors);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getPatients = async (req, res) => {
  try {
    const patients = await getAllPatients();
    res.json(patients);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getAppointments = async (req, res) => {
  try {
    const appointments = await getAllAppointments();
    res.json(appointments);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const toggleDoctorStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await updateDoctorStatus(id, status);
    res.json({ message: `Doctor status updated to ${status}` });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const addLabTechnician = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    const hash = await bcrypt.hash(password, 10);
    const hospitalId = req.hospitalId || null;
    await db.query(
      "INSERT INTO users (name, email, password, role, hospital_id, phone) VALUES (?,?,?,?,?,?)",
      [name, email, hash, "lab_technician", hospitalId, phone || ""]
    );
    res.status(201).json({ message: "Lab technician added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getLabTechnicians = async (req, res) => {
  try {
    const hospitalId = req.hospitalId || null;
    let rows;
    if (hospitalId) {
      [rows] = await db.query(
        "SELECT id, name, email, phone, created_at FROM users WHERE role = 'lab_technician' AND hospital_id = ? ORDER BY created_at DESC",
        [hospitalId]
      );
    } else {
      [rows] = await db.query(
        "SELECT id, name, email, phone, created_at FROM users WHERE role = 'lab_technician' ORDER BY created_at DESC"
      );
    }
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const editLabTechnician = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    
    await updateUser(id, [name, email, phone]);
    
    res.json({ message: "Lab technician updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const removeLabTechnician = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteUser(id);
    res.json({ message: "Lab technician deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
