// import React, { useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { useDoctors } from "../context/DoctorContext";
// import AppointmentModal from "../pages/AppointmentModal";


// import axios from "axios";
// import { API_BASE_URL } from "../config";

// export default function FieldDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { doctors } = useDoctors();

//   // Filter doctors by fieldId
//   const fieldDoctors = doctors.filter((doc) => doc.fieldId === Number(id));

//   // Modal state
//   const [showModal, setShowModal] = useState(false);
//   const [selectedDoctor, setSelectedDoctor] = useState(null);

//   // Appointment form state
//   const [formData, setFormData] = useState({
//     Patient: "",
//     Doctor: "",
//     CNIC: "",
//     Date: "",
//     Time: "",
//     Phone: "",
//     Fee: 1000,
//   });

//   const timeSlots = [
//     "8:00 AM - 8:30 AM",
//     "9:00 AM - 9:30 AM",
//     "10:00 AM - 10:30 AM",
//     "11:00 AM - 11:30 AM",
//     "12:00 PM - 12:30 PM",
//     "2:00 PM - 2:30 PM",
//     "3:00 PM - 3:30 PM",
//     "4:00 PM - 4:30 PM",
//   ];

//   // Handle Book button click
//   const handleBook = (doctor) => {
//     setSelectedDoctor(doctor);
//     setFormData((prev) => ({
//       ...prev,
//       Doctor: doctor.name,
//     }));
//     setShowModal(true);
//   };

//   // Handle form input change
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Submit appointment
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${API_BASE_URL}/api/appointments`, formData);
//       alert("Appointment booked successfully!");
//       setShowModal(false);
//     } catch (err) {
//       alert("Failed to book appointment");
//       console.error(err);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h2 className="fw-bold mb-4">Doctors</h2>

//       <div className="row g-4">
//         {fieldDoctors.length > 0 ? (
//           fieldDoctors.map((doc) => (
//             <div key={doc.id} className="col-md-4">
//               <div className="card shadow h-100">
//                 <img
//                   src={doc.image}
//                   alt={doc.name}
//                   className="card-img-top"
//                   style={{ height: "220px", objectFit: "cover" }}
//                 />
//                 <div className="card-body text-center">
//                   <h5 className="fw-bold">{doc.name}</h5>
//                   <p className="text-muted">{doc.specialty}</p>
//                   <button
//                     className="btn btn-primary w-100"
//                     onClick={() => handleBook(doc)}
//                   >
//                     Book Appointment
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-danger">No doctors found for this field.</p>
//         )}
//       </div>

      
//       <AppointmentModal
//         show={showModal}
//         doctor={selectedDoctor}
//         formData={formData}
//         timeSlots={timeSlots}
//         onChange={handleChange}
//         onSubmit={handleSubmit}
//         onClose={() => setShowModal(false)}
//       />

//       <Link to="/dashboard" className="btn btn-secondary mt-4">
//         Back
//       </Link>
//     </div>
//   );
// }
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useDoctors } from "../context/DoctorContext";
import DoctorList from "../components/DoctorList";

export default function FieldDetails() {
  const { id } = useParams();
  const { doctors } = useDoctors();

  const fieldDoctors = doctors.filter((d) => d.fieldId === Number(id));

  return (
    <div className="container mt-5">
      <h2 className="fw-bold mb-4">Doctors</h2>
      <DoctorList doctors={fieldDoctors} />
      <Link to="/dashboard" className="btn btn-secondary mt-4">
        Back
      </Link>
    </div>
  );
}
