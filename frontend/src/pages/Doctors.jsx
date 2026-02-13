import React from "react";
import { useDoctors } from "../context/DoctorContext";
import DoctorList from "../components/DoctorList";
export default function Doctors() {
  const { doctors } = useDoctors();

  return (
    <div className="container-fluid bg-light py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-primary">Our Doctors</h2>
        <p className="text-muted">Meet our professional medical team</p>
      </div>
      <div className="container">
        <DoctorList doctors={doctors} />
      </div>
    </div>
  );
}
