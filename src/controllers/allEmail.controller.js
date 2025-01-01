import { AllEmail } from "../models/allEmailSchema.js";

// Controller to add email to the database
export const addEmail = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if email already exists
        const emailExists = await AllEmail.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Create new email entry
        const newEmail = new AllEmail({ email });
        await newEmail.save();
        res.status(200).json({ message: "Email added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};