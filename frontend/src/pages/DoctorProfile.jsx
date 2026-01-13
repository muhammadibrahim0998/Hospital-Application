import React, {useState} from "react";
import {useLocation, Link, useNavigate} from "react-router-dom";
import axios from "axios";

export default function DoctorProfile() {
  const {state} = useLocation();
  const doctor = state?.doctor;
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(state?.openBooking || false);

  const [formData, setFormData] = useState({
    Patient: "",
    Doctor: doctor?.name || "",
    Date: "",
    Time: "",
    Phone: "",
    Fee: 1000,
  });

  if (!doctor) {
    return (
      <div className="container mt-5 text-center">
        <h4 className="text-danger">Doctor data not found</h4>
        <Link
          to="/doctors"
          className="btn btn-primary mt-3"
        >
          Back to Doctors
        </Link>
      </div>
    );
  }

  const handleChange = e => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Send data to backend
      await axios.post("http://localhost:3002/api/appointments", formData);
      alert("Appointment booked successfully!");
      setShowModal(false);
      navigate("/appointments");
    } catch (err) {
      console.error(err);
      alert("Failed to book appointment. Try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow border-0 p-4">
        <div className="row align-items-center">
          <div className="col-md-4 text-center">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="rounded-circle img-fluid"
              style={{width: "220px", height: "220px", objectFit: "cover"}}
            />
          </div>

          <div className="col-md-8">
            <h3 className="fw-bold text-primary">{doctor.name}</h3>
            <h5 className="text-muted">{doctor.specialty}</h5>
            <p>{doctor.experience}</p>

            <hr />

            <p>
              <strong>Email:</strong> {doctor.email}
            </p>
            <p>
              <strong>Phone:</strong> {doctor.phone}
            </p>
            <p>
              <strong>Bio:</strong> {doctor.bio}
            </p>

            <div className="d-flex gap-2 mt-3">
              <button
                className="btn btn-primary"
                onClick={() => setShowModal(true)}
              >
                Book Appointment
              </button>

              <Link
                to="/doctors"
                className="btn btn-outline-secondary"
              >
                Back
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 🔽 MODAL */}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    Book Appointment with {doctor.name}
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
                      required
                      value={formData.Doctor}
                      onChange={handleChange}
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
                    <label className="form-label">Time</label>
                    <input
                      type="time"
                      className="form-control"
                      name="Time"
                      required
                      value={formData.Time}
                      onChange={handleChange}
                    />
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

                  <div className="mb-3">
                    <label className="form-label">Fee</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Fee"
                      required
                      value={formData.Fee}
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
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal backdrop */}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}
