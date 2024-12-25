import mongoose from "mongoose";

const aluminiSchema = new mongoose.Schema({
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
        default: "alumini"
    }
},{ timestamps: true })

const Alumini = mongoose.model("alumini", aluminiSchema);

module.exports = Alumini;