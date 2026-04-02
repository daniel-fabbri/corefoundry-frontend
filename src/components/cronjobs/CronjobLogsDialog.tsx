import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { CheckCircle2, XCircle, Clock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { getCronjobLogs } from '@/lib/api/corefoundry'
import type { Cronjob, CronjobLog } from '@/lib/types/cronjob'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'

interface CronjobLogsDialogProps {
  cronjob: Cronjob
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CronjobLogsDialog({ cronjob, open, onOpenChange }: CronjobLogsDialogProps) {
  const { data: logs, isLoading, isError } = useQuery({
    queryKey: ['cronjob-logs', cronjob.id],
    queryFn: () => getCronjobLogs(cronjob.id, 50),
    enabled: open,
  })

  const getStatusIcon = (log: CronjobLog) => {
    if (!log.status_code) {
      return <XCircle className="h-4 w-4 text-destructive" />
    }
    if (log.status_code >= 200 && log.status_code < 300) {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />
    }
    return <XCircle className="h-4 w-4 text-destructive" />
  }

  const getStatusBadge = (log: CronjobLog) => {
    if (!log.status_code) {
      return <Badge variant="destructive">Error</Badge>
    }
    if (log.status_code >= 200 && log.status_code < 300) {
      return <Badge variant="default" className="bg-green-500">{log.status_code}</Badge>
    }
    if (log.status_code >= 400) {
      return <Badge variant="destructive">{log.status_code}</Badge>
    }
    return <Badge variant="outline">{log.status_code}</Badge>
  }

  const formatDate = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
    } catch {
      return 'Invalid date'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Cronjob Logs: {cronjob.name}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {cronjob.method} {cronjob.url}
          </p>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {isLoading ? (
            <LoadingSkeleton />
          ) : isError ? (
            <ErrorState message="Failed to load logs." />
          ) : !logs || logs.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="No logs yet"
              description="This cronjob hasn't been executed yet."
            />
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="border rounded-lg p-3 space-y-2 hover:bg-accent/30 transition-colors"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(log)}
                      <span className="text-sm font-medium">
                        {formatDate(log.executed_at)}
                      </span>
                      {getStatusBadge(log)}
                    </div>
                    {log.response_time_ms !== null && (
                      <span className="text-sm text-muted-foreground">
                        {log.response_time_ms}ms
                      </span>
                    )}
                  </div>

                  {/* Error Message */}
                  {log.error_message && (
                    <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                      {log.error_message}
                    </div>
                  )}

                  {/* Response Body (collapsed by default) */}
                  {log.response_body && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                        View response body
                      </summary>
                      <pre className="mt-2 p-2 bg-muted rounded overflow-x-auto">
                        {log.response_body}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
