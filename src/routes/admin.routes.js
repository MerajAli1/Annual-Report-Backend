import { Router } from "express";
import { handleAdminSignUp } from "../controllers/admin.controller.js"
import { handleAdminLogin } from "../controllers/admin.controller.js"
import { handleAdminHomePage } from "../controllers/admin.controller.js"
import { deleteAlumni } from "../controllers/admin.controller.js"
import { deleteStudent } from "../controllers/admin.controller.js"
import { updateAlumni } from "../controllers/admin.controller.js"
import { updateStudent } from "../controllers/admin.controller.js"

const router = Router();

router.route("/adminSignup").post(handleAdminSignUp);//http://localhost:5000/api/user/adminSignup
router.route("/adminLogin").post(handleAdminLogin);//http://localhost:5000/admin/adminLogin
router.route("/adminHomePage").get(handleAdminHomePage);//http://localhost:5000/api/user/adminHomePage
router.route("/deleteAlumni/:id").delete(deleteAlumni);//http://localhost:5000/api/user/deleteAlumni/:id
router.route("/deleteStudent/:id").delete(deleteStudent);//http://localhost:5000/api/user/deleteStudent/:id
router.route("/updateAlumni/:id").put(updateAlumni);//http://localhost:5000/api/user/updateAlumni/:id
router.route("/updateStudent/:id").put(updateStudent);//http://localhost:5000/api/user/updateStudent/:id

export default router;