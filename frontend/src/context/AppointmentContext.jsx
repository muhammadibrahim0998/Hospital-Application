import React, { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { AuthContext } from "./AuthContext";

const AppointmentContext = createContext();

export function AppointmentProvider({ children }) {
  const [appointments, setAppointments] = useState([]);
  const { token } = useContext(AuthContext);

  const fetchAppointments = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setAppointments(data);
      } else {
        setAppointments([]);
      }
    } catch (err) {
      console.log("Fetch Error:", err);
      setAppointments([]);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [token]);

  const bookAppointment = async (appointment) => {
    if (!token) return;
    try {
      await fetch(`${API_BASE_URL}/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(appointment),
      });
      fetchAppointments();
    } catch (err) {
      console.log("Book Error:", err);
    }
  };

  const deleteAppointment = async (id) => {
    if (!token) return;
    try {
      await fetch(`${API_BASE_URL}/api/appointments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.log("Delete Error:", err);
    }
  };

  const updateAppointment = (id, updatedData) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updatedData } : a)),
    );
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        fetchAppointments,
        bookAppointment,
        deleteAppointment,
        updateAppointment,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}

export const useAppointments = () => useContext(AppointmentContext);
