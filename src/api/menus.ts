import { apiBase } from './cms'

export type PublicMenuItem = { id: string; label: string; href: string }

export async function fetchPublicMenu(location: 'header' | 'footer'): Promise<PublicMenuItem[]> {
  try {
    const res = await fetch(`${apiBase()}/api/menus/${location}`)
    const json = await res.json().catch(() => ({}))
    if (!res.ok || !json.success || !json.data?.items) return []
    return json.data.items as PublicMenuItem[]
  } catch {
    return []
  }
}
