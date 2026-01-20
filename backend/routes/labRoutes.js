import express from "express";
import {
  getTests,
  createTest,
  assignTestCNIC,
  getPatientTests,
  performLabTest,
  addMedication,
} from "../controllers/labController.js";

const router = express.Router();

router.get("/tests", getTests);
router.post("/tests", createTest);

router.post("/assign", assignTestCNIC);
router.get("/patient/:cnic", getPatientTests);

router.put("/perform/:id", performLabTest);
router.put("/medication/:id", addMedication);

export default router;
