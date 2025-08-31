"use client"
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Icons } from '@/components/icons'
import { AlertTriangle, CheckCircle, Info, ExternalLink } from 'lucide-react'

interface JwtSetupModalProps {
  isOpen: boolean
  onValidToken: () => void
}

export function JwtSetupModal({ isOpen, onValidToken }: JwtSetupModalProps) {
  const { data: session } = useSession()
  const [jwt, setJwt] = useState('')
  const [isJwtVisible, setIsJwtVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isValidating, setIsValidating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleSaveAndValidate = async () => {
    if (!jwt.trim()) {
      setError('Please enter a JWT token')
      return
    }

    if (!session?.user?.steam) {
      setError('Failed to get Steam data. Please try logging in again.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const saveResponse = await fetch('/api/set-jwt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jwt: jwt.trim() }),
      })

      if (!saveResponse.ok) {
        throw new Error('Failed to save JWT token')
      }

      setIsValidating(true)
      const validateResponse = await fetch('/api/validate-jwt-steam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const validateData = await validateResponse.json()

      if (validateResponse.ok && validateData.success) {
        toast.success('JWT token successfully installed and verified!')
        onValidToken()
      } else {
        let errorMessage = validateData.message || 'JWT token is invalid or does not match your Steam account'
        
        if (validateData.message?.includes('Staff privileges required')) {
          errorMessage = 'Access denied: You need staff privileges to use this panel.'
        }
        
        setError(errorMessage)
        await fetch('/api/clear-jwt', { method: 'POST' })
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred while saving the token')
      await fetch('/api/clear-jwt', { method: 'POST' })
    } finally {
      setIsLoading(false)
      setIsValidating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm">
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* JWT Setup Card */}
            <Card className="border-2 border-destructive/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                  <CardTitle className="text-xl text-destructive">
                    JWT Setup Required
                  </CardTitle>
                </div>
                <CardDescription>
                  To access the panel, you need to configure the JWT token from gRust
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="jwt">JWT Token</Label>
                  <div className="relative">
                    <Input
                      id="jwt"
                      placeholder="Paste your JWT token here..."
                      value={jwt}
                      onChange={(e) => setJwt(e.target.value)}
                      type={isJwtVisible ? 'text' : 'password'}
                      className="pr-10"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => setIsJwtVisible(!isJwtVisible)}
                      disabled={isLoading}
                      data-umami-event="Setup JWT"
                    >
                      {isJwtVisible ? (
                        <Icons.eyeOff className="h-4 w-4" />
                      ) : (
                        <Icons.eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handleSaveAndValidate}
                  disabled={isLoading || !jwt.trim()}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      {isValidating ? 'Validating token...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Save and validate
                    </>
                  )}
                </Button>
                {session?.user && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <p className="text-sm text-muted-foreground">
                      Steam account: <span className="font-medium">{session.user.name}</span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Instructions Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  <CardTitle>How to get a JWT token</CardTitle>
                </div>
                <CardDescription>
                  Follow these steps to get your JWT token
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Login to the gRust website</p>
                      <p className="text-sm text-muted-foreground">
                        Go to grust.co and login via Steam
                      </p>
                      <Button variant="outline" size="sm" className="mt-2" asChild>
                        <a href="https://grust.co" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Open gRust
                        </a>
                      </Button>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Open developer tools</p>
                      <p className="text-sm text-muted-foreground">
                        Press F12 or Ctrl+Shift+I (Cmd+Option+I on Mac)
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Go to the Storage tab</p>
                      <p className="text-sm text-muted-foreground">
                        In the developer tools, find the "Storage" tab or "Application" for chromium users
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      4
                    </div>
                    <div>
                      <p className="font-medium">Find the Cookies section</p>
                      <p className="text-sm text-muted-foreground">
                        Open it and find <code className="bg-muted px-1 rounded">https://grust.co</code>
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      5
                    </div>
                    <div>
                      <p className="font-medium">Copy the JWT from the Cookie</p>
                      <p className="text-sm text-muted-foreground">
                        Find a cookie with the <code className="bg-muted px-1 rounded">jwt</code> name and copy its value
                      </p>
                    </div>
                  </div>
                </div>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Important:</strong> The JWT token must belong to the same Steam account
                    you used to log in to this panel. You also need to be staff on gRust (obviously).
                  </AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Security:</strong> Do not share your JWT token with anyone.
                    It provides full access to your gRust account.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
