import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useSnackbar } from 'notistack';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { isAuthenticated, user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (isAuthenticated && user && !socket) {
      const newSocket = io(process.env.REACT_APP_BASE_URL, {
        withCredentials: true,
        auth: {
          token: localStorage.getItem('token')
        }
      });

      newSocket.on('connect', () => {
        console.log('Connected to WebSocket server');
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
      });

      newSocket.on('paymentReceived', (data) => {
        enqueueSnackbar(`Payment received from ${data.customer.name}: $${data.payment.amount}`, { 
          variant: 'success',
          persist: true
        });
      });

      newSocket.on('newCustomer', (customer) => {
        enqueueSnackbar(`New customer added: ${customer.name}`, { 
          variant: 'info',
          persist: true
        });
      });

      newSocket.on('paymentOverdue', (customer) => {
        enqueueSnackbar(`Payment overdue for ${customer.name}`, { 
          variant: 'error',
          persist: true
        });
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);