import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { AgentsPage } from '@/pages/AgentsPage'
import { AgentDetailPage } from '@/pages/AgentDetailPage'
import { ChatPage } from '@/pages/ChatPage'
import { KnowledgePage } from '@/pages/KnowledgePage'
import { SettingsPage } from '@/pages/SettingsPage'
import AboutPage from '@/pages/AboutPage'
import { DocsPage } from '@/pages/DocsPage'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'

export const router = createBrowserRouter([
  // Public routes with layout
  {
    path: '/',
    element: <PublicLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/docs', element: <DocsPage /> },
    ],
  },
  // Protected routes
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'agents', element: <AgentsPage /> },
      { path: 'agents/:id', element: <AgentDetailPage /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'knowledge', element: <KnowledgePage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
])
