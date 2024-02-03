import { Schema, model } from "mongoose";

const RecruitUser = new Schema(
  {
    RegId: {
      type: String,
    //   unique: true,
    //   required: true,
    },
    Email: {
      type: String,
    //   required: true,
    //   unique: true,
    },
  },
  { timestamps: true }
);

export default model("RecruitUser", RecruitUser);
