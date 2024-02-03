import TestScoreSchema from "../Models/AnswerModal/TestScoreSchema.js";

export const SaveResult = async (userId, score, FieldName, res) => {
  try {
    const userRecord = await TestScoreSchema.findOne({ userId });
    if (userRecord) {
      const result = await TestScoreSchema.findOneAndUpdate(
        { userId },
        {
          $set: { [FieldName]: score },
        }
      ).lean();
      return result;
    } else {
      throw "User's Test record not created"
    }
  } catch (error) {
    return error
  }
};
