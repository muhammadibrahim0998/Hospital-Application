import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDepartments } from "../context/DepartmentContext.jsx";
import { useDoctors } from "../context/DoctorContext.jsx";

export default function DepartmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { departments } = useDepartments();
  const { doctors } = useDoctors();

  const department = departments?.find((d) => d.id === parseInt(id));
  if (!department) return <p>Department not found</p>;

  const getDoctorsByField = (fieldId) =>
    doctors.filter(
      (d) => d.departmentId === department.id && d.fieldId === fieldId
    );

  return (
    <div className="container mt-5">
      <h2>{department.name}</h2>
      <div className="row g-3">
        {department.fields.map((field) => {
          const count = getDoctorsByField(field.id).length;
          return (
            <div key={field.id} className="col-md-4">
              <div
                className="card text-center p-3 shadow rounded"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/field/${field.id}`)}
              >
                <div
                  className="mx-auto mb-2 rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "80px",
                    height: "80px",
                    fontSize: "24px",
                    fontWeight: "600",
                    color: "#fff",
                    background:
                      count > 0
                        ? "linear-gradient(135deg,#ff758c,#ff7eb3)"
                        : "#6c757d",
                  }}
                >
                  {count}
                </div>
                <h5>{field.name}</h5>
              </div>
            </div>
          );
        })}
      </div>

      <Link to="/dashboard" className="btn btn-secondary mt-4">
        Back
      </Link>
    </div>
  );
}
