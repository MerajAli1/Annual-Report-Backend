import { app } from "./app.js";
import connectDB from "./db/db.js";
import dotenv from "dotenv";
import http from "http";

// Load environment variables from .env file in the root directory
dotenv.config();

const PORT = 5000 || process.env.PORT;
const server = http.createServer(app);

connectDB()
    .then(() => {
        server.listen(PORT, () => {
            console.log("server is running on port", PORT);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to the Database", error);
    });