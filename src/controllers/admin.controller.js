import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { Admin } from "../models/adminSchema.js"
import { Alumni } from "../models/alumniSchema.js";
import { Student } from "../models/studentSchema.js";

const handleAdminSignUp = async (req, res) => {
    try {
        const { department, email, password } = req.body;
        if (!email || !password || !department) {
            return res.json({ status: "Failed", msg: "All fields are required" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const adminUser = await Admin.create({
            email: email,
            password: hashedPassword,
            department: department,
        });

        if (adminUser) {
            const { _id, department } = adminUser;
            const token = jwt.sign({ _id, department, email }, process.env.JWT_SECRET, {
                expiresIn: "30d",
            });
            return res.json({ msg: "successfully sign up", token: token });
        } else {
            return res.json({ status: "Failed", msg: "Admin user creation failed" });
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

const handleAdminHomePage = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(" ")[1];
        const verify = jwt.verify(token, process.env.JWT_SECRET);
        const { _id, department } = verify;
        const alumni = await Alumni.find({ department: department });
        const students = await Student.find({ department: department });
        res.json({ alumni, students });
    } catch (error) {
        res.json({ err: error.message });
    }
}

const deleteAlumni = async (req, res) => {
    try {
        const { id } = req.params;
        const alumni = await Alumni.findByIdAndDelete(id);
        if (!alumni) {
            return res.status(404).json({ msg: "Alumni not found" });
        }
        res.json({ msg: "Alumni successfully deleted", alumni });
    } catch (error) {
        res.json({ err: error.message });
    }
}

const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findByIdAndDelete(id);
        if (!student) {
            return res.status(404).json({ msg: "Student not found" });
        }
        res.json({ msg: "Student successfully deleted", student });
    } catch (error) {
        res.json({ err: error.message });
    }
}

const updateAlumni = async (req, res) => {
    try {
        const { id } = req.params;
        const alumni = await Alumni.findByIdAndUpdate(id, req.body, { new: true });
        if (!alumni) {
            return res.status(404).json({ msg: "Alumni not found" });
        }
        res.json({ msg: "Alumni successfully updated", alumni });
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
}

const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findByIdAndUpdate(id, req.body, { new: true });
        if (!student) {
            return res.status(404).json({ msg: "Student not found" });
        }
        res.json({ msg: "Student successfully updated", student });
    } catch (error) {
        res.status(500).json({ err: error.message });
    }

}
export {
    handleAdminSignUp,
    handleAdminLogin,
    handleAdminHomePage,
    deleteAlumni,
    deleteStudent,
    updateAlumni,
    updateStudent
}