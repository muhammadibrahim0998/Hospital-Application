import db from "../config/db.js";

// Get all lab tests
export const getAllTests = async () => {
  const [rows] = await db.query("SELECT * FROM lab_tests");
  return rows;
};

// Add a new lab test
export const addTest = async (
  test_name,
  description,
  normal_range,
  price,
  category
) => {
  const [result] = await db.query(
    "INSERT INTO lab_tests (test_name, description, normal_range, price, category, status) VALUES (?, ?, ?, ?, ?, 'pending')",
    [test_name, description, normal_range, price, category]
  );
  return result;
};

// Perform a test (add result)
export const performTest = async (id, result) => {
  const [res] = await db.query(
    "UPDATE lab_tests SET status='done', result=? WHERE id=?",
    [result, id]
  );
  return res;
};

// Give medication
export const giveMedication = async (id, medication) => {
  const [res] = await db.query(
    "UPDATE lab_tests SET medicationGiven=? WHERE id=?",
    [medication, id]
  );
  return res;
};
