import { useState } from 'react'
import AuthForm from '@/components/auth/auth-form'

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="container relative min-h-[calc(100vh-4rem)] flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-primary/20 to-violet-500/20 blur-3xl" />
        <div className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-gradient-to-l from-primary/20 to-violet-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* Auth Form */}
      <div className="relative w-full max-w-[400px] mx-auto">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLogin
                ? 'Enter your credentials to access your account'
                : 'Enter your information to get started'}
            </p>
          </div>
          <AuthForm isLogin={isLogin} onToggle={() => setIsLogin(!isLogin)} />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By continuing, you agree to our{' '}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthPage 