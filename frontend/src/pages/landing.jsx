import { ArrowRight, Youtube, Sparkles, Clock, Shield, ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

function LandingPage() {
  return (
    <div className="flex flex-col gap-24 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] overflow-hidden flex items-center pt-24">
        <div className="absolute inset-0 -z-10">
          {/* Gradient circles */}
          <div className="absolute top-1/4 -left-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-primary/20 to-violet-500/20 blur-3xl" />
          <div className="absolute -top-1/4 -right-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-l from-primary/20 to-violet-500/20 blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/90 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm shadow-sm">
                <Sparkles className="h-4 w-4" />
                <span>Revolutionizing Content Creation</span>
              </div>
            </div>

            <h1 className="mt-8 animate-fade-in-up bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-5xl font-bold text-transparent sm:text-6xl lg:text-7xl [text-wrap:balance] leading-tight">
              Transform YouTube Videos into
              <span className="block mt-2 bg-gradient-to-r from-primary via-violet-500 to-primary bg-clip-text text-transparent leading-[1.3] pb-1"> 
                Engaging Blog Posts 
              </span>
            </h1>

            <p className="mt-8 animate-fade-in-up text-xl text-muted-foreground leading-relaxed [text-wrap:balance]">
              Automatically generate well-structured, SEO-optimized blog posts from your favorite YouTube videos.
              Save time and reach a wider audience with AI-powered content generation.
            </p>

            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center animate-fade-in-up">
              <Button asChild size="lg" className="group h-12 rounded-full px-8 text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
                <Link to="/auth" className="flex items-center justify-center">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="group h-12 rounded-full px-8 text-lg border-primary/20 hover:bg-primary/5">
                <a href="#features" className="flex items-center justify-center">
                  Learn More
                  <ArrowUpRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
              </Button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-muted-foreground animate-fade-in-up">
              {['Free Trial', 'No Credit Card', '24/7 Support'].map((text) => (
                <div key={text} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 scroll-mt-24">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            <span>Key Features</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl bg-gradient-to-r from-primary via-violet-500 to-primary bg-clip-text text-transparent inline-block leading-[1.3] pb-1">
              Everything You Need
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform your video content into engaging blog posts with our powerful features
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Youtube />}
            title="Easy Content Generation"
            description="Simply paste a YouTube URL and get a professionally formatted blog post in seconds."
          />
          <FeatureCard
            icon={<Sparkles />}
            title="AI-Powered Writing"
            description="Our advanced AI ensures high-quality, engaging content that captures your video's essence."
          />
          <FeatureCard
            icon={<Clock />}
            title="Save Time"
            description="Focus on creating great videos while we handle the blog content creation."
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 relative">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
            <Clock className="h-4 w-4" />
            <span>Simple Process</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl bg-gradient-to-r from-primary via-violet-500 to-primary bg-clip-text text-transparent inline-block leading-[1.3] pb-1">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to transform your videos into blog posts
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent hidden md:block" />
          <StepCard
            number="1"
            title="Paste YouTube URL"
            description="Enter the URL of your YouTube video into our generator."
          />
          <StepCard
            number="2"
            title="Generate Content"
            description="Our AI analyzes your video and creates a well-structured blog post."
          />
          <StepCard
            number="3"
            title="Edit & Publish"
            description="Review, edit, and publish your blog post with one click."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <div className="relative rounded-[2.5rem] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-violet-500/10 to-primary/10" />
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" />
          <div className="relative p-12 sm:p-16 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl bg-gradient-to-r from-primary via-violet-500 to-primary bg-clip-text text-transparent inline-block leading-[1.3] pb-1">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of content creators who are saving time and reaching wider audiences
              with our AI-powered blog generator.
            </p>
            <Button asChild size="lg" className="mt-8 h-12 rounded-full px-8 text-lg group shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
              <Link to="/auth" className="flex items-center justify-center">
                Start Creating Now
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="group relative rounded-2xl border bg-card/50 p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-lg backdrop-blur-sm">
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary to-violet-500 opacity-0 blur transition-all duration-300 group-hover:opacity-20" />
      <div className="relative">
        <div className="text-primary mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-2 text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function StepCard({ number, title, description }) {
  return (
    <div className="group relative rounded-2xl border bg-card/50 p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-lg backdrop-blur-sm">
      <div className="absolute -top-4 left-8 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary to-violet-500 text-sm font-bold text-primary-foreground shadow-lg">
        {number}
      </div>
      <div className="mt-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-2 text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export default LandingPage 