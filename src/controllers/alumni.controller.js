import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { Alumni } from "../models/alumniSchema.js"
const handleAlumniSignup = async (req, res) => {
    try {
        const { fullname, fathername, cnic, dateOfBirth, rollno, address, password, phoneNumber, email } = req.body;
        if (!fullname,
            !email,
            !password,
            !fathername,
            !cnic,
            !dateOfBirth,
            !rollno,
            !address,
            !phoneNumber) {
            return res.json({ status: "Failed", msg: "All fields are required" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const alumniUser = await Alumni.create({
            fullname: fullname,
            fathername: fathername,
            cnic: cnic,
            phoneNumber: phoneNumber,
            dateOfBirth: dateOfBirth,
            rollno: rollno,
            address: address,
            email: email,
            password: hashedPassword,
        })

        const { _id } = alumniUser

        if (alumniUser) {
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
    handleAlumniSignup
}