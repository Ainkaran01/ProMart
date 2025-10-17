// services/notificationService.js
import API from "../api/API";

export const getNotifications = async () => {
  const res = await API.get("/notifications");
  return res.data;
};

export const markAsRead = async (notificationId) => {
  const res = await API.patch(`/notifications/${notificationId}/read`);
  return res.data;
};

export const markAllAsRead = async () => {
  const res = await API.patch("/notifications/read-all");
  return res.data;
};

export const deleteNotification = async (notificationId) => {
  const res = await API.delete(`/notifications/${notificationId}`);
  return res.data;
};