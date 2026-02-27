import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from '@app/router'
import { AuthProvider } from '@app/providers/AuthProvider'
import { FollowProvider } from '@app/providers/FollowProvider'
import '@app/styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <FollowProvider>
        <RouterProvider router={router} />
      </FollowProvider>
    </AuthProvider>
  </React.StrictMode>,
)
