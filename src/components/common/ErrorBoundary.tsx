import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom'
import { AlertCircle, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ErrorBoundary() {
  const error = useRouteError()

  let errorMessage: string
  let errorStatus: string | number = 'Error'

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status
    errorMessage = error.statusText || error.data?.message || 'An error occurred'
  } else if (error instanceof Error) {
    errorMessage = error.message
  } else {
    errorMessage = 'An unexpected error occurred'
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-2xl">{errorStatus}</CardTitle>
              <p className="text-sm text-muted-foreground">Something went wrong</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-md">
            <p className="text-sm font-mono">{errorMessage}</p>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => window.history.back()} variant="outline" className="flex-1">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            <Link to="/" className="flex-1">
              <Button className="w-full">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>If this problem persists, please check:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Your internet connection</li>
              <li>The backend API is running</li>
              <li>Browser console for more details</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
