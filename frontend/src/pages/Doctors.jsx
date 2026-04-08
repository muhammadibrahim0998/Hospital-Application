import React, { useState, useEffect } from "react";
import { useDoctors } from "../context/DoctorContext";
import DoctorList from "../components/DoctorList";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export default function Doctors() {
  const { doctors } = useDoctors();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const q = searchParams.get("search");
    if (q) setSearchTerm(q);
  }, [searchParams]);

  const filteredDoctors = (doctors || []).filter((doc) => {
    const name = doc?.name || "";
    const spec = doc?.specialization || doc?.specialty || "";
    const term = searchTerm.toLowerCase();

    return name.toLowerCase().includes(term) || spec.toLowerCase().includes(term);
  });

  return (


    <div className="container mt-5 pt-4">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-dark display-5 mb-3">Find Expert Care</h2>
        <p className="text-muted mb-4 fs-5">Search through our network of verified clinical specialists</p>
      </div>

      <DoctorList doctors={filteredDoctors} />
    </div>
  );
}
