import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { AuthContext } from "./AuthContext";

const DoctorContext = createContext();

export const useDoctors = () => useContext(DoctorContext);

export const DoctorProvider = ({ children }) => {
  const [doctors, setDoctors] = useState([]);
  const { user, token } = useContext(AuthContext);

  const fetchDoctors = async () => {
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };
    const role = user?.role?.toLowerCase();

    try {
      let endpoint = `${API_BASE_URL}/api/patient/doctors`;

      if (role === 'admin' || role === 'hospital_admin' || role === 'super_admin' || role === 'doctor' || role === 'lab_technician') {
        endpoint = `${API_BASE_URL}/api/admin/doctors`;
      }

      const res = await axios.get(endpoint, { headers });
      setDoctors(res.data || []);
    } catch (err) {
      console.error("Fetch doctors error:", err);
      // Fallback if role detection failed or endpoint mismatched
      if (err.response?.status === 403 || err.response?.status === 401) {
        try {
          const fallbackEndpoint = (role === 'admin' || role === 'hospital_admin' || role === 'super_admin' || role === 'lab_technician')
            ? `${API_BASE_URL}/api/patient/doctors`
            : `${API_BASE_URL}/api/admin/doctors`;
          const res = await axios.get(fallbackEndpoint, { headers });
          setDoctors(res.data || []);
        } catch (fallbackErr) {
          console.error("Fallback fetch error:", fallbackErr);
        }
      }
    }
  };

  const addDoctor = async (formData) => {
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
    if (!token) return;
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
    if (!token) return;
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
    if (!token) return;
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
  }, [token, user?.role]);

  return (
    <DoctorContext.Provider value={{ doctors, addDoctor, updateDoctor, removeDoctor, toggleStatus, fetchDoctors }}>
      {children}
    </DoctorContext.Provider>
  );
};
