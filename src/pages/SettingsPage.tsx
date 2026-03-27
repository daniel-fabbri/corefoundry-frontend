import { useState } from 'react'
import { User, Key, Copy, Trash2, Plus, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/lib/contexts/AuthContext'
import { useAPIKeys, useCreateAPIKey, useDeleteAPIKey, useUpdateProfile } from '@/features/settings/hooks'
import { toast } from 'sonner'

export function SettingsPage() {
  const { user } = useAuth()
  const { data: apiKeys, isLoading: keysLoading } = useAPIKeys()
  const createKeyMutation = useCreateAPIKey()
  const deleteKeyMutation = useDeleteAPIKey()
  const updateProfileMutation = useUpdateProfile()

  // Profile form state
  const [email, setEmail] = useState(user?.email || '')
  const [username, setUsername] = useState(user?.username || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // API Key form state
  const [newKeyName, setNewKeyName] = useState('')
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword && newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    try {
      await updateProfileMutation.mutateAsync({
        email: email !== user?.email ? email : undefined,
        username: username !== user?.username ? username : undefined,
        current_password: currentPassword || undefined,
        new_password: newPassword || undefined,
      })
      toast.success('Profile updated successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to update profile')
    }
  }

  const handleCreateAPIKey = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newKeyName.trim()) {
      toast.error('Please enter a name for the API key')
      return
    }

    try {
      const result = await createKeyMutation.mutateAsync({
        name: newKeyName.trim(),
      })
      
      if (result.key) {
        setNewlyCreatedKey(result.key)
        toast.success('API key created successfully')
      }
      
      setNewKeyName('')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to create API key')
    }
  }

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    toast.success('API key copied to clipboard')
  }

  const handleDeleteKey = async (keyId: number, keyName: string) => {
    if (!confirm(`Are you sure you want to delete the API key "${keyName}"?`)) {
      return
    }

    try {
      await deleteKeyMutation.mutateAsync(keyId)
      toast.success('API key deleted successfully')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to delete API key')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and API keys</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Profile Settings</CardTitle>
          </div>
          <CardDescription>Update your account information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                />
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-semibold mb-3">Change Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-muted-foreground" />
            <CardTitle>API Keys</CardTitle>
          </div>
          <CardDescription>
            Manage API keys for programmatic access to your agents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Show newly created key */}
          {newlyCreatedKey && (
            <Alert className="border-green-600 dark:border-green-500 bg-green-50/50 dark:bg-green-950/50">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-semibold text-green-800 dark:text-green-200">
                    API Key Created Successfully!
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Copy this key now - it won't be shown again:
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newlyCreatedKey}
                      readOnly
                      className="font-mono text-sm bg-background border-green-200 dark:border-green-800"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleCopyKey(newlyCreatedKey)}
                      variant="outline"
                      className="border-green-600 dark:border-green-500 hover:bg-green-100 dark:hover:bg-green-900"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setNewlyCreatedKey(null)}
                    className="mt-2"
                  >
                    I've saved it, close this
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Create new key form */}
          <div className="border rounded-lg p-4 bg-muted/50">
            <h3 className="text-sm font-semibold mb-3">Create New API Key</h3>
            <form onSubmit={handleCreateAPIKey} className="flex gap-2">
              <Input
                placeholder="Key name (e.g., Production, Development)"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={createKeyMutation.isPending}>
                <Plus className="h-4 w-4 mr-1" />
                {createKeyMutation.isPending ? 'Creating...' : 'Create'}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2">
              Use API keys to authenticate requests without JWT tokens. Include in requests as{' '}
              <code className="bg-muted px-1 py-0.5 rounded">X-API-Key</code> header.
            </p>
          </div>

          {/* List existing keys */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Your API Keys</h3>
            
            {keysLoading ? (
              <div className="text-sm text-muted-foreground py-4">Loading keys...</div>
            ) : !apiKeys || apiKeys.length === 0 ? (
              <div className="text-sm text-muted-foreground py-4 text-center border rounded-lg">
                No API keys yet. Create one above to get started.
              </div>
            ) : (
              <div className="space-y-2">
                {apiKeys.map((apiKey) => (
                  <div
                    key={apiKey.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{apiKey.name}</p>
                        {!apiKey.is_active && (
                          <span className="text-xs bg-destructive/20 text-destructive px-2 py-0.5 rounded">
                            Revoked
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-mono">{apiKey.prefix}</p>
                      <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                        <span>Created: {new Date(apiKey.created_at).toLocaleDateString()}</span>
                        {apiKey.last_used_at && (
                          <span>Last used: {new Date(apiKey.last_used_at).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteKey(apiKey.id, apiKey.name)}
                      disabled={deleteKeyMutation.isPending}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
