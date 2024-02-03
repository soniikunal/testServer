import { Schema, model } from "mongoose";

const RolesSchema = new Schema({
  name: {
    type: String,
    // required: true,
    // unique: true,
  },
  permissions: {
    type: [{ type: Schema.Types.Mixed, ref: "Permissions" }],
  },
});

export default model("Roles", RolesSchema);
