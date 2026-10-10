import api from './api'

const subscriptionService = {
  getPlans: () => api.get('/subscriptions/plans').then(r => r.data),
  getMyStatus: () => api.get('/subscriptions/my-status').then(r => r.data),
  subscribe: (planId, paymentReference = '') =>
    api.post('/subscriptions/subscribe', { planId, paymentReference }).then(r => r.data),
  cancel: () => api.delete('/subscriptions/cancel').then(r => r.data),
}

export default subscriptionService
