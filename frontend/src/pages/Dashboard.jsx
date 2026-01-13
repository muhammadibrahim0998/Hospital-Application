import React from "react";
import { Link } from "react-router-dom";
import { useDepartments } from "../context/DepartmentContext.jsx";
import { useDoctors } from "../context/DoctorContext.jsx";

export default function Dashboard() {
  const { departments } = useDepartments();
  const { doctors } = useDoctors();

  if (!departments) return <p>Loading...</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Departments</h2>
      <div className="row g-4">
        {departments.map((dep) => {
          const count = doctors.filter((d) => d.departmentId === dep.id).length;

          return (
            <div key={dep.id} className="col-md-4">
              <Link
                to={`/department/${dep.id}`}
                className="text-decoration-none text-dark"
              >
                <div className="card p-4 text-center shadow rounded">
                  <div
                    className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "100px",
                      height: "100px",
                      fontSize: "32px",
                      fontWeight: "700",
                      color: "#fff",
                      background:
                        count > 0
                          ? "linear-gradient(135deg,#6a11cb,#2575fc)"
                          : "#6c757d",
                    }}
                  >
                    {count}
                  </div>
                  <h5>{dep.name}</h5>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
