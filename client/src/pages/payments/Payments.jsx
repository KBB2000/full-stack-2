import { useState } from 'react';
import { usePayments } from '../../hooks/usePayments';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, TextField, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import PaymentActions from '../../components/payments/PaymentActions';

const columns = [
  { 
    field: 'customer.name', 
    headerName: 'Customer', 
    flex: 1,
    valueGetter: (params) => params.row.customer?.name 
  },
  { 
    field: 'amount', 
    headerName: 'Amount', 
    flex: 1,
    valueFormatter: (params) => `$${params.value.toFixed(2)}`
  },
  { 
    field: 'paymentDate', 
    headerName: 'Date', 
    flex: 1,
    valueFormatter: (params) => new Date(params.value).toLocaleDateString()
  },
  { 
    field: 'paymentMethod', 
    headerName: 'Method', 
    flex: 1 
  },
  { 
    field: 'status', 
    headerName: 'Status', 
    flex: 1,
    renderCell: (params) => (
      <Box
        sx={{
          color: params.value === 'completed' ? 'success.main' : 
                params.value === 'failed' ? 'error.main' : 
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
    renderCell: (params) => <PaymentActions payment={params.row} />
  }
];

function Payments() {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const { data, isLoading } = usePayments({ 
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Payments</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          href="/payments/add"
        >
          Add Payment
        </Button>
      </Box>

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

export default Payments;