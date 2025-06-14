import { useState, useEffect } from 'react';
import { Badge, IconButton, Popover, Box, Typography, Button } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useSocket } from '../../context/SocketContext';
import { useSnackbar } from 'notistack';
import { useNotifications } from '../../hooks/useNotifications';

function NotificationBell() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { socket } = useSocket();
  const { enqueueSnackbar } = useSnackbar();
  const { data: notifications, markAsRead, markAllAsRead } = useNotifications();
  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  useEffect(() => {
    if (socket) {
      socket.on('paymentReceived', (data) => {
        enqueueSnackbar(`Payment received from ${data.customer.name}: $${data.payment.amount}`, {
          variant: 'success',
          persist: true
        });
      });

      socket.on('newCustomer', (customer) => {
        enqueueSnackbar(`New customer added: ${customer.name}`, {
          variant: 'info',
          persist: true
        });
      });

      socket.on('paymentOverdue', (customer) => {
        enqueueSnackbar(`Payment overdue for ${customer.name}`, {
          variant: 'error',
          persist: true
        });
      });
    }

    return () => {
      if (socket) {
        socket.off('paymentReceived');
        socket.off('newCustomer');
        socket.off('paymentOverdue');
      }
    };
  }, [socket, enqueueSnackbar]);

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ p: 2, width: 360 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Notifications</Typography>
            {unreadCount > 0 && (
              <Button size="small" onClick={handleMarkAllAsRead}>
                Mark all as read
              </Button>
            )}
          </Box>
          {notifications?.length ? (
            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
              {notifications.map((notification) => (
                <Box
                  key={notification._id}
                  sx={{
                    p: 2,
                    mb: 1,
                    borderRadius: 1,
                    bgcolor: notification.read ? 'background.default' : 'action.selected',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                  onClick={() => handleMarkAsRead(notification._id)}
                >
                  <Typography variant="body2">{notification.message}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(notification.createdAt).toLocaleString()}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" align="center" py={2}>
              No notifications
            </Typography>
          )}
        </Box>
      </Popover>
    </>
  );
}

export default NotificationBell;