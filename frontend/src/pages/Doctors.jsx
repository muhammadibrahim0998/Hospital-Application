import React from "react";
import { useNavigate } from "react-router-dom";
import { useDoctors } from "../context/DoctorContext";

export default function Doctors() {
  const { doctors } = useDoctors();
  const navigate = useNavigate();

  const handleView = (doctor) => {
    navigate(`/doctor/${doctor.id}`, { state: { doctor } });
  };

  return (
    <div className="container-fluid bg-light py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-primary">Our Doctors</h2>
        <p className="text-muted">Meet our professional medical team</p>
      </div>

      <div className="container">
        <div className="row g-4">
          {doctors.map((doc) => (
            <div key={doc.id} className="col-lg-3 col-md-4 col-sm-6">
              <div className="card shadow-sm border-0 h-100">
                <img
                  src={doc.image}
                  alt={doc.name}
                  className="card-img-top"
                  style={{ height: "260px", objectFit: "cover" }}
                />
                <div className="card-body text-center">
                  <h5 className="fw-bold">{doc.name}</h5>
                  <p className="text-primary mb-1">{doc.specialty}</p>

                  <button
                    onClick={() => handleView(doc)}
                    className="btn btn-primary btn-sm w-100 mt-3"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
