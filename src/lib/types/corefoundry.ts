// Health
export interface HealthResponse {
  status: string
  [key: string]: unknown
}

// Agents
export interface AgentConfig {
  temperature?: number
  system_prompt?: string
  [key: string]: unknown
}

export interface Agent {
  id: number
  name: string
  description?: string
  model_name: string
  config: AgentConfig
  created_at: string
}

export interface CreateAgentRequest {
  name: string
  description?: string
  model_name?: string
  config: AgentConfig
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

export interface ChatRequest {
  input: string
  use_knowledge?: boolean
}

export interface ChatResponse {
  response: string
  metadata: {
    model?: string
    agent_id?: number
    agent_name?: string
    error?: boolean
    [key: string]: unknown
  }
}

// Knowledge
export interface KnowledgeUploadRequest {
  content: string
  source: string
  metadata?: Record<string, unknown>
}

export interface KnowledgeUploadResponse {
  chunks_created: number
  source: string
}

export interface KnowledgeSearchRequest {
  query: string
  limit?: number
}

export interface KnowledgeChunk {
  chunk_id: string
  content: string
  source: string
  metadata?: Record<string, unknown>
  score?: number
}

export interface KnowledgeSearchResponse {
  results: KnowledgeChunk[]
}
