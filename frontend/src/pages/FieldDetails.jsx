import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDoctors } from "../context/DoctorContext";

import axios from "axios";
import { API_BASE_URL } from "../config";

export default function FieldDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { doctors } = useDoctors();

  // Filter doctors by fieldId
  const fieldDoctors = doctors.filter((doc) => doc.fieldId === Number(id));

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Appointment form state
  const [formData, setFormData] = useState({
    Patient: "",
    Doctor: "",
    CNIC: "",
    Date: "",
    Time: "",
    Phone: "",
    Fee: 1000,
  });

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

  // Handle Book button click
  const handleBook = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData((prev) => ({
      ...prev,
      Doctor: doctor.name,
    }));
    setShowModal(true);
  };

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit appointment
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

  return (
    <div className="container mt-5">
      <h2 className="fw-bold mb-4">Doctors</h2>

      <div className="row g-4">
        {fieldDoctors.length > 0 ? (
          fieldDoctors.map((doc) => (
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
                    onClick={() => handleBook(doc)}
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-danger">No doctors found for this field.</p>
        )}
      </div>

      {/* Modal */}
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

                    <div className="mb-3">
                      <label className="form-label">CNIC</label>
                      <input
                        type="text"
                        className="form-control"
                        name="CNIC"
                        value={formData.CNIC}
                        onChange={handleChange}
                        placeholder="12345-1234567-1"
                        required
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
                              className={`slot-box ${
                                formData.Time === slot ? "active" : ""
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

      <Link to="/dashboard" className="btn btn-secondary mt-4">
        Back
      </Link>
    </div>
  );
}
