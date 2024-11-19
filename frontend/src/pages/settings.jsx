import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/providers/auth-provider'
import { useTheme } from '@/providers/theme-provider'
import { authApi } from '@/lib/api'
import { toast } from 'react-hot-toast'
import { Loader2, Moon, Sun, Trash2, KeyRound } from 'lucide-react'

const passwordSchema = z.object({
  old_password: z.string().min(1, 'Current password is required'),
  new_password: z.string().min(8, 'New password must be at least 8 characters'),
})

function SettingsPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [isDeleting, setIsDeleting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(passwordSchema),
  })

  const onChangePassword = async (data) => {
    try {
      await authApi.changePassword(data)
      toast.success('Password changed successfully')
      reset()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to change password')
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    try {
      setIsDeleting(true)
      await authApi.deleteAccount()
      toast.success('Account deleted successfully')
      logout()
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete account')
      setIsDeleting(false)
    }
  }

  const handleThemeChange = async (newTheme) => {
    try {
      await authApi.updateTheme({ ui_theme: newTheme })
      setTheme(newTheme)
      toast.success('Theme updated successfully')
    } catch (error) {
      toast.error('Failed to update theme')
    }
  }

  return (
    <div className="container py-24 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="space-y-8">
        {/* Theme Settings */}
        <div className="rounded-2xl border bg-card/50 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-1">Theme Preferences</h2>
              <p className="text-sm text-muted-foreground">
                Choose your preferred theme
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="icon"
                className="rounded-full"
                onClick={() => handleThemeChange('light')}
              >
                <Sun className="h-5 w-5" />
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="icon"
                className="rounded-full"
                onClick={() => handleThemeChange('dark')}
              >
                <Moon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="rounded-2xl border bg-card/50 p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <form onSubmit={handleSubmit(onChangePassword)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="old_password">
                Current Password
              </label>
              <input
                {...register('old_password')}
                type="password"
                className={`w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  errors.old_password ? 'border-destructive' : ''
                }`}
              />
              {errors.old_password && (
                <p className="text-sm text-destructive">{errors.old_password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="new_password">
                New Password
              </label>
              <input
                {...register('new_password')}
                type="password"
                className={`w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  errors.new_password ? 'border-destructive' : ''
                }`}
              />
              {errors.new_password && (
                <p className="text-sm text-destructive">{errors.new_password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full rounded-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Changing Password...
                </>
              ) : (
                <>
                  <KeyRound className="mr-2 h-4 w-4" />
                  Change Password
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Delete Account */}
        <div className="rounded-2xl border bg-card/50 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-destructive mb-1">Delete Account</h2>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button
              variant="destructive"
              className="rounded-full"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage 