import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Activity, AlertCircle, LogOut, User, Menu } from 'lucide-react'
import { getHealth } from '@/lib/api/corefoundry'
import { BASE_URL } from '@/lib/api/http'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/contexts/AuthContext'

interface TopbarProps {
  onMenuClick: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { data, isError } = useQuery({ queryKey: ['health'], queryFn: getHealth, refetchInterval: 30000 })
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const isHealthy = !isError && data?.status === 'ok'
  
  const handleLogout = () => {
    logout()
    navigate('/')
  }
  
  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-14 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 z-30">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-sm text-muted-foreground">API:</span>
          <code className="text-xs bg-muted px-2 py-1 rounded font-mono text-foreground">{BASE_URL}</code>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        {isHealthy ? (
          <Badge variant="success" className="flex items-center gap-1"><Activity className="h-3 w-3" /><span className="hidden sm:inline">Healthy</span></Badge>
        ) : (
          <Badge variant="destructive" className="flex items-center gap-1"><AlertCircle className="h-3 w-3" /><span className="hidden sm:inline">Offline</span></Badge>
        )}
        
        {user && (
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-muted rounded-md">
              <User className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm font-medium">{user.username}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="h-8">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
