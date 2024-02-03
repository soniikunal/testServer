import mongoose from "mongoose";
import ATDQuestionsSchema from "../Models/QuestionsModel/ATDQuestionSchema.js";
import ATDAnswerSchema from "../Models/AnswerModal/ATDAnswerSchema.js";
import { SaveResult } from "./TestMiddle.js";

export const assignUserQuestions = async (req, res) => {
  try {
    const userId = req.user.id;
    const existingUser = await ATDAnswerSchema.findOne({ userId });

    if (existingUser) {
      if (existingUser._doc.isSubmitted === true) {
        return res.status(203).json({
          message: "You have already submitted the ATD Test!",
        });
      }
      return res.status(200).json({
        message: "Your test is already in progress",
        user: existingUser,
      });
    }

    // Fetch 10 random questions
    const randomQuestions = await ATDQuestionsSchema.aggregate([
      { $sample: { size: 10 } },
      {
        $addFields: {
          selectedOption: null,
        },
      },
      {
        $project: {
          correctOpt: 0, // Exclude the correctOpt field
        },
      },
    ]);

    // Create a new user with assigned questions
    const newUser = await ATDAnswerSchema.create({
      userId: userId,
      assignedQuestions: randomQuestions,
    });

    return res
      .status(201)
      .json({ message: "Your test is ready!", user: newUser });
  } catch (error) {
    console.error("Error assigning questions:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserQuestion = async (req, res) => {
  try {
    const identifier = req.user.id;
    const { questionId, selectedAnswer, remainingTime } = req.body;

    // Validate if questionId and selectedAnswer are present in the request body
    if (!questionId) {
      return res.status(400).json({
        message:
          "Both questionId and selectedAnswer are required in the request body",
      });
    }

    // Find and update the record based on userId or _id
    let updateATDAnswer;
    if (identifier) {
      // If identifier is a valid ObjectId, assume it's _id
      updateATDAnswer = await ATDAnswerSchema.findOneAndUpdate(
        { userId: identifier, "assignedQuestions._id": questionId },
        {
          $set: {
            "assignedQuestions.$[elem].selectedAnswer": selectedAnswer,
            remainingTime,
          },
        },
        { arrayFilters: [{ "elem._id": questionId }], new: true }
      );
    }

    if (!updateATDAnswer) {
      return res
        .status(404)
        .json({ success: false, message: "ATD Answers not found" });
    }
    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const calATDResult = async (req, res) => {
  try {
    const userId = req.user.id;

    const userAnswers = await ATDAnswerSchema.findOne({ userId }).lean();

    if (!userAnswers) {
      return res.status(404).json({ message: "User answers not found" });
    }

    const finalResult = await calculateResult(userAnswers);
    if (finalResult >= 0) {
      const setIsSubmitted = await ATDAnswerSchema.findOneAndUpdate(
        { userId },
        {
          $set: { isSubmitted: true },
        }
      );
      if (setIsSubmitted) {
        const savedResult = SaveResult(userId, finalResult, "ATD");
      }
    }

    res
      .status(200)
      .json({ success: true, message: "Submitted!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const calculateResult = async (userAnswers) => {
  const userObjects = userAnswers.assignedQuestions.map(
    ({ _id, selectedAnswer }) => ({ _id, selectedAnswer })
  );

  let score = 0;

  // Iterate over userResponses
  for (const userResponse of userObjects) {
    const { _id, selectedAnswer } = userResponse;

    // Retrieve the question from the database based on _id
    const question = await ATDQuestionsSchema.findById(_id);

    if (question) {
      // Check if the selected option is correct
      if (selectedAnswer == question.correctOpt) {
        score++;
      }
    }
  }

  return score;
};
