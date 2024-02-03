import { Schema, model } from "mongoose";

const Teams = new Schema({
    name: {
        type:String,
        // unique: true,
        // required:true
    },
    heads: {
        type:[{ type: Schema.Types.Mixed, ref: 'User' }],
         // unique: true,
        // required:true
    }
})

export default model("Teams", Teams)