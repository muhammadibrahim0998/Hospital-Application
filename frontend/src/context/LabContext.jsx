import React, { createContext, useContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

const LabContext = createContext();
export const useLab = () => useContext(LabContext);

export const LabProvider = ({ children }) => {
  const [tests, setTests] = useState([]);

  const fetchTests = async (cnic = "") => {
    const res = await fetch(
      `${API_BASE_URL}/api/lab/tests${cnic ? "?cnic=" + cnic : ""}`,
    );
    const data = await res.json();
    setTests(data);
  };

  const addTest = async (form) => {
    await fetch(`${API_BASE_URL}/api/lab/tests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    fetchTests();
  };

  const performTest = async (id, result) => {
    await fetch(`${API_BASE_URL}/api/lab/tests/${id}/perform`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result }),
    });
    fetchTests();
  };

  const giveMedication = async (id, medication) => {
    await fetch(`${API_BASE_URL}/api/lab/tests/${id}/medication`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ medication }),
    });
    fetchTests();
  };

  useEffect(() => {
    fetchTests();
  }, []);

  return (
    <LabContext.Provider
      value={{ tests, fetchTests, addTest, performTest, giveMedication }}
    >
      {children}
    </LabContext.Provider>
  );
};
