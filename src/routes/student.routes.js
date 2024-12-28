import { Router } from "express";
import { handleStudentSignup } from "../controllers/student.controller.js"

const router = Router();

router.route("/studentSignup").post(handleStudentSignup);

export default router;