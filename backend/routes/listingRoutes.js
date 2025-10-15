import express from "express";
import {
  createListing,
  getApprovedListings,
  getCompanyListings,
  updateListingStatus,
  getAllListings,
} from "../controllers/listingController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
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

// ✅ Admin: Get all listings (pending + approved + rejected)
router.get("/", protect, adminOnly, getAllListings); // 🆕 Added route

// ✅ Admin: Update listing status (approve / reject)
router.put("/:id/status", protect, adminOnly, updateListingStatus);

export default router;
