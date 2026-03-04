import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { AuthContext } from "./AuthContext";

const LabContext = createContext();

export function LabProvider({ children }) {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  const fetchTests = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/lab/tests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTests(res.data || []);
    } catch (err) {
      console.error("Error fetching lab tests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, [token]);

  const addTest = async (testData) => {
    if (!token) return;
    try {
      await axios.post(`${API_BASE_URL}/api/lab/tests`, testData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTests();
    } catch (err) {
      console.error("Error adding lab test:", err);
      throw err;
    }
  };

  const performTest = async (id, result) => {
    if (!token) return;
    try {
      await axios.put(`${API_BASE_URL}/api/lab/tests/${id}/perform`, { result }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTests();
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
