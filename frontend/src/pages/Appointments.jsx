
import React, { useEffect, useState } from "react";
import { useAppointments } from "../context/AppointmentContext";
import AppointmentFormModal from "../pages/AppointmentModal";

export default function Appointments() {
  const {
    appointments,
    fetchAppointments,
    deleteAppointment,
    updateAppointment,
  } = useAppointments();

  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const closeModal = () => {
    setSelected(null);
    setMode("");
  };

  const handleChange = (e) =>
    setSelected({ ...selected, [e.target.name]: e.target.value });

  const handleUpdate = () => {
    updateAppointment(selected.id, selected);
    closeModal();
  };

  const openWhatsApp = (a) => {
    // Find the correct doctor's phone from appointments if current is missing
    let phone = a.DoctorPhone;
    if (!phone) {
      const doctorAppointment = appointments.find(
        (appt) => appt.Doctor === a.Doctor && appt.DoctorPhone,
      );
      if (doctorAppointment) {
        phone = doctorAppointment.DoctorPhone;
      } else {
        alert("Doctor phone number not available");
        return;
      }
    }

    // Remove '+' if exists
    phone = phone.replace("+", "");

    const message = `Hello ${a.Doctor},
  Patient: ${a.Patient}
  Date: ${a.Date}
  Time: ${a.Time}
  Phone: ${a.Phone}`;

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };
  

  const doctors = [...new Set(appointments.map((a) => a.Doctor))];

  const filteredAppointments = doctorFilter
    ? appointments.filter((a) => a.Doctor === doctorFilter)
    : appointments;

  return (
    <div className="container mt-5">
      <h4 className="mb-3 text-center fw-bold">Appointments List</h4>

      {/* Doctor Filter */}
      <div className="row mb-3">
        <div className="col-md-4">
          <select
            className="form-select form-select-sm shadow-sm"
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
          >
            <option value="">All Doctors</option>
            {doctors.map((doc, index) => (
              <option key={index} value={doc}>
                {doc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div
        className="table-responsive shadow rounded"
        style={{ fontSize: "12px" }}
      >
        <table className="table table-bordered table-hover table-sm text-nowrap align-middle mb-0">
          <thead className="table-dark text-center">
            <tr>
              <th>#</th>
              <th>Doctor</th>
              <th>DoctorPhone</th>
              <th>Fee</th>
              <th>Patient</th>
              <th>Phone</th>
              <th>CNIC</th>
              <th>Date</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredAppointments.map((a, i) => (
              <tr key={a.id}>
                <td>{i + 1}</td>
                <td>{a.Doctor}</td>

                {/* Clickable Doctor Phone */}
                <td>
                  <a
                    href={`tel:${a.DoctorPhone}`}
                    className="text-decoration-none fw-semibold"
                  >
                    {a.DoctorPhone}
                  </a>
                </td>

                <td>{a.Fee}</td>
                <td>{a.Patient}</td>
                <td>{a.Phone}</td>
                <td>{a.CNIC}</td>
                <td>{a.Date}</td>
                <td>{a.Time}</td>

                {/* Action Column */}
                <td className="text-center">
                  <div className="d-flex justify-content-center gap-2">
                    {/* WhatsApp */}
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => openWhatsApp(a)}
                      title="WhatsApp"
                    >
                      <i className="bi bi-whatsapp"></i>
                    </button>

                    {/* Dropdown */}
                    <div className="dropdown">
                      <button
                        className="btn btn-secondary btn-sm"
                        type="button"
                        data-bs-toggle="dropdown"
                      >
                        <i className="bi bi-three-dots-vertical"></i>
                      </button>

                      <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => {
                              setSelected(a);
                              setMode("view");
                            }}
                          >
                            <i className="bi bi-eye me-2 text-info"></i>
                            View
                          </button>
                        </li>

                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => {
                              setSelected(a);
                              setMode("edit");
                            }}
                          >
                            <i className="bi bi-pencil-square me-2 text-warning"></i>
                            Edit
                          </button>
                        </li>

                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={() => deleteAppointment(a.id)}
                          >
                            <i className="bi bi-trash me-2"></i>
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </td>
              </tr>
            ))}

            {filteredAppointments.length === 0 && (
              <tr>
                <td colSpan="10" className="text-center text-muted py-3">
                  No Appointments Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selected && (
        <>
          <div className="modal show d-block">
            <div className="modal-dialog modal-dialog-centered modal-sm">
              <div className="modal-content shadow">
                <div className="modal-header bg-primary text-white py-2">
                  <h6 className="mb-0">
                    {mode === "view" ? "View Appointment" : "Edit Appointment"}
                  </h6>
                  <button className="btn-close" onClick={closeModal} />
                </div>

                <div className="modal-body p-2">
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
                      className="form-control form-control-sm mb-2"
                      name={field}
                      value={selected[field] || ""}
                      onChange={handleChange}
                      readOnly={mode === "view"}
                      placeholder={field}
                    />
                  ))}
                </div>

                <div className="modal-footer py-2">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={closeModal}
                  >
                    Close
                  </button>

                  {mode === "edit" && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={handleUpdate}
                    >
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
