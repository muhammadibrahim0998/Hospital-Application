import React from "react";

export default function About() {
  return (
    <div>
      {/* ===== HERO / BANNER ===== */}
      <div
        className="text-white d-flex align-items-center"
        style={{
          height: "350px",
          backgroundImage:
            "linear-gradient(rgba(0,0,0,.6), rgba(0,0,0,.6)), url('https://images.unsplash.com/photo-1586773860418-d37222d8fce3')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container">
          <h1 className="fw-bold">City Care Hospital</h1>
          <p className="fs-6">Compassionate, Quality Healthcare for Everyone</p>
        </div>
      </div>

      {/* ===== WHO WE ARE ===== */}
      <div className="container my-5">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h3 className="fw-bold text-danger mb-3">Who We Are</h3>
            <p className="text-muted">
              City Care Hospital is a modern healthcare institution in Peshawar,
              providing high-quality medical services to all.
            </p>
          </div>
          <div className="col-md-6">
            <img
              src="https://images.unsplash.com/photo-1550831107-1553da8c8464"
              alt="Hospital"
              className="img-fluid rounded shadow"
            />
          </div>
        </div>
      </div>

      {/* ===== MISSION / VISION ===== */}
      <div className="container my-5">
        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <div className="p-4 shadow rounded h-100">
              <h5 className="fw-bold text-danger">Mission</h5>
              <p className="text-muted small">
                Accessible, affordable, quality healthcare with compassion.
              </p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="p-4 shadow rounded h-100">
              <h5 className="fw-bold text-danger">Vision</h5>
              <p className="text-muted small">
                Trusted hospital recognized for excellence, innovation, patient
                safety.
              </p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="p-4 shadow rounded h-100">
              <h5 className="fw-bold text-danger">Values</h5>
              <p className="text-muted small">
                Compassion • Respect • Quality • Transparency • Commitment
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
