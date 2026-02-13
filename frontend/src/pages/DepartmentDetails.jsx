
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useDepartments } from "../context/DepartmentContext";
import { useDoctors } from "../context/DoctorContext";
import DoctorList from "../components/DoctorList";

export default function DepartmentDetails() {
  const { id } = useParams();
  const { departments } = useDepartments();
  const { doctors } = useDoctors();

  const department = departments?.find((d) => d.id === parseInt(id));
  if (!department)
    return <p className="text-danger mt-5">Department not found</p>;

  // Filter doctors for this department
  const departmentDoctors = doctors.filter(
    (d) => d.departmentId === department.id,
  );

  return (
    <div className="container mt-5">
      <h2 className="mb-4">{department.name} Doctors</h2>

      {departmentDoctors.length > 0 ? (
        <DoctorList doctors={departmentDoctors} showImages={true} />
      ) : (
        // showImages can be used to optionally display doctor pics
        <p className="text-muted">No doctors available in this department.</p>
      )}

      <Link to="/dashboard" className="btn btn-secondary mt-4">
        Back to Dashboard
      </Link>
    </div>
  );
}
