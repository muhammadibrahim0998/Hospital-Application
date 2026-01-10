import React from "react";

export default function Reports() {
  const reports = [
    { id: 1, patient: "John Doe", type: "Blood Test", date: "2026-01-05" },
    { id: 2, patient: "Jane Roe", type: "X-Ray", date: "2026-01-06" },
    { id: 3, patient: "Bob Johnson", type: "MRI", date: "2026-01-07" },
  ];

  return (
    <div className="container mt-5">
      <h2 className="fw-bold mb-4">Reports</h2>

      <table className="table table-hover shadow-sm">
        <thead className="table-success">
          <tr>
            <th>#</th>
            <th>Patient</th>
            <th>Report Type</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((rep) => (
            <tr key={rep.id}>
              <td>{rep.id}</td>
              <td>{rep.patient}</td>
              <td>{rep.type}</td>
              <td>{rep.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
