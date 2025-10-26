const ACCESS_TOKEN_KEY = 'shodh_access_token'
const REFRESH_TOKEN_KEY = 'shodh_refresh_token'

const safeWindow = typeof window !== 'undefined' ? window : undefined

const getStorage = () => safeWindow?.localStorage

export const session = {
  getAccessToken: () => getStorage()?.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => getStorage()?.getItem(REFRESH_TOKEN_KEY),
  setTokens: ({ accessToken, token, refreshToken } = {}) => {
    const storage = getStorage()
    if (!storage) return

    const nextToken = accessToken ?? token
    if (nextToken) {
      storage.setItem(ACCESS_TOKEN_KEY, nextToken)
    } else {
      storage.removeItem(ACCESS_TOKEN_KEY)
    }

    if (refreshToken) {
      storage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    } else {
      storage.removeItem(REFRESH_TOKEN_KEY)
    }
  },
  clear: () => {
    const storage = getStorage()
    if (!storage) return
    storage.removeItem(ACCESS_TOKEN_KEY)
    storage.removeItem(REFRESH_TOKEN_KEY)
  },
}
