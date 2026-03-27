import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Bot, MessageSquare, Database, Shield, Zap, Users } from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      icon: <Bot className="w-6 h-6" />,
      title: "Agent Management",
      description: "Create, configure, and manage AI agents with custom behaviors and capabilities."
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Interactive Chat",
      description: "Engage in conversations with AI agents powered by advanced language models."
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Knowledge Base",
      description: "Enhance agent responses with RAG (Retrieval Augmented Generation) capabilities."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Authentication",
      description: "User authentication and authorization to protect your agents and conversations."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Thread Management",
      description: "Organize conversations into threads for better context management."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Personal Workspace",
      description: "Each user has their own private workspace with isolated agents and data."
    }
  ];

  const technologies = [
    { name: "React", category: "Frontend" },
    { name: "TypeScript", category: "Frontend" },
    { name: "Tailwind CSS", category: "Frontend" },
    { name: "FastAPI", category: "Backend" },
    { name: "Python", category: "Backend" },
    { name: "PostgreSQL", category: "Database" },
    { name: "LangChain", category: "AI" },
    { name: "Ollama", category: "AI" }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About CoreFoundry</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A powerful platform for building and managing AI agents with LangChain and Ollama.
          Create intelligent agents, organize conversations, and enhance responses with your own knowledge base.
        </p>
      </div>

      {/* Features */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl">Technology Stack</CardTitle>
          <CardDescription>
            Built with modern, production-ready technologies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                {tech.name}
                <span className="ml-2 text-xs opacity-60">({tech.category})</span>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl">How It Works</CardTitle>
          <CardDescription>
            Get started with CoreFoundry in a few simple steps
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="font-semibold mb-1">Create an Agent</h3>
              <p className="text-muted-foreground">
                Set up your first AI agent with a name, description, and choose the AI model that fits your needs.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="font-semibold mb-1">Start Chatting</h3>
              <p className="text-muted-foreground">
                Begin conversations with your agent. Create threads to organize different topics or contexts.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="font-semibold mb-1">Add Knowledge</h3>
              <p className="text-muted-foreground">
                Enhance your agent's capabilities by adding documents to the knowledge base for more informed responses.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h3 className="font-semibold mb-1">Manage & Scale</h3>
              <p className="text-muted-foreground">
                Create multiple agents for different purposes, organize conversations, and scale your AI operations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Documentation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">API Documentation</CardTitle>
          <CardDescription>
            Explore the complete API documentation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            CoreFoundry provides a comprehensive REST API for building custom integrations.
            Access the interactive API documentation to explore all available endpoints.
          </p>
          <div className="flex gap-4">
            <a
              href="/api/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Swagger UI Documentation
            </a>
            <a
              href="/api/redoc"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              ReDoc Documentation
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center mt-12 text-muted-foreground">
        <p>Version 0.1.0</p>
        <p className="mt-2">Built with ❤️ using React, FastAPI, and AI</p>
      </div>
    </div>
  );
}
