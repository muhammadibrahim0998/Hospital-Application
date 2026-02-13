import React, { createContext, useContext, useState } from "react";
import { API_BASE_URL } from "../config";

const AppointmentContext = createContext();

export function AppointmentProvider({ children }) {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/appointments`);
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.log("Fetch Error:", err);
    }
  };

  const bookAppointment = async (appointment) => {
    try {
      await fetch(`${API_BASE_URL}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointment),
      });
      fetchAppointments();
    } catch (err) {
      console.log("Book Error:", err);
    }
  };

  const deleteAppointment = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/appointments/${id}`, {
        method: "DELETE",
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
