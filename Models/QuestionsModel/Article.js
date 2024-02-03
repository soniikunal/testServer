import { Schema, model } from "mongoose";
import { generateUniqueCode } from "../../Middlewares/middle.js";

const ArticleSchema = new Schema({
  name: {
    type: String,
    // required: true,
    // unique:true
  },
  uniqueCode: {
    type: String,
    default: generateUniqueCode,
    unique: true,
  },
  category: {
    type: String,
    // required: true,
    // unique:true
  },
  paragraph: {
    type: String,
    // required: true,
    // unique:true
  },
  queArray: [
    {
      question: {
        type: String,
        // required: true,
        // unique:true
      },
      options: {
        type: [
          {
            type: String,
          },
        ],
        required: true,
        validate: {
          validator: function (v) {
            return v.length <= 5;
          },
          message: (props) =>
            `${props.value} exceeds the maximum limit of 5 options!`,
        },
      },
      correctAnswer: {
        type: String,
        // required: true
      },
    },
  ],
});

export default model("Article", ArticleSchema);
