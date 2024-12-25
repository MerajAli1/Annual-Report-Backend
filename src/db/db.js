import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            process.env.MONGODB_URI
        );
        console.log(
            `mongoDB connected !! DB Host: ${connectionInstance.connection.host}`
        );
    } catch (error) {
        console.log("mongooDB connection error..");
        process.exit(1);
    }
};
export default connectDB;
