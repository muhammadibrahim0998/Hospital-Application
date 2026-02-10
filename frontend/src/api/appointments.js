import axios from "axios";
import { API_BASE_URL } from "../config";

export const bookAppointmentAPI = (data, token) => {
  return axios.post(`${API_BASE_URL}/api/appointments`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getAppointmentsAPI = (token) => {
  return axios.get(`${API_BASE_URL}/api/appointments`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
