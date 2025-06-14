import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../ui/NotificationBell';
import UserMenu from './UserMenu';

function Header() {
  const { user } = useAuth();

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Collection Management
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <NotificationBell />
          {user && <UserMenu user={user} />}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;