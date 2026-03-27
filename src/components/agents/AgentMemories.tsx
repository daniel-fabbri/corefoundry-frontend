import { Brain } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { useAgentMemories } from '@/features/agents/hooks'

interface AgentMemoriesProps {
  agentId: string
}

export function AgentMemories({ agentId }: AgentMemoriesProps) {
  const { data: memories, isLoading, isError } = useAgentMemories(agentId)

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Agent Memories
          <span className="text-sm font-normal text-muted-foreground ml-auto">
            ({memories?.length || 0})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!memories || memories.length === 0 ? (
          <EmptyState title="No memories stored yet" description="Memories are created during conversations." />
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {memories.map((memory) => (
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
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(memory.updated_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
