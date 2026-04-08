import React, { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { AuthContext } from "./AuthContext";

const AppointmentContext = createContext();

export function AppointmentProvider({ children }) {
  const [appointments, setAppointments] = useState(() => {
    // Immediate restoration for guest users on page load/refresh
    const saved = localStorage.getItem("guest_appointments");
    return saved ? JSON.parse(saved) : [];
  });
  const { token } = useContext(AuthContext);

  const fetchAppointments = async () => {
    if (!token) {
      // Re-sync with local storage to capture any changes from other tabs/modals
      const guestAppts = JSON.parse(localStorage.getItem("guest_appointments") || "[]");
      setAppointments(guestAppts);
      return;
    }
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
    try {
      const res = await fetch(`${API_BASE_URL}/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(appointment),
      });

      // If guest, save their info locally so they can see their own appointments
      if (!token) {
        const data = await res.json();
        const guestAppts = JSON.parse(localStorage.getItem("guest_appointments") || "[]");
        // Use the ID from the server if available, otherwise use Date.now()
        const apptWithId = { ...appointment, _id: data.id || data._id || Date.now() };
        guestAppts.push(apptWithId);
        localStorage.setItem("guest_appointments", JSON.stringify(guestAppts));
        // Save guest name for dynamic display
        localStorage.setItem("guest_patient_name", appointment.Patient);
      }

      fetchAppointments();
      return true;
    } catch (err) {
      console.log("Book Error:", err);
      return false;
    }
  };

  const updateAppointment = async (id, updatedData) => {
    try {
      await fetch(`${API_BASE_URL}/api/appointments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(updatedData),
      });

      // Update local state - handle both id and _id for compatibility
      setAppointments((prev) =>
        prev.map((a) => (a.id === id || a._id === id ? { ...a, ...updatedData } : a))
      );

      // If guest, sync local storage
      if (!token) {
        const guestAppts = JSON.parse(localStorage.getItem("guest_appointments") || "[]");
        const updatedGuestAppts = guestAppts.map(a => (a.id === id || a._id === id ? { ...a, ...updatedData } : a));
        localStorage.setItem("guest_appointments", JSON.stringify(updatedGuestAppts));

        if (updatedData.Patient) {
          localStorage.setItem("guest_patient_name", updatedData.Patient);
          window.dispatchEvent(new Event("storage"));
        }
      }
      return true;
    } catch (err) {
      console.log("Update Error:", err);
      return false;
    }
  };

  const deleteAppointment = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/appointments/${id}`, {
        method: "DELETE",
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      });

      // Update local state
      setAppointments((prev) => prev.filter((a) => a.id !== id && a._id !== id));

      // If guest, sync local storage
      if (!token) {
        const guestAppts = JSON.parse(localStorage.getItem("guest_appointments") || "[]");
        const updatedGuestAppts = guestAppts.filter(a => a.id !== id && a._id !== id);
        localStorage.setItem("guest_appointments", JSON.stringify(updatedGuestAppts));
      }
    } catch (err) {
      console.log("Delete Error:", err);
    }
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
