import mongoose from "mongoose";

const alumniSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "alumni"
    }
},{ timestamps: true })

export const Alumni = mongoose.model("alumni", alumniSchema);
// module.exports = Alumni;