import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { LogIn, ArrowLeft, ShieldAlert } from 'lucide-react'

function UnauthorizedPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-destructive/20 to-violet-500/20 blur-3xl" />
        <div className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-gradient-to-l from-destructive/20 to-violet-500/20 blur-3xl" />
      </div>

      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="rounded-full border border-destructive/50 bg-destructive/10 p-3">
            <ShieldAlert className="h-6 w-6 text-destructive" />
          </div>
          <div className="space-y-2">
            <h1 className="bg-gradient-to-r from-destructive via-violet-500 to-destructive bg-clip-text text-3xl font-bold tracking-tighter text-transparent sm:text-5xl xl:text-6xl/none">
              401 - Unauthorized Access
            </h1>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
              You need to be logged in to access this page.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/auth" className="flex items-center">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link to="/" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UnauthorizedPage 