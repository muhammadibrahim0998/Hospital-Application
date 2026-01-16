import React, { useState } from "react";
import { useLab } from "../context/LabContext";

export default function DoctorLab() {
  const { tests, addTest, giveMedication } = useLab();

  const [form, setForm] = useState({
    test_name: "",
    description: "",
    normal_range: "",
    price: "",
    category: "",
  });

  const [medication, setMedication] = useState("");

  const handleSubmit = () => {
    addTest(form);
    setForm({
      test_name: "",
      description: "",
      normal_range: "",
      price: "",
      category: "",
    });
    alert("Lab test added ✅");
  };

  return (
    <div className="container mt-4">
      <h3>Add Lab Test</h3>

      {["test_name", "description", "normal_range", "price", "category"].map(
        (f) => (
          <input
            key={f}
            className="form-control mb-2"
            placeholder={f.replace("_", " ")}
            value={form[f]}
            onChange={(e) => setForm({ ...form, [f]: e.target.value })}
          />
        )
      )}

      <button className="btn btn-primary mb-4" onClick={handleSubmit}>
        Add Test
      </button>

      <h4>All Tests</h4>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
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
              <td>{t.test_name}</td>
              <td>{t.status}</td>
              <td>{t.result || "-"}</td>
              <td>
                {t.medicationGiven || (
                  <>
                    <input
                      className="form-control mb-1"
                      onChange={(e) => setMedication(e.target.value)}
                    />
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => giveMedication(t.id, medication)}
                    >
                      Give
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
