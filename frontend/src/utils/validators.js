export const validators = {
  required: (msg = 'This field is required') => ({ required: msg }),

  email: {
    required: 'Email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Enter a valid email address',
    },
  },

  password: {
    required: 'Password is required',
    minLength: { value: 8, message: 'Password must be at least 8 characters' },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      message: 'Must contain uppercase, lowercase, and a number',
    },
  },

  phone: {
    required: 'Phone number is required',
    pattern: {
      value: /^\+?[\d\s\-().]{7,15}$/,
      message: 'Enter a valid phone number',
    },
  },

  name: (label = 'Name') => ({
    required: `${label} is required`,
    minLength: { value: 2, message: `${label} must be at least 2 characters` },
    maxLength: { value: 50, message: `${label} must be 50 characters or less` },
  }),

  gpa: {
    min: { value: 0, message: 'GPA cannot be negative' },
    max: { value: 4.0, message: 'GPA cannot exceed 4.0' },
  },

  ielts: {
    min: { value: 0, message: 'Score cannot be negative' },
    max: { value: 9, message: 'IELTS max score is 9.0' },
  },
}

export const formatCurrency = (amount, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount ?? 0)

export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(dateStr))
}

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—'
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(dateStr))
}

export const truncate = (str, max = 80) =>
  str && str.length > max ? str.slice(0, max) + '…' : str
