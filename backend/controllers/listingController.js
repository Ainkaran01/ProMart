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
    const listings = await Listing.find({ status: "approved" }).populate(
      "companyId",
      "companyName email phone"
    ); // ✅ include company info

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

// ✅ Update Listing (company can edit) - FIXED VERSION
export const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    // 🧾 Only company who owns this listing can update it
    if (listing.companyId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 🧱 Parse existing files from request body with metadata
    let existingAttachments = [];
    let existingVerificationDocuments = [];

    try {
      if (req.body.existingAttachments) {
        existingAttachments =
          typeof req.body.existingAttachments === "string"
            ? JSON.parse(req.body.existingAttachments)
            : req.body.existingAttachments;
      }

      if (req.body.existingVerificationDocuments) {
        existingVerificationDocuments =
          typeof req.body.existingVerificationDocuments === "string"
            ? JSON.parse(req.body.existingVerificationDocuments)
            : req.body.existingVerificationDocuments;
      }
    } catch (parseError) {
      console.error("Error parsing existing files:", parseError);
      // Fallback to current listing files if parsing fails
      existingAttachments = listing.attachments || [];
      existingVerificationDocuments = listing.verificationDocuments || [];
    }

    // 🖼️ Handle new uploaded files with proper metadata
    const newAttachments = req.files?.attachments
      ? req.files.attachments.map((file) => ({
          name: file.originalname,
          url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
          type: file.mimetype,
          size: file.size,
          uploadedAt: new Date().toISOString(),
        }))
      : [];

    const newVerificationDocs = req.files?.verificationDocuments
      ? req.files.verificationDocuments.map((file) => ({
          name: file.originalname,
          url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
          type: file.mimetype,
          size: file.size,
          uploadedAt: new Date().toISOString(),
        }))
      : [];

    // ✅ Merge existing (with preserved metadata) + new files
    listing.attachments = [...existingAttachments, ...newAttachments];
    listing.verificationDocuments = [
      ...existingVerificationDocuments,
      ...newVerificationDocs,
    ];

    // 🧱 Update text fields
    listing.title = req.body.title || listing.title;
    listing.description = req.body.description || listing.description;
    listing.category = req.body.category || listing.category;
    listing.location = req.body.location || listing.location;
    listing.website = req.body.website || listing.website;

    // Parse keyFeatures if it's a string
    if (req.body.keyFeatures) {
      try {
        listing.keyFeatures =
          typeof req.body.keyFeatures === "string"
            ? JSON.parse(req.body.keyFeatures)
            : req.body.keyFeatures;
      } catch (error) {
        console.error("Error parsing keyFeatures:", error);
        listing.keyFeatures = req.body.keyFeatures;
      }
    }

    // 🔁 Set status back to pending (needs re-approval)
    listing.status = "pending";

    await listing.save();

    res.json({
      message: "Listing updated and pending admin approval",
      listing,
    });
  } catch (error) {
    console.error("Error updating listing:", error);
    res.status(500).json({ message: "Server error" });
  }
};
