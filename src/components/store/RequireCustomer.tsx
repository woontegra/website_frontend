import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { clearCustomerSession, getCustomerToken, isCustomerToken, isJwtExpired } from '../../lib/customerAuth'

export function RequireCustomer() {
  const location = useLocation()
  const token = getCustomerToken()

  if (!token || isJwtExpired(token) || !isCustomerToken(token)) {
    if (token) clearCustomerSession()
    return <Navigate to={`/giris?return=${encodeURIComponent(location.pathname + location.search)}`} replace />
  }

  return <Outlet />
}
