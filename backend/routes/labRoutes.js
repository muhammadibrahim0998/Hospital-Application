import express from "express";
import {
  getTests,
  createTest,
  performLabTest,
  addMedication,
} from "../controllers/labController.js";

const router = express.Router();

router.get("/tests", getTests); // GET all or by CNIC
router.post("/tests", createTest); // CREATE test
router.put("/tests/:id/perform", performLabTest); // UPDATE result
router.put("/tests/:id/medication", addMedication); // UPDATE medication

export default router;
