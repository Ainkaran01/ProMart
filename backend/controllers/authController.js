import User from "../models/user.js";
import { generateToken } from "../utils/jwt.js";


export const registerUser = async (req, res) => {
  try {
    const { companyName, email, phone, password, role } = req.body; // ✅ added phone

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Create new user
    const user = await User.create({
      companyName,
      email,
      phone, // ✅ added phone here
      password,
      role: role || "company",
      verified: true,
    });

    // Return response
    res.status(201).json({
      _id: user._id,
      companyName: user.companyName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken({ id: user._id, role: user.role }),
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message });
  }
};


// ✅ Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  res.json({
    _id: user._id,
    companyName: user.companyName,
    email: user.email,
    phone: user.phone, 
    role: user.role,
    token: generateToken({ id: user._id, role: user.role }),
  });
};
