import mongoose from 'mongoose';
import { LabResult } from './models/LabResultModel.js';
import { Appointment } from './models/appointmentModel.js';
import { Patient } from './models/PatientModel.js';
import { User } from './models/UserModel.js';

async function check() {
  await mongoose.connect('mongodb://127.0.0.1:27017/hospital_management_system');
  const labs = await LabResult.find({});
  console.log('--- LAB RESULTS ---');
  console.log(JSON.stringify(labs.map(l => ({
    _id: l._id,
    patient_name: l.patient_name,
    patient_id: l.patient_id,
    cnic: l.cnic,
    appointment_id: l.appointment_id
  })), null, 2));

  const apps = await Appointment.find({});
  console.log('\n--- APPOINTMENTS ---');
  console.log(JSON.stringify(apps.map(a => ({
    _id: a._id,
    patient: a.Patient,
    user_id: a.user_id,
    cnic: a.CNIC,
    phone: a.Phone
  })), null, 2));

  const users = await User.find({ role: 'patient' });
  console.log('\n--- USERS (PATIENT) ---');
  console.log(JSON.stringify(users.map(u => ({
    _id: u._id,
    name: u.name,
    cnic: u.cnic,
    phone: u.phone
  })), null, 2));

  process.exit(0);
}
check();
