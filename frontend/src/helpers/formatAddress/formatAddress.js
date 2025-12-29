const formatAddress = ({
  address,
  prefixLength = 6,
  suffixLength = 4,
  fallback = 'N/A',
}) => {
  if (!address) return fallback;

  if (address.length <= prefixLength + suffixLength) {
    return address;
  }

  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
};

export default formatAddress;
