"use client"
import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icons } from '@/components/icons'
import { LogoSpinner } from '@/components/logo-spinner'
import { ThemeToggle } from '@/components/theme/theme-toggle'

export default function LoginPage() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSteamLogin = async () => {
    setIsLoading(true)
    try {
      await signIn('steam', { callbackUrl: '/' })
    } catch (error) {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-lg">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-background flex items-center justify-center p-4 relative">
      {}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {}
      <Card className="w-full max-w-md shadow-2xl bg-card/95 backdrop-blur">
        <CardHeader className="text-center space-y-6">
          {}
          <div className="flex justify-center">
            <LogoSpinner />
          </div>
          
          {}
          <CardTitle className="text-3xl font-bold tracking-tight">
            Welcome to <span className="text-primary">gRust Panel</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {}
          <Button
            className="w-full h-12 text-base bg-[#1b2838] hover:bg-[#2a475e] text-white border-0"
            onClick={handleSteamLogin}
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <Icons.steam className="mr-2 h-5 w-5" />
                Login with Steam
              </>
            )}
          </Button>

          {}
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              We use Steam OpenID for secure authentication.<br />
              So your Steam credentials are not stored anywhere.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
