import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'

// The admin is only loaded on /admin, so visitors never download it (or its styles)
const Admin = lazy(() => import('./admin/Admin.tsx'))
const Desktop = lazy(() => import('./os/index.ts'))
const isAdmin = window.location.pathname.replace(/\/$/, '') === '/admin'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={null}>{isAdmin ? <Admin /> : <Desktop />}</Suspense>
  </StrictMode>,
)
