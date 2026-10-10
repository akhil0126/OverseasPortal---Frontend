import api from './api'

const universityService = {
  search: (params) => api.get('/universities', { params }).then(r => r.data),
  getById: (id) => api.get(`/universities/${id}`).then(r => r.data),
  create: (data) => api.post('/universities', data).then(r => r.data),
  update: (id, data) => api.put(`/universities/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/universities/${id}`).then(r => r.data),

  // Courses
  getCourses: (universityId) => api.get(`/courses?universityId=${universityId}`).then(r => r.data),
  searchCourses: (params) => api.get('/courses', { params }).then(r => r.data),
  createCourse: (data) => api.post('/courses', data).then(r => r.data),
  updateCourse: (id, data) => api.put(`/courses/${id}`, data).then(r => r.data),
  deleteCourse: (id) => api.delete(`/courses/${id}`).then(r => r.data),
}

export default universityService
