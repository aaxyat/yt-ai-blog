import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Loader2, Users, Key, BarChart2, Shield, Plus } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'

function AdminPage() {
  const [activeTab, setActiveTab] = useState('users')
  const queryClient = useQueryClient()

  return (
    <div className="container py-24 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage users, invites, and monitor platform usage
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b">
        <TabButton 
          active={activeTab === 'users'} 
          onClick={() => setActiveTab('users')}
          icon={<Users className="h-4 w-4" />}
        >
          Users
        </TabButton>
        <TabButton 
          active={activeTab === 'invites'} 
          onClick={() => setActiveTab('invites')}
          icon={<Key className="h-4 w-4" />}
        >
          Invite Codes
        </TabButton>
        <TabButton 
          active={activeTab === 'stats'} 
          onClick={() => setActiveTab('stats')}
          icon={<BarChart2 className="h-4 w-4" />}
        >
          Statistics
        </TabButton>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'invites' && <InvitesTab />}
        {activeTab === 'stats' && <StatsTab />}
      </div>
    </div>
  )
}

function TabButton({ children, active, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
        active 
          ? 'border-primary text-primary' 
          : 'border-transparent text-muted-foreground hover:text-foreground'
      }`}
    >
      {icon}
      {children}
    </button>
  )
}

function UsersTab() {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: adminApi.getUsers,
  })

  const banMutation = useMutation({
    mutationFn: adminApi.banUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin', 'users'])
      toast.success('User banned successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to ban user')
    },
  })

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-card/50 overflow-hidden backdrop-blur-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-4 font-medium">Email</th>
              <th className="text-left p-4 font-medium">Name</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Joined</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b last:border-0">
                <td className="p-4">{user.email}</td>
                <td className="p-4">{`${user.first_name} ${user.last_name}`}</td>
                <td className="p-4">
                  {user.is_banned ? (
                    <span className="inline-flex items-center rounded-full bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">
                      Banned
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      Active
                    </span>
                  )}
                </td>
                <td className="p-4">{format(new Date(user.date_joined), 'MMM d, yyyy')}</td>
                <td className="p-4 text-right">
                  {!user.is_banned && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        const reason = window.prompt('Enter ban reason:')
                        if (reason) {
                          banMutation.mutate({ email: user.email, reason })
                        }
                      }}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Ban User
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function InvitesTab() {
  const { data: invites = [], isLoading } = useQuery({
    queryKey: ['admin', 'invites'],
    queryFn: adminApi.getInvites,
  })

  const createMutation = useMutation({
    mutationFn: adminApi.createInvite,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin', 'invites'])
      toast.success('Invite code created successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to create invite code')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteInvite,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin', 'invites'])
      toast.success('Invite code deleted successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to delete invite code')
    },
  })

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          className="rounded-full"
          onClick={() => {
            const maxUses = window.prompt('Enter maximum number of uses (optional):')
            createMutation.mutate({ max_uses: maxUses ? parseInt(maxUses) : undefined })
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Invite Code
        </Button>
      </div>

      <div className="rounded-2xl border bg-card/50 overflow-hidden backdrop-blur-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-4 font-medium">Code</th>
              <th className="text-left p-4 font-medium">Created By</th>
              <th className="text-left p-4 font-medium">Uses</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invites.map((invite) => (
              <tr key={invite.id} className="border-b last:border-0">
                <td className="p-4 font-mono">{invite.code}</td>
                <td className="p-4">{invite.created_by}</td>
                <td className="p-4">{invite.uses} / {invite.max_uses || '∞'}</td>
                <td className="p-4">
                  {invite.is_valid ? (
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium">
                      Expired
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this invite code?')) {
                        deleteMutation.mutate(invite.code)
                      }
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatsTab() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: adminApi.getStats,
  })

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <div className="space-y-8">
      {/* Main Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Users"
          value={stats?.total_users || 0}
          subtitle={`${stats?.active_users || 0} active`}
          icon={<Users className="h-5 w-5" />}
          trend={stats?.users_this_month}
          trendLabel="this month"
        />
        <StatCard
          title="Total Blogs"
          value={stats?.total_blogs || 0}
          subtitle={`${stats?.blogs_this_month || 0} this month`}
          icon={<BarChart2 className="h-5 w-5" />}
        />
        <StatCard
          title="Active Invites"
          value={stats?.active_invites || 0}
          subtitle="available for use"
          icon={<Key className="h-5 w-5" />}
        />
      </div>

      {/* Invite Usage Breakdown */}
      <div className="rounded-2xl border bg-card/50 p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold mb-4">Invite Code Usage</h3>
        <div className="grid gap-4 sm:grid-cols-4">
          <InviteStatItem
            label="Total"
            value={stats?.invite_usage?.total || 0}
            className="bg-primary/10"
          />
          <InviteStatItem
            label="Used"
            value={stats?.invite_usage?.used || 0}
            className="bg-green-500/10"
          />
          <InviteStatItem
            label="Expired"
            value={stats?.invite_usage?.expired || 0}
            className="bg-destructive/10"
          />
          <InviteStatItem
            label="Available"
            value={stats?.invite_usage?.available || 0}
            className="bg-blue-500/10"
          />
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, subtitle, icon, trend, trendLabel }) {
  return (
    <div className="rounded-2xl border bg-card/50 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground">{icon}</div>
        <div className="text-3xl font-bold">{value.toLocaleString()}</div>
      </div>
      <div className="mt-2 text-sm text-muted-foreground">{title}</div>
      {subtitle && (
        <div className="mt-1 text-sm text-muted-foreground/80">
          {subtitle}
          {trend && (
            <span className="ml-2 text-green-500">
              +{trend} {trendLabel}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

function InviteStatItem({ label, value, className }) {
  return (
    <div className={`rounded-xl p-4 ${className}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex justify-center py-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

export default AdminPage 