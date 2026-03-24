import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Bot, Plus, Trash2, Eye } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { JsonEditor } from '@/components/common/JsonEditor'
import { useAgents, useCreateAgent, useDeleteAgent } from '@/features/agents/hooks'

const DEFAULT_CONFIG = JSON.stringify({ temperature: 0.7, system_prompt: 'You are a helpful and concise assistant.' }, null, 2)

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  model_name: z.string().min(1, 'Model name is required'),
  configJson: z.string().refine((val) => { try { JSON.parse(val); return true } catch { return false } }, { message: 'Invalid JSON' }),
})
type FormValues = z.infer<typeof schema>

export function AgentsPage() {
  const { data: agents, isLoading, isError } = useAgents()
  const createAgent = useCreateAgent()
  const deleteAgent = useDeleteAgent()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { name: '', description: '', model_name: 'phi3:latest', configJson: DEFAULT_CONFIG } })

  const onSubmit = (values: FormValues) => {
    const payload = {
      name: values.name, 
      description: values.description, 
      model_name: values.model_name,
      config: JSON.parse(values.configJson)
    }
    
    console.log('🤖 Creating agent with payload:', payload)
    
    createAgent.mutate(payload, {
      onSuccess: (data) => { 
        console.log('✅ Agent created successfully:', data)
        setDialogOpen(false)
        form.reset({ name: '', description: '', model_name: 'phi3:latest', configJson: DEFAULT_CONFIG })
      }
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
          {isLoading ? <LoadingSkeleton /> : isError ? <ErrorState message="Failed to load agents." /> : !agents || !Array.isArray(agents) || agents.length === 0 ? (
            <EmptyState icon={Bot} title="No agents yet" description="Create your first agent to get started." action={<Button onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4" />Create Agent</Button>} />
          ) : (
            <div className="space-y-2">
              {agents.map(agent => (
                <div key={agent.id} className="flex items-center justify-between p-3 rounded-md border border-border hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center"><Bot className="h-4 w-4 text-primary" /></div>
                    <div><p className="font-medium">{agent.name}</p><p className="text-xs text-muted-foreground font-mono">ID: {agent.id}</p></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to={`/agents/${agent.id}`} className="inline-flex items-center gap-2 h-9 px-3 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium transition-colors">
                        <Eye className="h-4 w-4" />View
                      </Link>
                    <Button variant="destructive" size="sm" onClick={() => setDeleteId(String(agent.id))}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Create Agent</DialogTitle></DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="My Agent" {...form.register('name')} />
              {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input id="description" placeholder="A helpful assistant" {...form.register('description')} />
              {form.formState.errors.description && <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>}
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="model_name">
                Model Name <span className="text-destructive">*</span>
              </Label>
              <Input 
                id="model_name" 
                placeholder="phi3:latest" 
                {...form.register('model_name')} 
              />
              <p className="text-xs text-muted-foreground">
                Example: phi3:latest, llama2, mistral, etc. Must be downloaded in Ollama.
              </p>
              {form.formState.errors.model_name && <p className="text-xs text-destructive">{form.formState.errors.model_name.message}</p>}
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
