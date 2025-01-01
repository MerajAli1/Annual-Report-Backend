import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    password: { type: String, required: true },
    otp: { type: String },
    role: { type: String },
    verification: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export { User };