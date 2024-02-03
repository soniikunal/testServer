import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      // required: true,
      // unique: true,
    },
    orgId: {
      type: String,
      // required: true,
      // unique: true,
    },
    email: {
      type: String,
      // required: true,
      // unique: true,
    },
    team: {
      // type: [{ type: Schema.Types.Mixed, ref: "Teams" }],
      // required:true
    },
    password: {
      type: String,
      // required: true,
    },
    Roles: {
      type: [{ type: Schema.Types.Mixed, ref: "Roles" }],
      // required:true
      // default: false, //Set default to VA
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default model("User", UserSchema);
