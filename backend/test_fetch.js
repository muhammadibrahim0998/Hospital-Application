import mongoose from 'mongoose';
import { LabResult } from './models/LabResultModel.js';
import { Appointment } from './models/appointmentModel.js';
import { User } from './models/UserModel.js';

async function testFetch() {
  await mongoose.connect('mongodb://127.0.0.1:27017/hospital_management_system');
  
  // Simulate req context for Hasnain khan
  const user = await User.findOne({ _id: "69d4d3f0fa90c9e9c255b673" }); // Hasnain khan
  console.log("Simulating for Patient:", user);
  
  const userId = user._id;
  const userCnic = user.cnic;
  const userName = user.name ? user.name.trim() : "";
  const userPhone = user.phone;
  
  console.log("Params:", { userId, userCnic, userName, userPhone });

  const conditions = [{ patient_id: userId }];
  
  if (userCnic) conditions.push({ cnic: userCnic });
  if (userPhone) conditions.push({ phone: userPhone });
  if (userName) {
     const regex = new RegExp(`^\\s*${userName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\s*`, 'i');
     console.log("Regex Name match:", regex);
     conditions.push({ patient_name: regex });
  }

  const apptFilter = { $or: [{ user_id: userId }] };
  if (userCnic) apptFilter.$or.push({ CNIC: userCnic });
  if (userName) {
     apptFilter.$or.push({ Patient: new RegExp(`^\\s*${userName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\s*`, 'i') });
  }
  if (userPhone) {
     apptFilter.$or.push({ Phone: new RegExp(`^\\s*${userPhone}\\s*`, 'i') });
  }

  console.log("ApptFilter:", JSON.stringify(apptFilter, null, 2));

  const appts = await Appointment.find(apptFilter);
  console.log("Found Appointments:", appts.length);
  
  const apptIds = appts.map(a => a._id);
  console.log("Appt IDs:", apptIds);
  
  if (apptIds.length > 0) {
      conditions.push({ appointment_id: { $in: apptIds } });
  }

  console.log("Final Report Filter Conditions:", JSON.stringify({ $or: conditions }, null, 2));

  const reports = await LabResult.find({ $or: conditions });
  console.log(`FOUND REPORTS: ${reports.length}`);
  if (reports.length > 0) {
      console.log(reports.map(r => ({ test: r.test_name, patient_name: r.patient_name, appt: r.appointment_id })));
  }

  process.exit();
}
testFetch();
