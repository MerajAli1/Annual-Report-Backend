import { Router } from "express";
import { handleAlumniSignup } from "../controllers/alumni.controller.js"
import { upload } from "../middlewares/multer.js";
const router = Router();

router.route("/alumniSignup")
    .post(upload.fields([{ name: "image", maxCount: 1 }]), handleAlumniSignup);

export default router;