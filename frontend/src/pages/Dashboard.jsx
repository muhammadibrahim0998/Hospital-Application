import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppointments } from "../context/AppointmentContext";
import { useDoctors } from "../context/DoctorContext";

export default function Dashboard() {
  const { appointments, fetchAppointments } = useAppointments();
  const { doctors } = useDoctors();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const Card = ({ title, count, link, color }) => (
    <div className="col-12 col-sm-6 col-md-4">
      <Link to={link} className="text-decoration-none text-dark">
        <div className="card shadow text-center p-4 h-100">
          <div
            className={`mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center bg-${color}`}
            style={{
              width: "90px",
              height: "90px",
              color: "#fff",
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            {count}
          </div>
          <h5 className="fw-bold">{title}</h5>
        </div>
      </Link>
    </div>
  );

  return (
    <div className="container mt-5">
      <h2 className="fw-bold mb-4">Dashboard</h2>

      <div className="row g-4">
        <Card
          title="Appointments"
          count={appointments.length}
          link="/appointments"
          color="primary"
        />

        <Card
          title="Doctors"
          count={doctors.length}
          link="/doctors"
          color="success"
        />

        <Card title="Reports" count={3} link="/reports" color="warning" />
      </div>
    </div>
  );
}
