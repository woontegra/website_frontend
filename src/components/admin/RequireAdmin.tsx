import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { clearAdminSession, getAdminToken, isJwtExpired } from '../../lib/adminAuth'

function parseJwtRole(token: string): string | null {
  try {
    const part = token.split('.')[1]
    if (!part) return null
    const json = JSON.parse(atob(part.replace(/-/g, '+').replace(/_/g, '/')))
    return json.role ?? null
  } catch {
    return null
  }
}

export function RequireAdmin() {
  const location = useLocation()
  const token = getAdminToken()

  if (!token || isJwtExpired(token)) {
    if (token) clearAdminSession()
    return <Navigate to="/admin/giris" replace state={{ from: location.pathname }} />
  }

  if (parseJwtRole(token) !== 'admin') {
    clearAdminSession()
    return <Navigate to="/admin/giris" replace />
  }

  return <Outlet />
}
