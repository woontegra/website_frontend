import { Navigate, Outlet, useLocation } from 'react-router-dom'

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
  const token = localStorage.getItem('woontegra_token')
  if (!token) {
    return <Navigate to="/admin/giris" replace state={{ from: location.pathname }} />
  }
  if (parseJwtRole(token) !== 'admin') {
    localStorage.removeItem('woontegra_token')
    return <Navigate to="/admin/giris" replace />
  }
  return <Outlet />
}
