import { User } from "../models/UserModel.js";
import { Doctor } from "../models/DoctorModel.js";
import { Patient } from "../models/PatientModel.js";
import { Appointment } from "../models/appointmentModel.js";
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
      fee,
      whatsappNumber,
    } = req.body;

    const hash = await bcrypt.hash(password, 10);

    // Determine hospital_id from the acting admin
    const hospitalId = req.hospitalId || null;

    // Insert user with hospital_id using Mongoose
    const user = await User.create({
      name,
      email,
      password: hash,
      role: "doctor",
      hospital_id: hospitalId
    });
    const userId = user._id;

    const imagePath = req.file ? `/uploads/doctors/${req.file.filename}` : null;

    // Insert doctor with hospital_id using Mongoose
    await Doctor.create({
      user_id: userId,
      specialization,
      contact_info,
      image: imagePath,
      department_id: departmentId,
      field_id: fieldId,
      phone,
      fee: fee || 500,
      whatsapp_number: whatsappNumber,
      hospital_id: hospitalId
    });

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

    const updateData = { specialization, contact_info, department_id: departmentId, field_id: fieldId, phone, fee, whatsapp_number: whatsappNumber };
    if (imagePath) updateData.image = imagePath;

    await Doctor.findByIdAndUpdate(id, updateData);

    res.json({ message: "Doctor updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const removeDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);
    if (doctor) {
      await User.findByIdAndDelete(doctor.user_id);
      await Doctor.findByIdAndDelete(id);
    }
    res.json({ message: "Doctor deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getDoctors = async (req, res) => {
  try {
    const hospitalId = req.hospitalId || null;
    const filter = hospitalId ? { hospital_id: hospitalId } : {};
    const doctors = await Doctor.find(filter).populate('user_id', 'name email').sort({ created_at: -1 });
    
    const formatted = doctors.map(d => ({
        ...d.toObject(),
        name: d.user_id?.name,
        email: d.user_id?.email
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getPatients = async (req, res) => {
  try {
    const hospitalId = req.hospitalId || null;
    const filter = hospitalId ? { hospital_id: hospitalId } : {};
    const patients = await Patient.find(filter).populate('user_id', 'name email').sort({ created_at: -1 });
    const formatted = patients.map(p => ({
        ...p.toObject(),
        name: p.user_id?.name,
        email: p.user_id?.email
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const hospitalId = req.hospitalId || null;
    const filter = hospitalId ? { hospital_id: hospitalId } : {};
    const appointments = await Appointment.find(filter).sort({ created_at: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const toggleDoctorStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await Doctor.findByIdAndUpdate(id, { status });
    res.json({ message: `Doctor status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const addLabTechnician = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    // Proactive check for duplicate email to avoid 500 errors
    const existing = await User.findOne({ email: { $regex: `^${email}$`, $options: "i" } });
    if (existing) {
      return res.status(400).json({ message: "A user with this email already exists." });
    }

    const hash = await bcrypt.hash(password, 10);
    const hospitalId = req.hospitalId || null;
    await User.create({
      name,
      email,
      password: hash,
      role: "lab_technician",
      hospital_id: hospitalId,
      phone: phone || ""
    });
    res.status(201).json({ message: "Lab technician added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getLabTechnicians = async (req, res) => {
  try {
    const hospitalId = req.hospitalId || null;
    const filter = { role: 'lab_technician' };
    if (hospitalId) filter.hospital_id = hospitalId;
    
    const rows = await User.find(filter)
        .select('name email phone created_at')
        .sort({ created_at: -1 });
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const editLabTechnician = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    await User.findByIdAndUpdate(id, { name, email, phone });
    res.json({ message: "Lab technician updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const removeLabTechnician = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: "Lab technician deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
