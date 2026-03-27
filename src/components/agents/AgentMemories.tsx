import { useState } from 'react'
import { Brain, Plus, Trash2, Pencil, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  useAgentMemories, 
  useSaveAgentMemory, 
  useUpdateAgentMemory, 
  useDeleteAgentMemory 
} from '@/features/agents/hooks'

interface AgentMemoriesProps {
  agentId: string
}

interface MemoryFormData {
  key: string
  value: string
}

export function AgentMemories({ agentId }: AgentMemoriesProps) {
  const { data: memories, isLoading, isError } = useAgentMemories(agentId)
  const saveMemory = useSaveAgentMemory()
  const updateMemory = useUpdateAgentMemory()
  const deleteMemory = useDeleteAgentMemory()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMemory, setEditingMemory] = useState<{ key: string; value: string } | null>(null)
  const [formData, setFormData] = useState<MemoryFormData>({ key: '', value: '' })

  const handleOpenDialog = (memory?: { key: string; value: string }) => {
    if (memory) {
      setEditingMemory(memory)
      setFormData({ key: memory.key, value: memory.value })
    } else {
      setEditingMemory(null)
      setFormData({ key: '', value: '' })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingMemory(null)
    setFormData({ key: '', value: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.key.trim() || !formData.value.trim()) return

    try {
      if (editingMemory) {
        // Update existing memory
        await updateMemory.mutateAsync({
          agentId,
          key: editingMemory.key,
          payload: { value: formData.value }
        })
      } else {
        // Create new memory
        await saveMemory.mutateAsync({
          agentId,
          payload: { key: formData.key, value: formData.value }
        })
      }
      handleCloseDialog()
    } catch (error) {
      // Error handled by hook
    }
  }

  const handleDelete = async (key: string) => {
    if (!confirm('Are you sure you want to delete this memory?')) return
    
    try {
      await deleteMemory.mutateAsync({ agentId, key })
    } catch (error) {
      // Error handled by hook
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Agent Memories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Agent Memories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorState message="Failed to load memories" />
        </CardContent>
      </Card>
    )
  }

  const autoMemories = memories?.filter(m => m.metadata?.auto_extracted) || []
  const manualMemories = memories?.filter(m => !m.metadata?.auto_extracted) || []

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Agent Memories
              </CardTitle>
              <CardDescription className="mt-1.5">
                Auto-saved from conversations and manually added information
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Memory
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!memories || memories.length === 0 ? (
            <EmptyState 
              title="No memories stored yet" 
              description="Memories are automatically created during conversations, or you can add them manually." 
            />
          ) : (
            <div className="space-y-4">
              {/* Auto-extracted memories */}
              {autoMemories.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    <h3 className="text-sm font-medium">Auto-Extracted ({autoMemories.length})</h3>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {autoMemories.map((memory) => (
                      <div
                        key={memory.id}
                        className="p-3 bg-purple-500/10 rounded-md border border-purple-500/20"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                {memory.key}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                Auto
                              </Badge>
                            </div>
                            <p className="text-sm break-words">{memory.value}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleOpenDialog({ key: memory.key, value: memory.value })}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive"
                              onClick={() => handleDelete(memory.key)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(memory.updated_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Manual memories */}
              {manualMemories.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Manual ({manualMemories.length})</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {manualMemories.map((memory) => (
                      <div
                        key={memory.id}
                        className="p-3 bg-muted rounded-md border border-border"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                              {memory.key}
                            </p>
                            <p className="text-sm break-words">{memory.value}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleOpenDialog({ key: memory.key, value: memory.value })}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive"
                              onClick={() => handleDelete(memory.key)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(memory.updated_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingMemory ? 'Edit Memory' : 'Add New Memory'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="key">Key</Label>
                <Input
                  id="key"
                  placeholder="e.g., user_name, preferred_language"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  disabled={!!editingMemory}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  A unique identifier for this memory (cannot be changed after creation)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Value</Label>
                <Textarea
                  id="value"
                  placeholder="Enter the memory value..."
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  rows={4}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={saveMemory.isPending || updateMemory.isPending}
              >
                {editingMemory ? 'Update' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
