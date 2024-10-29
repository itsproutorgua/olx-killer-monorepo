import axios from 'axios'
import i18n from 'i18next'

import { getContentType } from '@/shared/api/api.helpers.ts'
import { APP_VARIABLES } from '@/shared/constants/app.const.ts'

const axiosOptions = {
  baseURL: APP_VARIABLES.BASE_URL, // This would be http://olx.erpsolutions.com.ua:8000/en/api/v1/ initially
  headers: getContentType(),
  withCredentials: false,
}

export const instanceBase = axios.create(axiosOptions)

// Add interceptor to modify baseURL based on the current language
instanceBase.interceptors.request.use(
  config => {
    // Get the current language from i18n
    let currentLang = i18n.language || 'en'

    // Check if the current language is either 'uk' or 'en', otherwise default to 'en'
    if (currentLang !== 'uk' && currentLang !== 'en') {
      currentLang = 'en'
    }

    // Modify the baseURL to include the current language dynamically
    if (config.baseURL) {
      config.baseURL = config.baseURL.replace('/en/', `/${currentLang}/`)
    }

    return config
  },
  error => {
    return Promise.reject(error)
  },
)
