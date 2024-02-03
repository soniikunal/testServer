import { Schema, model } from "mongoose";
import { generateUniqueCode } from "../../Middlewares/middle.js";

const ATDQuestionsSchema = new Schema({
  question: {
    type: String,
    // required:true
  },
  uniqueCode: {
    type: String,
    default: generateUniqueCode,
    unique: true,
  },
  options: {
    type: [
      {
        type: String,
      },
    ],
    // required: true,
    validate: {
      validator: function (v) {
        return v.length <= 5;
      },
      message: (props) =>
        `${props.value} exceeds the maximum limit of 5 options!`,
    },
  },
  correctOpt: {
    type: String,
    // required: true
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
});

export default model("ATDQuestion", ATDQuestionsSchema);