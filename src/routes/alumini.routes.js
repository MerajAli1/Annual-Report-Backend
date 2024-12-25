import { Router } from "express";
import { handleAlumniSignup } from "../controllers/alumni.controller.js"

const router = Router();

router.route("/alumniSignup").post(handleAlumniSignup);
 
export default router;