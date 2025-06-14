import { Box, CircularProgress } from '@mui/material';

function Loading({ fullScreen = false }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: fullScreen ? '100vh' : '100%',
        width: fullScreen ? '100vw' : '100%'
      }}
    >
      <CircularProgress />
    </Box>
  );
}

export default Loading;