import React from "react";
import { useLab } from "../context/LabContext";
import jsPDF from "jspdf"; // npm install jspdf
import html2canvas from "html2canvas"; // npm install html2canvas

export default function LabResults() {
  const { tests } = useLab();

  const completedTests = tests.filter((t) => t.status === "done" && t.result);

  const hospitalName = "City Hospital"; // set your hospital name here

  // Format current date
  const formatDate = (date) => {
    const d = date ? new Date(date) : new Date();
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  };

  // Print single test
  const handlePrintSingle = (id) => {
    const test = completedTests.find((t) => t.id === id);
    if (!test) return;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Lab Result</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 30px; }
            h2 { text-align: center; color: #2c3e50; margin-bottom: 5px; }
            h4 { text-align: center; margin-top: 0; margin-bottom: 20px; color: #34495e; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            table, th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .info { margin-bottom: 15px; }
            .info p { margin: 4px 0; }
          </style>
        </head>
        <body>
          <h2>${hospitalName}</h2>
          <h4>Lab Test Result</h4>
          <div class="info">
            <p><strong>Patient:</strong> ${test.patientName || "—"}</p>
            <p><strong>Doctor:</strong> ${test.doctorName || "—"}</p>
            <p><strong>Date:</strong> ${formatDate(test.date || test.createdAt)}</p>
          </div>
          <table>
            <tr><th>Test Name</th><td>${test.test_name}</td></tr>
            <tr><th>Result</th><td>${test.result}</td></tr>
            <tr><th>Medication</th><td>${test.medicationGiven || "—"}</td></tr>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  // Save single test as PDF
  const handlePDFSingle = async (id) => {
    const test = completedTests.find((t) => t.id === id);
    if (!test) return;

    // Create a temporary div
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";

    tempDiv.innerHTML = `
      <div style="font-family: Arial, sans-serif; margin: 30px; width: 600px;">
        <h2 style="text-align:center; color:#2c3e50;">${hospitalName}</h2>
        <h4 style="text-align:center; margin-top:0; color:#34495e;">Lab Test Result</h4>
        <div style="margin-bottom:15px;">
          <p><strong>Patient:</strong> ${test.patientName || "—"}</p>
          <p><strong>Doctor:</strong> ${test.doctorName || "—"}</p>
          <p><strong>Date:</strong> ${formatDate(test.date || test.createdAt)}</p>
        </div>
        <table style="width:100%; border-collapse: collapse;">
          <tr><th style="border:1px solid #000; padding:8px; background:#f2f2f2;">Test Name</th><td style="border:1px solid #000; padding:8px;">${test.test_name}</td></tr>
          <tr><th style="border:1px solid #000; padding:8px; background:#f2f2f2;">Result</th><td style="border:1px solid #000; padding:8px;">${test.result}</td></tr>
          <tr><th style="border:1px solid #000; padding:8px; background:#f2f2f2;">Medication</th><td style="border:1px solid #000; padding:8px;">${test.medicationGiven || "—"}</td></tr>
        </table>
      </div>
    `;

    document.body.appendChild(tempDiv);

    const canvas = await html2canvas(tempDiv);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`LabResult-${test.id}.pdf`);

    document.body.removeChild(tempDiv);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Lab Results</h2>

      {completedTests.length === 0 ? (
        <p className="text-muted">No lab results available.</p>
      ) : (
        <>
          <div className="d-none d-md-block table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark text-center">
                <tr>
                  <th>#</th>
                  <th>Test Name</th>
                  <th>Result</th>
                  <th>Medication</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {completedTests.map((t, i) => (
                  <tr key={t.id} className="text-center align-middle">
                    <td>{i + 1}</td>
                    <td>{t.test_name}</td>
                    <td>{t.result}</td>
                    <td>{t.medicationGiven || "—"}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handlePrintSingle(t.id)}
                      >
                        Print
                      </button>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handlePDFSingle(t.id)}
                      >
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
