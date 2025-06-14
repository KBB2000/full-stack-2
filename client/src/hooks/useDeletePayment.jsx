import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/apiClient';
import { useSnackbar } from 'notistack';

export const useDeletePayment = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(
    (id) => apiClient.delete(`/payments/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['payments']);
        enqueueSnackbar('Payment deleted successfully', { variant: 'success' });
      },
      onError: (error) => {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    }
  );
};