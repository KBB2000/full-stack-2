import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import CustomerForm from '../../components/customers/CustomerForm';
import { useCustomer, useUpdateCustomer } from '../../hooks/useCustomers';
import Loading from '../../components/ui/Loading';

function EditCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: customer, isLoading } = useCustomer(id);
  const { mutate: updateCustomer, isLoading: isUpdating } = useUpdateCustomer();

  const handleSubmit = async (data) => {
    await updateCustomer({ id, data });
    navigate(`/customers/${id}`);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Edit Customer
      </Typography>
      <CustomerForm 
        defaultValues={customer} 
        onSubmit={handleSubmit} 
        loading={isUpdating} 
      />
    </Box>
  );
}

export default EditCustomer;