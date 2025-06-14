import { IconButton, Menu, MenuItem, ListItemIcon, Tooltip } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useDeletePayment } from '../../hooks/usePayments';
import { useSnackbar } from 'notistack';

function PaymentActions({ payment }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { mutate: deletePayment } = useDeletePayment();
  const { enqueueSnackbar } = useSnackbar();

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    handleCloseMenu();
    if (window.confirm('Are you sure you want to delete this payment?')) {
      deletePayment(payment._id, {
        onSuccess: () => {
          enqueueSnackbar('Payment deleted successfully', { variant: 'success' });
        },
        onError: (error) => {
          enqueueSnackbar(error.message, { variant: 'error' });
        }
      });
    }
  };

  return (
    <>
      <Tooltip title="Actions">
        <IconButton onClick={handleOpenMenu}>
          <MoreIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem component={Link} to={`/payments/${payment._id}`}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          View
        </MenuItem>
        <MenuItem component={Link} to={`/payments/${payment._id}/edit`}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography color="error">Delete</Typography>
        </MenuItem>
      </Menu>
    </>
  );
}

export default PaymentActions;