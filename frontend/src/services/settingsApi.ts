import API from "@/api/API";

// Update profile
export const updateProfile = async (data: {
  email: string;
  phone: string;
  companyName?: string;
}) => {
  try {
    const res = await API.put("/companies/update-profile", data, {
      withCredentials: true,
    });
    return res.data;
  } catch (err: any) {
    throw err.response?.data?.message || "Failed to update profile";
  }
};

// Change password
export const changePassword = async (passwordData: {
  currentPassword: string;
  newPassword: string;
}) => {
  try {
    const res = await API.put("/companies/change-password", passwordData, {
      withCredentials: true,
    });
    return res.data;
  } catch (err: any) {
    throw err.response?.data?.message || "Failed to change password";
  }
};
export const getProfile = async () => {
  try {
    const res = await API.get("/companies/profile", { withCredentials: true });
    return res.data;
  } catch (err: any) {
    throw err.response?.data?.message || "Failed to change profile";
  }
};
