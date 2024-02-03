import express from "express";
const router = express.Router();
import QuestionsSchema from "../../../Models/QuestionsModel/Question.js";
import { multerConfig } from "../../../Middlewares/imageUpload.js";
import {
  handleServerError,
  handleNotFound,
} from "../../../Middlewares/middle.js";
import { isAdmin } from "../../../Middlewares/RoleMiddleware.js";

router.get("/getQuestions", async (req, res) => {
  try {
    const searchQuery = req.query.search;
    let allQuestions;
    if (searchQuery) {
      const regexQuery = new RegExp(searchQuery, "i");
      allQuestions = await QuestionsSchema.find({
        $or: [
          { category: { $regex: regexQuery } },
          { uniqueCode: { $regex: regexQuery } },
          { question: { $regex: regexQuery } },
        ],
      });
    } else {
      allQuestions = await QuestionsSchema.find();
    }

    if (!allQuestions) {
      return handleNotFound(res, "Question not found");
    }
    res.status(201).json(allQuestions);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/addQuestion", multerConfig, async (req, res) => {
  const newQuestionData = {
    question: req.body.question,
    options: req.body.options,
    correctOpt: req.body.correctOpt,
    category: req.body.category,
  };
  if (req.file && req.file.filename) {
    newQuestionData.imgPath = `/uploads/${req.file.filename}`;
  }

  const newQuestion = new QuestionsSchema(newQuestionData);

  try {
    const savedQuestion = await newQuestion.save();
    res
      .status(201)
      .json({ message: "Question Added Successfully!", savedQuestion });
  } catch (error) {
    handleServerError(res, error);
  }
});

router.put("/updateQuestion/:id", multerConfig, async (req, res) => {
  const id = req.params.id;

  try {
    const updateData = {
      $set: {
        question: req.body.question,
        options: req.body.options,
        correctOpt: req.body.correctOpt,
        category: req.body.category,
      },
    };

    // Add imgPath conditionally
    if (req.file && req.file.filename) {
      updateData.$set.imgPath = `/uploads/${req.file.filename}`;
    }
    // } else {
    //   updateData.$set.imgPath = ``;
    //   updateData.$unset = { imgPath: 1 };
    // }

    const updatedQuestions = await QuestionsSchema.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).exec();

    if (!updatedQuestions) {
      return handleNotFound(res, "Question not found");
    }

    res
      .status(201)
      .json({ message: "Question Edited Successfully", updatedQuestions });
  } catch (error) {
    handleServerError(res, error);
  }
});

router.delete("/delQuestion/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const deletedQuestion = await QuestionsSchema.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Use status code 200 for successful deletion
    res
      .status(200)
      .json({ message: "Question Deleted Successfully", deletedQuestion });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export { router as questionRoutes };
