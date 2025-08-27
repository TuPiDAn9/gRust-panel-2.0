'use client'
import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search } from 'lucide-react'
import Link from 'next/link'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface User {
  avatar: string
  banned: boolean
  color: number
  discordid: string | null
  firstjoin: number
  lastseen: number
  name: string
  playtime: number
  power: number
  rank: string
  scrapcoins: number
  uid: string
}

interface UsersData {
  total: number
  users: User[]
}

function useScreenSize() {
  const [screenSize, setScreenSize] = useState('lg')
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) setScreenSize('mobile')
      else if (width < 768) setScreenSize('sm')
      else if (width < 1024) setScreenSize('md')
      else if (width < 1280) setScreenSize('lg')
      else if (width < 1536) setScreenSize('xl')
      else if (width < 1792) setScreenSize('2xl')
      else if (width < 2048) setScreenSize('3xl')
      else if (width < 2304) setScreenSize('4xl')
      else if (width < 2560) setScreenSize('5xl')
      else setScreenSize('6xl')
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return screenSize
}

// Значительно увеличенные лимиты
function getLimit(screenSize: string): number {
  const limits = {
    'mobile': 10,   // 1 колонка × 10 строк
    'sm': 20,       // 2 колонки × 10 строк  
    'md': 30,       // 3 колонки × 10 строк
    'lg': 40,       // 4 колонки × 10 строк
    'xl': 15,       // 5 колонок × 10 строк
    '2xl': 24,      // 6 колонок × 10 строк
    '3xl': 36,      // 7 колонок × 10 строк
    '4xl': 36,      // 8 колонок × 10 строк
    '5xl': 36,      // 9 колонок × 10 строк
    '6xl': 48,     // 10 колонок × 10 строк
  }
  return limits[screenSize as keyof typeof limits] || 40
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  
  const screenSize = useScreenSize()
  const limit = getLimit(screenSize)

  const fetchUsers = async (searchQuery: string = '', page: number = 1) => {
    try {
      setLoading(true)
      setError(null)
      const offset = (page - 1) * limit
      const response = await fetch(`/api/users?search=${searchQuery}&limit=${limit}&offset=${offset}`)
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('JWT not found. Please configure your JWT token in settings.')
        }
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }
      
      const data: UsersData = await response.json()
      setUsers(data.users)
      setTotal(data.total)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users')
      console.error('Users Error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers(search, currentPage)
  }, [search, currentPage, limit])

  useEffect(() => {
    setCurrentPage(1)
  }, [limit])

  const handleSearch = (value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }

  const decimalToHex = (decimal: number): string => {
    return `#${decimal.toString(16).padStart(6, '0')}`
  }

  const isOnline = (lastseen: number): boolean => {
    const now = Math.floor(Date.now() / 1000)
    return Math.abs(now - lastseen) < 60
  }

  const formatLastSeen = (lastseen: number): string => {
    if (isOnline(lastseen)) {
      return 'Online'
    }
    const date = new Date(lastseen * 1000)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  const totalPages = Math.ceil(total / limit)

  const generatePaginationItems = () => {
    const items = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setCurrentPage(i)
            }}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }
    return items
  }

  const generateLoadingCards = () => {
    return [...Array(limit)].map((_, index) => (
      <Card key={index} className="animate-pulse">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-muted rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2 min-w-0">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
              <div className="h-3 bg-muted rounded w-1/4" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="py-4 max-w-full mx-auto">
        <div className="space-y-6 px-4">
          {/* Search */}
          <div className="flex justify-center w-full">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 4xl:grid-cols-8 5xl:grid-cols-9 6xl:grid-cols-10 gap-4">
              {generateLoadingCards()}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
              <p className="text-red-500 text-center">{error}</p>
              {error.includes('JWT not found') && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    You need to configure your JWT token
                  </p>
                  <Button asChild>
                    <Link href="/settings">Go to Settings</Link>
                  </Button>
                </div>
              )}
              <Button onClick={() => fetchUsers(search, currentPage)} variant="outline">
                Retry
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 4xl:grid-cols-8 5xl:grid-cols-9 6xl:grid-cols-10 gap-4">
              {users.map((user) => (
                <Card key={user.uid} className="hover:shadow-md transition-shadow">
                  <CardContent className="px-2 py-1">
                    <div className="flex items-start gap-4">
                      <div className="relative flex-shrink-0">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-12 h-12 rounded-full"
                        />
                        {isOnline(user.lastseen) && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 flex-wrap mb-2">
                          <h3 className="font-semibold text-sm truncate">{user.name}</h3>
                          <Badge
                            variant="secondary"
                            className="text-xs px-1 py-0"
                            style={{
                              backgroundColor: decimalToHex(user.color) + '20',
                              color: decimalToHex(user.color),
                              borderColor: decimalToHex(user.color) + '40'
                            }}
                          >
                            {user.rank}
                          </Badge>
                          {user.banned && (
                            <Badge variant="destructive" className="text-xs px-1 py-0">
                              Banned
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground font-mono mb-1 break-all">
                          {user.uid}
                        </p>
                        <p className={`text-xs font-medium ${isOnline(user.lastseen) ? 'text-green-500' : 'text-muted-foreground'}`}>
                          {formatLastSeen(user.lastseen)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  Total: {total.toLocaleString()} users
                </p>
                <div className="text-xs text-muted-foreground">
                  Screen: {screenSize} | Limit: {limit}
                </div>
              </div>
              <Pagination className="!mx-0 !w-auto !justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage > 1) {
                          setCurrentPage(currentPage - 1)
                        }
                      }}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  {generatePaginationItems()}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage < totalPages) {
                          setCurrentPage(currentPage + 1)
                        }
                      }}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
