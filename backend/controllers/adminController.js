import User from "../models/User.js";
import Listing from "../models/Listing.js";
import sendEmail from "../services/emailService.js";
import Notification from "../models/Notification.js";

// 🟩 Dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalCompanies = await User.countDocuments({ role: "company" });
    const totalListings = await Listing.countDocuments();
    const approvedListings = await Listing.countDocuments({ status: "approved" });
    const pendingListings = await Listing.countDocuments({ status: "pending" });
    const rejectedListings = await Listing.countDocuments({ status: "rejected" });

    res.json({ 
      totalCompanies, 
      totalListings, 
      approvedListings, 
      pendingListings,
      rejectedListings 
    });
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

// 🟩 Approve listing - CORRECTED VERSION
export const approveListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate("companyId");
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    listing.status = "approved";
    await listing.save();

    console.log(`🎯 Approving listing: ${listing.title} for company: ${listing.companyId.companyName}`);

    // 🔔 NOTIFY COMPANY: Create notification
    try {
      await Notification.create({
        userId: listing.companyId._id,
        type: "status_update",
        message: `Your listing "${listing.title}" has been approved and is now live`,
        listingId: listing._id,
        read: false
      });
      console.log("✅ Notification created successfully");
    } catch (notificationError) {
      console.error("❌ Failed to create notification:", notificationError);
    }

    // 📧 NOTIFY COMPANY: Send email
    try {
      await sendEmail(
        listing.companyId.email,
        "Listing Approved - Your Listing is Now Live!",
        `Great news! Your listing "${listing.title}" has been approved and is now live on our platform.\n\nView your listing here: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/listings/${listing._id}\n\nThank you for using ProMart!`
      );
      console.log("✅ Approval email sent successfully");
    } catch (emailError) {
      console.error("❌ Failed to send approval email:", emailError.message);
      // Don't throw - continue even if email fails
    }

    res.json({ message: "Listing approved", listing });
  } catch (error) {
    console.error("Error approving listing:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟩 Reject listing - CORRECTED VERSION
export const rejectListing = async (req, res) => {
  try {
    const { reason } = req.body;
    const listing = await Listing.findById(req.params.id).populate("companyId");
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    listing.status = "rejected";
    if (reason) listing.adminComment = reason;
    await listing.save();

    const rejectionReason = reason || "Please check our guidelines and submit again.";

    console.log(`🎯 Rejecting listing: ${listing.title} for company: ${listing.companyId.companyName}`);

    // 🔔 NOTIFY COMPANY: Create notification
    try {
      await Notification.create({
        userId: listing.companyId._id,
        type: "status_update",
        message: `Your listing "${listing.title}" has been rejected. Reason: ${rejectionReason}`,
        listingId: listing._id,
        read: false
      });
      console.log("✅ Notification created successfully");
    } catch (notificationError) {
      console.error("❌ Failed to create notification:", notificationError);
    }

    // 📧 NOTIFY COMPANY: Send email
    try {
      await sendEmail(
        listing.companyId.email,
        "Listing Update - Your Listing Requires Changes",
        `Your listing "${listing.title}" has been reviewed and requires changes.\n\nReason: ${rejectionReason}\n\nPlease update your listing and submit it for review again.\n\nThank you for using ProMart!`
      );
      console.log("✅ Rejection email sent successfully");
    } catch (emailError) {
      console.error("❌ Failed to send rejection email:", emailError.message);
      // Don't throw - continue even if email fails
    }

    res.json({ message: "Listing rejected", listing });
  } catch (error) {
    console.error("Error rejecting listing:", error);
    res.status(500).json({ message: "Server error" });
  }
};