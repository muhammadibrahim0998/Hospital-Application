import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const LabContext = createContext();

export function LabProvider({ children }) {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchTests = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/lab/tests`, { headers });
      setTests(res.data || []);
    } catch (err) {
      console.error("Error fetching lab tests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchTests();
  }, [token]);

  const addTest = async (testData) => {
    try {
      await axios.post(`${API_BASE_URL}/api/lab/tests`, testData, { headers });
      fetchTests(); // Refresh
    } catch (err) {
      console.error("Error adding lab test:", err);
      throw err;
    }
  };

  const performTest = async (id, result) => {
    try {
      await axios.put(`${API_BASE_URL}/api/lab/tests/${id}/perform`, { result }, { headers });
      fetchTests(); // Refresh
    } catch (err) {
      console.error("Error performing lab test:", err);
    }
  };

  return (
    <LabContext.Provider value={{ tests, addTest, performTest, loading, fetchTests }}>
      {children}
    </LabContext.Provider>
  );
}

export const useLab = () => useContext(LabContext);
