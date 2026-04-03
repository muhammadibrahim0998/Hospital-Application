import { Appointment } from "../models/appointmentModel.js";
import { Doctor } from "../models/DoctorModel.js";

export const fetchAppointments = async (req, res) => {
  try {
    let appointments = [];
    const role = req.userRole?.toLowerCase();

    if (role === "admin" || role === "super_admin" || role === "hospital_admin") {
      appointments = await Appointment.find().sort({ created_at: 1 });
    } else if (role === "doctor") {
      const doctor = await Doctor.findOne({ user_id: req.userId });
      if (doctor) {
        appointments = await Appointment.find({ doctor_id: doctor._id }).sort({ created_at: 1 });
      }
    } else {
      const userId = req.userId; 
      const userCnic = req.userCnic; 
      const userPhone = req.userPhone; 
      const userName = req.userName; 
      let filter = { $or: [{ user_id: userId }] }; 
      if (userCnic || userPhone || userName) { 
        const cleanCnic = userCnic ? userCnic.replace(/\D/g, "") : ""; 
        const cleanPhone = userPhone ? userPhone.replace(/\D/g, "") : ""; 
        if (userCnic) { 
            filter.$or.push({ CNIC: userCnic }); 
            filter.$or.push({ CNIC: cleanCnic }); 
            filter.$or.push({ CNIC: new RegExp(cleanCnic.split("").join("[- ]?"), "i") }); 
        } 
        if (userPhone) { 
            filter.$or.push({ Phone: userPhone }); 
            filter.$or.push({ Phone: cleanPhone }); 
            filter.$or.push({ Phone: new RegExp(cleanPhone.split("").join("[- ]?"), "i") }); 
        } 
        if (userName) {
            filter.$or.push({ Patient: new RegExp(`^${userName}$`, "i") });
            const firstName = userName.split(" ")[0];
            if (firstName.length > 2) {
               filter.$or.push({ Patient: new RegExp(`^${firstName}`, "i") });
            }
        }
      } 
      appointments = await Appointment.find(filter).sort({ created_at: -1 });
    }

    res.json(appointments || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addAppointment = async (req, res) => {
  try {
    const { Patient, Doctor: DoctorName, CNIC, Date, Time, Phone, Fee, doctor_id, user_id, hospital_id } = req.body;
    const appt = await Appointment.create({
      Patient, Doctor: DoctorName, CNIC, Date, Time, Phone, Fee,
      doctor_id: doctor_id || null, user_id: user_id || null, hospital_id: hospital_id || null
    });
    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const editAppointment = async (req, res) => {
  try {
    const { Patient, Doctor: DoctorName, CNIC, Date, Time, Phone, Fee } = req.body;
    await Appointment.findByIdAndUpdate(req.params.id, {
      Patient, Doctor: DoctorName, CNIC, Date, Time, Phone, Fee
    });
    res.json({ message: "Updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
