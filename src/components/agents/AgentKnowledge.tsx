import { useState, useRef } from 'react'
import { FileText, Upload, Trash2, File } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import {
  useKnowledgeFiles,
  useUploadKnowledgeFile,
  useDeleteKnowledgeFile,
} from '@/features/agents/hooks'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface AgentKnowledgeProps {
  agentId: string
}

export function AgentKnowledge({ agentId }: AgentKnowledgeProps) {
  const { data: files, isLoading, isError } = useKnowledgeFiles(agentId)
  const uploadFile = useUploadKnowledgeFile()
  const deleteFile = useDeleteKnowledgeFile()
  
  const [uploadOpen, setUploadOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [fileToDelete, setFileToDelete] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ['.txt', '.csv', '.pdf']
      const fileExt = '.' + file.name.split('.').pop()?.toLowerCase()
      
      if (!validTypes.includes(fileExt)) {
        toast.error(`Invalid file type. Allowed: ${validTypes.join(', ')}`)
        return
      }
      
      setSelectedFile(file)
    }
  }

  const handleUpload = () => {
    if (!selectedFile) return
    
    uploadFile.mutate(
      { agentId, file: selectedFile },
      {
        onSuccess: () => {
          setUploadOpen(false)
          setSelectedFile(null)
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
        },
      }
    )
  }

  const handleDeleteClick = (filename: string) => {
    setFileToDelete(filename)
    setDeleteOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (!fileToDelete) return
    
    deleteFile.mutate(
      { agentId, filename: fileToDelete },
      {
        onSuccess: () => {
          setDeleteOpen(false)
          setFileToDelete(null)
        },
      }
    )
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Knowledge Base
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Knowledge Base
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorState message="Failed to load knowledge files" />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Knowledge Base
              <span className="text-sm font-normal text-muted-foreground">
                ({files?.length || 0} files)
              </span>
            </CardTitle>
            <Button size="sm" onClick={() => setUploadOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!files || files.length === 0 ? (
            <EmptyState
              title="No knowledge files uploaded yet"
              description="Upload txt, csv, or pdf files to provide context to the agent."
              icon={FileText}
            />
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {files.map((file) => (
                <div
                  key={file.filename}
                  className="flex items-center justify-between p-3 bg-muted rounded-md border border-border hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <File className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.filename}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive shrink-0"
                    onClick={() => handleDeleteClick(file.filename)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Knowledge File</DialogTitle>
            <DialogDescription>
              Select a text file (.txt), CSV (.csv), or PDF (.pdf) to add to the agent's knowledge base.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.csv,.pdf"
              onChange={handleFileSelect}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
            />
            {selectedFile && (
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setUploadOpen(false)
                setSelectedFile(null)
                if (fileInputRef.current) {
                  fileInputRef.current.value = ''
                }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploadFile.isPending}
            >
              {uploadFile.isPending ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Knowledge File"
        description={`Are you sure you want to delete "${fileToDelete}"? This will also remove all associated knowledge chunks.`}
        loading={deleteFile.isPending}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
}
