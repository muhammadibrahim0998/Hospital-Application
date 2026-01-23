import axios from "axios";
import { API_BASE_URL } from "../config";

const API = `${API_BASE_URL}/api/lab`;

export const fetchTests = () => axios.get(`${API}/tests`);
export const addTest = (data) => axios.post(`${API}/tests`, data);
export const performTest = (id, result) =>
  axios.put(`${API}/tests/${id}/perform`, { result });
export const giveMedication = (id, medication) =>
  axios.put(`${API}/tests/${id}/medication`, { medication });
