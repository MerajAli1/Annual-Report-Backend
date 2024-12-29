import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { Student } from "../models/studentSchema.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
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

        //Image Handling
        const imageLocalPath = req.files?.image[0]?.path;
        if (!imageLocalPath) {
            throw new ApiError(400, "meal_image is required...");
        }
        //upload on Cloudinary
        const image = await uploadOnCloudinary(imageLocalPath);
        if (!image) {
            throw new ApiError(400, "image field is required...");
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
            department: department,
            image: image,
        })

        const { _id } = studentUser

        if (studentUser) {
            const token = jwt.sign({ _id, fullname }, process.env.JWT_SECRET, {
                expiresIn: "30d",
            });
            return res.json({ msg: "Student successfully created", token: token });
        }
    } catch (error) {
        res.json({ err: error.message });
    }
}

export {
    handleStudentSignup
}