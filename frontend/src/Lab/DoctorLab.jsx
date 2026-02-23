import React, { useState } from "react";
import { useLab } from "../context/LabContext";

export default function DoctorLab() {
  const { tests, addTest } = useLab();

  const [form, setForm] = useState({
    patient_name: "",
    cnic: "",
    test_name: "",
    description: "",
    normal_range: "",
    price: "",
    category: "",
  });

  const handleAddTest = (e) => {
    e.preventDefault();
    if (!form.patient_name || !form.test_name) return;
    addTest(form);
    setForm({
      patient_name: "",
      cnic: "",
      test_name: "",
      description: "",
      normal_range: "",
      price: "",
      category: "",
    });
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm border-0 mb-5">
            <div className="card-body p-4">
              <h3 className="mb-4">New Laboratory Requisition</h3>
              <form onSubmit={handleAddTest}>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label small fw-bold text-muted">Patient Name</label>
                    <input
                      className="form-control"
                      placeholder="Enter patient full name"
                      value={form.patient_name}
                      onChange={(e) => setForm({ ...form, patient_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold text-muted">CNIC / ID</label>
                    <input
                      className="form-control"
                      placeholder="00000-0000000-0"
                      value={form.cnic}
                      onChange={(e) => setForm({ ...form, cnic: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold text-muted">Test Name</label>
                    <input
                      className="form-control"
                      placeholder="e.g. CBC, Serum Glucose"
                      value={form.test_name}
                      onChange={(e) => setForm({ ...form, test_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-8">
                    <label className="form-label small fw-bold text-muted">Clinical Notes / Description</label>
                    <input
                      className="form-control"
                      placeholder="Additional instructions for the lab"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold text-muted">Category</label>
                    <select
                      className="form-select"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                    >
                      <option value="">Select Category</option>
                      <option value="Blood">Blood</option>
                      <option value="Urine">Urine</option>
                      <option value="Imaging">Imaging</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="col-12 text-end mt-4">
                    <button type="submit" className="btn btn-primary px-5">
                      Authorize Lab Test
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">All Diagnostic Requisitions</h4>
        <div className="text-muted small">Total: {tests.length} tests</div>
      </div>

      {/* ===== Desktop Table ===== */}
      <div className="d-none d-lg-block">
        <div className="card shadow-sm border-0 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th className="ps-4">Patient</th>
                  <th>Test</th>
                  <th>Status</th>
                  <th>Clinical Findings</th>
                  <th className="pe-4 text-center">Category</th>
                </tr>
              </thead>
              <tbody>
                {tests.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-4">No tests ordered yet.</td></tr>
                ) : (
                  tests.map((t) => (
                    <tr key={t.id}>
                      <td className="ps-4">
                        <div className="fw-bold">{t.patient_name}</div>
                        <small className="text-muted">{t.cnic || 'No CNIC'}</small>
                      </td>
                      <td>{t.test_name}</td>
                      <td>
                        <span className={`badge bg-${t.status === 'done' ? 'success' : 'warning text-dark'}`}>
                          {t.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        {t.status === "done" ? (
                          <div className="text-primary fw-bold">{t.result}</div>
                        ) : (
                          <span className="text-muted italic small">Pending laboratory processing</span>
                        )}
                      </td>
                      <td className="pe-4 text-center">
                        <span className="badge bg-light text-dark border">{t.category || 'N/A'}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ===== Tablet / Mobile Cards ===== */}
      <div className="d-lg-none">
        <div className="row g-3">
          {tests.map((t) => (
            <div key={t.id} className="col-md-6 col-12">
              <div className="card shadow-sm h-100 border-0">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">{t.patient_name}</h5>
                    <span className={`badge bg-${t.status === 'done' ? 'success' : 'warning text-dark'}`}>
                      {t.status}
                    </span>
                  </div>
                  <p className="text-muted small mb-3">{t.test_name}</p>

                  <div>
                    <label className="small fw-bold text-muted mb-1">Result Finding</label>
                    {t.status === "done" ? (
                      <div className="p-2 bg-light rounded text-primary fw-bold">{t.result}</div>
                    ) : (
                      <div className="p-2 border rounded small bg-light text-muted italic">Awaiting technician entry...</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
