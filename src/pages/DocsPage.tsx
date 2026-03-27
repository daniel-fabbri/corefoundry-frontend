import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DocsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    {
      title: 'Getting Started',
      items: [
        { id: 'introduction', label: 'Introduction' },
        { id: 'authentication', label: 'Authentication' },
        { id: 'base-url', label: 'Base URL' },
      ],
    },
    {
      title: 'Endpoints',
      items: [
        { id: 'auth-register', label: 'Register' },
        { id: 'auth-login', label: 'Login' },
        { id: 'agents-list', label: 'List Agents' },
        { id: 'agents-create', label: 'Create Agent' },
        { id: 'agents-get', label: 'Get Agent' },
        { id: 'agents-update', label: 'Update Agent' },
        { id: 'agents-delete', label: 'Delete Agent' },
        { id: 'agents-chat', label: 'Chat with Agent' },
        { id: 'knowledge-list', label: 'List Knowledge' },
        { id: 'knowledge-upload', label: 'Upload Knowledge' },
        { id: 'knowledge-delete', label: 'Delete Knowledge' },
      ],
    },
    {
      title: 'Data Models',
      items: [
        { id: 'model-user', label: 'User' },
        { id: 'model-agent', label: 'Agent' },
        { id: 'model-knowledge', label: 'Knowledge' },
        { id: 'model-message', label: 'Message' },
      ],
    },
  ]

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setSidebarOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Mobile Sidebar Toggle */}
          <button
            className="lg:hidden fixed bottom-4 right-4 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-lg"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Sidebar */}
          <aside
            className={`
              fixed lg:sticky top-20 left-0 z-40 w-64 h-[calc(100vh-5rem)] 
              bg-background border-r border-border overflow-y-auto
              transition-transform duration-300 lg:translate-x-0
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
          >
            <nav className="p-4 space-y-6">
              {navigation.map((section) => (
                <div key={section.title}>
                  <h3 className="font-semibold text-sm mb-2 text-foreground">
                    {section.title}
                  </h3>
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => scrollToSection(item.id)}
                          className="w-full text-left px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 max-w-4xl">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold mb-4">API Documentation</h1>
              <p className="text-lg text-muted-foreground">
                Complete reference for integrating with CoreFoundry API. Build powerful AI agents programmatically.
              </p>
            </div>

            {/* Getting Started */}
            <section id="introduction" className="mb-12 scroll-mt-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center">
                <ChevronRight className="h-6 w-6 text-primary mr-2" />
                Introduction
              </h2>
              <p className="text-muted-foreground mb-4">
                Welcome to the CoreFoundry API! This API allows you to create and manage AI agents, 
                handle conversations, and upload knowledge bases programmatically. Built with FastAPI 
                and powered by LangChain and Ollama.
              </p>
              <div className="bg-muted/50 border border-border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Key Features:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>RESTful endpoints for all operations</li>
                  <li>JWT-based authentication</li>
                  <li>Multi-user support with data isolation</li>
                  <li>Thread-based conversation management</li>
                  <li>Document upload and RAG (Retrieval-Augmented Generation)</li>
                </ul>
              </div>
            </section>

            <section id="authentication" className="mb-12 scroll-mt-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center">
                <ChevronRight className="h-6 w-6 text-primary mr-2" />
                Authentication
              </h2>
              <p className="text-muted-foreground mb-4">
                CoreFoundry uses JWT (JSON Web Tokens) for authentication. Include the token in the 
                Authorization header for all protected endpoints.
              </p>
              <div className="bg-black/40 border border-border rounded-lg p-4 font-mono text-sm mb-4">
                <div className="text-green-400 mb-2"># Example request with authentication</div>
                <div className="text-muted-foreground">
                  curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \<br />
                  &nbsp;&nbsp;&nbsp;&nbsp; https://api.corefoundry.com/api/agents
                </div>
              </div>
            </section>

            <section id="base-url" className="mb-12 scroll-mt-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center">
                <ChevronRight className="h-6 w-6 text-primary mr-2" />
                Base URL
              </h2>
              <p className="text-muted-foreground mb-4">All API endpoints are relative to:</p>
              <div className="bg-black/40 border border-border rounded-lg p-4 font-mono text-sm">
                <span className="text-blue-400">https://2a5f-2804-14d-5c41-9977-b1c2-60a8-1e11-b453.ngrok-free.app/api</span>
              </div>
            </section>

            {/* Auth Endpoints */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-primary">Authentication Endpoints</h2>

              <section id="auth-register" className="mb-8 scroll-mt-8">
                <div className="border border-border rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded text-sm font-mono mr-3">
                      POST
                    </span>
                    <code className="text-lg font-mono">/auth/register</code>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Create a new user account. Returns user details and authentication token.
                  </p>
                  
                  <h4 className="font-semibold mb-2">Request Body:</h4>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm mb-4">
                    <pre className="text-muted-foreground">{`{
  "username": "string",
  "email": "string",
  "password": "string"
}`}</pre>
                  </div>

                  <h4 className="font-semibold mb-2">Response (200):</h4>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm">
                    <pre className="text-muted-foreground">{`{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`}</pre>
                  </div>
                </div>
              </section>

              <section id="auth-login" className="mb-8 scroll-mt-8">
                <div className="border border-border rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded text-sm font-mono mr-3">
                      POST
                    </span>
                    <code className="text-lg font-mono">/auth/login</code>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Authenticate an existing user. Returns authentication token.
                  </p>
                  
                  <h4 className="font-semibold mb-2">Request Body:</h4>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm mb-4">
                    <pre className="text-muted-foreground">{`{
  "username": "string",
  "password": "string"
}`}</pre>
                  </div>

                  <h4 className="font-semibold mb-2">Response (200):</h4>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm">
                    <pre className="text-muted-foreground">{`{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}`}</pre>
                  </div>
                </div>
              </section>
            </div>

            {/* Agent Endpoints */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-primary">Agent Endpoints</h2>

              <section id="agents-list" className="mb-8 scroll-mt-8">
                <div className="border border-border rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded text-sm font-mono mr-3">
                      GET
                    </span>
                    <code className="text-lg font-mono">/agents</code>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Retrieve all agents for the authenticated user.
                  </p>
                  
                  <h4 className="font-semibold mb-2">Headers:</h4>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm mb-4">
                    <pre className="text-muted-foreground">Authorization: Bearer YOUR_TOKEN</pre>
                  </div>

                  <h4 className="font-semibold mb-2">Response (200):</h4>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm">
                    <pre className="text-muted-foreground">{`[
  {
    "id": 1,
    "name": "Customer Support Agent",
    "description": "Handles customer inquiries",
    "model": "llama3.2",
    "temperature": 0.7,
    "system_prompt": "You are a helpful assistant...",
    "created_at": "2026-03-27T10:00:00Z"
  }
]`}</pre>
                  </div>
                </div>
              </section>

              <section id="agents-create" className="mb-8 scroll-mt-8">
                <div className="border border-border rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded text-sm font-mono mr-3">
                      POST
                    </span>
                    <code className="text-lg font-mono">/agents</code>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Create a new AI agent with custom configuration.
                  </p>
                  
                  <h4 className="font-semibold mb-2">Request Body:</h4>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm mb-4">
                    <pre className="text-muted-foreground">{`{
  "name": "string",
  "description": "string",
  "model": "llama3.2",
  "temperature": 0.7,
  "system_prompt": "string"
}`}</pre>
                  </div>

                  <h4 className="font-semibold mb-2">Response (201):</h4>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm">
                    <pre className="text-muted-foreground">{`{
  "id": 2,
  "name": "Customer Support Agent",
  "description": "Handles customer inquiries",
  "model": "llama3.2",
  "temperature": 0.7,
  "system_prompt": "You are a helpful assistant...",
  "created_at": "2026-03-27T10:00:00Z"
}`}</pre>
                  </div>
                </div>
              </section>

              <section id="agents-get" className="mb-8 scroll-mt-8">
                <div className="border border-border rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded text-sm font-mono mr-3">
                      GET
                    </span>
                    <code className="text-lg font-mono">/agents/:id</code>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Retrieve a specific agent by ID.
                  </p>
                  
                  <h4 className="font-semibold mb-2">Parameters:</h4>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm mb-4">
                    <pre className="text-muted-foreground">id: integer (path parameter)</pre>
                  </div>

                  <h4 className="font-semibold mb-2">Response (200):</h4>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm">
                    <pre className="text-muted-foreground">{`{
  "id": 1,
  "name": "Customer Support Agent",
  "description": "Handles customer inquiries",
  "model": "llama3.2",
  "temperature": 0.7,
  "system_prompt": "You are a helpful assistant...",
  "created_at": "2026-03-27T10:00:00Z"
}`}</pre>
                  </div>
                </div>
              </section>

              <section id="agents-update" className="mb-8 scroll-mt-8">
                <div className="border border-border rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded text-sm font-mono mr-3">
                      PUT
                    </span>
                    <code className="text-lg font-mono">/agents/:id</code>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Update an existing agent's configuration.
                  </p>
                  
                  <h4 className="font-semibold mb-2">Request Body:</h4>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm mb-4">
                    <pre className="text-muted-foreground">{`{
  "name": "string",
  "description": "string",
  "model": "llama3.2",
  "temperature": 0.7,
  "system_prompt": "string"
}`}</pre>
                  </div>

                  <h4 className="font-semibold mb-2">Response (200):</h4>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm">
                    <pre className="text-muted-foreground">{`{
  "id": 1,
  "name": "Updated Agent Name",
  "description": "Updated description",
  "model": "llama3.2",
  "temperature": 0.8,
  "system_prompt": "Updated prompt...",
  "created_at": "2026-03-27T10:00:00Z"
}`}</pre>
                  </div>
                </div>
              </section>

              <section id="agents-delete" className="mb-8 scroll-mt-8">
                <div className="border border-border rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded text-sm font-mono mr-3">
                      DELETE
                    </span>
                    <code className="text-lg font-mono">/agents/:id</code>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Delete an agent permanently.
                  </p>
                  
                  <h4 className="font-semibold mb-2">Parameters:</h4>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm mb-4">
                    <pre className="text-muted-foreground">id: integer (path parameter)</pre>
                  </div>

                  <h4 className="font-semibold mb-2">Response (204):</h4>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm">
                    <pre className="text-muted-foreground">No content</pre>
                  </div>
                </div>
              </section>

              <section id="agents-chat" className="mb-8 scroll-mt-8">
                <div className="border border-border rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded text-sm font-mono mr-3">
                      POST
                    </span>
                    <code className="text-lg font-mono">/agents/:id/chat</code>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Send a message to an agent and get a response. Maintains conversation context via thread_id.
                  </p>
                  
                  <h4 className="font-semibold mb-2">Request Body:</h4>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm mb-4">
                    <pre className="text-muted-foreground">{`{
  "message": "string",
  "thread_id": "string (optional)",
  "use_knowledge": true
}`}</pre>
                  </div>

                  <h4 className="font-semibold mb-2">Response (200):</h4>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm">
                    <pre className="text-muted-foreground">{`{
  "response": "Here's the answer to your question...",
  "thread_id": "thread_abc123",
  "agent_id": 1,
  "timestamp": "2026-03-27T10:30:00Z"
}`}</pre>
                  </div>
                </div>
              </section>
            </div>

            {/* Knowledge Endpoints */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-primary">Knowledge Base Endpoints</h2>

              <section id="knowledge-list" className="mb-8 scroll-mt-8">
                <div className="border border-border rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded text-sm font-mono mr-3">
                      GET
                    </span>
                    <code className="text-lg font-mono">/knowledge</code>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    List all knowledge base documents for the authenticated user.
                  </p>

                  <h4 className="font-semibold mb-2">Response (200):</h4>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm">
                    <pre className="text-muted-foreground">{`[
  {
    "id": 1,
    "title": "Product Documentation",
    "filename": "product_docs.pdf",
    "file_type": "pdf",
    "agent_id": 1,
    "uploaded_at": "2026-03-27T09:00:00Z"
  }
]`}</pre>
                  </div>
                </div>
              </section>

              <section id="knowledge-upload" className="mb-8 scroll-mt-8">
                <div className="border border-border rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded text-sm font-mono mr-3">
                      POST
                    </span>
                    <code className="text-lg font-mono">/knowledge/upload</code>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Upload a document to the knowledge base. Supports PDF, TXT, and DOCX files.
                  </p>
                  
                  <h4 className="font-semibold mb-2">Request (multipart/form-data):</h4>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm mb-4">
                    <pre className="text-muted-foreground">{`file: File
agent_id: integer (optional)
title: string (optional)`}</pre>
                  </div>

                  <h4 className="font-semibold mb-2">Response (201):</h4>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm">
                    <pre className="text-muted-foreground">{`{
  "id": 2,
  "title": "Product Documentation",
  "filename": "product_docs.pdf",
  "file_type": "pdf",
  "agent_id": 1,
  "uploaded_at": "2026-03-27T09:00:00Z",
  "message": "Document uploaded and indexed successfully"
}`}</pre>
                  </div>
                </div>
              </section>

              <section id="knowledge-delete" className="mb-8 scroll-mt-8">
                <div className="border border-border rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded text-sm font-mono mr-3">
                      DELETE
                    </span>
                    <code className="text-lg font-mono">/knowledge/:id</code>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Delete a knowledge base document.
                  </p>
                  
                  <h4 className="font-semibold mb-2">Parameters:</h4>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm mb-4">
                    <pre className="text-muted-foreground">id: integer (path parameter)</pre>
                  </div>

                  <h4 className="font-semibold mb-2">Response (204):</h4>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm">
                    <pre className="text-muted-foreground">No content</pre>
                  </div>
                </div>
              </section>
            </div>

            {/* Data Models */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-primary">Data Models</h2>

              <section id="model-user" className="mb-8 scroll-mt-8">
                <div className="border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3">User</h3>
                  <p className="text-muted-foreground mb-4">
                    Represents a user account in the system.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm">
                    <pre className="text-muted-foreground">{`{
  "id": integer,
  "username": string,
  "email": string,
  "created_at": datetime
}`}</pre>
                  </div>
                </div>
              </section>

              <section id="model-agent" className="mb-8 scroll-mt-8">
                <div className="border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3">Agent</h3>
                  <p className="text-muted-foreground mb-4">
                    Represents an AI agent configuration.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm">
                    <pre className="text-muted-foreground">{`{
  "id": integer,
  "name": string,
  "description": string,
  "model": string (e.g., "llama3.2"),
  "temperature": float (0.0 - 1.0),
  "system_prompt": string,
  "user_id": integer,
  "created_at": datetime
}`}</pre>
                  </div>
                </div>
              </section>

              <section id="model-knowledge" className="mb-8 scroll-mt-8">
                <div className="border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3">Knowledge</h3>
                  <p className="text-muted-foreground mb-4">
                    Represents a document in the knowledge base.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm">
                    <pre className="text-muted-foreground">{`{
  "id": integer,
  "title": string,
  "filename": string,
  "file_type": string (pdf, txt, docx),
  "agent_id": integer (optional),
  "user_id": integer,
  "uploaded_at": datetime
}`}</pre>
                  </div>
                </div>
              </section>

              <section id="model-message" className="mb-8 scroll-mt-8">
                <div className="border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3">Message</h3>
                  <p className="text-muted-foreground mb-4">
                    Represents a chat message in a conversation thread.
                  </p>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-sm">
                    <pre className="text-muted-foreground">{`{
  "id": integer,
  "thread_id": string,
  "role": string (user, assistant, system),
  "content": string,
  "agent_id": integer,
  "timestamp": datetime
}`}</pre>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer CTA */}
            <div className="mt-16 border-t border-border pt-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-3">Ready to get started?</h3>
                <p className="text-muted-foreground mb-6">
                  Create your account and start building AI agents today.
                </p>
                <Link to="/register">
                  <Button size="lg">
                    Get Started for Free
                  </Button>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
