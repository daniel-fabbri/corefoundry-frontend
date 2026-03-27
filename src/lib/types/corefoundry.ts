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

export interface UpdateAgentRequest {
  name?: string
  description?: string
  model_name?: string
  config?: AgentConfig
}

export interface ChatMessage {
  id?: number
  role: 'user' | 'assistant'
  content: string
  created_at?: string
  metadata?: Record<string, unknown>
}

export interface ChatUser {
  id: number
  name: string
  created_at: string
}

export interface ChatThread {
  id: number
  agent_id: number
  user_id: number
  title: string
  created_at: string
  updated_at: string
}

export interface ChatRequest {
  input: string
  thread_id: number
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

// Memory
export interface Memory {
  id: number
  agent_id: number
  key: string
  value: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

// Knowledge Files
export interface KnowledgeFile {
  filename: string
  size: number
  created_at: string
  agent_id: number
}

export interface KnowledgeFileUploadResponse {
  message: string
  filename: string
  chunks_created: number
  agent_id: number
}
