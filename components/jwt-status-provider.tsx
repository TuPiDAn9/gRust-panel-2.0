"use client"
import { createContext, useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface JwtStatusContextType {
  isJwtValid: boolean
  isLoading: boolean
  checkJwtStatus: () => Promise<void>
}

const JwtStatusContext = createContext<JwtStatusContextType>({
  isJwtValid: false,
  isLoading: true,
  checkJwtStatus: async () => {}
})

export const JwtStatusProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession()
  const [isJwtValid, setIsJwtValid] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const checkJwtStatus = async () => {
    if (status === 'loading') return
    if (!session) {
      setIsJwtValid(false)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      
      const testResponse = await fetch('/api/test-jwt')
      if (!testResponse.ok) {
        setIsJwtValid(false)
        return
      }

      const validateResponse = await fetch('/api/validate-jwt-steam', {
        method: 'POST'
      })
      
      const validateData = await validateResponse.json()
      setIsJwtValid(validateResponse.ok && validateData.success)
      
    } catch (error) {
      console.error('JWT check failed:', error)
      setIsJwtValid(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkJwtStatus()
  }, [session, status])

  return (
    <JwtStatusContext.Provider value={{ isJwtValid, isLoading, checkJwtStatus }}>
      {children}
    </JwtStatusContext.Provider>
  )
}

export const useJwtStatus = () => {
  const context = useContext(JwtStatusContext)
  if (!context) {
    throw new Error('useJwtStatus must be used within a JwtStatusProvider')
  }
  return context
}
