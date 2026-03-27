import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getAgents,
  createAgent,
  getAgent,
  deleteAgent,
  chatWithAgent,
  getAgentHistory,
  getChatUsers,
  createChatUser,
  getAgentThreads,
  createAgentThread,
  getAgentMemories,
  uploadKnowledgeFile,
  getKnowledgeFiles,
  deleteKnowledgeFile,
} from '@/lib/api/corefoundry'
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

export function useChatUsers() {
  return useQuery({ queryKey: ['chat-users'], queryFn: getChatUsers })
}

export function useCreateChatUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => createChatUser(name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['chat-users'] })
      toast.success('User created successfully')
    },
    onError: (err: Error) => { toast.error(err.message || 'Failed to create user') },
  })
}

export function useAgentThreads(agentId: string | null) {
  return useQuery({
    queryKey: ['agents', agentId, 'threads'],
    queryFn: () => getAgentThreads(agentId!),
    enabled: !!agentId,
    refetchOnWindowFocus: false,
  })
}

export function useCreateAgentThread() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ agentId, title }: { agentId: string; title?: string }) =>
      createAgentThread(agentId, title),
    onSuccess: (thread) => {
      qc.invalidateQueries({ queryKey: ['agents', String(thread.agent_id), 'threads'] })
      toast.success('Thread created successfully')
    },
    onError: (err: Error) => { toast.error(err.message || 'Failed to create thread') },
  })
}

export function useAgentHistory(agentId: string | null, threadId: string | null, limit = 50) {
  return useQuery({
    queryKey: ['agents', agentId, 'threads', threadId, 'history', limit],
    queryFn: () => {
      console.log('🔍 Fetching history for agent/thread:', { agentId, threadId, limit })
      return getAgentHistory(agentId!, threadId!, limit)
    },
    enabled: !!agentId && !!threadId,
    staleTime: 0, // Always refetch
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  })
}

// Memory hooks
export function useAgentMemories(agentId: string | null) {
  return useQuery({
    queryKey: ['agents', agentId, 'memories'],
    queryFn: () => getAgentMemories(agentId!),
    enabled: !!agentId,
  })
}

// Knowledge files hooks
export function useKnowledgeFiles(agentId: string | null) {
  return useQuery({
    queryKey: ['agents', agentId, 'knowledge', 'files'],
    queryFn: () => getKnowledgeFiles(agentId!),
    enabled: !!agentId,
  })
}

export function useUploadKnowledgeFile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ agentId, file }: { agentId: string; file: File }) =>
      uploadKnowledgeFile(agentId, file),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['agents', variables.agentId, 'knowledge', 'files'] })
      toast.success('File uploaded successfully')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to upload file')
    },
  })
}

export function useDeleteKnowledgeFile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ agentId, filename }: { agentId: string; filename: string }) =>
      deleteKnowledgeFile(agentId, filename),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['agents', variables.agentId, 'knowledge', 'files'] })
      toast.success('File deleted successfully')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete file')
    },
  })
}
