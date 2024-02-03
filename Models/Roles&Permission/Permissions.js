import { Schema, model } from "mongoose";

const PermissionsSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  }
});

export default model("Permissions", PermissionsSchema)