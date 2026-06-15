import { buildApiUrl } from '../config/api'

const TOKEN_KEY = 'woontegra_customer_token'
const PROFILE_KEY = 'woontegra_customer_profile'

export type CustomerProfile = { id: string; name: string; email: string; phone?: string | null }

export function getCustomerToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getCustomerProfile(): CustomerProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as CustomerProfile
  } catch {
    return null
  }
}

export function saveCustomerSession(token: string, profile: CustomerProfile) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

export function clearCustomerSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(PROFILE_KEY)
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

export function isCustomerToken(token: string): boolean {
  try {
    const part = token.split('.')[1]
    if (!part) return false
    const payload = JSON.parse(atob(part.replace(/-/g, '+').replace(/_/g, '/'))) as { aud?: string }
    return payload.aud === 'customer'
  } catch {
    return false
  }
}

export function redirectToCustomerLogin(returnPath?: string) {
  if (typeof window === 'undefined') return
  const q = returnPath ? `?return=${encodeURIComponent(returnPath)}` : ''
  window.location.href = `/giris${q}`
}

export async function customerFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = getCustomerToken()
  const headers = new Headers(init.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  return fetch(buildApiUrl(path), { ...init, headers })
}
