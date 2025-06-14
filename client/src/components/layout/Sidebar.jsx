import React from 'react';
import { 
  Drawer, 
  List, 
  ListItemButton, // Changed from ListItem
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Toolbar 
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  People as CustomersIcon,
  Payment as PaymentsIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";

const drawerWidth = 240;

export default function Sidebar() {
  const { logout } = useAuth();

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/'
    },
    {
      text: 'Customers',
      icon: <CustomersIcon />,
      path: '/customers'
    },
    {
      text: 'Payments',
      icon: <PaymentsIcon />,
      path: '/payments'
    }
  ];

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box'
        }
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItemButton 
            component={Link}
            to={item.path}
            key={item.text}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <List>
        <ListItemButton onClick={logout}>
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}