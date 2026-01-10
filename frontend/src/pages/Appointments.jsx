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
  const [mode, setMode] = useState(""); // "view" | "edit"
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
    updateAppointment(selected.id, selected); // frontend update
    closeModal();
  };

  const filteredAppointments =
    doctorFilter === "all"
      ? appointments
      : appointments.filter((a) => a.Doctor === doctorFilter);
  const doctorList = [...new Set(appointments.map((a) => a.Doctor))];

  return (
    <div className="container mt-5">
      {/* //filter by doctor */}
      <div className="d-flex justify-content-end mb-3">
        <select
          className="form-select w-auto"
          value={doctorFilter}
          onChange={(e) => setDoctorFilter(e.target.value)}
        >
          <option value="all">All Doctors</option>
          {doctorList.map((doc, index) => (
            <option key={index} value={doc}>
              {doc}
            </option>
          ))}
        </select>
      </div>

      <h2 className="mb-4">Appointments</h2>

      {/* ===== Desktop Table ===== */}
      <div className="d-none d-md-block table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="text-white" style={{ backgroundColor: "green" }}>
            <tr>
              <th>#</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Phone</th>
              <th>Fee</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
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
                  <td>{a.Date}</td>
                  <td>{a.Time}</td>
                  <td>{a.Phone}</td>
                  <td>{a.Fee}</td>
                  <td className="d-flex gap-2">
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

      {/* ===== Mobile Cards ===== */}
      <div className="d-md-none">
        {appointments.map((a, i) => (
          <div key={a.id} className="card mb-3 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">{a.Patient}</h5>
              <p>
                <strong>Doctor:</strong> {a.Doctor}
              </p>
              <p>
                <strong>Date:</strong> {a.Date}
              </p>
              <p>
                <strong>Time:</strong> {a.Time}
              </p>
              <p>
                <strong>Phone:</strong> {a.Phone}
              </p>
              <p>
                <strong>Fee:</strong> {a.Fee}
              </p>
              <div className="d-flex gap-2 mt-2">
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
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Modal ===== */}
      {selected && (
        <div className="modal show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {mode === "view" ? "View Appointment" : "Edit Appointment"}
                </h5>
                <button className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <label>Patient</label>
                <input
                  className="form-control mb-2"
                  value={selected.Patient}
                  readOnly
                />
                <label>Doctor</label>
                <input
                  className="form-control mb-2"
                  value={selected.Doctor}
                  readOnly
                />
                <label>Date</label>
                <input
                  type="date"
                  name="Date"
                  className="form-control mb-2"
                  value={selected.Date}
                  onChange={handleChange}
                  readOnly={mode === "view"}
                />
                <label>Time</label>
                <input
                  type="time"
                  name="Time"
                  className="form-control mb-2"
                  value={selected.Time}
                  onChange={handleChange}
                  readOnly={mode === "view"}
                />
                <label>Phone</label>
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
      )}
      {selected && <div className="modal-backdrop show"></div>}
    </div>
  );
}
