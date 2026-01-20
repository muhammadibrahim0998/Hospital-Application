import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

/**
 * Create Lab Context
 * This context is responsible for:
 * - Fetching lab tests from backend
 * - Adding new lab tests
 * - Performing lab tests (adding result)
 * - Giving medication after test is done
 */
const LabContext = createContext();

/**
 * Custom hook to use Lab Context
 */
export const useLab = () => useContext(LabContext);

/**
 * Backend base URL
 * Backend is running on port 3002
 */
const API_URL = "http://localhost:3002/api/lab";

export const LabProvider = ({ children }) => {
  /**
   * tests state
   * This will store all records from `lab_tests` table
   */
  const [tests, setTests] = useState([]);

  /**
   * 🔹 Fetch all lab tests from backend
   * GET /api/lab/tests
   */
  const fetchTests = async () => {
    try {
      const res = await axios.get(`${API_URL}/tests`);

      /**
       * Backend returns fields like:
       * id, test_name, description, normal_range,
       * price, category, status, result, medicationGiven
       */
      setTests(res.data);
    } catch (error) {
      console.error("Failed to fetch lab tests", error);
    }
  };

  /**
   * 🔹 Add new lab test
   * POST /api/lab/tests
   *
   * data example:
   * {
   *   test_name: "Blood Sugar",
   *   description: "...",
   *   normal_range: "70-100",
   *   price: 30,
   *   category: "Biochemistry"
   * }
   */
  const addTest = async (data) => {
    try {
      await axios.post(`${API_URL}/tests`, data);
      fetchTests(); // refresh list after insert
    } catch (error) {
      console.error("Failed to add test", error);
    }
  };

  /**
   * 🔹 Perform lab test (add result & mark done)
   * PUT /api/lab/tests/:id/perform
   *
   * body:
   * { result: "Positive / Negative / Value" }
   */
  const performTest = async (id, result) => {
    try {
      await axios.put(`${API_URL}/tests/${id}/perform`, { result });
      fetchTests(); // refresh list after update
    } catch (error) {
      console.error("Failed to perform test", error);
    }
  };

  /**
   * 🔹 Give medication after test is done
   * PUT /api/lab/tests/:id/medication
   *
   * body:
   * { medication: "Paracetamol 500mg" }
   */
  const giveMedication = async (id, medication) => {
    try {
      await axios.put(`${API_URL}/tests/${id}/medication`, { medication });
      fetchTests(); // refresh list after update
    } catch (error) {
      console.error("Failed to give medication", error);
    }
  };

  /**
   * 🔹 Load lab tests when app starts
   */
  useEffect(() => {
    fetchTests();
  }, []);

  return (
    <LabContext.Provider
      value={{
        tests, // all lab tests from DB
        addTest, // doctor adds test
        performTest, // lab performs test
        giveMedication, // doctor gives medication
      }}
    >
      {children}
    </LabContext.Provider>
  );
};
