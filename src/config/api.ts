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

export const getApiBase = (): string => {
  const url = getApiUrl()
  return url.endsWith('/api') ? url.slice(0, -4) : url
}
