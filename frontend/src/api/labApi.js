import axios from "axios";
const API = "http://localhost:3002/api/lab";

export const performTest = (id, result) =>
  axios.put(`${API}/tests/${id}/perform`, {
    result,
    lab_assistant_id: 1,
  });

export const fetchReports = () => axios.get(`${API}/reports`);
