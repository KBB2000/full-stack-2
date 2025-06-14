export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'paid':
    case 'completed':
      return 'success';
    case 'overdue':
    case 'failed':
      return 'error';
    case 'pending':
      return 'warning';
    case 'partial':
      return 'info';
    default:
      return 'primary';
  }
};