import { Schema, model } from "mongoose";
import { config } from "dotenv";

config();
const testDurationMinutes = process.env.TEST_DURATION_MINUTES || 45;

const PreScreeningSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  assignedQuestions: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
      options: {
        type: [
          {
            type: String,
          },
        ],
      },
      selectedAnswer: {
        type: Number,
        // required: true,
      },
      category: {
        type: String,
        // name: Schema.Types.ObjectId,
        // ref: "Category",
        // required:true
      },
      imgPath: {
        type: String,
        // data: Buffer,
        // contentType: String,
      },
      question: {
        type: String,
        // required:true
      },
      uniqueCode: {
        type: String,
      },
    },
  ],
  remainingTime: {
    type: String,
    required: true,
    default: `${testDurationMinutes * 60}`,
  },
  isSubmitted: {
    type: Boolean,
    default: false,
  },
});

export default model("PreScreeningAnswer", PreScreeningSchema);
