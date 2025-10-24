import axios from 'axios'
import { useLoadingStore } from '@/stores/globals/loading'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 🌀 Interceptadores para controlar o loading global
api.interceptors.request.use(
  (config) => {
    const loadingStore = useLoadingStore()
    loadingStore.start()
    return config
  },
  (error) => {
    const loadingStore = useLoadingStore()
    loadingStore.stop()
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    const loadingStore = useLoadingStore()
    loadingStore.stop()
    return response
  },
  (error) => {
    const loadingStore = useLoadingStore()
    loadingStore.stop()
    return Promise.reject(error)
  }
)

export default api
