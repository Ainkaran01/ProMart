import express from "express";
import {
  createListing,
  getApprovedListings,
  getCompanyListings,
  
} from "../controllers/listingController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();



// Create listing (authenticated)
router.post(
  "/",
  protect,
  upload.fields([
    { name: "attachments", maxCount: 5 },
    { name: "verificationDocuments", maxCount: 5 },
  ]),
  createListing
);

// ✅ Get all approved listings (Public)
router.get("/approved", getApprovedListings);

// ✅ Get listings for the logged-in company
router.get("/my", protect, getCompanyListings);



export default router;
