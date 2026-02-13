import React, { useState } from "react";

export default function AppointmentModal({ show, onClose, doctor, onSubmit }) {
  if (!show || !doctor) return null;

  const [formData, setFormData] = useState({
    Doctor: doctor.name,
    DoctorPhone: doctor.phone || "03000000000",
    Fee: 1000,
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
      <div className="modal show d-block">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5>Book Appointment</h5>
                <button type="button" className="btn-close" onClick={onClose} />
              </div>

              <div className="modal-body">
                {[
                  "Doctor",
                  "DoctorPhone",
                  "Fee",
                  "Patient",
                  "Phone",
                  "CNIC",
                  "Date",
                  "Time",
                ].map((field) => (
                  <input
                    key={field}
                    type={
                      field === "Date"
                        ? "date"
                        : field === "Time"
                          ? "time"
                          : "text"
                    }
                    className="form-control mb-2"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    readOnly={
                      field === "Doctor" ||
                      field === "DoctorPhone" ||
                      field === "Fee"
                    }
                    required={
                      field !== "Doctor" &&
                      field !== "DoctorPhone" &&
                      field !== "Fee"
                    }
                  />
                ))}
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
      <div className="modal-backdrop show"></div>
    </>
  );
}
