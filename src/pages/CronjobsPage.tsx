import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Clock, Play, Pause, Trash2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { CreateCronjobDialog } from '@/components/cronjobs/CreateCronjobDialog'
import { CronjobLogsDialog } from '@/components/cronjobs/CronjobLogsDialog'
import { 
  getCronjobs, 
  deleteCronjob, 
  toggleCronjob 
} from '@/lib/api/corefoundry'
import type { Cronjob } from '@/lib/types/cronjob'
import { formatDistanceToNow } from 'date-fns'

export function CronjobsPage() {
  const queryClient = useQueryClient()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [logsDialogOpen, setLogsDialogOpen] = useState(false)
  const [selectedCronjob, setSelectedCronjob] = useState<Cronjob | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  // Query for listing cronjobs
  const { data: cronjobs, isLoading, isError } = useQuery({
    queryKey: ['cronjobs'],
    queryFn: getCronjobs,
  })

  // Mutation for toggling cronjob status
  const toggleMutation = useMutation({
    mutationFn: (id: number) => toggleCronjob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cronjobs'] })
    },
  })

  // Mutation for deleting cronjob
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCronjob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cronjobs'] })
      setDeleteId(null)
    },
  })

  const handleViewLogs = (cronjob: Cronjob) => {
    setSelectedCronjob(cronjob)
    setLogsDialogOpen(true)
  }

  const getStatusBadge = (cronjob: Cronjob) => {
    if (!cronjob.is_active) {
      return <Badge variant="secondary">Inactive</Badge>
    }
    
    if (!cronjob.last_run_at) {
      return <Badge variant="outline">Never Run</Badge>
    }
    
    if (cronjob.last_status_code && cronjob.last_status_code >= 200 && cronjob.last_status_code < 300) {
      return <Badge variant="default" className="bg-green-500">Success</Badge>
    }
    
    return <Badge variant="destructive">Failed</Badge>
  }

  const formatLastRun = (lastRunAt: string | null) => {
    if (!lastRunAt) return 'Never'
    try {
      return formatDistanceToNow(new Date(lastRunAt), { addSuffix: true })
    } catch {
      return 'Invalid date'
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Cronjobs</h1>
          <p className="text-sm text-muted-foreground mt-1">Schedule and monitor automated HTTP requests</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Create Cronjob
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Cronjobs</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSkeleton />
          ) : isError ? (
            <ErrorState message="Failed to load cronjobs." />
          ) : !cronjobs || cronjobs.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="No cronjobs yet"
              description="Create your first cronjob to schedule automated HTTP requests."
              action={
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Create Cronjob
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {cronjobs.map((cronjob) => (
                <div
                  key={cronjob.id}
                  className="flex flex-col gap-3 p-4 rounded-md border border-border hover:bg-accent/50 transition-colors"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium truncate">{cronjob.name}</p>
                          {getStatusBadge(cronjob)}
                        </div>
                        <p className="text-sm text-muted-foreground font-mono truncate mt-1">
                          {cronjob.method} {cronjob.url}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <span>
                      <strong>Interval:</strong> {cronjob.interval_minutes} min
                    </span>
                    <span>
                      <strong>Last run:</strong> {formatLastRun(cronjob.last_run_at)}
                    </span>
                    {cronjob.last_status_code && (
                      <span>
                        <strong>Status:</strong> {cronjob.last_status_code}
                      </span>
                    )}
                  </div>

                  {/* Error */}
                  {cronjob.last_error && (
                    <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 p-2 rounded">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span className="break-all">{cronjob.last_error}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewLogs(cronjob)}
                    >
                      View Logs
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleMutation.mutate(cronjob.id)}
                      disabled={toggleMutation.isPending}
                    >
                      {cronjob.is_active ? (
                        <>
                          <Pause className="h-3 w-3" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3" />
                          Activate
                        </>
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteId(cronjob.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <CreateCronjobDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      {/* Logs Dialog */}
      {selectedCronjob && (
        <CronjobLogsDialog
          cronjob={selectedCronjob}
          open={logsDialogOpen}
          onOpenChange={setLogsDialogOpen}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Cronjob"
        description="Are you sure you want to delete this cronjob? This action cannot be undone."
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
