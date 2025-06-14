import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { createPayment, getPayments, getPayment, updatePayment, deletePayment } from '../services/paymentService';

export const usePayments = (params) => {
  return useQuery({
    queryKey: ['payments', params],
    queryFn: () => getPayments(params),
    keepPreviousData: true
  });
};

export const usePayment = (id) => {
  return useQuery({
    queryKey: ['payment', id],
    queryFn: () => getPayment(id),
    enabled: !!id
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(createPayment, {
    onSuccess: () => {
      queryClient.invalidateQueries(['payments']);
      enqueueSnackbar('Payment created successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  });
};

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(
    ({ id, data }) => updatePayment(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['payments']);
        enqueueSnackbar('Payment updated successfully', { variant: 'success' });
      },
      onError: (error) => {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    }
  );
};

export const useDeletePayment = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(deletePayment, {
    onSuccess: () => {
      queryClient.invalidateQueries(['payments']);
      enqueueSnackbar('Payment deleted successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  });
};