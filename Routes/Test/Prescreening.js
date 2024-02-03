import express from "express";
const router = express.Router();

import {
  assignUserQuestions,
  updateUserQuestion,
  calPrescreenResult,
} from "../../Middlewares/PrescreeningMiddle.js";

router.get("/test", async (req, res) => {
  try {
    await assignUserQuestions( req, res);
  } catch (error) {
    res.status(401).json(error);
  }
});

router.put("/updateSelectedAnswers", async (req, res) => {
  await updateUserQuestion(req, res);
});

router.post("/calculatePre", async (req, res) => {
  await calPrescreenResult(req, res);
});

export { router as PrescreeningTestRoutes };