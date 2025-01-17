import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true
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
    department: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        default: "admin"
    }
}, { timestamps: true })

export const Admin = mongoose.model("admin", adminSchema)

