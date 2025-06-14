import { useState } from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import { Upload as UploadIcon, Download as DownloadIcon } from '@mui/icons-material';
import { useUploadCustomers, useDownloadTemplate } from '../../hooks/useCustomers';
import { useSnackbar } from 'notistack';

function CustomerUpload() {
  const [file, setFile] = useState(null);
  const { mutate: uploadCustomers, isLoading: isUploading } = useUploadCustomers();
  const { mutate: downloadTemplate, isLoading: isDownloading } = useDownloadTemplate();
  const { enqueueSnackbar } = useSnackbar();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!file) {
      enqueueSnackbar('Please select a file first', { variant: 'error' });
      return;
    }
    uploadCustomers(file);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Upload Customers
      </Typography>
      
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 3, maxWidth: 600 }}
      >
        <Stack spacing={3}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadIcon />}
            fullWidth
          >
            Select Excel File
            <input
              type="file"
              hidden
              accept=".xlsx, .xls"
              onChange={handleFileChange}
            />
          </Button>
          
          {file && (
            <Typography variant="body2">
              Selected file: {file.name}
            </Typography>
          )}
          
          <Button
            type="submit"
            variant="contained"
            disabled={!file || isUploading}
            fullWidth
          >
            {isUploading ? 'Uploading...' : 'Upload Customers'}
          </Button>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" gutterBottom>
            Download Template
          </Typography>
          
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => downloadTemplate()}
            disabled={isDownloading}
            fullWidth
          >
            {isDownloading ? 'Downloading...' : 'Download Excel Template'}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

export default CustomerUpload;