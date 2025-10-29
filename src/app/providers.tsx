'use client'

import { SessionProvider } from 'next-auth/react'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import AuthModal from './components/AuthModal'

function AuthModalWrapper() {
  const { authModalOpen, closeAuthModal, authModalInitialEmail, authModalInitialEmailOptIn } = useAuth()

  return (
    <AuthModal
      isOpen={authModalOpen}
      onClose={closeAuthModal}
      initialEmail={authModalInitialEmail}
      initialEmailOptIn={authModalInitialEmailOptIn}
    />
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        {children}
        <AuthModalWrapper />
      </AuthProvider>
    </SessionProvider>
  )
}