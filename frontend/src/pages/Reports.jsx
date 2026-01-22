import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:3002/api/reports");
      console.log("Reports API Response:", res.data); // 👈 DEBUG

      // ✅ if backend sends array
      if (Array.isArray(res.data)) {
        setReports(res.data);
      } else {
        setReports(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading reports...</p>;

  if (error) return <p className="text-center text-danger mt-5">{error}</p>;

  return (
    <div className="container mt-5">
      <h2 className="fw-bold mb-4">Reports</h2>

      {reports.length === 0 ? (
        <p className="text-muted">No reports found</p>
      ) : (
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
            {reports.map((rep, index) => (
              <tr key={rep.id || index}>
                <td>{index + 1}</td>
                <td>{rep.patient || rep.patientName}</td>
                <td>{rep.type || rep.reportType}</td>
                <td>{rep.date || rep.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
