import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

const PatientDashboard = () => {
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [newAppointment, setNewAppointment] = useState({
        doctor_id: "",
        appointment_date: ""
    });

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const doctorsRes = await axios.get(`${API_BASE_URL}/api/patient/doctors`, { headers });
            const appRes = await axios.get(`${API_BASE_URL}/api/patient/appointments`, { headers });
            setDoctors(doctorsRes.data);
            setAppointments(appRes.data);
        } catch (err) {
            console.error("Error fetching patient data", err);
        }
    };

    const handleBookAppointment = async (e) => {
        e.preventDefault();
        const selectedDoc = doctors.find(d => d.user_id === newAppointment.doctor_id || d.id === newAppointment.doctor_id);

        const bookingData = {
            ...newAppointment,
            doctor_name: selectedDoc?.name || "",
            doctor_phone: selectedDoc?.contact_info || "",
            fee: selectedDoc?.fee || 500, // Default fee if not provided
        };

        try {
            await axios.post(`${API_BASE_URL}/api/patient/appointments`, bookingData, { headers });
            alert("Appointment booked!");
            fetchData();
            setNewAppointment({ doctor_id: "", appointment_date: "", cnic: "", patient_phone: "", time: "" });
        } catch (err) {
            alert("Error booking appointment");
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="fw-bold mb-4">Patient Dashboard</h2>

            <div className="row">
                <div className="col-12 col-md-5">
                    <div className="card p-3 shadow-sm border-0 bg-light mb-4">
                        <h3 className="h5 fw-bold mb-3">Book Appointment</h3>
                        <form onSubmit={handleBookAppointment}>
                            <div className="mb-2">
                                <label className="small fw-bold">Select Doctor</label>
                                <select className="form-select" value={newAppointment.doctor_id} onChange={e => setNewAppointment({ ...newAppointment, doctor_id: e.target.value })} required>
                                    <option value="">Select a Doctor</option>
                                    {doctors.map(doc => (
                                        <option key={doc.id} value={doc.user_id}>{doc.name} - {doc.specialization}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-2">
                                <label className="small fw-bold">Appointment Date</label>
                                <input type="date" className="form-control" value={newAppointment.appointment_date} onChange={e => setNewAppointment({ ...newAppointment, appointment_date: e.target.value })} required />
                            </div>
                            <div className="mb-2">
                                <label className="small fw-bold">Time</label>
                                <input type="time" className="form-control" value={newAppointment.time} onChange={e => setNewAppointment({ ...newAppointment, time: e.target.value })} required />
                            </div>
                            <div className="mb-2">
                                <label className="small fw-bold">Your Phone</label>
                                <input type="text" className="form-control" placeholder="03xxxxxxxxx" value={newAppointment.patient_phone} onChange={e => setNewAppointment({ ...newAppointment, patient_phone: e.target.value })} required />
                            </div>
                            <div className="mb-3">
                                <label className="small fw-bold">Your CNIC</label>
                                <input type="text" className="form-control" placeholder="42xxxxxxxxxxx" value={newAppointment.cnic} onChange={e => setNewAppointment({ ...newAppointment, cnic: e.target.value })} required />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Book Now</button>
                        </form>
                    </div>
                </div>

                <div className="col-12 col-md-7">
                    <h3>My Appointments</h3>
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="table-success">
                                <tr>
                                    <th>Doctor</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((app) => (
                                    <tr key={app.id}>
                                        <td>{app.Doctor || app.doctor_name}</td>
                                        <td>{new Date(app.Date || app.appointment_date).toLocaleString()}</td>
                                        <td>
                                            <span className={`badge bg-${app.status === 'completed' ? 'success' : app.status === 'cancelled' ? 'danger' : 'warning'}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td>
                                            <Link to={`/chat/${app.doctor_id}`} className="btn btn-outline-primary btn-sm">
                                                Chat
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4">
                        <a href="/lab-results" className="btn btn-success w-100 py-3 fw-bold shadow-sm">
                            View My Lab Results
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
