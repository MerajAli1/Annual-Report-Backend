import { Router } from "express";
import { handleStudentData, verifyOTP } from "../controllers/student.controller.js"
import { studentSignup } from "../controllers/student.controller.js"
import { upload } from "../middlewares/multer.js";
const router = Router();

router.route("/studentData").post(upload.fields([{ name: "image", maxCount: 1 }]), handleStudentData);
router.route("/verifyOtp").post(verifyOTP)
router.route("/studentSignup").post(studentSignup)
// router.route("/studentLogin").post(studentLogin)
export default router;