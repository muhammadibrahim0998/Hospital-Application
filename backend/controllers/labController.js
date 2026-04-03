import { LabTest } from "../models/LabTestModel.js";

export const getTests = async (req, res) => {
  try {
    const { cnic } = req.query;
    let tests = cnic ? await LabTest.find({ cnic: cnic }) : await LabTest.find();
    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const createTest = async (req, res) => {
  try {
    const { patient_name, cnic, test_name, description, normal_range, price, category } = req.body;
    if (!patient_name || !cnic || !test_name || !price || !category) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }
    await LabTest.create({ patient_name, cnic, test_name, description, normal_range, price, category });
    res.status(201).json({ message: "Test added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const performLabTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { result } = req.body;
    await LabTest.findByIdAndUpdate(id, { status: 'done', result: result });
    res.json({ message: "Test performed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const addMedication = async (req, res) => {
  try {
    const { id } = req.params;
    const { medication } = req.body;
    const existing = await LabTest.findById(id);
    if (!existing) return res.status(404).json({ message: "Test not found" });

    let meds = existing.medicationGiven ? existing.medicationGiven.split(", ") : [];
    meds.push(medication);
    await LabTest.findByIdAndUpdate(id, { medicationGiven: meds.join(", ") });
    res.json({ message: "Medication added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
