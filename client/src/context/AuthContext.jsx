import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { register as authRegister, login as authLogin, getMe } from '../services/authService';
import { useSnackbar } from 'notistack';
import { setToken, removeToken, getToken } from '../utils/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();
      
      if (token) {
        try {
          const currentUser = await getMe();
          setUser(currentUser);
          setIsAuthenticated(true);
        } catch (err) {
          removeToken();
        }
      }
      setLoading(false);
    };
    
    initializeAuth();
  }, []);

  const register = async (userData) => {
    try {
      const { token, user } = await authRegister(userData);
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (err) {
      throw err;
    }
  };

  // ... rest of your auth context (login, logout, etc.)

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        register,
        // ... other auth methods
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);