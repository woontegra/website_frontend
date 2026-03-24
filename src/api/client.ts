import axios from 'axios'
import { getApiUrl } from '../config/api'

const API_BASE = getApiUrl()
const API_URL = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/giris') {
        window.location.href = '/admin/giris'
      }
    }
    return Promise.reject(error)
  }
)
