'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Icons } from '@/components/icons'

export default function LoginPage() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSteamLogin = async () => {
    setIsLoading(true)
    try {
      // After successful login, redirect to home page
      await signIn('steam', { callbackUrl: '/' })
    } catch (error) {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // If user is authenticated, redirect to home page
    if (status === 'authenticated') {
      router.push('/')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to gRust Panel</CardTitle>
          <CardDescription>
            Sign in with your Steam account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="mb-6 text-sm text-muted-foreground">
              Connect your Steam account to access the gRust Panel
            </p>
            <div className="flex justify-center">
              <Icons.steam className="h-12 w-12 text-blue-500" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700" 
            onClick={handleSteamLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <Icons.steam className="mr-2 h-5 w-5" />
                Sign in with Steam
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}