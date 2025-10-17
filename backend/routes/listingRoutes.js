import express from "express";
import {
  createListing,
  getApprovedListings,
  getCompanyListings,
  updateListing,
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

// ✅ Update listing
router.put(
  "/:id",
  protect,
  upload.fields([
    { name: "attachments", maxCount: 10 },
    { name: "verificationDocuments", maxCount: 10 },
  ]),
  updateListing
);

// ✅ Get all approved listings (Public)
router.get("/approved", getApprovedListings);

// ✅ Get listings for the logged-in company
router.get("/my", protect, getCompanyListings);

export default router;
