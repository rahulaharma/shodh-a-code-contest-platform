const DEFAULT_API_BASE_URL = 'http://localhost:8080/api'

const normalize = (value, fallback) => value?.trim() || fallback

export const env = {
  apiBaseUrl: normalize(import.meta.env.VITE_API_BASE_URL, DEFAULT_API_BASE_URL),
  appEnv: import.meta.env.VITE_APP_ENV ?? 'development',
}

export const isProd = env.appEnv === 'production'
export const isDev = env.appEnv === 'development'
