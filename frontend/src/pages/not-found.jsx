import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft } from 'lucide-react'

function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-primary/20 to-violet-500/20 blur-3xl" />
        <div className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-gradient-to-l from-primary/20 to-violet-500/20 blur-3xl" />
      </div>

      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="bg-gradient-to-r from-primary via-violet-500 to-primary bg-clip-text text-3xl font-bold tracking-tighter text-transparent sm:text-5xl xl:text-6xl/none">
              404 - Page Not Found
            </h1>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/" className="flex items-center">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
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

export default NotFoundPage 