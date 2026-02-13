import React, { useState } from "react";
import AppointmentModal from "../pages/AppointmentModal";
import { useAppointments } from "../context/AppointmentContext";

export default function DoctorList({ doctors }) {
  const { bookAppointment } = useAppointments();

  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleSubmit = async (data) => {
    await bookAppointment(data);
  };

  return (
    <>
      <div className="container">
        <div className="row g-4">
          {doctors.map((doc) => (
            <div key={doc.id} className="col-lg-4 col-md-6 col-sm-12">
              <div
                className="card h-100 border-0 shadow-sm text-center"
                style={{
                  borderRadius: "15px",
                  transition: "0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 15px 30px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 0.125rem 0.25rem rgba(0,0,0,0.075)";
                }}
              >
                {/* Image */}
                <div
                  className="overflow-hidden"
                  style={{ borderRadius: "15px 15px 0 0" }}
                >
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="card-img-top"
                    style={{
                      height: "250px",
                      objectFit: "cover",
                    }}
                  />
                </div>

                {/* Body */}
                <div className="card-body d-flex flex-column">
                  <h5 className="fw-bold text-dark mb-1">{doc.name}</h5>

                  <span className="badge bg-primary mb-3">{doc.specialty}</span>

                  <div className="mb-3">
                    <a
                      href={`https://wa.me/${doc.phone}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-success btn-sm me-2"
                    >
                      WhatsApp
                    </a>

                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setSelectedDoctor(doc);
                        setShowModal(true);
                      }}
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
    </>
  );
}
