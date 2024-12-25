import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { Alumni } from "../models/alumniSchema.js"
const handleAlumniSignup = async (req, res) => {
    try {
        const { name, password, email } = req.body;
        if (!name, !email, !password) {
            return res.json({ status: "Failed", msg: "All fields are required" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const alumniUser = await Alumni.create({
            name: name,
            email: email,
            password: hashedPassword,
        })

        const { _id } = alumniUser

        if (alumniUser) {
            const token = jwt.sign({ _id, name }, process.env.JWT_SECRET, {
                expiresIn: "30d",
            });
            return res.json({ msg: "successfully sugn up", token: token });
        }
    } catch (error) {
        res.json({ err: error.message });
    }
}

export {
    handleAlumniSignup
}