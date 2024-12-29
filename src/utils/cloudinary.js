// const cloudinary = require("cloudinary");
// const fs = require("fs");

import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import dotenv from "dotenv";
// Load environment variables from .env file in the root directory
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    return response.url;
  } catch (error) {
    fs.unlink(localFilePath);
  }
};

export { uploadOnCloudinary };