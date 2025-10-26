import { httpClient } from '../lib/httpClient'

/**
 * Lightweight wrapper that keeps parity with Axios-style method calls.
 * Swap this implementation with a real Axios instance later without touching callers.
 */
export const apiClient = {
  get: (path, options) => httpClient.request(path, { ...options, method: 'GET' }),
  post: (path, body, options) =>
    httpClient.request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) =>
    httpClient.request(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options) =>
    httpClient.request(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) =>
    httpClient.request(path, { ...options, method: 'DELETE' }),
  request: (path, options) => httpClient.request(path, options),
}
