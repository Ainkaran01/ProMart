import API from "../api/API";

console.log("🔗 API URL:", `${API}/contact`);
// ✅ Fetch all contacts (for admin)
export const getContacts = async () => {
  const res = await API.get("/contact");
  return await res.data;
};

// ✅ Delete contact (for admin)
export const deleteContact = async (id) => {
  const res = await API.delete(`/contact/${id}`);
  return await res.data;
};

// ✅ Update status (for admin)
export const updateContactStatus = async (id, status) => {
  const { data } = await API.patch(`/contact/${id}`, { status }); // ✅ use PATCH not PUT
  return data;
};