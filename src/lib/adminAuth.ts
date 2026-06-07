import { buildApiUrl } from '../config/api'

const TOKEN_KEY = 'woontegra_token'
const REFRESH_KEY = 'woontegra_refresh_token'

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function saveAdminSession(token: string, refreshToken?: string) {
  localStorage.setItem(TOKEN_KEY, token)
  if (refreshToken) {
    localStorage.setItem(REFRESH_KEY, refreshToken)
  }
}

export function clearAdminSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

export function isJwtExpired(token: string, skewSeconds = 30): boolean {
  try {
    const part = token.split('.')[1]
    if (!part) return true
    const payload = JSON.parse(atob(part.replace(/-/g, '+').replace(/_/g, '/'))) as { exp?: number }
    if (!payload.exp) return false
    return Date.now() >= payload.exp * 1000 - skewSeconds * 1000
  } catch {
    return true
  }
}

export function redirectToAdminLogin() {
  if (typeof window === 'undefined') return
  if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/giris') {
    window.location.href = '/admin/giris'
  }
}

export async function refreshAdminToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem(REFRESH_KEY)
  if (!refreshToken) {
    clearAdminSession()
    return null
  }

  try {
    const response = await fetch(buildApiUrl('/auth/refresh'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    const data = (await response.json()) as { success?: boolean; token?: string }
    if (!response.ok || !data.success || !data.token) {
      clearAdminSession()
      return null
    }
    localStorage.setItem(TOKEN_KEY, data.token)
    return data.token
  } catch {
    clearAdminSession()
    return null
  }
}

export async function ensureAdminToken(): Promise<string | null> {
  const current = getAdminToken()
  if (!current) return null
  if (!isJwtExpired(current)) return current
  return refreshAdminToken()
}

export async function adminFetch(input: string, init: RequestInit = {}): Promise<Response> {
  let token = await ensureAdminToken()
  if (!token) {
    redirectToAdminLogin()
    throw new Error('Oturum gerekli')
  }

  const headers = new Headers(init.headers)
  headers.set('Authorization', `Bearer ${token}`)
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  let response = await fetch(input, { ...init, headers })

  if (response.status === 401) {
    token = await refreshAdminToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
      response = await fetch(input, { ...init, headers })
    }
  }

  if (response.status === 401) {
    clearAdminSession()
    redirectToAdminLogin()
    throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.')
  }

  return response
}
