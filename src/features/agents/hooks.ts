import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getAgents, createAgent, getAgent, deleteAgent, chatWithAgent, getAgentHistory } from '@/lib/api/corefoundry'
import type { CreateAgentRequest, ChatRequest } from '@/lib/types/corefoundry'

export const AGENTS_KEY = ['agents']

export function useAgents() {
  return useQuery({ queryKey: AGENTS_KEY, queryFn: getAgents })
}

export function useAgent(agentId: string) {
  return useQuery({ queryKey: ['agents', agentId], queryFn: () => getAgent(agentId), enabled: !!agentId })
}

export function useCreateAgent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateAgentRequest) => createAgent(payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: AGENTS_KEY }); toast.success('Agent created successfully') },
    onError: (err: Error) => { toast.error(err.message || 'Failed to create agent') },
  })
}

export function useDeleteAgent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (agentId: string) => deleteAgent(agentId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: AGENTS_KEY }); toast.success('Agent deleted successfully') },
    onError: (err: Error) => { toast.error(err.message || 'Failed to delete agent') },
  })
}

export function useChatWithAgent() {
  return useMutation({
    mutationFn: ({ agentId, payload }: { agentId: number; payload: ChatRequest }) => chatWithAgent(agentId, payload),
    onError: (err: Error) => { toast.error(err.message || 'Failed to send message') },
  })
}

export function useAgentHistory(agentId: string | null, limit = 50) {
  return useQuery({
    queryKey: ['agents', agentId, 'history', limit],
    queryFn: () => {
      console.log('🔍 Fetching history for agent:', agentId, 'limit:', limit)
      return getAgentHistory(agentId!, limit)
    },
    enabled: !!agentId,
    staleTime: 0, // Always refetch
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  })
}
