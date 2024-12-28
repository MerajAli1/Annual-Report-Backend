import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { Student } from "../models/studentSchema.js"
const handleStudentSignup = async (req, res) => {
    try {
        const { fullname, fathername, cnic, dateOfBirth, rollno, address, password, phoneNumber, email, department } = req.body;
        if (!fullname,
            !email,
            !password,
            !fathername,
            !cnic,
            !dateOfBirth,
            !rollno,
            !address,
            !phoneNumber,
            !department) {
            return res.json({ status: "Failed", msg: "All fields are required" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const studentUser = await Student.create({
            fullname: fullname,
            fathername: fathername,
            cnic: cnic,
            phoneNumber: phoneNumber,
            dateOfBirth: dateOfBirth,
            rollno: rollno,
            address: address,
            email: email,
            password: hashedPassword,
            department: department
        })

        const { _id } = studentUser

        if (studentUser) {
            const token = jwt.sign({ _id, fullname }, process.env.JWT_SECRET, {
                expiresIn: "30d",
            });
            return res.json({ msg: "successfully sign up", token: token });
        }
    } catch (error) {
        res.json({ err: error.message });
    }
}

export {
    handleStudentSignup
}