import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { blogApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Youtube, Calendar, User, ExternalLink, RefreshCw } from 'lucide-react'
import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { toast } from 'react-hot-toast'
import { useState, useEffect } from 'react'

function BlogPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Track regeneration state
  const [isRegenerating, setIsRegenerating] = useState(false)

  const { data: blog, isLoading, error } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogApi.getBlog(id),
    // Add this to check for updates more frequently during regeneration
    refetchInterval: isRegenerating ? 1000 : false,
  })

  // Add regenerate mutation
  const regenerateMutation = useMutation({
    mutationFn: (url) => blogApi.generateBlog({ url, regen: true }),
    onMutate: () => {
      setIsRegenerating(true)
    },
    onSettled: () => {
      // Start polling for updates
      queryClient.invalidateQueries(['blog', id])
    },
    onError: (error) => {
      setIsRegenerating(false)
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.error ||
                          'Failed to regenerate blog'
      toast.error(errorMessage)
    },
  })

  // Check if blog content has changed
  useEffect(() => {
    if (isRegenerating && blog?.content) {
      // Compare with previous content or check for new timestamp
      setIsRegenerating(false)
      toast.success('Blog regenerated successfully!')
    }
  }, [blog, isRegenerating])

  const handleRegenerate = () => {
    if (window.confirm('Are you sure you want to regenerate this blog post?')) {
      regenerateMutation.mutate(blog.youtube_url)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-24 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-24">
        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-destructive">Failed to load blog post</p>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-24 space-y-8">
      {/* Back Button */}
      <Button
        variant="outline"
        className="rounded-full"
        onClick={() => navigate('/dashboard')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      {/* Blog Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">{blog.blog_title}</h1>
        
        <div className="flex flex-wrap gap-4 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(blog.created_at), 'MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{blog.author_name}</span>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <div className="rounded-2xl border bg-card/50 p-8 backdrop-blur-sm">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            className="prose dark:prose-invert max-w-none"
            components={{
              h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-4 mb-2" {...props} />,
              a: ({node, ...props}) => (
                <a 
                  className="text-primary hover:underline" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  {...props} 
                />
              ),
              code: ({node, inline, ...props}) => (
                inline ? 
                  <code className="bg-muted px-1.5 py-0.5 rounded text-sm" {...props} /> :
                  <code className="block bg-muted p-4 rounded-lg text-sm" {...props} />
              ),
              blockquote: ({node, ...props}) => (
                <blockquote 
                  className="border-l-4 border-primary pl-4 italic my-4" 
                  {...props} 
                />
              ),
              ul: ({node, ...props}) => <ul className="list-disc pl-6 my-4" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal pl-6 my-4" {...props} />,
            }}
          >
            {blog.content}
          </ReactMarkdown>
        </div>
      </div>

      {/* Regenerate Button */}
      <Button
        variant="outline"
        className="w-full rounded-full group"
        onClick={handleRegenerate}
        disabled={isRegenerating}
      >
        {isRegenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Regenerating...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180" />
            Regenerate Blog
          </>
        )}
      </Button>

      {/* Original Video Section */}
      <a 
        href={blog.youtube_url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block rounded-2xl border bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg group"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Youtube className="h-5 w-5" />
              <span className="font-medium">Original Video</span>
            </div>
            <p className="text-lg group-hover:text-primary transition-colors">
              {blog.youtube_title}
            </p>
          </div>
          <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </a>
    </div>
  )
}

export default BlogPage 