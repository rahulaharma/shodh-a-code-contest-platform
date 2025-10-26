import { session } from './session'
import { env } from '../config/env'

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

const buildUrl = (path = '', query) => {
  const base = env.apiBaseUrl.endsWith('/')
    ? env.apiBaseUrl
    : `${env.apiBaseUrl}/`
  const relativePath = String(path ?? '').replace(/^\/+/, '')
  const url = new URL(relativePath, base)

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null) return
      url.searchParams.set(key, String(value))
    })
  }

  return url
}

const maybeJson = async (response) => {
  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    return response.json()
  }
  return response.text()
}

export class HttpClient {
  constructor(tokenProvider = session.getAccessToken) {
    this.tokenProvider = tokenProvider
  }

  async request(path, options = {}) {
    const url = buildUrl(path, options.query)
    const headers = new Headers(options.headers)

    if (
      !(options.body instanceof FormData) &&
      options.body !== undefined &&
      !headers.has('Content-Type')
    ) {
      headers.set('Content-Type', 'application/json')
    }

    if (options.withAuth !== false) {
      const token = this.tokenProvider()
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
    }

    const response = await fetch(url, {
      method: options.method ?? 'GET',
      body:
        options.body instanceof FormData
          ? options.body
          : options.body !== undefined
            ? JSON.stringify(options.body)
            : undefined,
      headers,
      signal: options.signal,
    })

    if (!response.ok) {
      const payload = await maybeJson(response)
      throw new ApiError(
        payload?.message ?? response.statusText,
        response.status,
        payload,
      )
    }

    if (response.status === 204) {
      return undefined
    }

    return maybeJson(response)
  }
}

export const httpClient = new HttpClient()
