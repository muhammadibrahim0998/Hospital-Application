
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
