import * as React from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface JsonEditorProps { label?: string; value: string; onChange: (value: string) => void; placeholder?: string; rows?: number; className?: string }
export function JsonEditor({ label, value, onChange, placeholder, rows = 6, className }: JsonEditorProps) {
  const [error, setError] = React.useState<string | null>(null)
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    onChange(val)
    if (val.trim()) {
      try { JSON.parse(val); setError(null) } catch { setError('Invalid JSON') }
    } else { setError(null) }
  }
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && <Label>{label}</Label>}
      <Textarea value={value} onChange={handleChange} placeholder={placeholder || '{ "key": "value" }'} rows={rows} className={cn('font-mono text-sm', error && 'border-destructive')} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
