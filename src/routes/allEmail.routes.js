import express from 'express';
import { addEmail } from '../controllers/allEmail.controller.js';

const router = express.Router();

// Route to add email
router.post('/addEmail', addEmail);

export default router;