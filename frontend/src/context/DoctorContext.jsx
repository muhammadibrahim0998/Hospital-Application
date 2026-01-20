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

//dermatology
import dermatology1 from "../assets/fields/dermatology/dermatology1.jpg";
import dermatology2 from "../assets/fields/dermatology/dermatology2.jpg";
import dermatology3 from "../assets/fields/dermatology/dermatology3.jpg";
import dermatology4 from "../assets/fields/dermatology/dermatology4.jpg";
import dermatology5 from "../assets/fields/dermatology/dermatology5.jpg";
//pediatric Cardiology1
import Cordiiology1 from "../assets/fields/cardiology/Cardiology1.jfif";
import Cordiiology2 from "../assets/fields/cardiology/Cardiology2.jfif";
import Cordiiology3 from "../assets/fields/cardiology/Cardiology3.jfif";
import Cordiiology4 from "../assets/fields/cardiology/Cardiology4.jfif";
import Cordiiology5 from "../assets/fields/cardiology/Cardiology5.jfif";
//Adult Cardiology1
import AdultCardiology1 from "../assets/fields/cardiology/AdultCardiology1.jfif";
import AdultCardiology2 from "../assets/fields/cardiology/AdultCardiology2.jfif";
import AdultCardiology3 from "../assets/fields/cardiology/AdultCardiology3.jpg";
import AdultCardiology4 from "../assets/fields/cardiology/AdultCardiology4.jpg";
import AdultCardiology5 from "../assets/fields/cardiology/AdultCardiology5.jpg";
//neurology
import neurology1 from "../assets/fields/neurology/Neurology1.jfif";
import neurology2 from "../assets/fields/neurology/Neurology2.jpg";
import neurology3 from "../assets/fields/neurology/Neurology3.jpg";
import neurology4 from "../assets/fields/neurology/Neurology4.jpg";
import neurology5 from "../assets/fields/neurology/Neurology5.jpg";
//pedric neonatology 
import PediatricNeurology1 from "../assets/fields/neurology/PediatricNeurology1.jpg";
import PediatricNeurology2 from "../assets/fields/neurology/PediatricNeurology2.jpg";
import PediatricNeurology3 from "../assets/fields/neurology/PediatricNeurology3.jpg";
import PediatricNeurology4 from "../assets/fields/neurology/PediatricNeurology4.jpg";
import PediatricNeurology5 from "../assets/fields/neurology/PediatricNeurology5.jpg";


// orthopedic
import orthopedic1 from "../assets/fields/orthopedics/orthopedic1.jpg";
import orthopedic2 from "../assets/fields/orthopedics/orthopedic2.webp";
import orthopedic3 from "../assets/fields/orthopedics/orthopedic3.webp";
import orthopedic4 from "../assets/fields/orthopedics/orthopedic4.jfif";
import orthopedic5 from "../assets/fields/orthopedics/orthopedic5.jfif";
//joint replacement
import joindtr1 from "../assets/fields/orthopedics/joindtr1.jfif";






const DoctorContext = createContext();
export const useDoctors = () => useContext(DoctorContext);

export const DoctorProvider = ({ children }) => {
  const [doctors] = useState([
    {
      id: 1,
      name: "Dr. Altaf",
      specialty: "Cardiologist",
      image: doc1,
      departmentId: 1,
      fieldId: 1,
    },
    {
      id: 2,
      name: "Dr. Ahmed",
      specialty: "Dermatologist",
      image: doc2,
      departmentId: 4,
      fieldId: 7,
    },
    {
      id: 3,
      name: "Dr. Sara",
      specialty: "Gynecologist",
      image: doc3,
      departmentId: 16,
      fieldId: 32,
    },
    {
      id: 4,
      name: "Dr. Alina",
      specialty: "ENT",
      image: doc4,
      departmentId: 8,
      fieldId: 15,
    },
    {
      id: 5,
      name: "Dr. Nazer",
      specialty: "ENT",
      image: doc5,
      departmentId: 8,
      fieldId: 16,
    },
    {
      id: 6,
      name: "Dr. Rafiq",
      specialty: "Eye",
      image: doc6,
      departmentId: 7,
      fieldId: 13,
    },
    {
      id: 7,
      name: "Dr. Najma",
      specialty: "Dermatologist",
      image: doc7,
      departmentId: 4,
      fieldId: 8,
    },
    {
      id: 8,
      name: "Dr. Lina",
      specialty: "Child",
      image: doc8,
      departmentId: 17,
      fieldId: 34,
    },
    {
      id: 9,
      name: "Dr. Inayat",
      specialty: "Child",
      image: doc9,
      departmentId: 17,
      fieldId: 33,
    },
    {
      id: 10,
      name: "Dr. Ozma Khan",
      specialty: "Child",
      image: doc10,
      departmentId: 17,
      fieldId: 33,
    },
    {
      id: 11,
      name: "Dr.Rahim",
      specialty: "Cordiiologist",
      image: Cordiiology1,
      departmentId: 1,
      fieldId: 1,
    },
    {
      id: 12,
      name: "Dr.waqas",
      specialty: "Cordiiologist",
      image: Cordiiology2,
      departmentId: 1,
      fieldId: 1,
    },
    {
      id: 13,
      name: "Dr.Younas",
      specialty: "Cordiiologist",
      image: Cordiiology3,
      departmentId: 1,
      fieldId: 1,
    },
    {
      id: 14,
      name: "Dr.Yaseen",
      specialty: "Cordiiologist",
      image: Cordiiology4,
      departmentId: 1,
      fieldId: 1,
    },
    {
      id: 15,
      name: "Dr.Yasir",
      specialty: "Cordiiologist",
      image: Cordiiology5,
      departmentId: 1,
      fieldId: 1,
    },
    //dermatology
    {
      id: 16,
      name: "Dr.Salman",
      specialty: " dermatology ",
      image: Cordiiology1,
      departmentId: 17,
      fieldId: 34,
    },
    //ADult Cardiology
    {
      id: 17,
      name: "Dr.usman",
      specialty: " Adult Cardiology ",
      image: AdultCardiology1,
      departmentId: 1,
      fieldId: 2,
    },
    {
      id: 18,
      name: "Dr.umar",
      specialty: " Adult Cardiology ",
      image: AdultCardiology2,
      departmentId: 1,
      fieldId: 2,
    },
    {
      id: 19,
      name: "Dr.khetab",
      specialty: " Adult Cardiology ",
      image: AdultCardiology3,
      departmentId: 1,
      fieldId: 2,
    },
    {
      id: 20,
      name: "Dr.karem khan",
      specialty: " Adult Cardiology ",
      image: AdultCardiology4,
      departmentId: 1,
      fieldId: 2,
    },
    {
      id: 21,
      name: "Dr.kamran",
      specialty: " Adult Cardiology ",
      image: AdultCardiology5,
      departmentId: 1,
      fieldId: 2,
    },
    // neurology

    {
      id: 22,
      name: "Dr.khurshed",
      specialty: " Neurology ",
      image: AdultCardiology2,
      departmentId: 2,
      fieldId: 3,
    },
    {
      id: 23,
      name: "Dr.Habib",
      specialty: " Neurology",
      image: AdultCardiology3,
      departmentId: 2,
      fieldId: 3,
    },
    {
      id: 24,
      name: "Dr.Hasnain",
      specialty: " Neurology ",
      image: AdultCardiology4,
      departmentId: 2,
      fieldId: 3,
    },
    {
      id: 25,
      name: "Dr.Raes khan",
      specialty: " Neurology ",
      image: AdultCardiology5,
      departmentId: 2,
      fieldId: 3,
    },
    {
      id: 26,
      name: "Dr.Nabeel",
      specialty: " Neurology ",
      image: AdultCardiology5,
      departmentId: 2,
      fieldId: 3,
    },
    //pedric neonatology
    {
      id: 27,
      name: "Dr.Laiba",
      specialty: "pediatric Neurology ",
      image: PediatricNeurology1,
      departmentId: 2,
      fieldId: 4,
    },
    {
      id: 28,
      name: "Dr.Zuhra",
      specialty: "pediatric Neurology",
      image: PediatricNeurology2,
      departmentId: 2,
      fieldId: 4,
    },
    {
      id: 29,
      name: "Dr.Hasher",
      specialty: "pediatric Neurology",
      image: PediatricNeurology3,
      departmentId: 2,
      fieldId: 4,
    },
    {
      id: 30,
      name: "Dr.Hamid ",
      specialty: "pediatric Neurology ",
      image: PediatricNeurology4,
      departmentId: 2,
      fieldId: 4,
    },
    {
      id: 31,
      name: "Dr.Nabeela",
      specialty: " pediatric Neurology ",
      image: PediatricNeurology5,
      departmentId: 2,
      fieldId: 4,
    },
    //orthopedics
    {
      id: 32,
      name: "Dr.Laiba",
      specialty: "orthopedics ",
      image: orthopedic1,
      departmentId: 3,
      fieldId: 5,
    },
    {
      id: 33,
      name: "Dr.Zahir",
      specialty: "orthopedics",
      image: orthopedic2,
      departmentId: 3,
      fieldId: 5,
    },
    {
      id: 34,
      name: "Dr.Hasher",
      specialty: "orthopedics",
      image: orthopedic3,
      departmentId: 3,
      fieldId: 5,
    },
    {
      id: 35,
      name: "Dr.Javeed ",
      specialty: "orthopedics ",
      image: orthopedic4,
      departmentId: 3,
      fieldId: 5,
    },
    {
      id: 36,
      name: "Dr.Naveed",
      specialty: " orthopedics ",
      image: orthopedic5,
      departmentId: 3,
      fieldId: 5,
    },
    {
      id: 37,
      name: "Dr.Zeshan",
      specialty: "Joint Replacement ",
      image: joindtr1,
      departmentId: 3,
      fieldId: 6,
    },
  ]);

  return (
    <DoctorContext.Provider value={{ doctors }}>
      {children}
    </DoctorContext.Provider>
  );
};
