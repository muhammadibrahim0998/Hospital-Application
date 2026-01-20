import React from "react";
import { useLab } from "../context/LabContext";

export default function LabResults() {
  const { tests } = useLab();

  // Print function for a single test
  const handlePrint = (test) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`<h3>Test Result</h3>`);
    printWindow.document.write(
      `<p><strong>Patient:</strong> ${test.patientName}</p>`,
    );
    printWindow.document.write(`<p><strong>CNIC:</strong> ${test.cnic}</p>`);
    printWindow.document.write(
      `<p><strong>Test:</strong> ${test.testName}</p>`,
    );
    printWindow.document.write(
      `<p><strong>Result:</strong> ${test.result}</p>`,
    );
    printWindow.document.write(
      `<p><strong>Medication:</strong> ${test.medicationGiven || "—"}</p>`,
    );
    printWindow.document.write(`<script>window.print();</script>`);
    printWindow.document.close();
  };

  // PDF download function for a single test
  const handlePDF = (test) => {
    const pdfContent = `
      Test Result\n
      Patient: ${test.patientName}\n
      CNIC: ${test.cnic}\n
      Test: ${test.testName}\n
      Result: ${test.result}\n
      Medication: ${test.medicationGiven || "—"}
    `;
    const blob = new Blob([pdfContent], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${test.patientName}_test.pdf`;
    link.click();
  };

  return (
    <div className="container mt-4">
      <h3>Lab Results</h3>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Patient</th>
            <th>CNIC</th>
            <th>Test</th>
            <th>Result</th>
            <th>Medication</th>
            <th>Actions</th> {/* New column for buttons */}
          </tr>
        </thead>

        <tbody>
          {tests
            .filter((t) => t.status === "done")
            .map((t, i) => (
              <tr key={t.id}>
                <td>{i + 1}</td>
                <td>{t.patientName}</td>
                <td>{t.cnic}</td>
                <td>{t.testName}</td>
                <td>{t.result}</td>
                <td>{t.medicationGiven || "—"}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => handlePrint(t)}
                  >
                    Print
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => handlePDF(t)}
                  >
                    PDF
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
