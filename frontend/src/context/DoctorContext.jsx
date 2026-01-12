import React, { createContext, useContext, useState } from "react";

import doc1 from "../assets/image/docter1.jfif";
import doc2 from "../assets/image/docter2.jfif";
import doc3 from "../assets/image/docter3.jfif";
import doc4 from "../assets/image/docter4.jfif";
import doc5 from "../assets/image/docter5.jfif";
import doc6 from "../assets/image/docter6.png";
import doc7 from "../assets/image/docter7.jpg";
import doc8 from "../assets/image/docter8.jpg";
import doc9 from "../assets/image/docter9.jpg";
import doc10 from "../assets/image/docter10.jpg";

const DoctorContext = createContext();

const doctorsData = [
  { id: 1, name: "Dr. Altaf", specialty: "Cardiologist", image: doc1 },
  { id: 2, name: "Dr. Ahmed", specialty: "Dermatologist", image: doc2 },
  { id: 3, name: "Dr. Sara", specialty: "Gynecologist", image: doc3 },
  { id: 4, name: "Dr. Ali", specialty: "ENT", image: doc4 },
  { id: 5, name: "Dr. Nazya", specialty: "ENT", image: doc5 },
  { id: 6, name: "Dr. Rafiq", specialty: "Eye", image: doc6 },
  { id: 7, name: "Dr. Najma", specialty: "Dermatologist", image: doc7 },
  { id: 8, name: "Dr. Lina", specialty: "Child", image: doc8 },
  { id: 9, name: "Dr. Inayat", specialty: "Child", image: doc9 },
  { id: 10, name: "Dr. Ozma Khan", specialty: "Child", image: doc10 },
  
];

export const DoctorProvider = ({ children }) => {
  const [doctors, setDoctors] = useState(doctorsData);

  return (
    <DoctorContext.Provider value={{ doctors }}>
      {children}
    </DoctorContext.Provider>
  );
};

export const useDoctors = () => useContext(DoctorContext);
