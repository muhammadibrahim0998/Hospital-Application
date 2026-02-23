import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function AppointmentModal({ show, onClose, doctor, onSubmit }) {
  const { user } = useContext(AuthContext);
  if (!show || !doctor) return null;

  const [formData, setFormData] = useState({
    Doctor: doctor.name,
    DoctorPhone: doctor.phone || "No Phone",
    Fee: 1000,
    Patient: user?.name || "",
    Phone: "",
    CNIC: "",
    Date: "",
    Time: "",
    doctor_id: doctor.id,
    patient_id: user?.id || null,
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
      <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }}>
        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '380px' }}>
          <div className="modal-content shadow-lg border-0" style={{ borderRadius: '12px' }}>
            <form onSubmit={handleSubmit}>
              <div className="modal-header bg-primary text-white py-2 border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                <div className="d-flex align-items-center gap-2">
                  <div className="bg-white rounded-circle p-1 d-flex shadow-sm">
                    <div className="bg-primary rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                  </div>
                  <h6 className="modal-title fw-bold mb-0" style={{ fontSize: '0.9rem' }}>Quick Book</h6>
                </div>
                <button type="button" className="btn-close btn-close-white" style={{ fontSize: '0.7rem', opacity: 0.8 }} onClick={onClose}></button>
              </div>

              <div className="modal-body p-3 bg-light">
                {/* Compact Info Card */}
                <div className="card border-0 shadow-sm rounded-3 mb-3" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)' }}>
                  <div className="card-body p-2">
                    <div className="row g-0 align-items-center text-center">
                      <div className="col-4 border-end">
                        <div className="text-muted mb-0" style={{ fontSize: '0.6rem' }}>DOCTOR</div>
                        <div className="fw-bold text-dark text-truncate" style={{ fontSize: '0.75rem' }}>{formData.Doctor}</div>
                      </div>
                      <div className="col-4 border-end">
                        <div className="text-muted mb-0" style={{ fontSize: '0.6rem' }}>CONTACT</div>
                        <a
                          href={`https://wa.me/${formData.DoctorPhone.replace(/\D/g, "").startsWith("0") ? "92" + formData.DoctorPhone.replace(/\D/g, "").substring(1) : formData.DoctorPhone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="fw-bold text-success text-decoration-none d-block text-truncate"
                          style={{ fontSize: '0.75rem' }}
                        >
                          <i className="bi bi-whatsapp me-1"></i>{formData.DoctorPhone}
                        </a>
                      </div>
                      <div className="col-4">
                        <div className="text-muted mb-0" style={{ fontSize: '0.6rem' }}>FEE</div>
                        <div className="fw-bold text-primary" style={{ fontSize: '0.75rem' }}>Rs.{formData.Fee}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Fields in High-Density Grid */}
                <div className="bg-white p-2 rounded-3 shadow-sm border border-light">
                  <div className="row g-2">
                    <div className="col-12">
                      <input
                        type="text"
                        className="form-control form-control-sm border-0 bg-light px-3"
                        style={{ fontSize: '0.8rem', height: '32px' }}
                        name="Patient"
                        placeholder="Full Name"
                        value={formData.Patient}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <input
                        type="text"
                        className="form-control form-control-sm border-0 bg-light px-3"
                        style={{ fontSize: '0.8rem', height: '32px' }}
                        name="Phone"
                        placeholder="Phone: 03xx-xxxxxxx"
                        value={formData.Phone}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <input
                        type="text"
                        className="form-control form-control-sm border-0 bg-light px-3"
                        style={{ fontSize: '0.8rem', height: '32px' }}
                        name="CNIC"
                        placeholder="CNIC: xxxxx-xxxxxxx-x"
                        value={formData.CNIC}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-6">
                      <div className="d-flex flex-column gap-1">
                        <label className="text-muted mb-0 px-1" style={{ fontSize: '0.6rem' }}>DATE</label>
                        <input
                          type="date"
                          className="form-control form-control-sm border-0 bg-light"
                          style={{ fontSize: '0.8rem', height: '32px' }}
                          name="Date"
                          value={formData.Date}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex flex-column gap-1">
                        <label className="text-muted mb-0 px-1" style={{ fontSize: '0.6rem' }}>TIME</label>
                        <input
                          type="time"
                          className="form-control form-control-sm border-0 bg-light"
                          style={{ fontSize: '0.8rem', height: '32px' }}
                          name="Time"
                          value={formData.Time}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-0 p-2 bg-light rounded-bottom d-flex justify-content-between">
                <button type="button" className="btn btn-sm text-secondary border-0 fw-semibold" style={{ fontSize: '0.75rem' }} onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-sm btn-primary px-4 rounded-pill fw-bold shadow-sm" style={{ fontSize: '0.8rem' }}>
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" style={{ opacity: 0.4 }}></div>
    </>
  );
}
