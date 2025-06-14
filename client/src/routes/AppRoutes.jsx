import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';
import Customers from '../pages/customers/Customers.jsx';
import CustomerDetails from '../pages/customers/CustomerDetails.jsx';
import AddCustomer from '../pages/customers/AddCustomer.jsx';
import UploadCustomers from '../pages/customers/UploadCustomers.jsx';
import Payments from '../pages/payments/Payments.jsx';
import PaymentDetails from '../pages/payments/PaymentDetails.jsx';
import AddPayment from '../pages/payments/AddPayment.jsx';

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/auth/login" element={!isAuthenticated ? <Login /> : <Navigate to="/customers" />} />
      <Route path="/auth/register" element={!isAuthenticated ? <Register /> : <Navigate to="/customers" />} />

      {/* Customer Routes */}
      <Route path="/customers" element={isAuthenticated ? <Customers /> : <Navigate to="/auth/login" />} />
      <Route path="/customers/add" element={isAuthenticated ? <AddCustomer /> : <Navigate to="/auth/login" />} />
      <Route path="/customers/upload" element={isAuthenticated ? <UploadCustomers /> : <Navigate to="/auth/login" />} />
      <Route path="/customers/edit/:id" element={isAuthenticated ? <CustomerDetails /> : <Navigate to="/auth/login" />} />

      {/* Payment Routes */}
      <Route path="/payments" element={isAuthenticated ? <Payments /> : <Navigate to="/auth/login" />} />
      <Route path="/payments/add" element={isAuthenticated ? <AddPayment /> : <Navigate to="/auth/login" />} />
      <Route path="/payments/:id" element={isAuthenticated ? <PaymentDetails /> : <Navigate to="/auth/login" />} />

      {/* Default Route */}
      <Route path="/" element={<Navigate to={isAuthenticated ? '/customers' : '/auth/login'} />} />
    </Routes>
  );
}

export default AppRoutes;