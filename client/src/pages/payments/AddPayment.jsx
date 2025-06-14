import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import PaymentForm from '../../components/payments/PaymentForm';
import { useCreatePayment } from '../../hooks/usePayments';

export default function AddPayment() {
  const navigate = useNavigate();
  const { mutate: createPayment, isLoading } = useCreatePayment();

  const handleSubmit = async (data) => {
    await createPayment(data);
    navigate('/payments');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Add New Payment
      </Typography>
      <PaymentForm onSubmit={handleSubmit} loading={isLoading} />
    </Box>
  );
}