import { Router } from "express";
import { handleAdminSignUp } from "../controllers/admin.controller.js"
import { handleAdminLogin } from "../controllers/admin.controller.js"

const router = Router();

router.route("/adminSignup").post(handleAdminSignUp);
router.route("/adminLogin").post(handleAdminLogin);

export default router;