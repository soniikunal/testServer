import express from "express";
import TestScoreSchema from "../../Models/AnswerModal/TestScoreSchema.js";

const router = express.Router();
const pageSize = 10; // Adjust the page size as needed

router.get("/getUsers", async (req, res) => {
  try {
    // Parse the page number from the request query or use 1 as default
    // const page = parseInt(req.query.page) || 1;
    // // Calculate the skip value based on the page size and current page
    // const skip = (page - 1) * pageSize;

    // Set up default date filter for today
    const defaultStartDate = new Date();
    defaultStartDate.setHours(0, 0, 0, 0);

    const defaultEndDate = new Date();
    defaultEndDate.setHours(23, 59, 59, 999);
    // Extract start and end dates from the request query or use default
    const startDate =
      req.query.startDate !== "null" && req.query.endDate !== "undefined"
        ? new Date(req.query.startDate).setHours(0, 0, 0, 0)
        : defaultStartDate;
    const endDate =
      req.query.endDate !== "null" && req.query.endDate !== "undefined"
        ? new Date(req.query.endDate).setHours(23, 59, 59, 999)
        : defaultEndDate;

    // Extract userId from the request query if provided
    const userId = req.query.userId;

    let userScoresQuery = {
      createdAt: { $gte: startDate, $lte: endDate },
    };

    if (userId) {
      const regexQuery = new RegExp(userId, "i");
      // { userId: { $regex: regexQuery } }
      userScoresQuery.userId = { $regex: regexQuery };
    }

    // const userScores = await TestScoreSchema.find(userScoresQuery)
    //   .aggregate([
    //     {
    //       $lookup: {
    //         from: "applicants",
    //         localField: "userId",
    //         foreignField: "AppID",
    //         as: "applicantData",
    //       },
    //     },
    //   ])
    //   .lean();

    const userScores = await TestScoreSchema.find(userScoresQuery).lean().exec();
    
    const aggregatedUserScores = await TestScoreSchema.aggregate([
      {
        $match: userScoresQuery,
      },
      {
        $lookup: {
          from: "applicants",
          localField: "userId",
          foreignField: "AppID",
          as: "applicantData",
        },
      },
    ]).exec();

    if (!aggregatedUserScores || aggregatedUserScores.length === 0) {
      return res
        .status(200)
        .json({ message: "No data found for the given filters" });
    }

    res.status(200).json(aggregatedUserScores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export { router as TestScoreRoutes };
