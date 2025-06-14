import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  TextField,
  Button,
  Stack,
  MenuItem,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  CircularProgress
} from '@mui/material';
import { useCustomers } from '../../hooks/useCustomers';

const schema = yup.object().shape({
  customer: yup.string().required('Customer is required'),
  amount: yup
    .number()
    .typeError('Amount must be a number')
    .required('Amount is required')
    .min(0.01, 'Amount must be greater than 0'),
  paymentMethod: yup
    .string()
    .oneOf(['cash', 'credit_card', 'bank_transfer', 'other'])
    .required('Method is required'),
  notes: yup.string().nullable()
});

export default function PaymentForm({ onSubmit, loading }) {
  const { data: customers } = useCustomers({ limit: 1000 });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: {
      customer: '',
      amount: 0,
      paymentMethod: 'bank_transfer',
      notes: ''
    },
    resolver: yupResolver(schema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <FormControl fullWidth error={!!errors.customer}>
          <InputLabel>Customer</InputLabel>
          <Select
            {...register('customer')}
            label="Customer"
            defaultValue=""
          >
            {customers?.data?.map((customer) => (
              <MenuItem key={customer._id} value={customer._id}>
                {customer.name} (${customer.outstandingAmount?.toFixed(2)})
              </MenuItem>
            ))}
          </Select>
          {errors.customer && (
            <Box sx={{ color: 'error.main', fontSize: '0.75rem', ml: 2, mt: 1 }}>
              {errors.customer.message}
            </Box>
          )}
        </FormControl>

        <TextField
          {...register('amount')}
          label="Amount"
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0, step: 0.01 }
          }}
          error={!!errors.amount}
          helperText={errors.amount?.message}
          fullWidth
        />

        <FormControl fullWidth error={!!errors.paymentMethod}>
          <InputLabel>Payment Method</InputLabel>
          <Select
            {...register('paymentMethod')}
            label="Payment Method"
            defaultValue="bank_transfer"
          >
            <MenuItem value="cash">Cash</MenuItem>
            <MenuItem value="credit_card">Credit Card</MenuItem>
            <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
          {errors.paymentMethod && (
            <Box sx={{ color: 'error.main', fontSize: '0.75rem', ml: 2, mt: 1 }}>
              {errors.paymentMethod.message}
            </Box>
          )}
        </FormControl>

        <TextField
          {...register('notes')}
          label="Notes"
          multiline
          rows={4}
          error={!!errors.notes}
          helperText={errors.notes?.message}
          fullWidth
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          fullWidth
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Process Payment'
          )}
        </Button>
      </Stack>
    </form>
  );
}