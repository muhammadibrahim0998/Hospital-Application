import React, { createContext, useContext, useState } from "react";

const LabContext = createContext();
export const useLab = () => useContext(LabContext);

export const LabProvider = ({ children }) => {
  const [tests, setTests] = useState([]);

  // ✅ Add test (Doctor / Patient)
  const addTest = ({ patientName, cnic, testName }) => {
    const newTest = {
      id: Date.now(),
      patientName,
      cnic,
      testName,
      status: "pending",
      result: "",
      medicationGiven: "",
    };
    setTests((prev) => [...prev, newTest]);
  };

  // ✅ Perform test (Lab)
  const performTest = (id, result) => {
    setTests((prev) =>
      prev.map((t) => (t.id === id ? { ...t, result, status: "done" } : t))
    );
  };

  // ✅ Give medication (Doctor)
  const giveMedication = (id, medication) => {
    setTests((prev) =>
      prev.map((t) => (t.id === id ? { ...t, medicationGiven: medication } : t))
    );
  };

  return (
    <LabContext.Provider
      value={{
        tests,
        addTest,
        performTest,
        giveMedication,
      }}
    >
      {children}
    </LabContext.Provider>
  );
};
