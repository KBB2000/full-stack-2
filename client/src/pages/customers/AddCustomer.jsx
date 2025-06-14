import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import CustomerForm from '../../components/customers/CustomerForm';
import { useCreateCustomer } from '../../hooks/useCustomers';

function AddCustomer() {
  const navigate = useNavigate();
  const { mutate: createCustomer, isLoading } = useCreateCustomer();

  const handleSubmit = async (data) => {
    await createCustomer(data);
    navigate('/customers');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Add New Customer
      </Typography>
      <CustomerForm onSubmit={handleSubmit} loading={isLoading} />
    </Box>
  );
}

export default AddCustomer;