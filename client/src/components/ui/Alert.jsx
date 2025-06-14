import { Alert as MuiAlert } from '@mui/material';

function Alert({ severity = 'info', children, onClose, ...props }) {
  return (
    <MuiAlert severity={severity} onClose={onClose} {...props}>
      {children}
    </MuiAlert>
  );
}

export default Alert;