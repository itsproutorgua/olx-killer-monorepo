import axios, { CreateAxiosDefaults } from 'axios'

import { getContentType } from '@/shared/api/api.helpers.ts'

const axiosOptions: CreateAxiosDefaults = {
  baseURL: import.meta.env.BASE_URL,
  headers: getContentType(),
  withCredentials: true,
}

export const instanceBase = axios.create(axiosOptions)
