import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Send, MessageSquare, Bot, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { EmptyState } from '@/components/common/EmptyState'
import { useAgents, useChatWithAgent, useAgentHistory } from '@/features/agents/hooks'

export function ChatPage() {
  const [searchParams] = useSearchParams()
  const { data: agents } = useAgents()
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null)
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const [input, setInput] = useState('')
  const [useKnowledge, setUseKnowledge] = useState(false)
  const chatMutation = useChatWithAgent()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { data: historyData, isLoading: isLoadingHistory, refetch: refetchHistory } = useAgentHistory(selectedAgentId?.toString() || null)

  useEffect(() => {
    const agentParam = searchParams.get('agent')
    if (agentParam && agents) {
      const agentId = parseInt(agentParam, 10)
      if (!isNaN(agentId)) {
        setSelectedAgentId(agentId)
        console.log('🤖 Agent auto-selected from URL:', agentId)
      }
    }
  }, [searchParams, agents])

  // Load conversation history when agent is selected
  useEffect(() => {
    console.log('📊 History state:', {
      selectedAgentId,
      hasHistoryData: !!historyData,
      historyLength: historyData?.length || 0,
      isLoading: isLoadingHistory
    })

    if (selectedAgentId && historyData !== undefined) {
      if (historyData && historyData.length > 0) {
        const loadedMessages = historyData.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }))
        setMessages(loadedMessages)
        console.log('📜 Loaded chat history:', loadedMessages.length, 'messages')
      } else {
        // Agent selected but no history - clear messages
        setMessages([])
        console.log('📜 No chat history for agent', selectedAgentId)
      }
    }
  }, [historyData, selectedAgentId, isLoadingHistory])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || !selectedAgentId) return
    
    const userMessage = input
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])

    console.log('💬 Sending chat message:', {
      agentId: selectedAgentId,
      input: userMessage,
      use_knowledge: useKnowledge
    })

    chatMutation.mutate(
      { 
        agentId: selectedAgentId, 
        payload: { input: userMessage, use_knowledge: useKnowledge } 
      },
      {
        onSuccess: (data) => {
          console.log('✅ Chat response received:', data)
          
          // Check if response contains error from backend
          if (data.metadata?.error || data.response.includes('Error communicating with Ollama')) {
            let errorMsg = data.response
            
            if (data.response.includes('Ollama') && data.response.includes('404')) {
              errorMsg = '⚠️ Ollama service error detected:\n\n' +
                        'The backend cannot connect to Ollama. Please check:\n\n' +
                        '1. Is Ollama installed and running?\n' +
                        '2. Is it accessible at http://localhost:11434?\n' +
                        '3. Try: `ollama serve` in a terminal\n' +
                        '4. Verify a model is downloaded: `ollama list`'
            }
            
            setMessages(prev => [...prev, { 
              role: 'assistant', 
              content: errorMsg
            }])
          } else {
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
          }
        },
        onError: (error) => {
          console.error('❌ Chat error:', error)
          let errorMsg = 'Sorry, I encountered an error processing your message.'
          
          if (error.message.includes('Ollama')) {
            errorMsg = '⚠️ Ollama is not running or not accessible. Please ensure:\n\n1. Ollama is installed and running\n2. The service is available at http://localhost:11434\n3. A model is downloaded (e.g., `ollama pull llama2`)'
          } else if (error.message.includes('404')) {
            errorMsg = '⚠️ API endpoint not found. The backend service may need to be restarted.'
          } else if (error.message) {
            errorMsg = `❌ Error: ${error.message}`
          }
          
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: errorMsg
          }])
        }
      }
    )
  }

  const selectedAgent = agents?.find(a => a.id === selectedAgentId)

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Chat</h1>
        <p className="text-muted-foreground mt-1">Interact with your AI agents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Debug Mode:</strong> Logs are active. Check browser console (F12) for details.
              </AlertDescription>
            </Alert>
 
            <div className="space-y-2">
              <Label htmlFor="agent-select">Agent</Label>
              <Select 
                value={selectedAgentId?.toString() || ''} 
                onValueChange={(v) => {
                  const agentId = parseInt(v, 10)
                  setSelectedAgentId(agentId)
                  setMessages([]) // Clear messages when switching agents
                  console.log('🤖 Agent selected:', agentId, agents?.find(a => a.id === agentId))
                  console.log('🔄 History will be loaded for agent:', agentId)
                }}
              >
                <SelectTrigger id="agent-select">
                  <SelectValue placeholder="Select an agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents?.map(agent => (
                    <SelectItem key={agent.id} value={agent.id.toString()}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedAgent && (
              <div className="space-y-2 p-3 bg-muted rounded-md">
                <p className="text-xs text-muted-foreground">Selected Agent</p>
                <p className="font-medium text-sm">{selectedAgent.name}</p>
                <p className="text-xs text-muted-foreground">Model: {selectedAgent.model_name}</p>
                <p className="text-xs font-mono text-destructive">ID: {selectedAgent.id}</p>
                {selectedAgent.config && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-muted-foreground">Config</summary>
                    <pre className="mt-1 p-2 bg-background rounded text-[10px] overflow-auto max-h-32">
                      {JSON.stringify(selectedAgent.config, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <Label htmlFor="use-knowledge" className="text-sm">Use Knowledge Base</Label>
              <Switch 
                id="use-knowledge"
                checked={useKnowledge} 
                onCheckedChange={setUseKnowledge}
              />
            </div>

            {selectedAgentId && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => {
                  console.log('🔄 Manually reloading history for agent:', selectedAgentId)
                  refetchHistory()
                }}
                disabled={isLoadingHistory}
              >
                {isLoadingHistory ? 'Loading...' : 'Reload History'}
              </Button>
            )}

            {messages.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => setMessages([])}
              >
                Clear Chat
              </Button>
            )}

            <div className="pt-4 border-t">
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full"
                onClick={async () => {
                  if (!selectedAgentId) {
                    alert('Please select an agent first')
                    return
                  }
                  
                  console.log('🧪 Testing direct API call with agent:', selectedAgentId)
                  
                  try {
                    const response = await fetch(`https://5c76-2804-14d-5c41-9977-a417-c16c-a3a1-d0a2.ngrok-free.app/agents/${selectedAgentId}/chat`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true',
                      },
                      body: JSON.stringify({
                        input: 'Test message from frontend',
                        use_knowledge: false
                      })
                    })
                    
                    const data = await response.json()
                    console.log('🧪 Test response:', data)
                    alert(`Status: ${response.status}\n\nResponse: ${JSON.stringify(data, null, 2)}`)
                  } catch (error) {
                    console.error('🧪 Test error:', error)
                    alert(`Error: ${error}`)
                  }
                }}
              >
                🧪 Test Direct API Call
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle>Conversation</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {!selectedAgentId ? (
                <EmptyState 
                  icon={Bot} 
                  title="Select an agent" 
                  description="Choose an agent from the sidebar to start chatting"
                />
              ) : messages.length === 0 ? (
                <EmptyState 
                  icon={MessageSquare} 
                  title="No messages yet" 
                  description={`Start a conversation with ${selectedAgent?.name || 'your agent'}`}
                />
              ) : (
                <>
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex items-start gap-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary' : 'bg-muted'}`}>
                          {msg.role === 'user' ? (
                            <span className="text-primary-foreground text-sm font-medium">U</span>
                          ) : (
                            <Bot className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className={`rounded-lg p-3 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {chatMutation.isPending && (
                    <div className="flex justify-start">
                      <div className="flex items-start gap-2 max-w-[80%]">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="rounded-lg p-3 bg-muted">
                          <p className="text-sm text-muted-foreground">Thinking...</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder={selectedAgentId ? "Type your message..." : "Select an agent first..."}
                disabled={chatMutation.isPending || !selectedAgentId}
              />
              <Button 
                onClick={handleSend} 
                disabled={chatMutation.isPending || !input.trim() || !selectedAgentId}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
