import mongoose from 'mongoose';

const allEmailSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    role: { type: String, default: null }
}, { timestamps: true });

export const AllEmail = mongoose.model('AllEmail', allEmailSchema);