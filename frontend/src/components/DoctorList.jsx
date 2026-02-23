import React, { useState } from "react";
import AppointmentModal from "../pages/AppointmentModal";
import { useAppointments } from "../context/AppointmentContext";
import { API_BASE_URL } from "../config";

const Badge = ({ children, bg, className }) => (
  <span className={`badge bg-${bg} ${className}`}>{children}</span>
);

export default function DoctorList({ doctors }) {
  const { bookAppointment } = useAppointments();

  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleSubmit = async (data) => {
    await bookAppointment(data);
  };

  const activeDoctors = doctors.filter((doc) => doc.status === "active" || !doc.status);

  return (
    <>
      <div className="container">
        <div className="row g-4">
          {activeDoctors.length === 0 ? (
            <div className="col-12 text-center py-5">
              <p className="text-muted">No doctors found matching your criteria.</p>
            </div>
          ) : (
            activeDoctors.map((doc) => (
              <div key={doc.id} className="col-lg-4 col-md-6 col-sm-12">
                <div
                  className="card h-100 border-0 shadow-sm text-center transform-hover-up transition-all"
                  style={{
                    borderRadius: "20px",
                    overflow: "hidden"
                  }}
                >
                  {/* Image */}
                  <div className="position-relative overflow-hidden" style={{ height: "280px" }}>
                    <img
                      src={doc.image ? (doc.image.startsWith("http") ? doc.image : `${API_BASE_URL}${doc.image}`) : "https://img.icons8.com/color/96/doctor-male.png"}
                      alt={doc.name}
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                    />
                    <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-gradient-dark text-white text-start">
                      <Badge bg="primary" className="rounded-pill px-3 py-2 mb-2">{doc.specialization || doc.specialty || "General Physician"}</Badge>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="card-body p-4 d-flex flex-column">
                    <h5 className="fw-bold text-dark mb-2">{doc.name}</h5>
                    <p className="text-muted small mb-4">{doc.contact_info || "Consultation available by appointment"}</p>

                    <div className="mt-auto d-flex gap-2">
                      <a
                        href={`https://wa.me/${(doc.phone || "").replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-success rounded-pill px-4 flex-grow-1 fw-bold d-flex align-items-center justify-content-center gap-2"
                      >
                        WhatsApp
                      </a>

                      <button
                        className="btn btn-primary rounded-pill px-4 flex-grow-1 fw-bold"
                        onClick={() => {
                          setSelectedDoctor(doc);
                          setShowModal(true);
                        }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <AppointmentModal
          show={showModal}
          doctor={selectedDoctor}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        />
      )}

      <style>{`
        .bg-gradient-dark { background: linear-gradient(transparent, rgba(0,0,0,0.8)); }
        .transform-hover-up:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important; }
        .transition-all { transition: all 0.3s ease; }
      `}</style>
    </>
  );
}