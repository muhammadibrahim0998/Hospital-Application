
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useDepartments } from "../context/DepartmentContext";
import { useDoctors } from "../context/DoctorContext";
import DoctorList from "../components/DoctorList";

export default function DepartmentDetails() {
  const { id } = useParams();
  const { departments } = useDepartments();
  const { doctors } = useDoctors();

  const department = departments?.find((d) => Number(d.id) === Number(id));
  if (!department)
    return (
      <div className="container mt-5 pt-5 text-center">
        <p className="text-danger h4">Department not found</p>
        <Link to="/" className="btn btn-primary mt-3">Back to Home</Link>
      </div>
    );

  // Filter doctors for this department using robust comparison
  const departmentDoctors = (doctors || []).filter(
    (d) => Number(d.department_id) === Number(department.id)
  );

  return (
    <div className="container mt-5 pt-4">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-dark display-5 mb-2">{department.name} Specialists</h2>
        <p className="text-muted">Expert doctors available in our {department.name} department</p>
      </div>

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
