import React, { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const LabContext = createContext();

export function LabProvider({ children }) {
  const [tests, setTests] = useState([]);

  const addTest = async (test) => {
    const newTest = {
      ...test,
      id: uuidv4(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setTests((prev) => [newTest, ...prev]);
  };

  const performTest = (id, result) => {
    setTests((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "done", result } : t)),
    );
  };

  return (
    <LabContext.Provider value={{ tests, addTest, performTest }}>
      {children}
    </LabContext.Provider>
  );
}

// ✅ Named export
export const useLab = () => useContext(LabContext);
