import { useParams } from 'react-router-dom';
import { Box, Typography, Button, Stack, Paper, Divider } from '@mui/material';
import { usePayment } from '../../hooks/usePayments';
import Loading from '../../components/ui/Loading';
import { Edit as EditIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

function PaymentDetails() {
  const { id } = useParams();
  const { data: payment, isLoading } = usePayment(id);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center" mb={3}>
        <Button
          component={Link}
          to="/payments"
          startIcon={<BackIcon />}
          variant="outlined"
        >
          Back
        </Button>
        <Typography variant="h4" component="h1">
          Payment Details
        </Typography>
        <Button
          component={Link}
          to={`/payments/${id}/edit`}
          startIcon={<EditIcon />}
          variant="contained"
          sx={{ ml: 'auto' }}
        >
          Edit
        </Button>
      </Stack>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Payment Information
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={2}>
          <Typography>
            <strong>Customer:</strong> {payment.customer?.name}
          </Typography>
          <Typography>
            <strong>Amount:</strong> ${payment.amount.toFixed(2)}
          </Typography>
          <Typography>
            <strong>Payment Date:</strong> {new Date(payment.paymentDate).toLocaleDateString()}
          </Typography>
          <Typography>
            <strong>Payment Method:</strong> {payment.paymentMethod}
          </Typography>
          <Typography>
            <strong>Status:</strong> {payment.status}
          </Typography>
          {payment.notes && (
            <Typography>
              <strong>Notes:</strong> {payment.notes}
            </Typography>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}

export default PaymentDetails;