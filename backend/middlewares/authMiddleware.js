// middleware/authMiddleware.js
import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 🔒 Check if token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];

    // ✅ Verify JWT
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // 👤 Find user in DB (without password)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({ message: "Token verification failed" });
  }
};

// 🧩 Restrict route to admin users only
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Admins only" });
  }
};
