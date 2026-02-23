import React, { useState } from "react";
import { useDoctors } from "../context/DoctorContext";
import DoctorList from "../components/DoctorList";
import { Search } from "lucide-react";

export default function Doctors() {
  const { doctors } = useDoctors();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDoctors = doctors.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.specialization || doc.specialty || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5 pt-4">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-dark display-5 mb-3">Find Expert Care</h2>
        <p className="text-muted mb-4">Search through our network of verified clinical specialists</p>

        <div className="col-md-6 mx-auto position-relative">
          <Search className="position-absolute top-50 translate-middle-y ms-3 text-muted" size={20} />
          <input
            type="text"
            className="form-control form-control-lg rounded-pill ps-5 shadow-sm border-0"
            placeholder="Search by doctor name or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <DoctorList doctors={filteredDoctors} />
    </div>
  );
}
