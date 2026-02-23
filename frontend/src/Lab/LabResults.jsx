import React, { useState } from "react";
import { useLab } from "../context/LabContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function LabResults() {
  const { tests } = useLab();
  const [searchTerm, setSearchTerm] = useState("");

  const completedTests = tests.filter((t) => t.status === "done" && t.result);

  const filteredResults = completedTests.filter(t =>
    t.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.test_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hospitalName = "City Hospital Diagnostics";

  const formatDate = (date) => {
    const d = date ? new Date(date) : new Date();
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  };

  const handlePrintSingle = (test) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Clinical Report - ${test.patient_name}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; color: #333; }
            .header { border-bottom: 2px solid #0d6efd; padding-bottom: 20px; margin-bottom: 30px; text-align: center; }
            .hospital-name { font-size: 28px; font-weight: bold; color: #0d6efd; margin: 0; }
            .report-title { font-size: 18px; color: #666; margin-top: 5px; text-transform: uppercase; letter-spacing: 2px; }
            .meta-section { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; background: #f8f9fa; padding: 20px; border-radius: 8px; }
            .meta-item { margin-bottom: 8px; }
            .label { font-weight: bold; color: #555; width: 120px; display: inline-block; }
            .content-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .content-table th, .content-table td { border: 1px solid #dee2e6; padding: 15px; text-align: left; }
            .content-table th { background-color: #f8f9fa; color: #0d6efd; }
            .result-value { font-size: 20px; font-weight: bold; color: #000; }
            .footer { margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #999; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="hospital-name">${hospitalName}</div>
            <div class="report-title">Formal Laboratory Report</div>
          </div>
          
          <div class="meta-section">
            <div class="meta-item"><span class="label">Patient Name:</span> ${test.patient_name}</div>
            <div class="meta-item"><span class="label">Requisition ID:</span> #LAB-${test.id.substring(0, 8)}</div>
            <div class="meta-item"><span class="label">Contact/CNIC:</span> ${test.cnic || 'N/A'}</div>
            <div class="meta-item"><span class="label">Report Date:</span> ${formatDate(new Date())}</div>
          </div>

          <table class="content-table">
            <thead>
              <tr>
                <th style="width: 40%">Investigation</th>
                <th style="width: 60%">Findings & Interpretation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>${test.test_name}</strong><br><small style="color: #666">${test.description || 'Routine Diagnostic'}</small></td>
                <td><div class="result-value">${test.result}</div></td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            Note: This is an electronically generated report and does not require a physical signature. 
            Verification can be done through the hospital's central portal.
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h2 className="mb-0 fw-bold">Diagnostic Archive</h2>
          <p className="text-muted mb-0">Official record of all finalized clinical investigations</p>
        </div>
        <div className="text-end">
          <input
            type="text"
            className="form-control"
            placeholder="Search archive..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '250px' }}
          />
        </div>
      </div>

      {filteredResults.length === 0 ? (
        <div className="card shadow-sm border-0 text-center p-5">
          <div className="card-body">
            <h5 className="text-muted">No diagnostic records matching your search.</h5>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {filteredResults.map((t) => (
            <div key={t.id} className="col-lg-6">
              <div className="card shadow-sm border-0 h-100 overflow-hidden">
                <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                  <span className="badge bg-success-soft text-success px-3 py-2 border border-success">FINALIZED</span>
                  <small className="text-muted">ID: {t.id.substring(0, 8)}</small>
                </div>
                <div className="card-body px-4 pb-4">
                  <div className="mb-3">
                    <h5 className="mb-1">{t.patient_name}</h5>
                    <div className="small text-muted">{t.cnic || 'No CNIC provided'}</div>
                  </div>

                  <div className="p-3 bg-light rounded-3 mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-bold text-dark">{t.test_name}</span>
                    </div>
                    <div className="h4 mb-0 text-primary fw-bold text-center py-2">{t.result}</div>
                  </div>


                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-primary flex-grow-1"
                      onClick={() => handlePrintSingle(t)}
                    >
                      Official Print
                    </button>
                    <button
                      className="btn btn-primary flex-grow-1"
                      onClick={() => handlePrintSingle(t)}
                    >
                      Digital Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
