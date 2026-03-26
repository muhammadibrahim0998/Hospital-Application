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
    const role = user?.role?.toLowerCase();
    const isAdminRole = ['admin', 'hospital_admin', 'super_admin', 'doctor', 'lab_technician'].includes(role);

    try {
      // For Admins/Staff: Use the protected admin endpoint with headers
      if (token && isAdminRole) {
        const res = await axios.get(`${API_BASE_URL}/api/admin/doctors`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDoctors(res.data || []);
      } else {
        // For Patients/Guests: Always use the public endpoint WITHOUT headers
        // This avoids 403s if a token is present but invalid/expired
        const res = await axios.get(`${API_BASE_URL}/api/patient/doctors`);
        setDoctors(res.data || []);
      }
    } catch (err) {
      console.error("Fetch doctors error:", err);
      // Fallback: If admin call failed, try public one as Last Resort
      if (isAdminRole) {
        try {
          const res = await axios.get(`${API_BASE_URL}/api/patient/doctors`);
          setDoctors(res.data || []);
        } catch (fallbackErr) {
          console.error("Critical doctor fetch failure:", fallbackErr);
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
