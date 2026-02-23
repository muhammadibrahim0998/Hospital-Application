import React, { useState } from "react";
import { useLab } from "../context/LabContext";

export default function LaboratoryPanel() {
  const { tests, performTest } = useLab();
  const [results, setResults] = useState({});

  const pendingTests = tests.filter((t) => t.status !== "done");

  const handlePerform = (id) => {
    if (!results[id]) return;
    performTest(id, results[id]);
    setResults((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Laboratory Panel</h3>
        <span className="badge bg-primary">{pendingTests.length} Pending</span>
      </div>

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th className="ps-4">#</th>
                <th>Patient</th>
                <th>Test Name</th>
                <th>Status</th>
                <th>Result Entry</th>
                <th className="text-center pe-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingTests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5 text-muted">
                    No pending laboratory tests found.
                  </td>
                </tr>
              ) : (
                pendingTests.map((t, i) => (
                  <tr key={t.id}>
                    <td className="ps-4">{i + 1}</td>
                    <td>
                      <div className="fw-bold">{t.patient_name}</div>
                      <small className="text-muted">{t.cnic}</small>
                    </td>
                    <td>{t.test_name}</td>
                    <td>
                      <span className="badge bg-warning text-dark uppercase">{t.status}</span>
                    </td>
                    <td>
                      <input
                        className="form-control form-control-sm"
                        placeholder="Enter finding..."
                        value={results[t.id] || ""}
                        onChange={(e) => setResults({ ...results, [t.id]: e.target.value })}
                      />
                    </td>
                    <td className="text-center pe-4">
                      <button
                        className="btn btn-success btn-sm px-3"
                        disabled={!results[t.id]}
                        onClick={() => handlePerform(t.id)}
                      >
                        Complete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
