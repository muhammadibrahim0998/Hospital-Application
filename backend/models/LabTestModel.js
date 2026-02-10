import db from "../config/db.js";

// Get all tests or by CNIC
export const getAllTests = async () => {
  const [rows] = await db.query("SELECT * FROM lab_tests");
  return rows;
};

export const getTestsByCNIC = async (cnic) => {
  const [rows] = await db.query("SELECT * FROM lab_tests WHERE cnic=?", [cnic]);
  return rows;
};

// Add new test
export const addTest = async (
  patient_name,
  cnic,
  test_name,
  description,
  normal_range,
  price,
  category,
) => {
  const [result] = await db.query(
    `INSERT INTO lab_tests 
    (patient_name, cnic, test_name, description, normal_range, price, category, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
    [patient_name, cnic, test_name, description, normal_range, price, category],
  );
  return result;
};

// Perform test
export const performTest = async (id, result) => {
  const [res] = await db.query(
    "UPDATE lab_tests SET status='done', result=? WHERE id=?",
    [result, id],
  );
  return res;
};

// Give medication (support multiple meds)
export const giveMedication = async (id, medication) => {
  const [existing] = await db.query(
    "SELECT medicationGiven FROM lab_tests WHERE id=?",
    [id],
  );

  let meds = existing[0].medicationGiven
    ? existing[0].medicationGiven.split(", ")
    : [];
  meds.push(medication);

  const [res] = await db.query(
    "UPDATE lab_tests SET medicationGiven=? WHERE id=?",
    [meds.join(", "), id],
  );
  return res;
};
