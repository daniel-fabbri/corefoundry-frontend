import { http } from './http'
import type {
  HealthResponse,
  Agent,
  CreateAgentRequest,
  ChatMessage,
  ChatRequest,
  ChatResponse,
  ChatUser,
  ChatThread,
  KnowledgeUploadRequest,
  KnowledgeUploadResponse,
  KnowledgeSearchRequest,
  KnowledgeSearchResponse,
  KnowledgeChunk,
} from '../types/corefoundry'

// Health
export const getHealth = async (): Promise<HealthResponse> => {
  const { data } = await http.get<HealthResponse>('/health')
  return data
}

// Agents
export const getAgents = async (): Promise<Agent[]> => {
  const { data } = await http.get<Agent[]>('/agents/')
  return data
}

export const createAgent = async (payload: CreateAgentRequest): Promise<Agent> => {
  const { data } = await http.post<Agent>('/agents/create', payload)
  return data
}

export const getAgent = async (agentId: string): Promise<Agent> => {
  const { data } = await http.get<Agent>(`/agents/${agentId}`)
  return data
}

export const deleteAgent = async (agentId: string): Promise<void> => {
  await http.delete(`/agents/${agentId}`)
}

export const chatWithAgent = async (agentId: number, payload: ChatRequest): Promise<ChatResponse> => {
  const { data } = await http.post<ChatResponse>(`/agents/${agentId}/chat`, payload)
  return data
}

export const getAgentHistory = async (
  agentId: string,
  userId: string,
  threadId: string,
  limit = 50,
): Promise<ChatMessage[]> => {
  const { data } = await http.get<ChatMessage[]>(`/agents/${agentId}/history`, {
    params: { user_id: userId, thread_id: threadId, limit },
  })
  return data
}

export const getChatUsers = async (): Promise<ChatUser[]> => {
  const { data } = await http.get<ChatUser[]>('/agents/chat-users')
  return data
}

export const createChatUser = async (name: string): Promise<ChatUser> => {
  const { data } = await http.post<ChatUser>('/agents/chat-users', { name })
  return data
}

export const getAgentThreads = async (agentId: string, userId: string): Promise<ChatThread[]> => {
  const { data } = await http.get<ChatThread[]>(`/agents/${agentId}/threads`, {
    params: { user_id: userId },
  })
  return data
}

export const createAgentThread = async (
  agentId: string,
  userId: string,
  title?: string,
): Promise<ChatThread> => {
  const { data } = await http.post<ChatThread>(`/agents/${agentId}/threads`, {
    user_id: Number(userId),
    title,
  })
  return data
}

// Knowledge
export const uploadKnowledge = async (payload: KnowledgeUploadRequest): Promise<KnowledgeUploadResponse> => {
  const { data } = await http.post<KnowledgeUploadResponse>('/knowledge/upload', payload)
  return data
}

export const searchKnowledge = async (payload: KnowledgeSearchRequest): Promise<KnowledgeSearchResponse> => {
  const { data } = await http.post<KnowledgeSearchResponse>('/knowledge/search', payload)
  return data
}

export const getKnowledgeChunks = async (params?: { source?: string; limit?: number }): Promise<KnowledgeChunk[]> => {
  const { data } = await http.get<KnowledgeChunk[]>('/knowledge/chunks', { params })
  return data
}

export const deleteKnowledgeChunk = async (chunkId: string): Promise<void> => {
  await http.delete(`/knowledge/chunks/${chunkId}`)
}

export const deleteKnowledgeSource = async (source: string): Promise<void> => {
  await http.delete(`/knowledge/source/${source}`)
}
