import User from "../models/User.js";
import Listing from "../models/Listing.js";

// 🟩 Dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalCompanies = await User.countDocuments({ role: "company" });
    const totalListings = await Listing.countDocuments();
    const approvedListings = await Listing.countDocuments({ status: "approved" });
    const pendingListings = await Listing.countDocuments({ status: "pending" });

    res.json({ totalCompanies, totalListings, approvedListings, pendingListings });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟩 Get all companies
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await User.find({ role: "company" }).select("-password");
    res.json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟩 Get all listings
export const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate("companyId", "companyName email phone")
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟩 Approve listing
export const approveListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    listing.status = "approved";
    await listing.save();
    res.json({ message: "Listing approved", listing });
  } catch (error) {
    console.error("Error approving listing:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟩 Reject listing
export const rejectListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    listing.status = "rejected";
    await listing.save();
    res.json({ message: "Listing rejected", listing });
  } catch (error) {
    console.error("Error rejecting listing:", error);
    res.status(500).json({ message: "Server error" });
  }
};
