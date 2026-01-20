import React, { createContext, useContext, useState } from "react";

const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);

  // Fetch all appointments
  const fetchAppointments = async () => {
    const res = await fetch("http://localhost:3002/api/appointments");
    const data = await res.json();
    setAppointments(data);
  };

  // Delete an appointment
  const deleteAppointment = async (id) => {
    await fetch(`http://localhost:3002/api/appointments/${id}`, {
      method: "DELETE",
    });
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  // Update an appointment
  const updateAppointment = async (id, updatedData) => {
    await fetch(`http://localhost:3002/api/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updatedData } : a)),
    );
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        fetchAppointments,
        deleteAppointment,
        updateAppointment,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => useContext(AppointmentContext);
