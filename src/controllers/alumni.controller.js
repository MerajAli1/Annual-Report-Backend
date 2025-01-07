import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { Alumni } from "../models/alumniSchema.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import nodemailer from "nodemailer";
import { AllEmail } from "../models/allEmailSchema.js";

const handleAlumniData = async (req, res) => {
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
            department: department,
            image: image,
        })

        const { _id } = alumniUser

        if (alumniUser) {
            const token = jwt.sign({ _id, fullname }, process.env.JWT_SECRET, {
                expiresIn: "30d",
            });
            return res.json({ msg: "Alumni successfully Created", token: token });
        }
    } catch (error) {
        res.json({ err: error.message });
    }
}

// Function to generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to send OTP via email
const sendOTPEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password'
        }
    });

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`
    };

    await transporter.sendMail(mailOptions);
};

// Signup controller
const alumniSignup = async (req, res) => {
    const { email, department, password } = req.body;

    try {
        // Check if email exists in the AllEmail collection
        const emailExists = await AllEmail.findOne({ email });
        if (!emailExists) {
            return res.status(400).json({ message: "Email not found in our database" });
        }

        // Generate OTP and send to email
        const otp = generateOTP();
        await sendOTPEmail(email, otp);

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Save the alumni with hashed password and department
        const newAlumni = new Alumni({ email, department, password: hashedPassword, otp });
        await newAlumni.save();

        res.status(200).json({ message: "Signup successful, OTP sent to email" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Login controller
// const alumniLogin = async (req, res) => {
//     const { email, password, otp } = req.body;

//     try {
//         // Check if email exists in the Alumni collection
//         const existingAlumni = await Alumni.findOne({ email });
//         if (!existingAlumni) {
//             return res.status(400).json({ message: "Invalid credentials" });
//         }

//         // Check if OTP matches
//         if (existingAlumni.otp !== otp) {
//             return res.status(400).json({ message: "Invalid OTP" });
//         }

//         // Check if password matches
//         const isPasswordCorrect = await bcrypt.compare(password, existingAlumni.password);
//         if (!isPasswordCorrect) {
//             return res.status(400).json({ message: "Invalid credentials" });
//         }

//         // Generate JWT token
//         const token = jwt.sign({ email: existingAlumni.email, id: existingAlumni._id }, 'secret', { expiresIn: "1h" });

//         res.status(200).json({ result: existingAlumni, token });
//     } catch (error) {
//         res.status(500).json({ message: "Something went wrong" });
//     }
// };

export {
    handleAlumniData,
    alumniSignup,
    // alumniLogin
}