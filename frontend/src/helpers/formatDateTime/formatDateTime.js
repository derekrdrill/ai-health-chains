const DEFAULT_OPTIONS = Object.freeze({
  dateStyle: 'medium',
  timeStyle: 'short',
});

const formatDateTime = ({
  value,
  locale = 'en-US',
  options = DEFAULT_OPTIONS,
  fallback = 'N/A',
}) => {
  if (!value) return fallback;

  try {
    const dateValue = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(dateValue.getTime())) {
      return fallback;
    }
    return dateValue.toLocaleString(locale, options);
  } catch {
    return fallback;
  }
};

export default formatDateTime;

