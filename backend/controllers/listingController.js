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
          type: file.mimetype,
          size: file.size,
          uploadedAt: new Date().toISOString(),
        }))
      : [];

    const verificationDocuments = req.files?.verificationDocuments
      ? req.files.verificationDocuments.map((file) => ({
          name: file.originalname,
          url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
          type: file.mimetype,
          size: file.size,
          uploadedAt: new Date().toISOString(),
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
  try {
    const listings = await Listing.find({ status: "approved" })
      .populate("companyId", "companyName email phone"); // ✅ include company info

    res.json(listings);
  } catch (error) {
    console.error("Error fetching approved listings:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// 🟩 Get listings of logged-in company
export const getCompanyListings = async (req, res) => {
  const listings = await Listing.find({ companyId: req.user._id });
  res.json(listings);
};

