import Listing from "../models/Listing.js";
import User from "../models/User.js";

// 🟩 Create new listing (with file uploads)
export const createListing = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 🖼️ Handle uploaded files
    const attachments = req.files?.attachments
      ? req.files.attachments.map((file) => ({
          name: file.originalname,
          url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
        }))
      : [];

    const verificationDocuments = req.files?.verificationDocuments
      ? req.files.verificationDocuments.map((file) => ({
          name: file.originalname,
          url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
        }))
      : [];

    // 🏗️ Create new listing
    const listing = await Listing.create({
      companyId: user._id,
      companyName: user.companyName,
      email: user.email,
      phone: user.phone,
      ...req.body,
      attachments,
      verificationDocuments,
      status: "pending",
    });

    res.status(201).json(listing);
  } catch (err) {
    console.error("Error creating listing:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟩 Get all approved listings (public)
export const getApprovedListings = async (req, res) => {
  const listings = await Listing.find({ status: "approved" });
  res.json(listings);
};

// 🟩 Get listings of logged-in company
export const getCompanyListings = async (req, res) => {
  const listings = await Listing.find({ companyId: req.user._id });
  res.json(listings);
};

// 🟩 Admin: Approve / Reject
export const updateListingStatus = async (req, res) => {
  const { status, comment } = req.body;
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: "Listing not found" });

  listing.status = status;
  listing.adminComment = comment || "";
  await listing.save();

  res.json(listing);
};

// 🟩 Get all listings (admin)
export const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate("companyId", "companyName email phone")
      .sort({ createdAt: -1 });

    res.status(200).json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ message: "Server error" });
  }
};
