import axios from 'axios'
import { getApiUrl } from '../config/api'
import { clearAdminSession, getAdminToken, redirectToAdminLogin, refreshAdminToken } from '../lib/adminAuth'

const API_BASE = getApiUrl()
const API_URL = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = getAdminToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && original && !original._retried) {
      original._retried = true
      const token = await refreshAdminToken()
      if (token) {
        original.headers.Authorization = `Bearer ${token}`
        return apiClient(original)
      }
      clearAdminSession()
      redirectToAdminLogin()
    }
    return Promise.reject(error)
  }
)
