import axios from 'axios'

const API_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('userRole')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (userData) => api.post('/register', userData),
  login: (credentials) => api.post('/login', credentials),
  logout: () => api.post('/logout'),
  getUser: () => api.get('/user'),
  updateProfile: (data) => api.put('/user/profile', data),
  changePassword: (data) => api.post('/user/change-password', data),
}

// Room API
export const roomAPI = {
  getAll: () => api.get('/rooms'),
  getAvailability: (params) => api.get('/rooms/availability', { params }),
  getCalendar: (params) => api.get('/rooms/calendar', { params }),
  getRoomDetails: (id) => api.get(`/rooms/${id}`),
}

// Reservation API
export const reservationAPI = {
  getAll: () => api.get('/reservations'),
  getMyBookings: () => api.get('/my-bookings'),
  create: (data) => api.post('/reservations', data),
  cancel: (id) => api.post(`/reservations/${id}/cancel`),
  checkIn: (id) => api.post(`/reservations/${id}/check-in`),
  checkOut: (id) => api.post(`/reservations/${id}/check-out`),
}

// Admin API
export const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard'),
  getRecentActivity: () => api.get('/admin/activity'),
  
  // User Management
  getUsers: (params) => api.get('/admin/users', { params }),
  createUser: (data) => api.post('/admin/users', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deactivateUser: (id) => api.patch(`/admin/users/${id}/deactivate`),
  activateUser: (id) => api.patch(`/admin/users/${id}/activate`),
  
  // Room Management
  getRooms: () => api.get('/admin/rooms'),
  createRoom: (data) => api.post('/admin/rooms', data),
  updateRoom: (id, data) => api.put(`/admin/rooms/${id}`, data),
  archiveRoom: (id) => api.patch(`/admin/rooms/${id}/archive`),
  restoreRoom: (id) => api.patch(`/admin/rooms/${id}/restore`),
  
  // Add-on Management
  getAddOns: () => api.get('/admin/addons'),
  createAddOn: (data) => api.post('/admin/addons', data),
  updateAddOn: (id, data) => api.put(`/admin/addons/${id}`, data),
  toggleAddOnStatus: (id) => api.patch(`/admin/addons/${id}/toggle`),
  deleteAddOn: (id) => api.delete(`/admin/addons/${id}`),
}

// Manager API
export const managerAPI = {
  getDashboardStats: () => api.get('/manager/dashboard'),
  getReservations: () => api.get('/manager/reservations'),
  getGuests: () => api.get('/manager/guests'),
  approveDiscount: (id, data) => api.post(`/manager/discounts/${id}/approve`, data),
  rejectDiscount: (id, data) => api.post(`/manager/discounts/${id}/reject`, data),
  generateReport: (type, params) => api.post(`/manager/reports/generate/${type}`, params),
}

// Staff API
export const staffAPI = {
  getDashboardStats: () => api.get('/staff/dashboard'),
  checkInGuest: (id, data) => api.post(`/staff/checkin/${id}`, data),
  checkOutGuest: (id, data) => api.post(`/staff/checkout/${id}`, data),
  getGuests: () => api.get('/staff/guests'),
  getReservations: () => api.get('/staff/reservations'),
  getRooms: () => api.get('/staff/rooms'),
  createBill: (data) => api.post('/staff/billing', data),
  logCompliance: (data) => api.post('/staff/house-rules', data),
}

export default api