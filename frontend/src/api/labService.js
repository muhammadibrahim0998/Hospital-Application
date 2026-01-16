import axios from "axios";

const API = "http://localhost:3002/api/lab";

export const fetchTests = () => axios.get(`${API}/tests`);
export const addTest = (data) => axios.post(`${API}/tests`, data);
export const performTest = (id, result) =>
  axios.put(`${API}/tests/${id}/perform`, { result });
export const giveMedication = (id, medication) =>
  axios.put(`${API}/tests/${id}/medication`, { medication });
