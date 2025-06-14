import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';

export default function UploadCustomers() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Upload Customers
      </Typography>
      <Button
        variant="contained"
        startIcon={<UploadIcon />}
      >
        Upload Excel File
      </Button>
    </Box>
  );
}