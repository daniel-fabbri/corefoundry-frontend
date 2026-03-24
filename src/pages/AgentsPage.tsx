import { useState } from 'react'
import { Bot, Plus, Trash2, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAgents, useCreateAgent, useDeleteAgent } from '@/features/agents/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { JsonEditor } from '@/components/common/JsonEditor'

const DEFAULT_CONFIG = JSON.stringify({ temperature: 0.7, system_prompt: 'You are a helpful and concise assistant.' }, null, 2)

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  configJson: z.string().refine((val) => { try { JSON.parse(val); return true } catch { return false } }, { message: 'Invalid JSON' }),
})
type FormValues = z.infer<typeof schema>

export function AgentsPage() {
  const { data: agents, isLoading, isError } = useAgents()
  const createAgent = useCreateAgent()
  const deleteAgent = useDeleteAgent()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { name: '', configJson: DEFAULT_CONFIG } })

  const onSubmit = (values: FormValues) => {
    createAgent.mutate({ name: values.name, config: JSON.parse(values.configJson) }, {
      onSuccess: () => { setDialogOpen(false); form.reset({ name: '', configJson: DEFAULT_CONFIG }) }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Agents</h1><p className="text-muted-foreground mt-1">Manage your AI agents</p></div>
        <Button onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4" />Create Agent</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>All Agents</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? <LoadingSkeleton /> : isError ? <ErrorState message="Failed to load agents." /> : agents?.length === 0 ? (
            <EmptyState icon={Bot} title="No agents yet" description="Create your first agent to get started." action={<Button onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4" />Create Agent</Button>} />
          ) : (
            <div className="space-y-2">
              {agents?.map(agent => (
                <div key={agent.agent_id} className="flex items-center justify-between p-3 rounded-md border border-border hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center"><Bot className="h-4 w-4 text-primary" /></div>
                    <div><p className="font-medium">{agent.name}</p><p className="text-xs text-muted-foreground font-mono">{agent.agent_id}</p></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button asChild variant="outline" size="sm"><Link to={`/agents/${agent.agent_id}`}><Eye className="h-4 w-4" />View</Link></Button>
                    <Button variant="destructive" size="sm" onClick={() => setDeleteId(agent.agent_id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Agent</DialogTitle></DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="My Agent" {...form.register('name')} />
              {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
            </div>
            <JsonEditor label="Config (JSON)" value={form.watch('configJson')} onChange={(v) => form.setValue('configJson', v)} rows={8} />
            {form.formState.errors.configJson && <p className="text-xs text-destructive">{form.formState.errors.configJson.message}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createAgent.isPending}>{createAgent.isPending ? 'Creating...' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete Agent" description="Are you sure you want to delete this agent? This action cannot be undone."
        loading={deleteAgent.isPending}
        onConfirm={() => { if (deleteId) deleteAgent.mutate(deleteId, { onSuccess: () => setDeleteId(null) }) }}
      />
    </div>
  )
}
