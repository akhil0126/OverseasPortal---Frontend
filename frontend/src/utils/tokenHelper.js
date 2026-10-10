import { TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY } from './constants'

export const tokenHelper = {
  getToken:        () => localStorage.getItem(TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  getUser:         () => { try { return JSON.parse(localStorage.getItem(USER_KEY)) } catch { return null } },

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem(TOKEN_KEY, accessToken)
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  },

  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),

  clear: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },

  isLoggedIn: () => !!localStorage.getItem(TOKEN_KEY),
}
