import { Router } from "express";
import { handleStudentSignup } from "../controllers/student.controller.js"
import { upload } from "../middlewares/multer.js";
const router = Router();

router.route("/studentSignup")
    .post(upload.fields([{ name: "image", maxCount: 1 }]), handleStudentSignup);

export default router;