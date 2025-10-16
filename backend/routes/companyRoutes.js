import express from "express";
import { updateProfile, changePassword, getProfile} from "../controllers/companyController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🟩 Get profile
router.get("/profile", protect, getProfile); 
// 🟩 Update profile
router.put("/update-profile", protect, updateProfile);

// 🟩 Change password
router.put("/change-password", protect, changePassword);

export default router;
