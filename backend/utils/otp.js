/**
 * Generate a 6-digit OTP
 * @returns {String} 6-digit OTP code
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Verify OTP with expiration
 * @param {String} enteredOTP - OTP entered by the user
 * @param {String} savedOTP - OTP stored in DB/session
 * @param {Date} savedTime - Time when OTP was generated
 * @param {Number} expiryMinutes - Validity duration in minutes
 * @returns {Boolean} Whether OTP is valid
 */
export const verifyOTP = (enteredOTP, savedOTP, savedTime, expiryMinutes = 10) => {
  if (!enteredOTP || !savedOTP || !savedTime) return false;

  const now = new Date();
  const expiry = new Date(savedTime);
  expiry.setMinutes(expiry.getMinutes() + expiryMinutes);

  return enteredOTP === savedOTP && now <= expiry;
};
