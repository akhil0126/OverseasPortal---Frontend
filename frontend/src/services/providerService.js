import api from './api'

const providerService = {
  getMyProfile: () => api.get('/provider/profile').then(r => r.data),
  updateMyProfile: (data) => api.put('/provider/profile', data).then(r => r.data),
  getPublicProfile: (id) => api.get(`/providers/public/${id}`).then(r => r.data),
  search: (params) => api.get('/providers/public', { params }).then(r => r.data),

  getMyListings: () => api.get('/services/my-listings').then(r => r.data),
  createListing: (data) => api.post('/services', data).then(r => r.data),
  updateListing: (id, data) => api.put(`/services/${id}`, data).then(r => r.data),
  deleteListing: (id) => api.delete(`/services/${id}`).then(r => r.data),

  getMyBookings: (params) => api.get('/bookings/provider', { params }).then(r => r.data),
  confirmBooking: (id) => api.patch(`/bookings/${id}/confirm`).then(r => r.data),
  completeBooking: (id) => api.patch(`/bookings/${id}/complete`).then(r => r.data),
  cancelBooking: (id, reason) => api.patch(`/bookings/${id}/cancel`, { reason }).then(r => r.data),

  getReviews: (providerId, params) => api.get(`/reviews/provider/${providerId}`, { params }).then(r => r.data),
  respondToReview: (reviewId, response) => api.patch(`/reviews/${reviewId}/respond`, { response }).then(r => r.data),
}

export default providerService
