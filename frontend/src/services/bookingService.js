import api from './api'

const bookingService = {
  getMyBookings: (params) => api.get('/bookings/my', { params }).then(r => r.data),
  getProviderBookings: (params) => api.get('/bookings/provider', { params }).then(r => r.data),
  getById: (id) => api.get(`/bookings/${id}`).then(r => r.data),
  create: (data) => api.post('/bookings', data).then(r => r.data),
  confirm: (id) => api.patch(`/bookings/${id}/confirm`).then(r => r.data),
  complete: (id) => api.patch(`/bookings/${id}/complete`).then(r => r.data),
  cancel: (id, reason) => api.patch(`/bookings/${id}/cancel`, { reason }).then(r => r.data),

  // Applications
  getMyApplications: (params) => api.get('/applications/my', { params }).then(r => r.data),
  getApplicationById: (id) => api.get(`/applications/${id}`).then(r => r.data),
  createApplication: (data) => api.post('/applications', data).then(r => r.data),
  submitApplication: (id) => api.patch(`/applications/${id}/submit`).then(r => r.data),
  withdrawApplication: (id) => api.patch(`/applications/${id}/withdraw`).then(r => r.data),

  // Services marketplace
  searchServices: (params) => api.get('/services', { params }).then(r => r.data),
  getServiceById: (id) => api.get(`/services/${id}`).then(r => r.data),
  getCategories: () => api.get('/services/categories').then(r => r.data),
}

export default bookingService
