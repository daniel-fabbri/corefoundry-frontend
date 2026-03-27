import { useNavigate, useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { ArrowLeft, Bot, MessageSquare, Trash2, Edit } from 'lucide-react'
import { useAgent, useDeleteAgent, useUpdateAgent } from '@/features/agents/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { ErrorState } from '@/components/common/ErrorState'
import { AgentMemories } from '@/components/agents/AgentMemories'
import { AgentKnowledge } from '@/components/agents/AgentKnowledge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function AgentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: agent, isLoading, isError } = useAgent(id ?? '')
  const deleteAgent = useDeleteAgent()
  const updateAgent = useUpdateAgent()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  // Edit form state
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editModelName, setEditModelName] = useState('')
  const [editPrompt, setEditPrompt] = useState('')

  const handleDelete = () => {
    if (!id) return
    deleteAgent.mutate(id, { onSuccess: () => navigate('/agents') })
  }

  const handleEditOpen = () => {
    if (!agent) return
    setEditName(agent.name)
    setEditDescription(agent.description || '')
    setEditModelName(agent.model_name || '')
    setEditPrompt(agent.config?.system_prompt || '')
    setEditOpen(true)
  }

  const handleEditSave = () => {
    if (!id) return
    
    updateAgent.mutate(
      {
        agentId: id,
        payload: {
          name: editName,
          description: editDescription || undefined,
          model_name: editModelName || undefined,
          config: {
            ...agent?.config,
            system_prompt: editPrompt,
          },
        },
      },
      {
        onSuccess: () => {
          setEditOpen(false)
        },
      }
    )
  }

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full" /></div>
  if (isError || !agent) return <ErrorState message="Failed to load agent details." />

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/agents')}><ArrowLeft className="h-4 w-4" /></Button>
          <div><h1 className="text-2xl sm:text-3xl font-bold">{agent.name}</h1><p className="text-muted-foreground font-mono text-xs sm:text-sm">ID: {agent.id}</p></div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link to={`/chat?agent=${agent.id}`} className="inline-flex items-center gap-2 h-10 px-3 sm:px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors">
            <MessageSquare className="h-4 w-4" /><span className="hidden sm:inline">Chat with Agent</span><span className="sm:hidden">Chat</span>
          </Link>
          <Button variant="outline" size="sm" onClick={handleEditOpen} className="h-10"><Edit className="h-4 w-4" /><span className="hidden sm:inline ml-2">Edit</span></Button>
          <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)} className="h-10"><Trash2 className="h-4 w-4" /><span className="hidden sm:inline ml-2">Delete</span></Button>
        </div>
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

      {/* Knowledge Base and Memories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AgentKnowledge agentId={id!} />
        <AgentMemories agentId={id!} />
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Agent</DialogTitle>
            <DialogDescription>
              Update agent information and configuration
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Agent name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Agent description (optional)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-model">Model Name</Label>
              <Input
                id="edit-model"
                value={editModelName}
                onChange={(e) => setEditModelName(e.target.value)}
                placeholder="e.g., llama2, gpt-4, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-prompt">System Prompt</Label>
              <Textarea
                id="edit-prompt"
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder="System prompt for the agent"
                className="min-h-[200px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                The system prompt defines how the agent behaves and responds to messages.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave} disabled={updateAgent.isPending || !editName.trim()}>
              {updateAgent.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} title="Delete Agent" description={`Are you sure you want to delete "${agent.name}"? This action cannot be undone.`} loading={deleteAgent.isPending} onConfirm={handleDelete} />
    </div>
  )
}
