import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/providers/auth-provider'

function AdminRoute({ children }) {
  const { user } = useAuth()
  const location = useLocation()

  // Check if user has admin privileges (either staff or superuser)
  const isAdmin = user?.roles?.is_staff || user?.roles?.is_superuser

  if (!isAdmin) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />
  }

  return children
}

export default AdminRoute 