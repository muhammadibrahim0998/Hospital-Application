import db from "../config/db.js";

// all tests (doctor view)
export const getAllTests = async () => {
  const [rows] = await db.query("SELECT * FROM lab_tests");
  return rows;
};

// add new test
export const addTest = async (data) => {
  const { test_name, description, normal_range, price, category } = data;
  const [res] = await db.query(
    `INSERT INTO lab_tests 
     (test_name, description, normal_range, price, category)
     VALUES (?,?,?,?,?)`,
    [test_name, description, normal_range, price, category]
  );
  return { id: res.insertId, ...data };
};

// assign test to patient by CNIC
export const assignTestByCNIC = async (cnic, lab_test_id) => {
  await db.query(
    "INSERT INTO lab_test_requests (cnic, lab_test_id) VALUES (?,?)",
    [cnic, lab_test_id]
  );
};

// get tests of patient by CNIC
export const getPatientTests = async (cnic) => {
  const [rows] = await db.query(
    `SELECT r.id, t.test_name, r.status, r.result, r.medicationGiven
     FROM lab_test_requests r
     JOIN lab_tests t ON t.id = r.lab_test_id
     WHERE r.cnic = ?
     ORDER BY r.created_at DESC`,
    [cnic]
  );
  return rows;
};

// perform test
export const performTest = async (id, result) => {
  await db.query(
    `UPDATE lab_test_requests 
     SET status='done', result=? 
     WHERE id=?`,
    [result, id]
  );
};

// give medication
export const giveMedication = async (id, medication) => {
  await db.query("UPDATE lab_test_requests SET medicationGiven=? WHERE id=?", [
    medication,
    id,
  ]);
};
