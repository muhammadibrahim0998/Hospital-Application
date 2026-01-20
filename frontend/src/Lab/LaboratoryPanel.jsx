import React, { useState } from "react";
import { useLab } from "../context/LabContext";

export default function LaboratoryPanel() {
  const { tests, performTest } = useLab();
  const [results, setResults] = useState({});

  const handlePerform = (id) => {
    if (!results[id]) return alert("Please enter result");
    performTest(id, results[id]);
    alert("Test performed successfully");
  };

  return (
    <div className="container mt-4">
      <h3>Laboratory Panel</h3>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Patient</th>
            <th>CNIC</th>
            <th>Test</th>
            <th>Status</th>
            <th>Result</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {tests
            .filter((t) => t.status === "pending")
            .map((t, i) => (
              <tr key={t.id}>
                <td>{i + 1}</td>
                <td>{t.patientName}</td>
                <td>{t.cnic}</td>
                <td>{t.testName}</td>
                <td>
                  <span className="badge bg-warning text-dark">Pending</span>
                </td>
                <td>
                  <input
                    className="form-control"
                    onChange={(e) =>
                      setResults({ ...results, [t.id]: e.target.value })
                    }
                  />
                </td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handlePerform(t.id)}
                  >
                    Perform
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
