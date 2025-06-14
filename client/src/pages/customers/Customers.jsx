import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomers } from '../../hooks/useCustomers';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, Typography, TextField, Stack } from '@mui/material';
import { Add, Upload, Download } from '@mui/icons-material';
import CustomerActions from '../../components/customers/CustomerActions';

const columns = [
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 1 },
  { field: 'phone', headerName: 'Phone', flex: 1 },
  { 
    field: 'outstandingAmount', 
    headerName: 'Outstanding', 
    flex: 1,
    valueFormatter: (params) => `$${params.value.toFixed(2)}`
  },
  { 
    field: 'paymentDueDate', 
    headerName: 'Due Date', 
    flex: 1,
    valueFormatter: (params) => new Date(params.value).toLocaleDateString()
  },
  { 
    field: 'paymentStatus', 
    headerName: 'Status', 
    flex: 1,
    renderCell: (params) => (
      <Box
        sx={{
          color: params.value === 'paid' ? 'success.main' : 
                params.value === 'overdue' ? 'error.main' : 
                'warning.main',
          fontWeight: 'medium'
        }}
      >
        {params.value}
      </Box>
    )
  },
  {
    field: 'actions',
    headerName: 'Actions',
    type: 'actions',
    flex: 1,
    renderCell: (params) => <CustomerActions customer={params.row} />
  }
];

function Customers() {
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading } = useCustomers({ 
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    search: searchTerm 
  });

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Customers</Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/customers/add')}
          >
            Add Customer
          </Button>
          <Button
            variant="outlined"
            startIcon={<Upload />}
            onClick={() => navigate('/customers/upload')}
          >
            Upload
          </Button>
        </Stack>
      </Stack>

      <TextField
        fullWidth
        placeholder="Search customers..."
        variant="outlined"
        sx={{ mb: 3 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={data?.data || []}
          columns={columns}
          loading={isLoading}
          rowCount={data?.total || 0}
          pageSizeOptions={[10, 25, 50]}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
}

export default Customers;