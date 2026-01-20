import React, { useState } from "react";
import { useLab } from "../context/LabContext";

export default function PatientLab() {
  const { addTest } = useLab();

  const [form, setForm] = useState({
    patientName: "",
    cnic: "",
    testName: "",
  });

  const submit = () => {
    if (!form.patientName || !form.cnic || !form.testName)
      return alert("All fields are required");

    addTest(form);
    alert("Lab test booked successfully ✅");

    setForm({ patientName: "", cnic: "", testName: "" });
  };

  return (
    <div className="container mt-4">
      <h3>Book Lab Test</h3>

      <input
        className="form-control mb-2"
        placeholder="Patient Name"
        value={form.patientName}
        onChange={(e) => setForm({ ...form, patientName: e.target.value })}
      />

      <input
        className="form-control mb-2"
        placeholder="CNIC"
        value={form.cnic}
        onChange={(e) => setForm({ ...form, cnic: e.target.value })}
      />

      <input
        className="form-control mb-2"
        placeholder="Test Name"
        value={form.testName}
        onChange={(e) => setForm({ ...form, testName: e.target.value })}
      />

      <button className="btn btn-primary" onClick={submit}>
        Book Test
      </button>
    </div>
  );
}
