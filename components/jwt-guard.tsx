"use client"
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useJwtStatus } from './jwt-status-provider'
import { JwtSetupModal } from './jwt-setup-modal'

export function JwtGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const { isJwtValid, isLoading, checkJwtStatus } = useJwtStatus()

  const isLoginPage = pathname.startsWith('/login')

  if (isLoginPage) {
    return <>{children}</>
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-lg">Loading...</span>
        </div>
      </div>
    )
  }

  if (!session) {
    return <>{children}</>
  }

  const shouldShowJwtModal = session && !isJwtValid

  return (
    <>
      <JwtSetupModal 
        isOpen={shouldShowJwtModal} 
        onValidToken={checkJwtStatus}
      />
      {shouldShowJwtModal ? null : children}
    </>
  )
}
