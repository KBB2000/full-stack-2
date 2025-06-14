import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { 
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from '../services/customerService';

export const useCustomers = (params) => {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => getCustomers(params),
    keepPreviousData: true
  });
};

export const useCustomer = (id) => {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: () => getCustomer(id),
    enabled: !!id
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(createCustomer, {
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
      enqueueSnackbar('Customer created successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(
    ({ id, data }) => updateCustomer(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['customers']);
        enqueueSnackbar('Customer updated successfully', { variant: 'success' });
      },
      onError: (error) => {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    }
  );
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(deleteCustomer, {
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
      enqueueSnackbar('Customer deleted successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  });
};