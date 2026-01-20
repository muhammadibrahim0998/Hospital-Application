import * as Lab from "../models/LabModel.js";

// doctor
export const getTests = async (req, res) => {
  res.json(await Lab.getAllTests());
};

export const createTest = async (req, res) => {
  const test = await Lab.addTest(req.body);
  res.status(201).json(test);
};

// patient
export const assignTestCNIC = async (req, res) => {
  const { cnic, lab_test_id } = req.body;
  if (!cnic) return res.status(400).json({ message: "CNIC required" });

  await Lab.assignTestByCNIC(cnic, lab_test_id);
  res.json({ message: "Test assigned" });
};

export const getPatientTests = async (req, res) => {
  const { cnic } = req.params;
  res.json(await Lab.getPatientTests(cnic));
};

// lab
export const performLabTest = async (req, res) => {
  await Lab.performTest(req.params.id, req.body.result);
  res.json({ message: "Test performed" });
};

export const addMedication = async (req, res) => {
  await Lab.giveMedication(req.params.id, req.body.medication);
  res.json({ message: "Medication added" });
};
