import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Stack } from '@mui/material';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required')
});

function LoginForm({ onSubmit, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <TextField
          {...register('email')}
          label="Email"
          type="email"
          error={!!errors.email}
          helperText={errors.email?.message}
          fullWidth
          autoFocus
        />
        <TextField
          {...register('password')}
          label="Password"
          type="password"
          error={!!errors.password}
          helperText={errors.password?.message}
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          fullWidth
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </Stack>
    </form>
  );
}

export default LoginForm;