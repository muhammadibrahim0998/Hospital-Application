import React, { useState } from "react";
import { useLab } from "../context/LabContext";

export default function LabPanel() {
  const { tests, performTest } = useLab();
  const [results, setResults] = useState({});

  const handlePerform = (testId) => {
    if (!results[testId]) return alert("Enter result!");
    performTest(testId, results[testId]);
    setResults((prev) => ({ ...prev, [testId]: "" }));
    alert("Test performed!");
  };

  return (
    <div className="container mt-5">
      <h3>Laboratory Panel</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Patient</th>
            <th>Test</th>
            <th>Status</th>
            <th>Result</th>
            <th>Perform Test</th>
          </tr>
        </thead>
        <tbody>
          {tests
            .filter((t) => t.status === "pending")
            .map((t, i) => (
              <tr key={t.id}>
                <td>{i + 1}</td>
                <td>{t.patient}</td>
                <td>{t.testName}</td>
                <td>{t.status}</td>
                <td>
                  <input
                    className="form-control"
                    value={results[t.id] || ""}
                    onChange={(e) =>
                      setResults((prev) => ({
                        ...prev,
                        [t.id]: e.target.value,
                      }))
                    }
                  />
                </td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
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
