import { Schema, model } from "mongoose";

const categorySchema = new Schema({
    name: {
        type:String,
        // unique: true,
        // required:true
    },
    heads: {
        type:[{ type: Schema.Types.ObjectId, ref: 'User' }],
         // unique: true,
        // required:true
    }
})

export default model("Category", categorySchema)