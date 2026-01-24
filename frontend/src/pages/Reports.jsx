import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch reports from backend
  const fetchReports = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE_URL}/api/reports`);
      // Check if response is array or wrapped in data
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setReports(data);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load reports. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Loading state
  if (loading)
    return (
      <div className="text-center mt-5">
        <p className="fw-bold">Loading reports...</p>
      </div>
    );

  // Error state
  if (error)
    return (
      <div className="text-center mt-5 text-danger">
        <p className="fw-bold">{error}</p>
      </div>
    );

  return (
    <div className="container mt-5">
      <h2 className="fw-bold mb-4">Reports</h2>

      {reports.length === 0 ? (
        <p className="text-muted mt-5 text-center">No reports found.</p>
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
                <tr key={rep.id || index}>
                  <td className="text-center">{index + 1}</td>
                  <td>{rep.patient || rep.patientName || "-"}</td>
                  <td>{rep.doctor || rep.doctorName || "-"}</td>
                  <td>
                    {Array.isArray(rep.tests)
                      ? rep.tests.map((t, i) => (
                          <div key={i}>
                            <strong>{t.test_name}</strong>
                          </div>
                        ))
                      : rep.test_name || rep.type || "-"}
                  </td>
                  <td>
                    {Array.isArray(rep.tests)
                      ? rep.tests.map((t, i) => (
                          <div key={i}>{t.result || "Pending"}</div>
                        ))
                      : rep.result || "-"}
                  </td>
                  <td>{rep.date || rep.createdAt || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
