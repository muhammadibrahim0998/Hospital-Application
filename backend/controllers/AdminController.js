import { createUser } from "../models/UserModel.js";
import {
  createDoctor,
  getAllDoctors,
  updateDoctorStatus,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from "../models/DoctorModel.js";
import { getAllPatients } from "../models/PatientModel.js";
import { getAllAppointments } from "../models/AppointmentModel.js";
import bcrypt from "bcryptjs";

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
    } = req.body;

    const hash = await bcrypt.hash(password, 10);
    const userResult = await createUser([name, email, hash, "doctor"]);
    const userId = userResult[0].insertId;

    const imagePath = req.file ? `/uploads/doctors/${req.file.filename}` : null;

    await createDoctor([
      userId,
      specialization,
      contact_info,
      imagePath,
      departmentId,
      fieldId,
      phone,
    ]);
    res.status(201).json({ message: "Doctor added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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
    } = req.body;

    const imagePath = req.file ? `/uploads/doctors/${req.file.filename}` : null;

    await updateDoctor(id, [
      specialization,
      contact_info,
      imagePath,
      departmentId,
      fieldId,
      phone,
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
