import { apiClient } from './axios'

export const login = (credentials) =>
  apiClient.post('auth/login', credentials, { withAuth: false })

export const register = (payload) =>
  apiClient.post('auth/register', payload, { withAuth: false })
