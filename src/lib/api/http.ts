import axios from 'axios'

const BASE_URL = import.meta.env.DEV
  ? (import.meta.env.VITE_COREFOUNDRY_API_URL || 'http://localhost:8000/api')
  : '/api'

export const http = axios.create({
  baseURL: BASE_URL,
  timeout: 180000, 
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
})

http.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: `${config.baseURL}${config.url}`,
      data: config.data,
      dataStringified: JSON.stringify(config.data),
      hasToken: !!token,
      headers: Object.fromEntries(
        Object.entries(config.headers || {}).filter(([_, v]) => v !== undefined)
      )
    })
    return config
  },
  (error) => Promise.reject(error)
)

http.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    })
    return response
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    })
    
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      console.warn('🔒 Unauthorized - clearing auth token')
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      // Redirect to login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred'
    return Promise.reject(new Error(message))
  }
)

export { BASE_URL }
