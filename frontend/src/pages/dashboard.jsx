import { useState, useEffect } from 'react'
import { Youtube, Search, Filter, LayoutGrid, LayoutList, Loader2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { blogApi } from '@/lib/api'
import { toast } from 'react-hot-toast'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/providers/auth-provider'

function DashboardPage() {
  const { user } = useAuth()
  const [url, setUrl] = useState('')
  const [isGridView, setIsGridView] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const queryClient = useQueryClient()

  // Debug function to check admin status
  useEffect(() => {
    console.group('🔒 User Authorization Debug')
    console.log('User Object:', user)
    console.log('Is Admin:', user?.is_staff ? '✅ Yes' : '❌ No')
    console.log('User Email:', user?.email)
    console.log('Auth Token:', localStorage.getItem('access_token') ? '🔑 Present' : '🚫 Missing')
    console.groupEnd()
  }, [user])

  // Fetch blogs
  const { data: blogs = [], isLoading: isLoadingBlogs } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogApi.getMyBlogs,
  })

  // Generate blog mutation
  const generateMutation = useMutation({
    mutationFn: blogApi.generateBlog,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['blogs'])
      toast.success('Blog generated successfully!')
      setUrl('')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.error ||
                          error.message ||
                          'Failed to generate blog'
      toast.error(errorMessage)
      console.error('Generate blog error:', error)
    },
  })

  // Delete blog mutation
  const deleteMutation = useMutation({
    mutationFn: blogApi.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs'])
      toast.success('Blog deleted successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to delete blog')
    },
  })

  const handleGenerate = async () => {
    if (!url) {
      toast.error('Please enter a YouTube URL')
      return
    }

    // Basic URL validation
    try {
      const urlObj = new URL(url)
      if (!urlObj.hostname.includes('youtube.com') && !urlObj.hostname.includes('youtu.be')) {
        toast.error('Please enter a valid YouTube URL')
        return
      }
      generateMutation.mutate({ url })
    } catch (error) {
      toast.error('Please enter a valid URL')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      deleteMutation.mutate(id)
    }
  }

  // Filter blogs based on search term
  const filteredBlogs = blogs.filter(blog => 
    blog.blog_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.youtube_title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container py-24 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your blog posts and generate new content
          </p>
        </div>
      </div>

      {/* URL Input Section */}
      <div className="rounded-2xl border bg-card/50 p-8 backdrop-blur-sm">
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="url">
              YouTube URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="flex-1 rounded-full border bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Button 
                className="group rounded-full px-6" 
                onClick={handleGenerate} 
                disabled={generateMutation.isPending}
              >
                {generateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border bg-background pl-9 pr-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <Button variant="outline" size="icon" className="rounded-full">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isGridView ? 'default' : 'outline'}
            size="icon"
            className="rounded-full"
            onClick={() => setIsGridView(true)}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={!isGridView ? 'default' : 'outline'}
            size="icon"
            className="rounded-full"
            onClick={() => setIsGridView(false)}
          >
            <LayoutList className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoadingBlogs && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Empty State */}
      {!isLoadingBlogs && filteredBlogs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No blog posts found.</p>
        </div>
      )}

      {/* Blog Posts Grid */}
      <div className={`grid gap-6 ${isGridView ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {filteredBlogs.map((blog) => (
          <BlogPostCard 
            key={blog.id} 
            blog={blog} 
            isGridView={isGridView}
            onDelete={() => handleDelete(blog.id)}
          />
        ))}
      </div>
    </div>
  )
}

function BlogPostCard({ blog, isGridView, onDelete }) {
  const navigate = useNavigate()

  return (
    <div className={`group relative rounded-2xl border bg-card/50 p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg backdrop-blur-sm`}>
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary to-violet-500 opacity-0 blur transition-all duration-300 group-hover:opacity-20" />
      
      <div className="relative space-y-4">
        <div 
          className="cursor-pointer" 
          onClick={() => navigate(`/blog/${blog.id}`)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Youtube className="h-4 w-4" />
              <span>Blog Post</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {format(new Date(blog.created_at), 'MMM d, yyyy')}
            </span>
          </div>

          <div>
            <h3 className="font-semibold line-clamp-2 text-lg mb-2">
              {blog.blog_title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
              Original Video: {blog.youtube_title}
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage 