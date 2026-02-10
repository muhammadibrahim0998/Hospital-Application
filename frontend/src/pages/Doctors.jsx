import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDoctors } from "../context/DoctorContext";
import "./Doctors.css";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function Doctors() {
  const { doctors } = useDoctors();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [formData, setFormData] = useState({
    Patient: "",
    Doctor: "",
    CNIC: "",
    Date: "",
    Time: "",
    Phone: "",
    Fee: 1000,
  });

  const handleView = (doctor) => {
    navigate(`/doctor/${doctor.id}`, { state: { doctor } });
  };

  const handleBook = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData((prev) => ({
      ...prev,
      Doctor: doctor.name,
    }));
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/appointments`, formData);
      alert("Appointment booked successfully!");
      setShowModal(false);
    } catch (err) {
      alert("Failed to book appointment");
      console.error(err);
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
    <div className="container-fluid bg-light py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-primary">Our Doctors</h2>
        <p className="text-muted">Meet our professional medical team</p>
      </div>

      <div className="container">
        <div className="row g-4">
          {doctors.map((doc) => (
            <div key={doc.id} className="col-lg-3 col-md-4 col-sm-6">
              <div className="doctor-card">
                <img src={doc.image} alt={doc.name} className="doctor-img" />

                <div className="doctor-overlay">
                  <button
                    className="btn btn-outline-light btn-sm mb-2 w-100"
                    onClick={() => handleView(doc)}
                  >
                    View Profile
                  </button>

                  <button
                    className="btn btn-primary btn-sm w-100"
                    onClick={() => handleBook(doc)}
                  >
                    Book Appointment
                  </button>
                </div>

                <div className="doctor-info text-center">
                  <h6 className="fw-bold mb-0">{doc.name}</h6>
                  <small className="text-primary">{doc.specialty}</small>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showModal && selectedDoctor && (
          <>
            <div
              className="modal show d-block"
              tabIndex="-1"
              onClick={(e) => {
                if (e.target.classList.contains("modal")) setShowModal(false);
              }}
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <form onSubmit={handleSubmit}>
                    <div className="modal-header">
                      <h5 className="modal-title">
                        Book Appointment with {selectedDoctor.name}
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

                      {/* ✅ CNIC FIXED */}
                      <div className="mb-3">
                        <label className="form-label">CNIC</label>
                        <input
                          type="text"
                          className="form-control"
                          name="CNIC"
                          value={formData.CNIC}
                          onChange={handleChange}
                          placeholder="12345-1234567-1"
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
      </div>
    </div>
  );
}
