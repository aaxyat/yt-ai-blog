import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/providers/auth-provider'
import { ArrowRight, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
  inviteCode: z.string().min(1, 'Invitation code is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

function AuthForm({ isLogin, onToggle }) {
  const { login, register: registerUser } = useAuth()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
  })

  const onSubmit = async (data) => {
    try {
      if (isLogin) {
        await login({
          email: data.email,
          password: data.password,
        })
      } else {
        try {
          await registerUser({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            inviteCode: data.inviteCode,
          })
        } catch (error) {
          if (error.response?.data?.email?.[0]?.includes('already exists')) {
            setError('email', {
              type: 'manual',
              message: 'This email is already registered'
            })
            toast.error('This email is already registered')
          } else if (error.response?.data?.detail) {
            toast.error(error.response.data.detail)
          } else {
            toast.error('Registration failed. Please try again.')
          }
          throw error
        }
      }
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          {!isLogin && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <label className="text-sm font-medium leading-none" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    {...register('firstName')}
                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                      errors.firstName ? 'border-destructive' : ''
                    }`}
                    placeholder="John"
                    id="firstName"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium leading-none" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    {...register('lastName')}
                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                      errors.lastName ? 'border-destructive' : ''
                    }`}
                    placeholder="Doe"
                    id="lastName"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">{errors.lastName.message}</p>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="grid gap-2">
            <label className="text-sm font-medium leading-none" htmlFor="email">
              Email
            </label>
            <input
              {...register('email')}
              className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.email ? 'border-destructive' : ''
              }`}
              placeholder="name@example.com"
              id="email"
              type="email"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium leading-none" htmlFor="password">
              Password
            </label>
            <input
              {...register('password')}
              className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.password ? 'border-destructive' : ''
              }`}
              id="password"
              type="password"
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          {!isLogin && (
            <>
              <div className="grid gap-2">
                <label className="text-sm font-medium leading-none" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  {...register('confirmPassword')}
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.confirmPassword ? 'border-destructive' : ''
                  }`}
                  id="confirmPassword"
                  type="password"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium leading-none" htmlFor="inviteCode">
                  Invitation Code <span className="text-destructive">*</span>
                </label>
                <input
                  {...register('inviteCode')}
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.inviteCode ? 'border-destructive' : ''
                  }`}
                  id="inviteCode"
                  type="text"
                  placeholder="Enter your invitation code"
                />
                {errors.inviteCode && (
                  <p className="text-sm text-destructive">{errors.inviteCode.message}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  You need an invitation code from an admin to register.
                </p>
              </div>
            </>
          )}

          <Button className="group h-10 rounded-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Sign Up'}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </Button>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        type="button"
        className="rounded-full"
        onClick={onToggle}
      >
        {isLogin ? 'Create an account' : 'Sign in to your account'}
      </Button>
    </div>
  )
}

export default AuthForm 