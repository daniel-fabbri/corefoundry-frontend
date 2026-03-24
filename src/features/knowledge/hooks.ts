import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { uploadKnowledge, searchKnowledge, getKnowledgeChunks, deleteKnowledgeChunk, deleteKnowledgeSource } from '@/lib/api/corefoundry'
import type { KnowledgeUploadRequest, KnowledgeSearchRequest } from '@/lib/types/corefoundry'

const CHUNKS_KEY = ['knowledge', 'chunks']

export function useKnowledgeChunks(params?: { source?: string; limit?: number }) {
  return useQuery({ queryKey: [...CHUNKS_KEY, params], queryFn: () => getKnowledgeChunks(params) })
}

export function useUploadKnowledge() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: KnowledgeUploadRequest) => uploadKnowledge(payload),
    onSuccess: (data) => { qc.invalidateQueries({ queryKey: CHUNKS_KEY }); toast.success(`Uploaded ${data.chunks_created} chunks from source "${data.source}"`) },
    onError: (err: Error) => { toast.error(err.message || 'Failed to upload knowledge') },
  })
}

export function useSearchKnowledge() {
  return useMutation({
    mutationFn: (payload: KnowledgeSearchRequest) => searchKnowledge(payload),
    onError: (err: Error) => { toast.error(err.message || 'Failed to search knowledge') },
  })
}

export function useDeleteChunk() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (chunkId: string) => deleteKnowledgeChunk(chunkId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: CHUNKS_KEY }); toast.success('Chunk deleted') },
    onError: (err: Error) => { toast.error(err.message || 'Failed to delete chunk') },
  })
}

export function useDeleteSource() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (source: string) => deleteKnowledgeSource(source),
    onSuccess: () => { qc.invalidateQueries({ queryKey: CHUNKS_KEY }); toast.success('Source deleted') },
    onError: (err: Error) => { toast.error(err.message || 'Failed to delete source') },
  })
}
