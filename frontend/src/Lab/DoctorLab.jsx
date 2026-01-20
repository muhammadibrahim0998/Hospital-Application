import React, { useState, useRef } from "react";
import { useLab } from "../context/LabContext";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function DoctorLab() {
  const { tests, addTest, giveMedication } = useLab();

  const [patientName, setPatientName] = useState("");
  const [cnic, setCnic] = useState("");
  const [testName, setTestName] = useState("");
  const [medicationInputs, setMedicationInputs] = useState({});

  // Ref for printing / PDF
  const reportRef = useRef();

  // ===============================
  // Add Lab Test
  // ===============================
  const handleAddTest = () => {
    if (!patientName || !cnic || !testName) {
      alert("Please enter patient name, CNIC and test name");
      return;
    }

    addTest({
      patientName,
      cnic,
      testName,
    });

    setPatientName("");
    setCnic("");
    setTestName("");
    alert("Lab test added successfully ✅");
  };

  // ===============================
  // Give Medication
  // ===============================
  const handleGiveMedication = (testId) => {
    if (!medicationInputs[testId]) {
      alert("Please enter medication");
      return;
    }

    giveMedication(testId, medicationInputs[testId]);
    alert("Medication prescribed successfully ✅");
  };

  // ===============================
  // Print / PDF Functionality
  // ===============================
  const handlePrint = () => {
    const input = reportRef.current;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      // Open a new window for printing
      const win = window.open("", "_blank");
      win.document.write(`<html><head><title>Lab Report</title></head><body>`);
      win.document.write(`<img src="${imgData}" style="width:100%"/>`);
      win.document.write(`</body></html>`);
      win.document.close();
      win.focus();
      win.print();
      win.close();
    });
  };

  const handleExportPDF = () => {
    const input = reportRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("lab_report.pdf");
    });
  };

  return (
    <div className="container-fluid mt-4">
      {/* Header */}
      <div className="card shadow-sm mb-4">
        <div className="card-body bg-dark text-white rounded">
          <h3 className="mb-0">🩺 Doctor – Lab Management</h3>
          <small>Assign tests & review lab results</small>
        </div>
      </div>

      {/* Assign Test */}
      <div className="card shadow mb-4">
        <div className="card-header bg-primary text-white">
          <strong>Assign Lab Test</strong>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Patient Name</label>
              <input
                className="form-control"
                placeholder="Enter patient name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">CNIC</label>
              <input
                className="form-control"
                placeholder="35202-1234567-1"
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Lab Test Name</label>
              <input
                className="form-control"
                placeholder="e.g. Blood CBC, X-Ray Chest"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-3 text-end">
            <button className="btn btn-success" onClick={handleAddTest}>
              ➕ Add Lab Test
            </button>
          </div>
        </div>
      </div>

      {/* Print / PDF Buttons */}
      <div className="mb-3 text-end">
        <button className="btn btn-info me-2" onClick={handlePrint}>
          🖨 Print Report
        </button>
        <button className="btn btn-secondary" onClick={handleExportPDF}>
          📄 Export PDF
        </button>
      </div>

      {/* Tests Table */}
      <div className="card shadow mb-4" ref={reportRef}>
        <div className="card-header bg-secondary text-white">
          <strong>Lab Tests Overview</strong>
        </div>
        <div className="card-body table-responsive">
          {tests.length === 0 ? (
            <p className="text-muted text-center mb-0">
              No lab tests available
            </p>
          ) : (
            <table className="table table-bordered align-middle">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Patient</th>
                  <th>CNIC</th>
                  <th>Test</th>
                  <th>Status</th>
                  <th>Result</th>
                  <th>Medication</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((t, i) => (
                  <tr key={t.id}>
                    <td>{i + 1}</td>
                    <td>{t.patientName}</td>
                    <td>{t.cnic}</td>
                    <td>{t.testName}</td>
                    <td>
                      {t.status === "pending" ? (
                        <span className="badge bg-warning text-dark">
                          Pending
                        </span>
                      ) : (
                        <span className="badge bg-success">Completed</span>
                      )}
                    </td>
                    <td>{t.result || "-"}</td>
                    <td>
                      {t.medicationGiven ? (
                        <span className="text-success fw-semibold">
                          {t.medicationGiven}
                        </span>
                      ) : (
                        t.status === "done" && (
                          <>
                            <input
                              className="form-control mb-1"
                              placeholder="Enter medication"
                              onChange={(e) =>
                                setMedicationInputs({
                                  ...medicationInputs,
                                  [t.id]: e.target.value,
                                })
                              }
                            />
                            <button
                              className="btn btn-primary btn-sm w-100"
                              onClick={() => handleGiveMedication(t.id)}
                            >
                              💊 Prescribe
                            </button>
                          </>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
