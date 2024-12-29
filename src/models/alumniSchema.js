import mongoose from "mongoose";

const alumniSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    fathername: {
        type: String,
        required: true
    },
    cnic: {
        type: Number,
        required: true,
        unique: true
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    rollno: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phoneNumber: {
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
    department: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    role: {
        type: String,
        default: "alumni"
    }
}, { timestamps: true })

export const Alumni = mongoose.model("alumni", alumniSchema);
// module.exports = Alumni;