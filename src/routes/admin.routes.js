import { Router } from "express";
import { handleAdminSignUp } from "../controllers/admin.controller.js"
import { handleAdminLogin } from "../controllers/admin.controller.js"
import { handleAdminHomePage } from "../controllers/admin.controller.js"
import { deleteAlumni } from "../controllers/admin.controller.js"
import { deleteStudent } from "../controllers/admin.controller.js"
import { updateAlumni } from "../controllers/admin.controller.js"
import { updateStudent } from "../controllers/admin.controller.js"

const router = Router();

router.route("/adminSignup").post(handleAdminSignUp);
router.route("/adminLogin").post(handleAdminLogin);
router.route("/adminHomePage").get(handleAdminHomePage);
router.route("/deleteAlumni/:id").delete(deleteAlumni);
router.route("/deleteStudent/:id").delete(deleteStudent);
router.route("/updateAlumni/:id").put(updateAlumni);
router.route("/updateStudent/:id").put(updateStudent);

export default router;