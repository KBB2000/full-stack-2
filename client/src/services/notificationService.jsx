import apiClient from './apiClient';

export const getNotifications = async () => {
  return apiClient.get('/notifications');
};

export const markNotificationAsRead = async (id) => {
  return apiClient.put(`/notifications/${id}/read`);
};

export const markAllNotificationsAsRead = async () => {
  return apiClient.put('/notifications/read-all');
};