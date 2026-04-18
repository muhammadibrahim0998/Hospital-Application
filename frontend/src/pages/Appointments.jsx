
import React, { useEffect, useState, useContext } from "react";
import { useAppointments } from "../context/AppointmentContext";
import { useDoctors } from "../context/DoctorContext";
import { AuthContext } from "../context/AuthContext";
import AppointmentFormModal from "../pages/AppointmentModal";

export default function Appointments() {
  const { doctors: allDoctors } = useDoctors();
  const {
    appointments,
    fetchAppointments,
    deleteAppointment,
    updateAppointment,
  } = useAppointments();

  const { user } = useContext(AuthContext);
  const isPatient = user?.role?.toLowerCase() === "patient";

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
              <div className="mobile-action-bar mt-3 pt-3 border-top">
                <button
                  className="btn btn-success btn-action shadow-sm"
                  onClick={() => openWhatsApp(a)}
                >
                  <i className="bi bi-whatsapp"></i> <span>WhatsApp</span>
                </button>

                {(a.status === "completed" || a.status === "done" || a.status === "Completed") && (
                  <button
                    className="btn btn-primary btn-action shadow-sm"
                    onClick={() => openReport(a.id)}
                  >
                    <i className="bi bi-file-earmark-medical"></i> <span>Result</span>
                  </button>
                )}

                <button
                  className="btn btn-info btn-action text-white shadow-sm"
                  onClick={() => {
                    setSelected(a);
                    setMode("view");
                  }}
                >
                  <i className="bi bi-eye"></i> <span>View</span>
                </button>

                {!isPatient && (
                  <button
                    className="btn btn-warning btn-action text-white shadow-sm"
                    onClick={() => {
                      setSelected(a);
                      setMode("edit");
                    }}
                  >
                    <i className="bi bi-pencil-square"></i> <span>Edit</span>
                  </button>
                )}

                <button
                  className="btn btn-danger btn-action shadow-sm"
                  onClick={() => deleteAppointment(a.id)}
                >
                  <i className="bi bi-trash"></i> <span>Delete</span>
                </button>
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
          className="shadow-lg rounded-4 overflow-visible bg-white p-2"
          style={{ fontSize: "13px" }}
        >
          <table className="table table-hover align-middle mb-0 custom-premium-table">
            <thead>
              <tr>
                <th className="rounded-start-4">#</th>
                <th>Doctor</th>
                <th>Doctor Phone</th>
                <th>Fee</th>
                <th>Patient Name</th>
                <th>Phone</th>
                <th>CNIC</th>
                <th>Date</th>
                <th>Time</th>
                <th className="rounded-end-4">Action</th>
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

                    <button
                      className="btn btn-info btn-sm me-1 text-white"
                      onClick={() => {
                        setSelected(a);
                        setMode("view");
                      }}
                      title="View"
                    >
                      <i className="bi bi-eye"></i>
                    </button>

                    {!isPatient && (
                      <button
                        className="btn btn-warning btn-sm me-1 text-white"
                        onClick={() => {
                          setSelected(a);
                          setMode("edit");
                        }}
                        title="Edit"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                    )}

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteAppointment(a.id)}
                      title="Delete"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
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

          /* Premium Table Styling */
          .custom-premium-table {
            border-collapse: separate;
            border-spacing: 0 8px;
            width: 100%;
          }
          
          .custom-premium-table thead th {
            background: linear-gradient(90deg, #0d6efd 0%, #1e3a8a 100%) !important;
            color: white !important;
            padding: 16px 12px !important;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 1px;
            font-weight: 800;
            border: none !important;
            text-align: center;
          }

          .card-view .card {
            border: 1px solid rgba(13, 110, 253, 0.1) !important;
            border-radius: 20px !important;
            box-shadow: 0 12px 30px rgba(13, 110, 253, 0.12) !important;
            transition: all 0.4s ease;
            background: #ffffff;
            overflow: hidden;
          }
          
          .card-view .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(13, 110, 253, 0.2) !important;
          }

          .mobile-action-bar {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            justify-content: center;
          }

          .btn-action {
            width: 50px;
            height: 42px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2px !important;
            font-size: 7.5px !important;
            font-weight: 700;
            border-radius: 10px !important;
            transition: all 0.3s ease;
            border: none !important;
            box-shadow: none !important; /* Flat design */
          }

          .btn-action:hover {
            opacity: 0.9;
            transform: scale(1.05);
          }

          .btn-action i {
            font-size: 12px;
            margin-bottom: 2px;
          }

          .btn-action span {
             display: block;
             white-space: nowrap;
             overflow: hidden;
             text-overflow: ellipsis;
          }

          .btn-action:active {
            transform: scale(0.92);
          }

          .card-view .card {
            border-left: 5px solid #0d6efd !important;
            border-radius: 15px !important;
            transition: 0.3s ease;
          }
          
          .card-view .card:hover {
            box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
          }

          .custom-premium-table tbody tr {
            box-shadow: 0 4px 10px rgba(0,0,0,0.03);
            border-radius: 10px;
            transition: all 0.3s ease;
          }

          .custom-premium-table tbody tr:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(0,0,0,0.08);
            background-color: #f1f7ff !important;
          }

          .custom-premium-table tbody td {
            padding: 12px 10px !important;
            border: none !important;
            background: white;
          }

          .custom-premium-table tbody tr td:first-child { border-radius: 10px 0 0 10px; }
          .custom-premium-table tbody tr td:last-child { border-radius: 0 10px 10px 0; }

          /* Action Column Fix */
          .overflow-visible {
            overflow: visible !important;
          }
          
          .dropdown-menu {
            z-index: 1050 !important;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
            border: none !important;
            border-radius: 12px !important;
          }
        `}
      </style>

      {/* Modal untouched */}
      {selected && (
        <>
          <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '340px' }}>
              <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="modal-header bg-primary text-white border-0 py-3">
                  <h6 className="modal-title fw-bold m-0">
                    {mode === "view" ? "Appointment Details" : "Edit Appointment"}
                  </h6>
                  <button className="btn-close btn-close-white" onClick={closeModal} />
                </div>
                <div className="modal-body p-4 bg-light">
                  {mode === "view" ? (
                    <div className="appointment-details">
                      <div className="bg-white p-3 rounded-4 shadow-sm text-center mb-4 border-top border-5 border-primary">
                        <div className="text-muted small text-uppercase fw-bold mb-1" style={{ fontSize: '10px', letterSpacing: '1px' }}>Specialist</div>
                        <h5 className="fw-bold text-dark mb-2">{selected.Doctor}</h5>
                        <div className="d-flex justify-content-center flex-wrap gap-2">
                          <div className="px-2 py-1 bg-success bg-opacity-10 text-success rounded-pill small fw-bold">
                            <i className="bi bi-whatsapp me-1"></i>
                            {selected.DoctorPhone || getDoctorPhone(selected)}
                          </div>
                          <div className="px-2 py-1 bg-primary bg-opacity-10 text-primary rounded-pill small fw-bold">
                            Fee: Rs.{selected.Fee}
                          </div>
                        </div>
                      </div>

                      <div className="row g-2">
                        {[
                          { label: "Patient", value: selected.Patient, icon: "person" },
                          { label: "CNIC", value: selected.CNIC || "N/A", icon: "card-text" },
                          { label: "Date", value: selected.Date, icon: "calendar3" },
                          { label: "Time", value: selected.Time, icon: "clock" },
                        ].map((item, idx) => (
                          <div className="col-6" key={idx}>
                            <div className="bg-white p-2 rounded-3 border border-light">
                              <div className="text-muted mb-0" style={{ fontSize: '9px' }}>
                                <i className={`bi bi-${item.icon} me-1`}></i>{item.label}
                              </div>
                              <div className="fw-bold text-dark text-truncate" style={{ fontSize: '11px' }}>{item.value || "N/A"}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="row g-2">
                      {["Patient", "Doctor", "CNIC", "Fee", "Date", "Time", "Phone"].map((field) => (
                        <div className={field === "Date" || field === "Time" ? "col-6" : "col-12"} key={field}>
                          <label className="form-label mb-1" style={{ fontSize: '11px', fontWeight: '700', color: '#6c757d' }}>{field}</label>
                          <input
                            type={field === "Date" ? "date" : field === "Time" ? "time" : "text"}
                            className="form-control form-control-sm rounded-3"
                            name={field}
                            value={selected[field] || ""}
                            onChange={handleChange}
                            style={{ fontSize: '12px' }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="modal-footer bg-light border-0 pt-0 pb-3 px-4 d-flex justify-content-center">
                  {mode === "view" ? (
                    <button className="btn btn-dark rounded-pill px-5 fw-bold btn-sm" onClick={closeModal}>
                      Close
                    </button>
                  ) : (
                    <>
                      <button className="btn btn-secondary rounded-pill px-4 btn-sm" onClick={closeModal}>Cancel</button>
                      <button className="btn btn-primary rounded-pill px-4 btn-sm" onClick={handleUpdate}>Update</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
