import { useQuery } from '@tanstack/react-query'
import { Bot, Activity, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getHealth, getAgents } from '@/lib/api/corefoundry'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/common/ErrorState'
import { BASE_URL } from '@/lib/api/http'

export function DashboardPage() {
  const health = useQuery({ queryKey: ['health'], queryFn: getHealth })
  const agents = useQuery({ queryKey: ['agents'], queryFn: getAgents })

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your CoreFoundry instance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">API Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {health.isLoading ? <Skeleton className="h-6 w-20" /> : health.isError ? <Badge variant="destructive">Offline</Badge> : (
              <div className="space-y-1">
                <Badge variant="success">{String(health.data?.status ?? 'unknown')}</Badge>
                <p className="text-xs text-muted-foreground">{BASE_URL}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {agents.isLoading ? <Skeleton className="h-8 w-12" /> : agents.isError ? <span className="text-2xl font-bold text-destructive">—</span> : <span className="text-2xl font-bold">{Array.isArray(agents.data) ? agents.data.length : 0}</span>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Link to="/agents" className="h-9 rounded-md px-3 inline-flex items-center justify-center gap-2 text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
              Manage Agents
            </Link>
            <Link to="/chat" className="h-9 rounded-md px-3 inline-flex items-center justify-center gap-2 text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
              Open Chat
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Recent Agents</CardTitle></CardHeader>
        <CardContent>
          {agents.isLoading ? (
            <div className="space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : agents.isError ? (
            <ErrorState message="Failed to load agents. Check your API connection." />
          ) : !agents.data || !Array.isArray(agents.data) || agents.data.length === 0 ? (
            <p className="text-sm text-muted-foreground">No agents yet. <Link to="/agents" className="text-primary underline">Create one</Link>.</p>
          ) : (
            <div className="space-y-2">
              {agents.data.slice(0, 5).map(agent => (
                <Link key={agent.id} to={`/agents/${agent.id}`}>
                  <div className="flex items-center justify-between p-3 rounded-md border border-border hover:bg-accent transition-colors">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><Bot className="h-4 w-4 text-primary" /></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{agent.name}</p>
                        <p className="text-xs text-muted-foreground font-mono truncate">ID: {agent.id}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="flex-shrink-0">View</Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
