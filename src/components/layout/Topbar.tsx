import { useQuery } from '@tanstack/react-query'
import { Activity, AlertCircle } from 'lucide-react'
import { getHealth } from '@/lib/api/corefoundry'
import { BASE_URL } from '@/lib/api/http'
import { Badge } from '@/components/ui/badge'

export function Topbar() {
  const { data, isError } = useQuery({ queryKey: ['health'], queryFn: getHealth, refetchInterval: 30000 })
  const isHealthy = !isError && data?.status === 'ok'
  return (
    <header className="fixed top-0 left-64 right-0 h-14 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-6 z-10">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">API:</span>
        <code className="text-xs bg-muted px-2 py-1 rounded font-mono text-foreground">{BASE_URL}</code>
      </div>
      <div className="flex items-center gap-2">
        {isHealthy ? (
          <Badge variant="success" className="flex items-center gap-1"><Activity className="h-3 w-3" />Healthy</Badge>
        ) : (
          <Badge variant="destructive" className="flex items-center gap-1"><AlertCircle className="h-3 w-3" />Offline</Badge>
        )}
      </div>
    </header>
  )
}
