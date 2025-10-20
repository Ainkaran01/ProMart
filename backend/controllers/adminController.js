import User from "../models/User.js";
import Listing from "../models/Listing.js";
import sendEmail from "../services/emailService.js";
import Notification from "../models/Notification.js";
import bcrypt from "bcryptjs";
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
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
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


// 🟩 Admin Reset Password
export const resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const tempPassword = "company123";
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const user = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    // 📨 Send email with temp password
    await sendEmail(
      user.email,
      "🔑 Password Reset by Admin",
      `
      Hi ${user.companyName || user.email},

      Your account password has been reset by the administrator.

      👉 Temporary Password: ${tempPassword}

      Please log in using this password and change it immediately from your dashboard.

      Thank you,
      Support Team
      `
    );

    res.json({ success: true, message: "Password reset and email sent successfully" });
  } catch (error) {
    console.error("❌ Reset password error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🟩 Reactivate User
export const reactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    // 📨 Send email notification
    await sendEmail(
      user.email,
      "✅ Account Reactivated",
      `
      Hi ${user.companyName || user.email},

      Good news! Your account has been reactivated by the administrator.

      You can now log in and continue using the system as usual.

      Thank you,
      Admin Team
      `
    );

    res.json({ success: true, message: "User reactivated successfully", user });
  } catch (error) {
    console.error("❌ Reactivate user error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🟥 Deactivate User
export const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    // 📨 Send email notification
    await sendEmail(
      user.email,
      "🚫 Account Deactivated",
      `
      Hi ${user.companyName || user.email},

      Your account has been deactivated by the administrator.

      If you believe this is a mistake or need assistance, please contact support.

      Thank you,
      Admin Team
      `
    );

    res.json({ success: true, message: "User deactivated successfully", user });
  } catch (error) {
    console.error("❌ Deactivate user error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};