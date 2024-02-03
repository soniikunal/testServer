import { Schema, model } from "mongoose";

const TestScoreSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    Prescreening: {
      type: Number,
      default: null,
    },
    ATD: {
      type: Number,
      default: null,
    },
    TypingTest: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default model("TestScore", TestScoreSchema);
