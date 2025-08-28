'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface UserInfo {
  avatar: string
  banned: boolean
  color: number
  discordid: string
  firstjoin: number
  lastseen: number
  name: string
  playtime: number
  power: number
  rank: string
  scrapcoins: number
  uid: string
}

interface UserContextType {
  userInfo: UserInfo | null
  loading: boolean
  error: string | null
}

const UserContext = createContext<UserContextType>({
  userInfo: null,
  loading: false,
  error: null
})

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'authenticated' && session && !userInfo && !loading) {
      const fetchUserInfo = async () => {
        setLoading(true)
        setError(null)
        try {
          const response = await fetch('/api/me')
          if (response.ok) {
            const data = await response.json()
            if (data.success) {
              setUserInfo(data.data)
            }
          }
        } catch (err) {
          setError('Failed to fetch user info')
          console.error('Failed to fetch user info:', err)
        } finally {
          setLoading(false)
        }
      }
      
      fetchUserInfo()
    }
    
    if (status === 'unauthenticated') {
      setUserInfo(null)
      setError(null)
    }
  }, [status, session, userInfo, loading])

  return (
    <UserContext.Provider value={{ userInfo, loading, error }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  return useContext(UserContext)
}
