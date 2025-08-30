"use client"
import { useState, useEffect, useRef, useCallback } from 'react'
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, MoreVertical, Ban, Shield, Eye, AlertTriangle, Settings, Crown, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { UserMenu } from "@/components/user/user-menu"
import { WarnsDialog } from "@/components/user/warns-dialog"
import { UserProfileDialog } from "@/components/user/user-profile-dialog"
import { useUser } from '@/contexts/user-context'

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
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      let newScreenSize = 'lg'
      if (width < 640) newScreenSize = 'mobile'
      else if (width < 768) newScreenSize = 'sm'
      else if (width < 1024) newScreenSize = 'md'
      else if (width < 1280) newScreenSize = 'lg'
      else if (width < 1536) newScreenSize = 'xl'
      else if (width < 1792) newScreenSize = '2xl'
      else if (width < 2048) newScreenSize = '3xl'
      else if (width < 2304) newScreenSize = '4xl'
      else if (width < 2560) newScreenSize = '5xl'
      else newScreenSize = '6xl'

      setScreenSize(newScreenSize)
      if (!isInitialized) {
        setIsInitialized(true)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isInitialized])

  return { screenSize, isInitialized }
}

function getLimit(screenSize: string): number {
  const limits = {
    'mobile': 6,
    'sm': 14,
    'md': 15,
    'lg': 20,
    'xl': 15,
    '2xl': 24,
    '3xl': 36,
    '4xl': 36,
    '5xl': 36,
    '6xl': 48,
  }
  return limits[screenSize as keyof typeof limits] || 40
}

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const { screenSize, isInitialized } = useScreenSize()
  const limit = getLimit(screenSize)
  const [profileUser, setProfileUser] = useState<User | null>(null)
  const [warnsUser, setWarnsUser] = useState<User | null>(null)
  const [advancedInfoUser, setAdvancedInfoUser] = useState<User | null>(null)
  const { userInfo: currentUser } = useUser()

  const canSetRank = currentUser?.rank === 'Staff Manager' || currentUser?.rank === 'Owner'

  const handleSteamProfile = (uid: string) => {
    window.open(`https://steamcommunity.com/profiles/${uid}`, '_blank')
  }

  const handleGrustProfile = (uid: string) => {
    window.open(`https://grust.co/profile/${uid}`, '_blank')
  }

  const debouncedSearch = useDebounce(searchInput, 1000)

  const prevParams = useRef<{
    search: string
    page: number
    limit: number
    isInitialized: boolean
  }>({
    search: '',
    page: 1,
    limit: 40,
    isInitialized: false
  })

  const fetchUsers = useCallback(async (searchQuery: string, page: number, currentLimit: number) => {
    try {
      setLoading(true)
      setError(null)
      const offset = (page - 1) * currentLimit
      const response = await fetch(`/api/users?search=${searchQuery}&limit=${currentLimit}&offset=${offset}`)
      
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
  }, [])

  useEffect(() => {
    if (!isInitialized) return
    
    const currentParams = {
      search: debouncedSearch,
      page: currentPage,
      limit,
      isInitialized
    }

    const paramsChanged = (
      prevParams.current.search !== currentParams.search ||
      prevParams.current.page !== currentParams.page ||
      prevParams.current.limit !== currentParams.limit ||
      !prevParams.current.isInitialized
    )

    if (paramsChanged) {
      if (prevParams.current.search !== currentParams.search && prevParams.current.isInitialized) {
        setCurrentPage(1)
        fetchUsers(debouncedSearch, 1, limit)
      } else if (prevParams.current.limit !== currentParams.limit && prevParams.current.isInitialized) {
        setCurrentPage(1)
        fetchUsers(debouncedSearch, 1, limit)
      } else {
        fetchUsers(debouncedSearch, currentPage, limit)
      }
      
      prevParams.current = currentParams
    }
  }, [debouncedSearch, currentPage, limit, isInitialized, fetchUsers])

  const handleSearch = (value: string) => {
    setSearchInput(value)
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
      <Card key={index}>
        <CardContent className="px-2 py-1 relative">
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              <Skeleton className="w-12 h-12 rounded-full" />
              <Skeleton className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 flex-wrap mb-2">
                <Skeleton className="h-5 w-3/5" />
                <Skeleton className="h-4 w-1/5" />
              </div>
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/5" />
            </div>
            <div className="flex flex-col gap-1 items-center absolute right-2 top-1/2 transform -translate-y-1/2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-7 w-7" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="py-4 max-w-full mx-auto overflow-x-hidden">
        <div className="space-y-6 px-4">
          <div className="flex justify-center w-full">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
              {searchInput !== debouncedSearch && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                </div>
              )}
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
              <Button onClick={() => fetchUsers(debouncedSearch, currentPage, limit)} variant="outline">
                Retry
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 4xl:grid-cols-8 5xl:grid-cols-9 6xl:grid-cols-10 gap-4">
              {users.map((user) => (
                <UserMenu key={user.uid} user={user}>
                  <Card className="hover:shadow-md transition-shadow cursor-context-menu">
                    <CardContent className="px-2 py-1 relative">
                      <div className="flex items-start gap-4">
                        <div className="relative flex-shrink-0">
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            width={48}
                            height={48}
                            className="rounded-full"
                            unoptimized
                          />
                          {isOnline(user.lastseen) ? (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                          ) : (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-background" />
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
                        <div className="flex flex-col gap-1 items-center absolute right-2 top-1/2 transform -translate-y-1/2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-5 w-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Player Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setProfileUser(user); }}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setWarnsUser(user); }}>
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                View Warns
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setAdvancedInfoUser(user); }}>
                                <Settings className="mr-2 h-4 w-4" />
                                Advanced Info
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem disabled>
                                <Ban className="mr-2 h-4 w-4" />
                                Ban
                              </DropdownMenuItem>
                              <DropdownMenuItem disabled>
                                <Shield className="mr-2 h-4 w-4" />
                                Warn
                              </DropdownMenuItem>
                              {canSetRank && (
                                <DropdownMenuItem disabled>
                                  <Crown className="mr-2 h-4 w-4" />
                                  Set Rank
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                          {user.banned ? (
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-7 w-7"
                              disabled
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Shield className="h-4 w-4 text-green-600" />
                            </Button>
                          ) : (
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-7 w-7"
                              disabled
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Ban className="h-4 w-4 text-red-600" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </UserMenu>
              ))}
            </div>
          )}

          {!loading && !error && totalPages > 1 && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  Total: {total.toLocaleString()} users
                </p>
                <div className="text-xs text-muted-foreground">
                  {screenSize} | Showing: {limit}
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

      <Dialog open={!!profileUser} onOpenChange={(isOpen) => !isOpen && setProfileUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-left">
            <DialogTitle>View Profile</DialogTitle>
            <DialogDescription>
              Choose where to view {profileUser?.name}'s profile:
            </DialogDescription>
          </DialogHeader>
          {profileUser && (
            <div className="flex items-center gap-3 py-4">
              <Image
                src={profileUser.avatar}
                alt={profileUser.name}
                width={48}
                height={48}
                className="rounded-full"
                unoptimized
              />
              <div>
                <p className="font-medium">{profileUser.name}</p>
                <p className="text-sm text-muted-foreground font-mono">{profileUser.uid}</p>
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => profileUser && handleSteamProfile(profileUser.uid)}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in Steam
              </Button>
              <Button
                onClick={() => profileUser && handleGrustProfile(profileUser.uid)}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in gRust
              </Button>
            </div>
            <DialogClose asChild>
              <Button type="button" variant="secondary" className="hidden sm:flex">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <WarnsDialog
        user={warnsUser}
        isOpen={!!warnsUser}
        onOpenChange={(isOpen) => !isOpen && setWarnsUser(null)}
      />
      <UserProfileDialog
        uid={advancedInfoUser?.uid || null}
        isOpen={!!advancedInfoUser}
        onOpenChange={(isOpen) => !isOpen && setAdvancedInfoUser(null)}
      />
    </div>
  )
}
