export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/+$/, '')

export const ROLES = {
  STUDENT:  'ROLE_STUDENT',
  PROVIDER: 'ROLE_PROVIDER',
  ADMIN:    'ROLE_ADMIN',
}

export const APPLICATION_STATUSES = {
  DRAFT:              { label: 'Draft',              color: 'gray'   },
  SUBMITTED:          { label: 'Submitted',          color: 'blue'   },
  UNDER_REVIEW:       { label: 'Under Review',       color: 'purple' },
  DOCUMENTS_REQUIRED: { label: 'Docs Required',      color: 'gold'   },
  OFFER_RECEIVED:     { label: 'Offer Received',     color: 'green'  },
  ACCEPTED:           { label: 'Accepted',           color: 'green'  },
  REJECTED:           { label: 'Rejected',           color: 'red'    },
  DEFERRED:           { label: 'Deferred',           color: 'gray'   },
  WITHDRAWN:          { label: 'Withdrawn',          color: 'gray'   },
  ENROLLED:           { label: 'Enrolled',           color: 'green'  },
}

export const BOOKING_STATUSES = {
  PENDING:    { label: 'Pending',     color: 'gold'   },
  CONFIRMED:  { label: 'Confirmed',   color: 'blue'   },
  IN_PROGRESS:{ label: 'In Progress', color: 'purple' },
  COMPLETED:  { label: 'Completed',   color: 'green'  },
  CANCELLED:  { label: 'Cancelled',   color: 'red'    },
  REFUNDED:   { label: 'Refunded',    color: 'gray'   },
  NO_SHOW:    { label: 'No Show',     color: 'red'    },
}

export const PROVIDER_TYPES = [
  'AGENCY', 'CONSULTANT', 'UNIVERSITY_PARTNER',
  'ACCOMMODATION_PROVIDER', 'VISA_SPECIALIST',
  'LANGUAGE_INSTITUTE', 'INSURANCE_PROVIDER',
  'BANK', 'TRANSPORT', 'OTHER',
]

export const DEGREE_LEVELS = ["Bachelor's", "Master's", "PhD", "Diploma", "Certificate", "Foundation"]

export const ENGLISH_TESTS = ['IELTS', 'TOEFL', 'Duolingo', 'PTE', 'Cambridge', 'Not Required']

export const COUNTRIES = [
  'Australia', 'Canada', 'Germany', 'Ireland', 'New Zealand',
  'United Kingdom', 'United States', 'France', 'Netherlands',
  'Sweden', 'Norway', 'Denmark', 'Switzerland', 'Singapore',
  'Japan', 'South Korea', 'India', 'UAE',
]

export const TOKEN_KEY        = 'overseas_access_token'
export const REFRESH_TOKEN_KEY = 'overseas_refresh_token'
export const USER_KEY          = 'overseas_user'
