import { getApiUrl } from '../config/api'

export type SifreKasasiDownloadStats = {
  total: number
  setup: number
  portable: number
}

function apiRoot(): string {
  const url = getApiUrl()
  return url.endsWith('/api') ? url : `${url}/api`
}

export async function fetchSifreKasasiStats(): Promise<SifreKasasiDownloadStats | null> {
  try {
    const res = await fetch(`${apiRoot()}/public/downloads/sifre-kasasi/stats`)
    const json = await res.json().catch(() => ({}))
    if (!res.ok || !json.success || !json.data) return null
    return json.data as SifreKasasiDownloadStats
  } catch {
    return null
  }
}

export function getSifreKasasiSetupDownloadUrl(): string {
  return `${apiRoot()}/public/downloads/sifre-kasasi/setup`
}

export function getSifreKasasiPortableDownloadUrl(): string {
  return `${apiRoot()}/public/downloads/sifre-kasasi/portable`
}
