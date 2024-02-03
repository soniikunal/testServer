import express from "express";
const router = express.Router();
import ATDQuestionSchema from "../../../Models/QuestionsModel/ATDQuestionSchema.js";
import ATDAnswerSchema from "../../../Models/AnswerModal/ATDAnswerSchema.js";

import {
  handleServerError,
  handleNotFound,
} from "../../../Middlewares/middle.js";
import { multerConfig } from "../../../Middlewares/imageUpload.js";

router.get("/getQuestions", async (req, res) => {
  try {
    const searchQuery = req.query.search;
    let allQuestions;
    if (searchQuery) {
      const regexQuery = new RegExp(searchQuery, "i");
      allQuestions = await ATDQuestionSchema.find({
        $or: [
          { category: { $regex: regexQuery } },
          { uniqueCode: { $regex: regexQuery } },
          { question: { $regex: regexQuery } },
        ],
      });
    } else {
      allQuestions = await ATDQuestionSchema.find();
    }

    if (!allQuestions) {
      return handleNotFound(res, "Question not found");
    }
    res.status(200).json(allQuestions);
  } catch (error) {}
});

router.post("/addQuestion", multerConfig, async (req, res) => {
  const newQuestion = new ATDQuestionSchema({
    question: req.body.question,
    options: req.body.options,
    correctOpt: req.body.correctOpt,
    category: req.body.category,
  });

  try {
    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    handleServerError(res, error);
  }
});

router.put("/updateQuestion/:id", multerConfig, async (req, res) => {
  const id = req.params.id;

  try {
    const updatedQuestions = await ATDQuestionSchema.findByIdAndUpdate(
      id,
      {
        $set: {
          question: req.body.question,
          options: req.body.options,
          correctOpt: req.body.correctOpt,
          category: req.body.category,
        },
      },
      { new: true }
    ).exec();

    if (!updatedQuestions) {
      return handleNotFound(res, "Question not found");
    }

    res
      .status(201)
      .json({ message: "Question Edited Successfully!", updatedQuestions });
  } catch (error) {
    handleServerError(res, error);
  }
});

router.delete("/delQuestion/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const deletedQuestion = await ATDQuestionSchema.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Use status code 200 for successful deletion
    res
      .status(200)
      .json({ message: "Question deleted successfully", deletedQuestion });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/submitTest", async (req, res) => {
  try {
    const submittedData = new ATDAnswerSchema({
      userId: req.body.userId,
      attemptedQuestions: req.body.attemptedQuestions,
      remainingTime: req.body.remainingTime,
    });
    const savedData = await submittedData.save();
    res.status(201).json({ success: true, savedData });
  } catch (error) {
    handleServerError(res, error);
  }
});

router.get("/calculateScore/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const userSubmitData = await ATDAnswerSchema.find({ userId });
    const attemptedQuestions = userSubmitData.attemptedQuestions();
    const questions = await QuestionModel.find({
      _id: { $in: attemptedQuestions.map((id) => mongoose.Types.ObjectId(id)) },
    });
    console.log(userSubmitData.userId, userSubmitData.attemptedQuestions);
  } catch (error) {}
});

export { router as ATDQuestionRoutes };
