import { useNavigate, useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { ArrowLeft, Bot, MessageSquare, Trash2 } from 'lucide-react'
import { useAgent, useDeleteAgent } from '@/features/agents/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { ErrorState } from '@/components/common/ErrorState'

export function AgentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: agent, isLoading, isError } = useAgent(id ?? '')
  const deleteAgent = useDeleteAgent()
  const [deleteOpen, setDeleteOpen] = useState(false)

  const handleDelete = () => {
    if (!id) return
    deleteAgent.mutate(id, { onSuccess: () => navigate('/agents') })
  }

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full" /></div>
  if (isError || !agent) return <ErrorState message="Failed to load agent details." />

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/agents')}><ArrowLeft className="h-4 w-4" /></Button>
        <div><h1 className="text-3xl font-bold">{agent.name}</h1><p className="text-muted-foreground font-mono text-sm">{agent.agent_id}</p></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5" />Agent Info</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div><p className="text-xs text-muted-foreground">Name</p><p className="font-medium">{agent.name}</p></div>
            <div><p className="text-xs text-muted-foreground">ID</p><p className="font-mono text-sm">{agent.agent_id}</p></div>
            {agent.created_at && <div><p className="text-xs text-muted-foreground">Created</p><p className="text-sm">{new Date(agent.created_at).toLocaleString()}</p></div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Configuration</CardTitle></CardHeader>
          <CardContent>
            <pre className="text-xs font-mono bg-muted p-3 rounded-md overflow-auto max-h-48">{JSON.stringify(agent.config, null, 2)}</pre>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <Button asChild><Link to={`/chat?agent=${agent.agent_id}`}><MessageSquare className="h-4 w-4" />Chat with Agent</Link></Button>
        <Button variant="destructive" onClick={() => setDeleteOpen(true)}><Trash2 className="h-4 w-4" />Delete Agent</Button>
      </div>

      <ConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} title="Delete Agent" description={`Are you sure you want to delete "${agent.name}"? This action cannot be undone.`} loading={deleteAgent.isPending} onConfirm={handleDelete} />
    </div>
  )
}
