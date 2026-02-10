import React, { useState } from "react";
import { useLab } from "../context/LabContext";

export default function DoctorLab() {
  const { tests, addTest, performTest, giveMedication } = useLab();

  const [form, setForm] = useState({
    patient_name: "",
    cnic: "",
    test_name: "",
    description: "",
    normal_range: "",
    price: "",
    category: "",
  });

  const [medication, setMedication] = useState({});
  const [result, setResult] = useState({});

  const handleAddTest = () => {
    addTest(form);
    setForm({
      patient_name: "",
      cnic: "",
      test_name: "",
      description: "",
      normal_range: "",
      price: "",
      category: "",
    });
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4 text-center text-md-start">Add Lab Test</h3>

      {/* Add Test Form */}
      <div className="row g-2 mb-3">
        {[
          "patient_name",
          "cnic",
          "test_name",
          "description",
          "normal_range",
          "price",
          "category",
        ].map((f) => (
          <div key={f} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <input
              className="form-control"
              placeholder={f.replace("_", " ")}
              value={form[f]}
              onChange={(e) => setForm({ ...form, [f]: e.target.value })}
            />
          </div>
        ))}
      </div>

      <button className="btn btn-primary mb-4 " onClick={handleAddTest}>
        Add Test
      </button>

      <h4 className="mb-3">All Tests</h4>

      {/* ===== Desktop Table ===== */}
      <div className="d-none d-lg-block table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark text-center">
            <tr>
              <th>#</th>
              <th>Patient</th>
              <th>CNIC</th>
              <th>Test</th>
              <th>Status</th>
              <th>Result</th>
              <th>Medication</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((t, i) => (
              <tr key={t.id} className="text-center align-middle">
                <td>{i + 1}</td>
                <td>{t.patient_name}</td>
                <td>{t.cnic}</td>
                <td>{t.test_name}</td>
                <td>{t.status}</td>
                <td>
                  {t.status === "done" ? (
                    t.result
                  ) : (
                    <input
                      className="form-control"
                      value={result[t.id] || ""}
                      onChange={(e) =>
                        setResult({ ...result, [t.id]: e.target.value })
                      }
                      placeholder="Result"
                    />
                  )}
                </td>
                <td>{t.medicationGiven || "-"}</td>
                <td>
                  {t.status !== "done" && (
                    <button
                      className="btn btn-primary btn-sm mb-1"
                      onClick={() => performTest(t.id, result[t.id])}
                    >
                      Perform
                    </button>
                  )}
                  <input
                    className="form-control mb-1"
                    placeholder="Medication"
                    value={medication[t.id] || ""}
                    onChange={(e) =>
                      setMedication({ ...medication, [t.id]: e.target.value })
                    }
                  />
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => giveMedication(t.id, medication[t.id])}
                  >
                    Give
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== Tablet / iPad Cards ===== */}
      <div className="d-none d-md-block d-lg-none">
        <div className="row">
          {tests.map((t, i) => (
            <div key={t.id} className="col-12 col-sm-6 mb-3">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">
                    #{i + 1} - {t.test_name}
                  </h5>
                  <p>
                    <strong>Patient:</strong> {t.patient_name}
                  </p>
                  <p>
                    <strong>CNIC:</strong> {t.cnic}
                  </p>
                  <p>
                    <strong>Status:</strong> {t.status}
                  </p>
                  <p>
                    <strong>Result:</strong>
                    {t.status === "done" ? (
                      t.result
                    ) : (
                      <input
                        className="form-control"
                        value={result[t.id] || ""}
                        onChange={(e) =>
                          setResult({ ...result, [t.id]: e.target.value })
                        }
                        placeholder="Result"
                      />
                    )}
                  </p>
                  <p>
                    <strong>Medication:</strong> {t.medicationGiven || "-"}
                  </p>
                  {t.status !== "done" && (
                    <button
                      className="btn btn-primary btn-sm mb-1"
                      onClick={() => performTest(t.id, result[t.id])}
                    >
                      Perform
                    </button>
                  )}
                  <input
                    className="form-control mb-1"
                    value={medication[t.id] || ""}
                    placeholder="Medication"
                    onChange={(e) =>
                      setMedication({ ...medication, [t.id]: e.target.value })
                    }
                  />
                  <button
                    className="btn btn-success btn-sm w-100"
                    onClick={() => giveMedication(t.id, medication[t.id])}
                  >
                    Give
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Mobile Cards (280px) ===== */}
      <div className="d-md-none">
        {tests.map((t, i) => (
          <div
            key={t.id}
            className="card mb-3 shadow-sm"
            style={{ minWidth: "280px" }}
          >
            <div className="card-body">
              <h5 className="card-title">
                #{i + 1} - {t.test_name}
              </h5>
              <p>
                <strong>Patient:</strong> {t.patient_name}
              </p>
              <p>
                <strong>CNIC:</strong> {t.cnic}
              </p>
              <p>
                <strong>Status:</strong> {t.status}
              </p>
              <p>
                <strong>Result:</strong>
                {t.status === "done" ? (
                  t.result
                ) : (
                  <input
                    className="form-control"
                    value={result[t.id] || ""}
                    onChange={(e) =>
                      setResult({ ...result, [t.id]: e.target.value })
                    }
                    placeholder="Result"
                  />
                )}
              </p>
              <p>
                <strong>Medication:</strong> {t.medicationGiven || "-"}
              </p>
              {t.status !== "done" && (
                <button
                  className="btn btn-primary btn-sm mb-1 w-100"
                  onClick={() => performTest(t.id, result[t.id])}
                >
                  Perform
                </button>
              )}
              <input
                className="form-control mb-1"
                value={medication[t.id] || ""}
                placeholder="Medication"
                onChange={(e) =>
                  setMedication({ ...medication, [t.id]: e.target.value })
                }
              />
              <button
                className="btn btn-success btn-sm w-100"
                onClick={() => giveMedication(t.id, medication[t.id])}
              >
                Give
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
