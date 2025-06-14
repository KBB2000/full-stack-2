import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSnackbar } from 'notistack';
import { Box, Typography, TextField, Button, Link, Grid } from '@mui/material';
import LoginForm from '../../components/auth/LoginForm';

function Login() {
  const { login } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      await login(data);
      enqueueSnackbar('Login successful', { variant: 'success' });
      navigate('/customers');
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 3,
        backgroundColor: 'background.paper'
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: 'background.default'
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Login
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" mb={4}>
          Enter your credentials to access your account
        </Typography>
        
        <LoginForm onSubmit={handleSubmit} loading={loading} />
        
        <Grid container justifyContent="flex-end" mt={2}>
          <Grid item>
            <Link href="/auth/register" variant="body2">
              Don't have an account? Register
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Login;