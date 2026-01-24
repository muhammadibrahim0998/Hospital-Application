import axios from "axios";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api/auth`;

// Register user
export const registerUser = (formData) => {
  return axios.post(`${API_URL}/register`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Login user
export const loginUser = (data) => {
  return axios.post(`${API_URL}/login`, data);
};

// Get profile
export const getProfile = (token) => {
  return axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
