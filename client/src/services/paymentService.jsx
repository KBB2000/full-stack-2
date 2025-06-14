import apiClient from './apiClient';

export const getPayments = async (params = {}) => {
  return apiClient.get('/payments', { params });
};

export const getPayment = async (id) => {
  return apiClient.get(`/payments/${id}`);
};

export const createPayment = async (paymentData) => {
  return apiClient.post('/payments', paymentData);
};

export const updatePayment = async (id, paymentData) => {
  return apiClient.put(`/payments/${id}`, paymentData);
};

export const deletePayment = async (id) => {
  return apiClient.delete(`/payments/${id}`);
};