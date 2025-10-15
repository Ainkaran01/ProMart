import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Automatically attach token if available
API.interceptors.request.use((config) => {
  const savedUser = localStorage.getItem("promart_user");
  if (savedUser) {
    const { token } = JSON.parse(savedUser);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default API;
