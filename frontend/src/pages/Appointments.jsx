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
  const [mode, setMode] = useState(""); // "view" or "edit"
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

  // Filter appointments based on selected doctor
  const filteredAppointments =
    doctorFilter === "all"
      ? appointments
      : appointments.filter((a) => a.Doctor === doctorFilter); // note: a.Doctor

  // Unique list of doctors for dropdown
  const doctorList = [...new Set(appointments.map((a) => a.Doctor))];

  return (
    <div className="container mt-5">
      {/* Filter by Doctor */}
      <div className="d-flex justify-content-end mb-3">
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

      <h2 className="mb-4">Appointments</h2>

      {/* Appointments Table */}
      <div className="table-responsive">
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center">
                  No Appointments Found
                </td>
              </tr>
            ) : (
              filteredAppointments.map((a, i) => (
                <tr key={a.id}>
                  <td>{i + 1}</td>
                  <td>{a.Patient}</td>
                  <td>{a.Doctor}</td>
                  <td>{a.CNIC || "—"}</td>
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

      {/* Modal for View/Edit */}
      {selected && (
        <>
          <div className="modal show d-block">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5>
                    {mode === "view" ? "View Appointment" : "Edit Appointment"}
                  </h5>
                  <button className="btn-close" onClick={closeModal}></button>
                </div>

                <div className="modal-body">
                  <label>Patient</label>
                  <input
                    className="form-control mb-2"
                    name="Patient"
                    value={selected.Patient}
                    onChange={handleChange}
                    readOnly={mode === "view"}
                  />

                  <label>Doctor</label>
                  <input
                    className="form-control mb-2"
                    name="Doctor"
                    value={selected.Doctor}
                    onChange={handleChange}
                    readOnly
                  />

                  <label>CNIC</label>
                  <input
                    className="form-control mb-2"
                    name="CNIC"
                    value={selected.CNIC || ""}
                    onChange={handleChange}
                    readOnly={mode === "view"}
                  />

                  <label>Date</label>
                  <input
                    type="Date"
                    className="form-control mb-2"
                    name="Date"
                    value={selected.Date}
                    onChange={handleChange}
                    readOnly={mode === "view"}
                  />

                  <label>Time</label>
                  <input
                    type="text"
                    className="form-control mb-2"
                    name="Time"
                    value={selected.Time}
                    onChange={handleChange}
                    readOnly={mode === "view"}
                  />

                  <label>Phone</label>
                  <input
                    type="text"
                    className="form-control mb-2"
                    name="Phone"
                    value={selected.Phone}
                    onChange={handleChange}
                    readOnly={mode === "view"}
                  />

                  <label>Fee</label>
                  <input
                    type="number"
                    className="form-control mb-2"
                    name="Fee"
                    value={selected.Fee}
                    readOnly
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
