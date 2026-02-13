import React, { useState, useEffect } from "react";

export default function AppointmentModal({ show, onClose, doctor, onSubmit }) {
  if (!show || !doctor) return null;

  const [formData, setFormData] = useState({
    Doctor: doctor.name,
    DoctorPhone: doctor.phone || "03000000000", // static if not available
    Fee: 1000, // static
    Patient: "",
    Phone: "",
    CNIC: "",
    Date: "",
    Time: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <>
      <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5>Book Appointment</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={onClose}
                ></button>
              </div>

              <div className="modal-body">
                {/* Static fields */}
                <div className="mb-2">
                  <label className="form-label">Doctor</label>
                  <input
                    type="text"
                    className="form-control"
                    name="Doctor"
                    value={formData.Doctor}
                    readOnly
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label">Doctor Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    name="DoctorPhone"
                    value={formData.DoctorPhone}
                    readOnly
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label">Fee</label>
                  <input
                    type="text"
                    className="form-control"
                    name="Fee"
                    value={formData.Fee}
                    readOnly
                  />
                </div>

                {/* User input fields */}
                <div className="mb-2">
                  <label className="form-label">Patient Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="Patient"
                    value={formData.Patient}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    name="Phone"
                    value={formData.Phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label">CNIC</label>
                  <input
                    type="text"
                    className="form-control"
                    name="CNIC"
                    value={formData.CNIC}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="Date"
                    value={formData.Date}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* ================= Time Picker ================= */}
                <div className="mb-2">
                  <label className="form-label">Select Time</label>
                  <input
                    type="time"
                    className="form-control"
                    name="Time"
                    value={formData.Time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}
