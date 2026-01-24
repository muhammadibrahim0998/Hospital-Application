import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useDoctors } from "../context/DoctorContext";
import { useDepartments } from "../context/DepartmentContext";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function DoctorProfile() {
  const { state } = useLocation();
  const doctor = state?.doctor;
  const navigate = useNavigate();
  const { doctors } = useDoctors();
  const { departments } = useDepartments();

  const [showModal, setShowModal] = useState(state?.openBooking || false);
  const [email, setEmail] = useState(doctor?.email || "");
  const [phone, setPhone] = useState(doctor?.phone || "");

  const [formData, setFormData] = useState({
    Patient: "",
    Doctor: doctor?.name || "",
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

  // Random email & phone generator if not available
  useEffect(() => {
    if (!doctor) return;

    // Email
    if (!doctor.email) {
      const randomEmail = `${doctor.name
        .toLowerCase()
        .replace(/\s+/g, "")}${Math.floor(Math.random() * 1000)}@hospital.com`;
      setEmail(randomEmail);
    } else {
      setEmail(doctor.email);
    }

    // Phone
    if (!doctor.phone) {
      const randomPhone =
        "+92" + Math.floor(1000000000 + Math.random() * 9000000000);
      setPhone(randomPhone);
    } else {
      setPhone(doctor.phone);
    }

    setFormData((prev) => ({
      ...prev,
      Phone: doctor.phone || phone,
    }));
  }, [doctor]);

  if (!doctor) {
    return (
      <div className="container mt-5 text-center">
        <h4 className="text-danger">Doctor data not found</h4>
        <Link to="/doctors" className="btn btn-primary mt-3">
          Back to Doctors
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/appointments`, formData);
      alert("Appointment booked successfully!");
      setShowModal(false);
      navigate("/appointments"); // optional: navigate to appointments page
    } catch (err) {
      console.error(err);
      alert("Failed to book appointment. Please try again.");
    }
  };

  // Department name
  const departmentName =
    departments.find((dep) =>
      dep.fields.some((field) => field.id === doctor.fieldId)
    )?.name || "N/A";

  // Field / specialty name
  const fieldName =
    departments
      .flatMap((dep) => dep.fields)
      .find((field) => field.id === doctor.fieldId)?.name || doctor.specialty;

  return (
    <div className="container mt-5">
      <div className="card shadow border-0 p-4">
        <div className="row align-items-center">
          <div className="col-md-4 text-center">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="rounded-circle img-fluid"
              style={{ width: "220px", height: "220px", objectFit: "cover" }}
            />
          </div>

          <div className="col-md-8">
            <h3 className="fw-bold text-primary">{doctor.name}</h3>
            <h5 className="text-muted">{fieldName}</h5>
            <p>
              <strong>Department:</strong> {departmentName}
            </p>
            <p>{doctor.bio || "No bio available"}</p>
            <hr />
            <p>
              <strong>Email:</strong> {email}
            </p>
            <p>
              <strong>Phone:</strong> {phone}
            </p>

            <div className="d-flex gap-2 mt-3">
              <button
                className="btn btn-primary"
                onClick={() => setShowModal(true)}
              >
                Book Appointment
              </button>
              <Link to="/doctors" className="btn btn-outline-secondary">
                Back
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          onClick={(e) => {
            // Close modal if clicked outside modal-content
            if (e.target.classList.contains("modal")) setShowModal(false);
          }}
        >
          <div className="modal-dialog">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    Book Appointment with {doctor?.name}
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
      )}

      {showModal && <div className="modal-backdrop show"></div>}
    </div>
  );
}
