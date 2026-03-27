import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { http } from '@/lib/api/http'

export interface APIKey {
  id: number
  name: string
  prefix: string
  last_used_at: string | null
  expires_at: string | null
  is_active: boolean
  created_at: string
  key?: string // Only present when first created
}

export interface CreateAPIKeyRequest {
  name: string
  expires_at?: string | null
}

export interface UpdateProfileRequest {
  email?: string
  username?: string
  current_password?: string
  new_password?: string
}

export function useAPIKeys() {
  return useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const response = await http.get<APIKey[]>('/auth/api-keys')
      return response.data
    },
  })
}

export function useCreateAPIKey() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateAPIKeyRequest) => {
      const response = await http.post<APIKey>('/auth/api-keys', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
    },
  })
}

export function useDeleteAPIKey() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (keyId: number) => {
      await http.delete(`/auth/api-keys/${keyId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
    },
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      const response = await http.put('/auth/profile', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}
