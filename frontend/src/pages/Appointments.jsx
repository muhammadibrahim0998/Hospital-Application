import React, { useEffect, useState } from "react";
import { useAppointments } from "../context/AppointmentContext";

export default function Appointments() {
  const {
    appointments,
    fetchAppointments,
    deleteAppointment,
    updateAppointment,
  } = useAppointments();

  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("all");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const closeModal = () => {
    setSelected(null);
    setMode("");
  };

  const handleChange = (e) => {
    setSelected({ ...selected, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    updateAppointment(selected.id, selected);
    closeModal();
  };

  // ✅ WhatsApp
  const openWhatsApp = (a) => {
    const message = `
Hello Doctor,
I am ${a.Patient}.
My appointment is on ${a.Date} at ${a.Time}.
    `;
    const phone = 923295649784;
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  const filteredAppointments =
    doctorFilter === "all"
      ? appointments
      : appointments.filter((a) => a.Doctor === doctorFilter);

  const doctorList = [...new Set(appointments.map((a) => a.Doctor))];

  return (
    <div className="container mt-5">
      {/* Doctor Filter */}
      <div className="d-flex justify-content-end mb-3">
        <select
          className="form-select w-auto"
          value={doctorFilter}
          onChange={(e) => setDoctorFilter(e.target.value)}
        >
          <option value="all">All Doctors</option>
          {doctorList.map((d, i) => (
            <option key={i} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <h3 className="mb-4">Appointments</h3>

      {/* ================= TABLE ================= */}
      <div className="table-responsive d-none d-xl-block">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>CNIC</th>
              <th>Date</th>
              <th>Time</th>
              <th>Phone</th>
              <th>Fee</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((a, i) => (
              <tr key={a.id}>
                <td>{i + 1}</td>
                <td>{a.Patient}</td>
                <td>{a.Doctor}</td>
                <td>{a.CNIC}</td>
                <td>{a.Date}</td>
                <td>{a.Time}</td>
                <td>{a.Phone}</td>
                <td>{a.Fee}</td>
                <td className="d-flex gap-2">
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => openWhatsApp(a)}
                  >
                    WhatsApp
                  </button>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => {
                      setSelected(a);
                      setMode("view");
                    }}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => {
                      setSelected(a);
                      setMode("edit");
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteAppointment(a.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      {selected && (
        <>
          <div className="modal show d-block">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5>
                    {mode === "view" ? "View Appointment" : "Edit Appointment"}
                  </h5>
                  <button className="btn-close" onClick={closeModal}></button>
                </div>

                <div className="modal-body">
                  {[
                    "Patient",
                    "Doctor",
                    "CNIC",
                    "Date",
                    "Time",
                    "Phone",
                    "Fee",
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
                      value={selected[field] || ""}
                      onChange={handleChange}
                      readOnly={mode === "view"}
                      placeholder={field}
                    />
                  ))}
                </div>

                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={closeModal}>
                    Close
                  </button>
                  {mode === "edit" && (
                    <button className="btn btn-primary" onClick={handleUpdate}>
                      Update
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show"></div>
        </>
      )}
    </div>
  );
}
