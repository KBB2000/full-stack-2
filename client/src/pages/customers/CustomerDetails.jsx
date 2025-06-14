import { useParams } from 'react-router-dom';
import { Box, Typography, Button, Stack, Paper, Divider } from '@mui/material';
import { useCustomer } from '../../hooks/useCustomers';
import Loading from '../../components/ui/Loading';
import { Edit as EditIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

function CustomerDetails() {
  const { id } = useParams();
  const { data: customer, isLoading } = useCustomer(id);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center" mb={3}>
        <Button
          component={Link}
          to="/customers"
          startIcon={<BackIcon />}
          variant="outlined"
        >
          Back
        </Button>
        <Typography variant="h4" component="h1">
          Customer Details
        </Typography>
        <Button
          component={Link}
          to={`/customers/${id}/edit`}
          startIcon={<EditIcon />}
          variant="contained"
          sx={{ ml: 'auto' }}
        >
          Edit
        </Button>
      </Stack>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Basic Information
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={2}>
          <Typography>
            <strong>Name:</strong> {customer.name}
          </Typography>
          <Typography>
            <strong>Email:</strong> {customer.email || 'N/A'}
          </Typography>
          <Typography>
            <strong>Phone:</strong> {customer.phone || 'N/A'}
          </Typography>
        </Stack>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Payment Information
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={2}>
          <Typography>
            <strong>Outstanding Amount:</strong> ${customer.outstandingAmount.toFixed(2)}
          </Typography>
          <Typography>
            <strong>Payment Due Date:</strong> {new Date(customer.paymentDueDate).toLocaleDateString()}
          </Typography>
          <Typography>
            <strong>Payment Status:</strong> {customer.paymentStatus}
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}

export default CustomerDetails;