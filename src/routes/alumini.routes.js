import { Router } from "express";
import { handleAlumniData } from "../controllers/alumni.controller.js"
import { upload } from "../middlewares/multer.js";
const router = Router();

router.route("/alumniData")
    .post(upload.fields([{ name: "image", maxCount: 1 }]), handleAlumniData);

export default router;