import React, { useState } from "react";
import { useLab } from "../context/LabContext";

export default function LaboratoryPanel() {
  const { tests, performTest } = useLab();
  const [result, setResult] = useState("");

  return (
    <div className="container mt-4 mt-5">
      <h3>Laboratory Panel</h3>

      <table className="table table-hover">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Test</th>
            <th>Status</th>
            <th>Result</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tests
            .filter((t) => t.status !== "done")
            .map((t, i) => (
              <tr key={t.id}>
                <td>{i + 1}</td>
                <td>{t.test_name}</td>
                <td>{t.status}</td>
                <td>
                  <input
                    className="form-control"
                    onChange={(e) => setResult(e.target.value)}
                  />
                </td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => performTest(t.id, result)}
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
