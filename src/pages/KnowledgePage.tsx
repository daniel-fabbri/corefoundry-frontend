import { useState } from 'react'
import { FileText, Plus, Trash2, Upload } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/EmptyState'

export function KnowledgePage() {
  const [knowledge] = useState<Array<{ id: string; name: string; size: string }>>([])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Knowledge Base</h1>
          <p className="text-muted-foreground mt-1">Manage documents and knowledge for your agents</p>
        </div>
        <Button>
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {knowledge.length === 0 ? (
            <EmptyState 
              icon={FileText} 
              title="No documents yet" 
              description="Upload documents to create a knowledge base for your agents"
              action={
                <Button>
                  <Plus className="h-4 w-4" />
                  Upload Document
                </Button>
              }
            />
          ) : (
            <div className="space-y-2">
              {knowledge.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-3 rounded-md border border-border hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
