
import React, { useEffect, useState } from "react";
import { useAppointments } from "../context/AppointmentContext";
import { useDoctors } from "../context/DoctorContext";
import AppointmentFormModal from "../pages/AppointmentModal";

export default function Appointments() {
  const { doctors: allDoctors } = useDoctors();
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

  const getDoctorPhone = (appt) => {
    // 1st Priority: Data within appointment object
    // 2nd Priority: Look up in allDoctors (from DoctorContext) by name
    // 3rd Priority: Any secondary phone field
    if (appt.DoctorPhone && appt.DoctorPhone !== "N/A") return appt.DoctorPhone;
    if (appt.doctor_phone) return appt.doctor_phone;

    const matchedDoctor = (allDoctors || []).find(d => 
      d.name === appt.Doctor || d.name === appt.doctor_name
    );
    return matchedDoctor?.phone || matchedDoctor?.whatsappNumber || "";
  };

  const openWhatsApp = (a) => {
    let phone = getDoctorPhone(a);
    let cleanPhone = phone.replace(/\D/g, "");

    // Modern Pakistan phone formatting (ensuring 92 prefix)
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "92" + cleanPhone.substring(1);
    } else if (cleanPhone.length === 10 && !cleanPhone.startsWith("92")) {
      cleanPhone = "92" + cleanPhone;
    }

    if (!cleanPhone) {
      alert("Doctor contact number not available in profile. Please contact hospital support.");
      return;
    }

    const message = `Assalam-o-Alaikum Dr. ${a.Doctor},
I am ${a.Patient}. I have booked an appointment with you.
Details:
- Date: ${a.Date}
- Time: ${a.Time}`;

    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  const openReport = (appointmentId) => {
    if (!appointmentId) {
      alert("Report not yet finalized.");
      return;
    }
    window.open(`/medical-report/${appointmentId}`, "_blank");
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

      {/* ================= CARD VIEW (Mobile + iPad) ================= */}
      <div className="card-view">
        {filteredAppointments.map((a, i) => (
          <div key={a.id} className="card shadow-sm mb-3 border-0 rounded-3">
            <div className="card-body p-3 text-start">
              <h6 className="fw-bold mb-2 text-primary">
                #{i + 1} - Dr. {a.Doctor}
              </h6>

              <p className="mb-1 small">
                <strong>DoctorPhone:</strong> {getDoctorPhone(a) || "Profile Missing Phone"}
              </p>
              <p className="mb-1 small">
                <strong>Fee:</strong> {a.Fee}
              </p>
              <p className="mb-1 small">
                <strong>Patient:</strong> {a.Patient}
              </p>
              <p className="mb-1 small">
                <strong>Phone:</strong> {a.Phone}
              </p>
              <p className="mb-1 small">
                <strong>CNIC:</strong> {a.CNIC}
              </p>
              <p className="mb-1 small">
                <strong>Date:</strong> {a.Date}
              </p>
              <p className="mb-2 small">
                <strong>Time:</strong> {a.Time}
              </p>

              {/* ================= ACTIONS ================= */}
              <div className="d-flex justify-content-center gap-2 mt-2 pt-2 border-top">
                <button
                  className="btn btn-success btn-sm px-3 shadow-sm"
                  onClick={() => openWhatsApp(a)}
                >
                  <i className="bi bi-whatsapp me-1"></i> WhatsApp
                </button>

                {(a.status === "completed" || a.status === "done" || a.status === "Completed") && (
                  <button
                    className="btn btn-primary btn-sm px-3 shadow-sm"
                    onClick={() => openReport(a.id)}
                  >
                    <i className="bi bi-file-earmark-medical me-1"></i> Result
                  </button>
                )}

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
                        Edit
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={() => deleteAppointment(a.id)}
                      >
                        Delete
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredAppointments.length === 0 && (
          <div className="text-center text-muted py-3 shadow-sm rounded-3 bg-white">
            No Appointments Found
          </div>
        )}
      </div>

      {/* ================= TABLE VIEW (Large Screen) ================= */}
      <div className="table-view">
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

            <tbody className="text-center">
              {filteredAppointments.map((a, i) => (
                <tr key={a.id}>
                  <td>{i + 1}</td>
                  <td>{a.Doctor}</td>

                  <td className="fw-bold text-success">
                    <a
                      href={`tel:${getDoctorPhone(a)}`}
                      className="text-decoration-none"
                    >
                      {getDoctorPhone(a) || "N/A"}
                    </a>
                  </td>

                  <td className="fw-bold">Rs. {a.Fee}</td>
                  <td>{a.Patient}</td>
                  <td>{a.Phone}</td>
                  <td>{a.CNIC}</td>
                  <td>{a.Date}</td>
                  <td>{a.Time}</td>

                  {/* ================= ACTIONS ================= */}
                  <td className="text-center">
                    <button
                      className="btn btn-success btn-sm me-1"
                      onClick={() => openWhatsApp(a)}
                      title="WhatsApp"
                    >
                      <i className="bi bi-whatsapp"></i>
                    </button>

                    {(a.status === "completed" || a.status === "done" || a.status === "Completed") && (
                      <button
                        className="btn btn-primary btn-sm me-1"
                        onClick={() => openReport(a.id)}
                        title="View Lab Results"
                      >
                        <i className="bi bi-file-earmark-medical"></i>
                      </button>
                    )}

                    <div className="dropdown d-inline">
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
                            className="dropdown-item px-3"
                            onClick={() => {
                              setSelected(a);
                              setMode("view");
                            }}
                          >
                            View
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item px-3"
                            onClick={() => {
                              setSelected(a);
                              setMode("edit");
                            }}
                          >
                            Edit
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item px-3 text-danger"
                            onClick={() => deleteAppointment(a.id)}
                          >
                            Delete
                          </button>
                        </li>
                      </ul>
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
      </div>

      {/* ================= RESPONSIVE CSS ================= */}
      <style>
        {`
          .card-view { display: none; }
          .table-view { display: block; }

          @media (max-width: 991px) {
            .card-view { display: block; }
            .table-view { display: none; }
          }

          @media (min-width: 992px) {
            .card-view { display: none; }
            .table-view { display: block; }
          }
        `}
      </style>

      {/* Modal untouched */}
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
