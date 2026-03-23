import { useEffect, useState } from 'react'
import { fetchPublicPage } from '../api/pages'
import type { PageApiResponse } from '../types/page-api'

export function usePage(slug: string) {
  const [data, setData] = useState<PageApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(null)
    fetchPublicPage(slug).then((r) => {
      if (!alive) return
      if (r.status === 'ok') {
        setData(r.data)
      } else if (r.status === 'not_found') {
        setData(null)
      } else {
        setError(r.message)
        setData(null)
      }
      setLoading(false)
    })
    return () => {
      alive = false
    }
  }, [slug])

  return { data, loading, error }
}
