import API from "../api/API";

// ✅ Send OTP to email
export const sendOTP = async (email) => {
  const res = await API.post("/otp/send", { email });
  return res.data;
};

// ✅ Verify OTP
export const verifyOTP = async (email, code) => {
  const res = await API.post("/otp/verify", { email, code });
  return res.data;
};

// ✅ Register user
export const registerUser = async (userData) => {
  const res = await API.post("/auth/register", userData);
  return res.data;
};

// ✅ Login user
export const loginUser = async (data) => {
  const response = await API.post("/auth/login", data);
  return response.data;
};