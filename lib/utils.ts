export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `₹${num.toLocaleString('en-IN')}`;
}

export function formatDate(date: Date | string | null | undefined): string {
  // Handle null/undefined
  if (!date) {
    return 'N/A';
  }

  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid
  if (isNaN(d.getTime())) {
    return 'Invalid Date';
  }

  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDateTime(date: Date | string | null | undefined): string {
  // Handle null/undefined
  if (!date) {
    return 'N/A';
  }

  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid
  if (isNaN(d.getTime())) {
    return 'Invalid Date';
  }

  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
