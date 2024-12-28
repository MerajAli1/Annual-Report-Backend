import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { Admin } from "../models/adminSchema.js"

const handleAdminSignUp = async (req, res) => {
    try {
        const { department, email, password } = req.body;
        if (!email, !password, !department) {
            return res.json({ status: "Failed", msg: "All fields are required" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const adminUser = await Admin.create({
            email: email,
            password: hashedPassword,
            department: department,
        });


        if (adminUser) {
            const { _id, department } = adminUser
            const token = jwt.sign({ _id, department, email }, process.env.JWT_SECRET, {
                expiresIn: "30d",
            });
            return res.json({ msg: "successfully sign up", token: token });
        }
    } catch (error) {
        res.json({ err: error.message });
    }
}

const handleAdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email, !password) {
            return res.json({ status: "Failed", msg: "All fields are required" })
        }
        const adminUser = await Admin.findOne({ email: email });
        if (!adminUser) {
            return res.json({ status: "Failed", msg: "User not found" })
        }
        const isMatch = await bcrypt.compare(password, adminUser.password);
        if (!isMatch) {
            return res.json({ status: "Failed", msg: "Invalid credentials" })
        }
        const { _id, department } = adminUser
        const token = jwt.sign({ _id, department, email }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });
        return res.json({ msg: "successfully login", token: token });
    } catch (error) {
        res.json({ err: error.message });
    }
}
export {
    handleAdminSignUp,
    handleAdminLogin
}