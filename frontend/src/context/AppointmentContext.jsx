import React, { createContext, useContext, useState } from "react";

const AppointmentContext = createContext();

export function AppointmentProvider({ children }) {
  const [appointments, setAppointments] = useState([]);

  // GET all appointments (assume fetched from backend)
  const fetchAppointments = async () => {
    try {
      const res = await fetch("http://localhost:3002/api/appointments");
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.log("Fetch Error:", err);
    }
  };

  // POST / add new appointment
  const bookAppointment = async (appointment) => {
    try {
      await fetch("http://localhost:3002/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointment),
      });
      fetchAppointments();
    } catch (err) {
      console.log("Book Error:", err);
    }
  };

  // DELETE appointment
  const deleteAppointment = async (id) => {
    try {
      await fetch(`http://localhost:3002/api/appointments/${id}`, {
        method: "DELETE",
      });
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.log("Delete Error:", err);
    }
  };

  // ✅ FRONTEND-ONLY UPDATE (no backend call)
  const updateAppointment = (id, updatedData) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updatedData } : a))
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
