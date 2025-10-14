import express from "express";
import { sendEmailOTP, verifyEmailOTP } from "../controllers/otpController.js";


const router = express.Router();


router.post("/send", sendEmailOTP);
router.post("/verify", verifyEmailOTP);


export default router;
