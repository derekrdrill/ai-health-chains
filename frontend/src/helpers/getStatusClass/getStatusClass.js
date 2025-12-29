const strategies = {
  consent: (status) => (status === 'active' ? 'active' : 'pending'),
  default: (status) => (status ? status.toLowerCase() : 'pending'),
};

const getStatusClass = ({ status, variant = 'default' }) => {
  const resolver = strategies[variant] || strategies.default;
  return resolver(status);
};

export default getStatusClass;
