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
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: `${config.baseURL}${config.url}`,
      data: config.data,
      dataStringified: JSON.stringify(config.data),
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
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred'
    return Promise.reject(new Error(message))
  }
)

export { BASE_URL }
