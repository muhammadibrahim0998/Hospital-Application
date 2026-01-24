import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDoctors } from "../context/DoctorContext";
import { useDepartments } from "../context/DepartmentContext";
import axios from "axios";
import { API_BASE_URL } from "../config";
import "../css/Home.css";

export default function Home() {
  const navigate = useNavigate();
  const { doctors } = useDoctors();
  const { departments } = useDepartments();

  const slides = [
    {
      img: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3",
      title: "CityCare Hospital",
      desc: "Trusted healthcare with modern technology",
    },
    {
      img: "https://images.unsplash.com/photo-1550831107-1553da8c8464",
      title: "Expert Doctors",
      desc: "Professional & experienced specialists",
    },
    {
      img: "https://images.unsplash.com/photo-1600959907703-125ba1374a12",
      title: "24/7 Medical Care",
      desc: "Emergency & patient care anytime",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    Patient: "",
    Doctor: "",
    Date: "",
    Time: "",
    Phone: "",
    Fee: 1000,
  });

  useEffect(() => {
    const timer = setInterval(
      () => setCurrentIndex((prev) => (prev + 1) % slides.length),
      3000
    );
    return () => clearInterval(timer);
  }, []);

  const openModal = (doctor = null) => {
    setSelectedDoctor(doctor);
    setFormData((prev) => ({ ...prev, Doctor: doctor ? doctor.name : "" }));
    setShowModal(true);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/appointments`, formData);
      alert("Appointment booked successfully!");
      setShowModal(false);
    } catch (err) {
      alert("Failed to book appointment");
    }
  };

  const timeSlots = [
    "8:00 AM - 8:30 AM",
    "9:00 AM - 9:30 AM",
    "10:00 AM - 10:30 AM",
    "11:00 AM - 11:30 AM",
    "12:00 PM - 12:30 PM",
    "2:00 PM - 2:30 PM",
    "3:00 PM - 3:30 PM",
    "4:00 PM - 4:30 PM",
  ];

  return (
    <div >
      {/* ================= HERO SLIDER ================= */}
      <div className="position-relative slider-container">
        {slides.map((slide, i) => (
          <img
            key={i}
            src={slide.img}
            alt={slide.title}
            className={`slider-img ${i === currentIndex ? "active" : ""}`}
          />
        ))}

        <div className="carousel-caption center-caption">
          <h2 className="fw-bold">{slides[currentIndex].title}</h2>
          <p>{slides[currentIndex].desc}</p>
        </div>
      </div>

      {/* ================= DEPARTMENTS ================= */}
      <section className="py-5 bg-light dept-section">
        <div className="container">
          <div className="text-center mb-4">
            <h3 className="fw-bold text-danger">Our Departments</h3>
            <p className="text-muted small">
              Specialized departments with expert doctors
            </p>
          </div>

          <div className="row g-4">
            {departments.map((dept) => {
              const count = doctors.filter(
                (d) => d.departmentId === dept.id
              ).length;
              return (
                <div
                  key={dept.id}
                  className="col-md-4"
                  onClick={() => navigate(`/department/${dept.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card h-100 shadow-sm border-0 text-center p-4 dept-card">
                    <div
                      className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: "80px",
                        height: "80px",
                        fontSize: "24px",
                        fontWeight: "600",
                        color: "#fff",
                        background:
                          count > 0
                            ? "linear-gradient(135deg,#6a11cb,#2575fc)"
                            : "#6c757d",
                      }}
                    >
                      {count}
                    </div>
                    <h5 className="fw-bold mb-0">{dept.name}</h5>
                    <small className="text-muted">{count} doctors</small>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= DOCTORS ================= */}
      <div className="container my-5">
        <h3 className="fw-bold text-center mb-4 text-danger">Our Doctors</h3>
        <div className="row g-4">
          {doctors.slice(0, 8).map((doc) => (
            <div className="col-md-3" key={doc.id}>
              <div className="card h-100 shadow-sm text-center">
                <img
                  src={doc.image}
                  className="card-img-top"
                  alt={doc.name}
                  style={{ height: "220px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h6 className="fw-bold">{doc.name}</h6>
                  <p className="text-muted small">{doc.specialty}</p>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => openModal(doc)}
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <>
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <form onSubmit={handleSubmit}>
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {selectedDoctor
                        ? `Book Appointment with ${selectedDoctor.name}`
                        : "Book Appointment"}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowModal(false)}
                    ></button>
                  </div>

                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Patient</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Patient"
                        required
                        value={formData.Patient}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Doctor</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Doctor"
                        value={formData.Doctor}
                        readOnly
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="Date"
                        required
                        value={formData.Date}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Select Time Slot
                      </label>
                      <div className="row g-2">
                        {timeSlots.map((slot, index) => (
                          <div className="col-6" key={index}>
                            <input
                              type="radio"
                              name="Time"
                              id={`slot-${index}`}
                              value={slot}
                              checked={formData.Time === slot}
                              onChange={handleChange}
                              className="d-none"
                              required
                            />
                            <label
                              htmlFor={`slot-${index}`}
                              className={`slot-box ${formData.Time === slot ? "active" : ""
                                }`}
                            >
                              {slot}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Phone</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Phone"
                        required
                        value={formData.Phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Confirm Booking
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
      {/* ================= ABOUT HOSPITAL & DOCTORS ================= */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            {/* Hospital Image */}
            <div className="col-md-6 mb-4 mb-md-0">
              <img
                src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3"
                alt="Hospital"
                className="img-fluid rounded shadow"
              />
            </div>

            {/* About Hospital Text */}
            <div className="col-md-6">
              <h3 className="fw-bold text-danger mb-3">About Our Hospital</h3>
              <p className="text-muted mb-4">
                Our hospital is committed to providing world-class healthcare
                with state-of-the-art facilities. Our team of expert doctors
                ensures that every patient receives personalized care.
              </p>
              <p className="text-muted mb-4">
                We believe in modern treatment methods, compassionate care, and
                complete patient satisfaction.
              </p>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => navigate("/about")}
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Doctors Preview */}
          <div className="mt-5">
            <h4 className="fw-bold text-center text-danger mb-4">
              Meet Our Expert Doctors
            </h4>
            <div className="row g-4">
              {doctors.slice(0, 4).map((doc) => (
                <div className="col-md-3" key={doc.id}>
                  <div className="card h-100 shadow-sm text-center">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="card-img-top"
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <h6 className="fw-bold mb-0">{doc.name}</h6>
                      <small className="text-muted">{doc.specialty}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
