import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectContextValue { value: string; onValueChange: (value: string) => void; open: boolean; setOpen: (open: boolean) => void }
const SelectContext = React.createContext<SelectContextValue>({ value: '', onValueChange: () => {}, open: false, setOpen: () => {} })

interface SelectProps { value?: string; onValueChange?: (value: string) => void; children: React.ReactNode }
const Select = ({ value = '', onValueChange = () => {}, children }: SelectProps) => {
  const [open, setOpen] = React.useState(false)
  return <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}><div className="relative">{children}</div></SelectContext.Provider>
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen } = React.useContext(SelectContext)
    return <button ref={ref} className={cn('flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', className)} onClick={() => setOpen(!open)} {...props}>{children}<ChevronDown className="h-4 w-4 opacity-50" /></button>
  }
)
SelectTrigger.displayName = 'SelectTrigger'

interface SelectValueProps {
  placeholder?: string
  children?: React.ReactNode
}

const SelectValue: React.FC<SelectValueProps> = ({ placeholder, children }) => {
  const { value } = React.useContext(SelectContext)
  if (children) return <>{children}</>
  return <span>{value || placeholder}</span>
}

const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen } = React.useContext(SelectContext)
    if (!open) return null
    return <><div className="fixed inset-0 z-40" onClick={() => setOpen(false)} /><div ref={ref} className={cn('absolute top-full z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-popover text-popover-foreground shadow-md', className)} {...props}>{children}</div></>
  }
)
SelectContent.displayName = 'SelectContent'

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> { value: string }
const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value, ...props }, ref) => {
    const ctx = React.useContext(SelectContext)
    return <div ref={ref} className={cn('relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground', ctx.value === value && 'bg-accent text-accent-foreground', className)} onClick={() => { ctx.onValueChange(value); ctx.setOpen(false) }} {...props}>{children}</div>
  }
)
SelectItem.displayName = 'SelectItem'

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
