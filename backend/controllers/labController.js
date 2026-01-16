import * as Lab from "../models/LabTestModel.js";

// GET /api/lab/tests
export const getTests = async (req, res) => {
  try {
    const tests = await Lab.getAllTests();
    res.json(tests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// POST /api/lab/tests
// POST /api/lab/tests
export const createTest = async (req, res) => {
  try {
    const { test_name, description, normal_range, price, category } = req.body;

    if (!test_name || !price || !category) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    await Lab.addTest(test_name, description, normal_range, price, category);
    res.status(201).json({ message: "Test added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// PUT /api/lab/:id/perform
export const performLabTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { result } = req.body;
    await Lab.performTest(id, result);
    res.json({ message: "Test performed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// PUT /api/lab/:id/medication
export const addMedication = async (req, res) => {
  try {
    const { id } = req.params;
    const { medication } = req.body;
    await Lab.giveMedication(id, medication);
    res.json({ message: "Medication added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
