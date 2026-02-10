import React, { createContext, useContext, useState, useEffect } from "react";

const DepartmentContext = createContext();
export const useDepartments = () => useContext(DepartmentContext);

export const DepartmentProvider = ({ children }) => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    setDepartments([
      {
        id: 1,
        name: "Cardiology",
        fields: [
          { id: 1, name: "Pediatric Cardiology" },
          { id: 2, name: "Adult Cardiology" },
        ],
      },
      {
        id: 2,
        name: "Neurology",
        fields: [
          { id: 3, name: "Neurophysiology" },
          { id: 4, name: "Pediatric Neurology" },
        ],
      },
      {
        id: 3,
        name: "Orthopedics",
        fields: [
          { id: 5, name: "Spine Surgery" },
          { id: 6, name: "Joint Replacement" },
        ],
      },
      {
        id: 4,
        name: "Dermatology",
        fields: [
          { id: 7, name: "Cosmetic Dermatology" },
          { id: 8, name: "Medical Dermatology" },
        ],
      },
      
      {
        id: 17,
        name: "Pediatrics",
        fields: [
          { id: 33, name: "Neonatology" },
          { id: 34, name: "Child Care" },
        ],
      },
      
    ]);
  }, []);

  return (
    <DepartmentContext.Provider value={{ departments }}>
      {children}
    </DepartmentContext.Provider>
  );
};
