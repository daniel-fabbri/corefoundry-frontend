import { Link } from 'react-router-dom'
import { Bot, MessageSquare, Database, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Bot className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-5xl font-bold mb-4">CoreFoundry</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Build powerful AI agents using LangChain and Ollama. Manage conversations, threads, and knowledge bases with ease.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline">Sign Up</Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="ghost">Learn More</Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <MessageSquare className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Multi-Thread Conversations</CardTitle>
              <CardDescription>
                Organize conversations by user and thread. Keep context isolated for different projects or clients.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Database className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Knowledge Base</CardTitle>
              <CardDescription>
                Upload documents and create a searchable knowledge base. Your agents can use this context in conversations.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Powered by Ollama</CardTitle>
              <CardDescription>
                Run powerful open-source LLMs locally. Privacy-first architecture with full control over your data.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to build your first agent?</CardTitle>
              <CardDescription>
                Sign up now and start creating intelligent conversational experiences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/register">
                <Button size="lg" className="w-full md:w-auto">
                  Create Free Account
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
