import api from './api'

const studentService = {
  getProfile: () => api.get('/student/profile').then(r => r.data),
  updateProfile: (data) => api.put('/student/profile', data).then(r => r.data),
  changePassword: (currentPassword, newPassword) =>
    api.post('/student/change-password', { currentPassword, newPassword }).then(r => r.data),

  // Documents
  getDocuments: () => api.get('/documents/my').then(r => r.data),
  uploadDocument: (formData) =>
    api.post('/documents/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data),
  deleteDocument: (id) => api.delete(`/documents/${id}`).then(r => r.data),

  // Notifications
  getNotifications: (page = 0) =>
    api.get(`/notifications/my?page=${page}&size=20`).then(r => r.data),
  markNotificationRead: (id) => api.patch(`/notifications/${id}/read`).then(r => r.data),
  markAllNotificationsRead: () => api.patch('/notifications/read-all').then(r => r.data),
  getNotificationSummary: () => api.get('/notifications/summary').then(r => r.data),
}

export default studentService
