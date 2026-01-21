import React from "react";
import { useLab } from "../context/LabContext";
import jsPDF from "jspdf"; // npm install jspdf
import html2canvas from "html2canvas"; // npm install html2canvas

export default function LabResults() {
  const { tests } = useLab();

  const completedTests = tests.filter((t) => t.status === "done" && t.result);

  // Print single test
  const handlePrintSingle = (id) => {
    const element = document.getElementById(`lab-${id}`);
    if (!element) return;

    const clone = element.cloneNode(true);
    const buttons = clone.querySelectorAll("button");
    buttons.forEach((btn) => btn.remove());

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Lab Result</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h5 { margin-bottom: 10px; }
            p { margin: 5px 0; }
            table { border-collapse: collapse; width: 100%; margin-top: 10px; }
            table, th, td { border: 1px solid #000; padding: 8px; text-align: center; }
            th { background-color: #eee; }
          </style>
        </head>
        <body>
          ${clone.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  // Save single test as PDF
  const handlePDFSingle = async (id) => {
    const element = document.getElementById(`lab-${id}`);
    if (!element) return;

    const clone = element.cloneNode(true);
    const buttons = clone.querySelectorAll("button");
    buttons.forEach((btn) => btn.remove());

    // Create a temporary div to render clone for canvas
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    tempDiv.appendChild(clone);
    document.body.appendChild(tempDiv);

    const canvas = await html2canvas(clone);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`LabResult-${id}.pdf`);

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
                  <tr
                    key={t.id}
                    className="text-center align-middle"
                    id={`lab-${t.id}`}
                  >
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

          <div className="d-md-none">
            {completedTests.map((t, i) => (
              <div
                key={t.id}
                className="card mb-3 shadow-sm"
                id={`lab-${t.id}`}
              >
                <div className="card-body">
                  <h5 className="card-title">
                    #{i + 1} - {t.test_name}
                  </h5>
                  <p className="mb-1">
                    <strong>Result:</strong> {t.result}
                  </p>
                  <p className="mb-2">
                    <strong>Medication:</strong> {t.medicationGiven || "—"}
                  </p>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-primary flex-grow-1"
                      onClick={() => handlePrintSingle(t.id)}
                    >
                      Print
                    </button>
                    <button
                      className="btn btn-sm btn-success flex-grow-1"
                      onClick={() => handlePDFSingle(t.id)}
                    >
                      PDF
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
