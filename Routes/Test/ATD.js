import express from "express";
const router = express.Router();
import { SaveResult } from "../../Middlewares/TestMiddle.js";
import {
  assignUserQuestions,
  updateUserQuestion,
  calATDResult,
} from "../../Middlewares/ATDMiddle.js";
import TestScoreSchema from "../../Models/AnswerModal/TestScoreSchema.js";

router.get("/test", async (req, res) => {
  try {
    await assignUserQuestions(req, res);
  } catch (error) {
    res.status(401).json(error);
  }
});

router.put("/updateSelectedAnswers", async (req, res) => {
  await updateUserQuestion(req, res);
});

router.post("/calculateATD", async (req, res) => {
  await calATDResult(req, res);
});

router.post("/typingscore", async (req, res) => {
  const userId = req.user.id;

  try {
    const { str } = req.body;
    if (userId) {
      const savedRecord = await SaveResult(userId, str, "TypingTest");
      res.status(200).json({ status: true, savedRecord });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/getTypingScore", async (req, res) => {
  const userId = req.user.id;
  try {
    if (userId) {
      const appearedCandidate = await TestScoreSchema.findOne({ userId });
      if (!appearedCandidate.TypingTest) {
        return res.status(200).json({ success: true });
      }
      res.status(200).json({ success: false });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

export { router as ATDTestRoutes };
