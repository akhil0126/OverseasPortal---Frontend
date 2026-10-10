import api from './api'

const adminService = {
  getDashboard: () => api.get('/admin/dashboard').then(r => r.data),

  getUsers: (params) => api.get('/admin/users', { params }).then(r => r.data),
  getUserById: (id) => api.get(`/admin/users/${id}`).then(r => r.data),
  toggleUserActive: (id) => api.patch(`/admin/users/${id}/toggle-active`).then(r => r.data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`).then(r => r.data),

  getProviders: (params) => api.get('/providers/public', { params }).then(r => r.data),
  verifyProvider: (profileId, verified) =>
    api.patch(`/admin/providers/${profileId}/verify`, { verified }).then(r => r.data),

  getUniversities: (params) => api.get('/universities', { params }).then(r => r.data),
  createUniversity: (data) => api.post('/universities', data).then(r => r.data),
  updateUniversity: (id, data) => api.put(`/universities/${id}`, data).then(r => r.data),
  deleteUniversity: (id) => api.delete(`/universities/${id}`).then(r => r.data),

  getAllApplications: (params) => api.get('/applications', { params }).then(r => r.data),
  updateApplicationStatus: (id, status, adminNotes) =>
    api.patch(`/applications/${id}/status`, { status, adminNotes }).then(r => r.data),

  getAllSubscriptions: (params) => api.get('/admin/subscriptions', { params }).then(r => r.data),
  getSubscriptionPlans: () => api.get('/subscriptions/plans').then(r => r.data),
}

export default adminService
