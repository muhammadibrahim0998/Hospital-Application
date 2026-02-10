// src/pages/Reports.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:3002";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${API_BASE_URL}/api/reports`);
        setReports(res.data || []);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch reports",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading)
    return <p className="text-center mt-5 fw-bold">Loading reports...</p>;
  if (error)
    return <p className="text-center mt-5 text-danger fw-bold">{error}</p>;

  return (
    <div className="container mt-5">
      <h2 className="fw-bold mb-4">Reports</h2>
      {reports.length === 0 ? (
        <p className="text-center text-muted">No reports found.</p>
      ) : (
        <div className="table-responsive shadow-sm">
          <table className="table table-hover table-bordered align-middle">
            <thead className="table-success text-center">
              <tr>
                <th>#</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Test / Report</th>
                <th>Result</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((rep, index) => (
                <tr key={rep.id}>
                  <td className="text-center">{index + 1}</td>
                  <td>{rep.patientName}</td>
                  <td>{rep.doctorName}</td>
                  <td>{rep.test_name || "-"}</td>
                  <td
                    style={{
                      color: rep.result === "Pending" ? "orange" : "green",
                      fontWeight: "bold",
                    }}
                  >
                    {rep.result}
                  </td>
                  <td>{rep.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
