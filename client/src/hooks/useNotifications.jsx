import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/apiClient';

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => apiClient.get('/notifications')
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (id) => apiClient.put(`/notifications/${id}/read`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['notifications']);
      }
    }
  );
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation(
    () => apiClient.put('/notifications/read-all'),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['notifications']);
      }
    }
  );
};