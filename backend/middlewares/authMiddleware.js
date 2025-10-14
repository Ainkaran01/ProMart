// middleware/authMiddleware.js
import { verifyToken } from "../utils/jwt.js";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  req.user = await User.findById(decoded.id).select("-password");
  if (!req.user) {
    return res.status(404).json({ message: "User not found" });
  }

  next();
};
