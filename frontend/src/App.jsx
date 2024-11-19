import { Routes, Route } from 'react-router-dom'
import RootLayout from '@/components/layout/root-layout'
import LandingPage from '@/pages/landing'
import AuthPage from '@/pages/auth'
import DashboardPage from '@/pages/dashboard'
import NotFoundPage from '@/pages/not-found'
import UnauthorizedPage from '@/pages/unauthorized'
import AppProvider from '@/providers/app-provider'
import BlogPage from '@/pages/blog'
import SettingsPage from '@/pages/settings'
import AdminPage from '@/pages/admin'
import AdminRoute from '@/components/auth/admin-route'
import ProtectedRoute from '@/components/auth/protected-route'

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route element={<RootLayout />}>
          {/* Public Routes */}
          <Route index element={<LandingPage />} />
          <Route path="auth" element={<AuthPage />} />
          
          {/* Protected Routes */}
          <Route path="dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="blog/:id" element={
            <ProtectedRoute>
              <BlogPage />
            </ProtectedRoute>
          } />
          <Route path="settings" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="admin" element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            </ProtectedRoute>
          } />
          
          {/* Error Pages */}
          <Route path="401" element={<UnauthorizedPage />} />
          <Route path="404" element={<NotFoundPage />} />
          <Route path="unauthorized" element={<UnauthorizedPage />} />

          {/* Catch all route for 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AppProvider>
  )
}

export default App
