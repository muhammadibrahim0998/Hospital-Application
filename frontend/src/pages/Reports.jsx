import React, { useEffect, useState } from "react";
import { fetchReports } from "../api/labApi";

export default function Reports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports().then((res) => setReports(res.data));
  }, []);

  return (
    <div className="container mt-5">
      <h2>Lab Reports</h2>

      {reports.length === 0 ? (
        <p>No Reports Found</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Patient ID</th>
              <th>Test</th>
              <th>Result</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td>{r.patient_id}</td>
                <td>{r.test_name}</td>
                <td>{r.result_data}</td>
                <td>{r.submitted_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
