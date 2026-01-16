import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDoctors } from "../context/DoctorContext";

export default function FieldDetails() {
  const { id } = useParams();
  const { doctors } = useDoctors();
  const navigate = useNavigate();

  const fieldDoctors = doctors.filter((doc) => doc.fieldId === Number(id));

  return (
    <div className="container mt-5">
      <h2 className="fw-bold mb-4">Doctors</h2>

      <div className="row g-4">
        {fieldDoctors.map((doc) => (
          <div key={doc.id} className="col-md-4">
            <div className="card shadow h-100">
              <img
                src={doc.image}
                alt={doc.name}
                className="card-img-top"
                style={{ height: "220px", objectFit: "cover" }}
              />

              <div className="card-body text-center">
                <h5 className="fw-bold">{doc.name}</h5>
                <p className="text-muted">{doc.specialty}</p>

                <button
                  className="btn btn-primary w-100"
                  onClick={() =>
                    navigate(`/doctor/${doc.id}`, {
                      state: { doctor: doc },
                    })
                  }
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        ))}

        {fieldDoctors.length === 0 && (
          <p className="text-danger">No doctors found</p>
        )}
      </div>
    </div>
  );
}
