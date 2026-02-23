import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const DoctorContext = createContext();

export const useDoctors = () => useContext(DoctorContext);

export const DoctorProvider = ({ children }) => {
  const [doctors, setDoctors] = useState([]);

  const fetchDoctors = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    try {
      // First try the admin endpoint
      try {
        const res = await axios.get(`${API_BASE_URL}/api/admin/doctors`, { headers });
        setDoctors(res.data || []);
      } catch (adminErr) {
        if (adminErr.response?.status === 401 || adminErr.response?.status === 403) {
          // If admin fails, try the patient endpoint
          const res = await axios.get(`${API_BASE_URL}/api/patient/doctors`, { headers });
          setDoctors(res.data || []);
        } else {
          throw adminErr;
        }
      }
    } catch (err) {
      console.error("Fetch doctors error:", err);
    }
  };

  const addDoctor = async (formData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in!");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/admin/doctors`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Doctor added successfully");
      fetchDoctors();
    } catch (err) {
      console.error("Add doctor error:", err);
      alert(err.response?.data?.message || "Error adding doctor");
    }
  };

  const updateDoctor = async (id, formData) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`${API_BASE_URL}/api/admin/doctors/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Doctor updated successfully");
      fetchDoctors();
    } catch (err) {
      console.error("Update doctor error:", err);
      alert(err.response?.data?.message || "Error updating doctor");
    }
  };

  const removeDoctor = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/doctors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Doctor deleted successfully");
      fetchDoctors();
    } catch (err) {
      console.error("Delete doctor error:", err);
      alert(err.response?.data?.message || "Error deleting doctor");
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const token = localStorage.getItem("token");
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await axios.put(`${API_BASE_URL}/api/admin/doctors/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDoctors();
    } catch (err) {
      console.error("Toggle status error:", err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <DoctorContext.Provider value={{ doctors, addDoctor, updateDoctor, removeDoctor, toggleStatus, fetchDoctors }}>
      {children}
    </DoctorContext.Provider>
  );
};
