import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import dayjs from 'dayjs';
import {
  TextField,
  Button,
  Stack,
  MenuItem,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Box
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// Corrected Yup validation schema
const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').nullable(),
  phone: yup.string().nullable(),
  outstandingAmount: yup
    .number()
    .typeError('Amount must be a number')
    .required('Amount is required')
    .min(0, 'Amount cannot be negative'),
  paymentDueDate: yup
    .date()
    .typeError('Invalid date')
    .required('Due date is required')
    .min(dayjs().subtract(1, 'day'), 'Date cannot be in the past'),
  paymentStatus: yup
    .string()
    .oneOf(['pending', 'paid', 'overdue', 'partial'])
    .required('Status is required')
});

export default function CustomerForm({ defaultValues, onSubmit, loading }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      outstandingAmount: 0,
      paymentDueDate: dayjs().add(7, 'day'),
      paymentStatus: 'pending',
      ...defaultValues
    },
    resolver: yupResolver(schema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <TextField
          {...register('name')}
          label="Name"
          error={!!errors.name}
          helperText={errors.name?.message}
          fullWidth
        />

        <TextField
          {...register('email')}
          label="Email"
          type="email"
          error={!!errors.email}
          helperText={errors.email?.message}
          fullWidth
        />

        <TextField
          {...register('phone')}
          label="Phone"
          error={!!errors.phone}
          helperText={errors.phone?.message}
          fullWidth
        />

        <TextField
          {...register('outstandingAmount')}
          label="Outstanding Amount"
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>
          }}
          error={!!errors.outstandingAmount}
          helperText={errors.outstandingAmount?.message}
          fullWidth
        />

        <DatePicker
          label="Payment Due Date"
          control={control}
          name="paymentDueDate"
          render={({ field }) => (
            <TextField
              {...field}
              error={!!errors.paymentDueDate}
              helperText={errors.paymentDueDate?.message}
              fullWidth
            />
          )}
        />

        <FormControl fullWidth error={!!errors.paymentStatus}>
          <InputLabel>Payment Status</InputLabel>
          <Select
            {...register('paymentStatus')}
            label="Payment Status"
            defaultValue="pending"
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="overdue">Overdue</MenuItem>
            <MenuItem value="partial">Partial</MenuItem>
          </Select>
          {errors.paymentStatus && (
            <Box sx={{ color: 'error.main', fontSize: '0.75rem', ml: 2, mt: 1 }}>
              {errors.paymentStatus.message}
            </Box>
          )}
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          fullWidth
        >
          {loading ? 'Saving...' : 'Save Customer'}
        </Button>
      </Stack>
    </form>
  );
}