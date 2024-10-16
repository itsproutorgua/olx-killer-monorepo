import axios from 'axios'
import i18n from 'i18next'
import { getContentType } from '@/shared/api/api.helpers.ts'

const axiosOptions = {
  baseURL: import.meta.env.VITE_BASE_URL, // This would be http://olx.erpsolutions.com.ua:8000/en/api/v1/ initially
  headers: getContentType(),
  withCredentials: false,
}

export const instanceBase = axios.create(axiosOptions)

// Add interceptor to modify baseURL based on the current language
instanceBase.interceptors.request.use((config) => {
  // Get the current language from i18n
  const currentLang = i18n.language || 'en'

  // Modify the baseURL to include the current language dynamically
  if (config.baseURL) {
    config.baseURL = config.baseURL.replace('/en/', `/${currentLang}/`)
  }

  return config
}, (error) => {
  return Promise.reject(error)
})
