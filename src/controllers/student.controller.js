import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer";
import { Student } from "../models/studentSchema.js"
import { AllEmail } from "../models/allEmailSchema.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import dotenv from "dotenv";
import { User } from "../models/userSchema.js";
// Load environment variables from .env file in the root directory
dotenv.config();

// Function to generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to send OTP via email
const sendOTPEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        secure: true,
        port: 465,
        auth: {
            user: "k11662275@gmail.com",
            pass: "iwqcordsfkrvtwaj",
        },
    });

    const mailOptions = {
        from: "k11662275@gmail.com",
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`
    };

    await transporter.sendMail(mailOptions);
};

// Signup controller
const studentSignup = async (req, res) => {
    const { email, department, password } = req.body;
    try {
        // Check if email exists in the AllEmail collection
        const emailExists = await AllEmail.findOne({ email });
        if (!emailExists) {
            return res.status(400).json({ message: "Email not found in our database" });
        }
        // Check if user already exists in the User collection
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (!existingUser.verification) {
                // Regenerate OTP and update in the database
                const otp = generateOTP();
                await sendOTPEmail(email, otp);
                existingUser.otp = otp;
                await existingUser.save();
                return res.status(200).json({ message: "OTP regenerated and sent to email. Please verify your email." });
            } else {
                return res.status(400).json({ message: "User already exists and is verified." });
            }
        }
        // Generate OTP and send to email
        const otp = generateOTP();
        await sendOTPEmail(email, otp);
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);
        // Save the student with hashed password and department
        const newUser = new User({ email, department, password: hashedPassword, otp, verification: false });
        await newUser.save();
        res.status(200).json({ message: "Signup successful, OTP sent to email" });
    } catch (error) {
        console.error("Error during signup:", error); // Log the error
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

//OTP verification
const verifyOTP = async (req, res) => {
    const { otp, email } = req.body;
    try {
        // Check if email exists in the Student collection
        const existingStudent = await User.findOne({ email });
        console.log("existingStudent", existingStudent);

        if (!existingStudent) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // Check if OTP matches
        if (existingStudent.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        // Generate JWT token
        const token = jwt.sign({ email: existingStudent.email, id: existingStudent._id },
            process.env.JWT_SECRET, { expiresIn: "30d" });
        if (token) {
            existingStudent.verification = true;
            await existingStudent.save();
        }
        res.status(200).json({ message: "OTP verified successfully", token: token });


    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

// // Login controller
// const studentLogin = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         // Check if email exists in the Student collection
//         const existingStudent = await User.findOne({ email });
//         if (!existingStudent) {
//             return res.status(400).json({ message: "Invalid credentials" });
//         }

//         // Check if email is verified
//         if (!existingStudent.verification) {
//             return res.status(400).json({ message: "Please verify your email first" });
//         }

//         // Check if password matches
//         const isPasswordCorrect = await bcrypt.compare(password, existingStudent.password);
//         if (!isPasswordCorrect) {
//             return res.status(400).json({ message: "Invalid credentials" });
//         }

//         // Generate JWT token
//         const token = jwt.sign({ email: existingStudent.email, id: existingStudent._id }, process.env.JWT_SECRET,
//             { expiresIn: "30d" });

//         res.status(200).json({ msg: "Login", result: existingStudent, token });
//     } catch (error) {
//         res.status(500).json({ message: "Something went wrong" });
//     }
// };

const handleStudentData = async (req, res) => {
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
        });

        const { _id } = studentUser;

        if (studentUser) {
            const token = jwt.sign({ _id, fullname }, process.env.JWT_SECRET, {
                expiresIn: "30d",
            });
            return res.json({ msg: "Student successfully created", studentUser, token });
        }
    } catch (error) {
        res.json({ err: error.message });
    }
};

export {
    handleStudentData,
    studentSignup,
    // studentLogin,
    verifyOTP
};