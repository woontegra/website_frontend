const API_URL_RAW = import.meta.env.VITE_API_URL

const normalizeApiUrl = (input: string): string => input.trim().replace(/\/+$/, '')

const API_URL = typeof API_URL_RAW === 'string' ? normalizeApiUrl(API_URL_RAW) : ''

if (!API_URL) {
  console.error('VITE_API_URL environment variable is not defined!')
}

let warnedLocalApiPaytrMismatch = false

export const getApiUrl = (): string => {
  if (!API_URL) {
    throw new Error('API URL is not configured. Please set VITE_API_URL environment variable.')
  }
  if (
    import.meta.env.DEV &&
    !warnedLocalApiPaytrMismatch &&
    /localhost|127\.0\.0\.1/i.test(API_URL)
  ) {
    warnedLocalApiPaytrMismatch = true
    console.warn(
      '[woontegra-api] VITE_API_URL yerel backend’e işaret ediyor. PayTR Bildirim URL’si https://woontegra.com/api/... ise callback Railway DB’ye yazılır; sipariş ve başarı sayfası aynı veritabanı için VITE_API_URL’yi Railway veya https://woontegra.com/api olarak ayarlayın (frontend/.env.example “PayTR yerel testi”).',
    )
  }
  return API_URL
}

/** Backend kökü — uploads ve public asset'ler için (/api son eki yok) */
export const getApiBase = (): string => {
  const url = getApiUrl()
  if (!url.endsWith('/api')) return url.replace(/\/+$/, '')
  return url.length <= 4 ? '' : url.slice(0, -4)
}

/**
 * `/uploads/...` görsellerinin yükleneceği kök URL.
 * Öncelik: VITE_UPLOADS_BASE_URL → VITE_BACKEND_PUBLIC_URL → getApiBase() → tarayıcı origin (Vercel /uploads rewrite).
 */
export const getUploadsBase = (): string => {
  const fromEnv =
    import.meta.env.VITE_UPLOADS_BASE_URL?.trim() || import.meta.env.VITE_BACKEND_PUBLIC_URL?.trim()
  if (fromEnv) return fromEnv.replace(/\/+$/, '')

  const apiBase = getApiBase()
  if (apiBase) return apiBase

  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }

  return ''
}

/**
 * REST endpoint — VITE_API_URL tam kök veya .../api veya yerelde `/api` olabilir.
 * path zaten `/api/...` ile başlıyorsa tekrar `/api` eklenmez.
 */
export const buildApiUrl = (path: string): string => {
  const root = getApiBase()
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  if (normalizedPath === '/api' || normalizedPath.startsWith('/api/')) {
    return `${root}${normalizedPath}`
  }
  return `${root}/api${normalizedPath}`
}
