

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

  const filteredAppointments =
    doctorFilter === "all"
      ? appointments
      : appointments.filter((a) => a.Doctor === doctorFilter);

  const doctorList = [...new Set(appointments.map((a) => a.Doctor))];

  return (
    <div className="container mt-4">
      {/* Doctor Filter */}
      <div className="d-flex justify-content-end mb-3 mt-5">
        <select
          className="form-select w-auto"
          value={doctorFilter}
          onChange={(e) => setDoctorFilter(e.target.value)}
        >
          <option value="all">All Doctors</option>
          {doctorList.map((doc, i) => (
            <option key={i} value={doc}>
              {doc}
            </option>
          ))}
        </select>
      </div>

      <h3 className="mb-4">
        Appointments
      </h3>

      {/* ================= LARGE SCREEN (≥1200px) TABLE ================= */}
      <div className="d-none d-xl-block table-responsive">
        <table className="table table-bordered table-hover">
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
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">
                  No Appointments Found
                </td>
              </tr>
            ) : (
              filteredAppointments.map((a, i) => (
                <tr key={a.id}>
                  <td>{i + 1}</td>
                  <td>{a.Patient}</td>
                  <td>{a.Doctor}</td>
                  <td>{a.CNIC}</td>
                  <td>{a.Date}</td>
                  <td>{a.Time}</td>
                  <td>{a.Phone}</td>
                  <td>{a.Fee}</td>
                  <td className="d-flex gap-2 justify-content-center">
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= SMALL → MEDIUM SCREENS (≤1200px) CARDS ================= */}
      <div className="d-xl-none">
        <div className="row g-3">
          {filteredAppointments.map((a) => (
            <div key={a.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h6 className="card-title fw-bold">{a.Patient}</h6>
                  <p className="mb-1">
                    <strong>Doctor:</strong> {a.Doctor}
                  </p>
                  <p className="mb-1">
                    <strong>Date:</strong> {a.Date}
                  </p>
                  <p className="mb-1">
                    <strong>CNIC:</strong> {a.CNIC}
                  </p>
                  <p className="mb-1">
                    <strong>Time:</strong> {a.Time}
                  </p>
                  <p className="mb-1">
                    <strong>Phone:</strong> {a.Phone}
                  </p>
                  <p className="mb-2">
                    <strong>Fee:</strong> {a.Fee}
                  </p>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-info btn-sm w-100"
                      onClick={() => {
                        setSelected(a);
                        setMode("view");
                      }}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-warning btn-sm w-100"
                      onClick={() => {
                        setSelected(a);
                        setMode("edit");
                      }}
                    >
                      Edit
                    </button>
                  </div>

                  <button
                    className="btn btn-danger btn-sm w-100 mt-2"
                    onClick={() => deleteAppointment(a.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
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
                  <input
                    className="form-control mb-2"
                    value={selected.Patient}
                    readOnly
                  />
                  <input
                    className="form-control mb-2"
                    value={selected.Doctor}
                    readOnly
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    name="CNIC"
                    value={selected.CNIC}
                    onChange={handleChange}
                    readOnly={mode === "view"}
                  />

                  <input
                    type="date"
                    name="Date"
                    className="form-control mb-2"
                    value={selected.Date}
                    onChange={handleChange}
                    readOnly={mode === "view"}
                  />
                  <input
                    type="time"
                    name="Time"
                    className="form-control mb-2"
                    value={selected.Time}
                    onChange={handleChange}
                    readOnly={mode === "view"}
                  />
                  <input
                    type="text"
                    name="Phone"
                    className="form-control mb-2"
                    value={selected.Phone}
                    onChange={handleChange}
                    readOnly={mode === "view"}
                  />
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
