import { useNavigate, useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { ArrowLeft, Bot, MessageSquare, Trash2 } from 'lucide-react'
import { useAgent, useDeleteAgent } from '@/features/agents/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { ErrorState } from '@/components/common/ErrorState'
import { AgentMemories } from '@/components/agents/AgentMemories'
import { AgentKnowledge } from '@/components/agents/AgentKnowledge'

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
        <div><h1 className="text-3xl font-bold">{agent.name}</h1><p className="text-muted-foreground font-mono text-sm">ID: {agent.id}</p></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5" />Agent Info</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div><p className="text-xs text-muted-foreground">Name</p><p className="font-medium">{agent.name}</p></div>
            <div><p className="text-xs text-muted-foreground">ID</p><p className="font-mono text-sm">{agent.id}</p></div>
            <div><p className="text-xs text-muted-foreground">Model</p><p className="text-sm">{agent.model_name}</p></div>
            {agent.description && <div><p className="text-xs text-muted-foreground">Description</p><p className="text-sm">{agent.description}</p></div>}
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
        <Link to={`/chat?agent=${agent.id}`} className="inline-flex items-center gap-2 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors">
            <MessageSquare className="h-4 w-4" />Chat with Agent
          </Link>
        <Button variant="destructive" onClick={() => setDeleteOpen(true)}><Trash2 className="h-4 w-4" />Delete Agent</Button>
      </div>

      {/* Knowledge Base and Memories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AgentKnowledge agentId={id!} />
        <AgentMemories agentId={id!} />
      </div>

      <ConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} title="Delete Agent" description={`Are you sure you want to delete "${agent.name}"? This action cannot be undone.`} loading={deleteAgent.isPending} onConfirm={handleDelete} />
    </div>
  )
}
