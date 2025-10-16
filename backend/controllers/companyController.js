import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// 🟩 Update profile (email, phone, companyName)
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { email, phone, companyName } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (companyName) user.companyName = companyName; 

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        email: user.email,
        phone: user.phone,
        companyName: user.companyName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// 🟩 Change password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    if (newPassword.length < 8)
      return res.status(400).json({ message: "Password must be at least 8 characters" });

    user.password = newPassword; // 🔹 Don't hash here — let pre-save hook do it
    user.passwordChangedAt = new Date();
    await user.save();

    res.json({
      message: "Password updated successfully. Please login again.",
      requiresReauth: true,
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error" });
  }
};

