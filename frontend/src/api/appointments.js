import axios from "axios";

export const bookAppointmentAPI = (data, token) => {
  return axios.post("http://localhost:3002/api/appointments", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getAppointmentsAPI = (token) => {
  return axios.get("http://localhost:3002/api/appointments", {
    headers: { Authorization: `Bearer ${token}` },
  });
};
