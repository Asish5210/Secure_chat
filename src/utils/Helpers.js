// src/utils/helpers.js
export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) 
      ? 'Invalid date' 
      : date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
};

export const truncateString = (str, num = 10) => {
  if (typeof str !== 'string') return '';
  return str.length <= num 
    ? str 
    : `${str.slice(0, num)}...${str.slice(-4)}`;
};