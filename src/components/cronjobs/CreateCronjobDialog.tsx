import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { createCronjob } from '@/lib/api/corefoundry'
import type { CreateCronjobRequest, HttpMethod } from '@/lib/types/cronjob'

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().optional(),
  url: z.string().url('Must be a valid URL'),
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
  headers: z.string().optional(),
  body: z.string().optional(),
  interval_minutes: z.number().min(1).max(1440),
  is_active: z.boolean(),
})

type FormValues = z.infer<typeof schema>

interface CreateCronjobDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateCronjobDialog({ open, onOpenChange }: CreateCronjobDialogProps) {
  const queryClient = useQueryClient()
  const [jsonError, setJsonError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      url: '',
      method: 'GET',
      headers: '',
      body: '',
      interval_minutes: 1,
      is_active: true,
    },
  })

  const createMutation = useMutation({
    mutationFn: (payload: CreateCronjobRequest) => createCronjob(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cronjobs'] })
      onOpenChange(false)
      form.reset()
      setJsonError(null)
    },
  })

  const onSubmit = (values: FormValues) => {
    setJsonError(null)

    let headers = null
    let body = null

    if (values.headers?.trim()) {
      try {
        headers = JSON.parse(values.headers)
      } catch {
        setJsonError('Invalid JSON in headers')
        return
      }
    }

    if (values.body?.trim()) {
      try {
        body = JSON.parse(values.body)
      } catch {
        setJsonError('Invalid JSON in body')
        return
      }
    }

    const payload: CreateCronjobRequest = {
      name: values.name,
      description: values.description || undefined,
      url: values.url,
      method: values.method,
      headers: headers || undefined,
      body: body || undefined,
      interval_minutes: values.interval_minutes,
      is_active: values.is_active,
    }

    createMutation.mutate(payload)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Cronjob</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              {...form.register('name')}
              placeholder="My Cronjob"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="Optional description"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="url">URL *</Label>
            <Input
              id="url"
              {...form.register('url')}
              placeholder="https://example.com/api/endpoint"
            />
            {form.formState.errors.url && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.url.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="method">HTTP Method *</Label>
            <Select
              value={form.watch('method')}
              onValueChange={(value) => form.setValue('method', value as HttpMethod)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="interval_minutes">Interval (minutes) *</Label>
            <Input
              id="interval_minutes"
              type="number"
              {...form.register('interval_minutes', { valueAsNumber: true })}
              min={1}
              max={1440}
            />
            <p className="text-xs text-muted-foreground mt-1">
              How often to run this cronjob (1-1440 minutes)
            </p>
          </div>

          <div>
            <Label htmlFor="headers">Headers (JSON)</Label>
            <Textarea
              id="headers"
              {...form.register('headers')}
              placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
              rows={3}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Optional HTTP headers as JSON object
            </p>
          </div>

          {['POST', 'PUT', 'PATCH'].includes(form.watch('method')) && (
            <div>
              <Label htmlFor="body">Body (JSON)</Label>
              <Textarea
                id="body"
                {...form.register('body')}
                placeholder='{"key": "value"}'
                rows={4}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Request body as JSON object
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <Label>Active</Label>
              <p className="text-xs text-muted-foreground">
                Start cronjob immediately after creation
              </p>
            </div>
            <Switch
              checked={form.watch('is_active')}
              onCheckedChange={(checked) => form.setValue('is_active', checked)}
            />
          </div>

          {jsonError && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
              {jsonError}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Creating...' : 'Create Cronjob'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
