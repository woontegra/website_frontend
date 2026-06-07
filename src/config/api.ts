const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
  console.error('VITE_API_URL environment variable is not defined!')
}

export const getApiUrl = (): string => {
  if (!API_URL) {
    throw new Error('API URL is not configured. Please set VITE_API_URL environment variable.')
  }
  return API_URL
}

/** Backend kökü — uploads ve public asset'ler için (/api olmadan) */
export const getApiBase = (): string => {
  const url = getApiUrl()
  return url.endsWith('/api') ? url.slice(0, -4) : url
}

/** REST endpoint — VITE_API_URL /api ile veya /api olmadan verilebilir */
export const buildApiUrl = (path: string): string => {
  const root = getApiBase()
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${root}/api${normalizedPath}`
}
