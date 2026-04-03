
import React, { useState, useContext } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { AuthContext } from "../context/AuthContext";

export default function DoctorProfile() {
  const { state } = useLocation();
  const doctor = state?.doctor;
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const { user, token } = useContext(AuthContext); 

  const [formData, setFormData] = useState({
    Patient: user?.name || "",
    Doctor: doctor?.name || "",
    DoctorPhone: doctor?.phone?.replace("+", "") || "",
    CNIC: user?.cnic || "",
    Date: "",
    Time: "",
    Phone: user?.phone || "",
    Fee: doctor?.fee || 1000,
    doctor_id: doctor?._id || doctor?.id,
    hospital_id: doctor?.hospital_id?._id || doctor?.hospital_id || null,
    user_id: user?._id || user?.id || null
  });

  if (!doctor)
    return (
      <div className="container mt-5 text-center">
        <h4 className="text-danger">Doctor not found</h4>
        <Link to="/doctors" className="btn btn-primary mt-3">
          Back
        </Link>
      </div>
    );

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/appointments`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Appointment booked successfully!");
      setShowModal(false);
      navigate("/appointments");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error booking appointment");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow text-center">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="rounded-circle mb-3"
          style={{ width: "150px", height: "150px", objectFit: "cover" }}
        />
        <h3 className="text-primary">{doctor.name}</h3>
        <p>{doctor.specialty}</p>
        <p>
          <strong>Phone:</strong> {doctor.phone}
        </p>
        {(!user || user?.role?.toLowerCase() === "patient") && (
          <button
            className="btn btn-primary mt-3"
            onClick={() => setShowModal(true)}
          >
            Book Appointment
          </button>
        )}
      </div>

      {showModal && (
        <>
          <div className="modal show d-block">
            <div className="modal-dialog">
              <div className="modal-content">
                <form onSubmit={handleSubmit}>
                  <div className="modal-header">
                    <h5>Book Appointment</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowModal(false)}
                    />
                  </div>
                  <div className="modal-body">
                    {[
                      "Patient",
                      "DoctorPhone",
                      "CNIC",
                      "Date",
                      "Time",
                      "Phone",
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
                        placeholder={field}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        required
                      />
                    ))}
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
                      Confirm
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show"></div>
        </>
      )}
    </div>
  );
}
