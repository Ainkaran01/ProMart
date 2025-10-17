import API from "@/api/API";


// 📰 Get all blogs (optionally filter by category)
export const getBlogs = async (category?: string) => {
  const params = category && category !== "All" ? { category } : {};
  const res = await API.get("/blogs", { params });
  return res.data;
};

// 📰 Get single blog by ID
export const getBlogById = async (id: string) => {
  const res = await API.get(`/blogs/${id}`);
  return res.data;
};

// ✍️ Create new blog (admin only)
export const createBlog = async (blogData: any) => {
  const res = await API.post("/blogs", blogData);
  return res.data;
};

// 🛠 Update blog
export const updateBlog = async (id: string, blogData: any) => {
  const res = await API.put(`/blogs/${id}`, blogData);
  return res.data;
};

// ❌ Delete blog
export const deleteBlog = async (id: string) => {
  const res = await API.delete(`/blogs/${id}`);
  return res.data;
};
