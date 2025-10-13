import jwt from "jsonwebtoken";

/**
 * Generate JWT token
 * @param {Object} payload - Data to encode (e.g. user ID, role)
 * @returns {String} Signed JWT
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

/**
 * Verify JWT token
 * @param {String} token - Token from request header
 * @returns {Object|null} Decoded payload or null if invalid
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};
