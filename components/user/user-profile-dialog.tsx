"use client"
import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { 
  AlertTriangle, 
  Copy, 
  Check, 
  Clock, 
  Calendar, 
  Coins, 
  Shield,
  Zap,
  User
} from "lucide-react"
import { toast } from "sonner"

interface UserProfileData {
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

interface UserProfileDialogProps {
  uid: string | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function UserProfileDialog({ uid, isOpen, onOpenChange }: UserProfileDialogProps) {
  const [profile, setProfile] = useState<UserProfileData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const fetchProfile = async (userId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/users/${userId}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      setProfile(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user profile')
      console.error('Profile Error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && uid) {
      fetchProfile(uid)
    }
  }, [isOpen, uid])

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      toast.success(`${field} copied to clipboard!`)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const decimalToHex = (decimal: number): string => {
    return `#${decimal.toString(16).padStart(6, '0')}`
  }

  const formatDateTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPlaytime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    
    if (days > 0) {
      return `${days}d ${remainingHours}h`
    }
    return `${hours}h`
  }

  const isOnline = (lastseen: number): boolean => {
    const now = Math.floor(Date.now() / 1000)
    return Math.abs(now - lastseen) < 60
  }

  const CopyableField = ({ label, value, field, icon: Icon }: {
    label: string
    value: string
    field: string
    icon: any
  }) => (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="font-mono text-sm truncate">{value}</p>
        </div>
      </div>
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8 flex-shrink-0"
        onClick={() => copyToClipboard(value, field)}
      >
        {copiedField === field ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  )

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="space-y-3">
        {[...Array(6)].map((_, index) => (
          <Skeleton key={index} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">User Profile</DialogTitle>
          <DialogDescription>
            Detailed information about the user
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : profile ? (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-background to-muted/20 border">
              <div className="relative">
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  width={80}
                  height={80}
                  className="rounded-full border-4 border-background shadow-lg"
                  unoptimized
                />
                <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-background shadow-md ${
                  isOnline(profile.lastseen) ? 'bg-green-500' : 'bg-red-500'
                }`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold mb-2">{profile.name}</h2>
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <Badge
                    className="px-3 py-1"
                    style={{
                      backgroundColor: decimalToHex(profile.color) + '20',
                      color: decimalToHex(profile.color),
                      borderColor: decimalToHex(profile.color) + '40'
                    }}
                  >
                    {profile.rank}
                  </Badge>
                  {profile.banned && (
                    <Badge variant="destructive">Banned</Badge>
                  )}
                  <Badge variant="outline" className="gap-1">
                    <Zap className="h-3 w-3" />
                    Power {profile.power}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className={isOnline(profile.lastseen) ? 'text-green-500 font-medium' : ''}>
                    {isOnline(profile.lastseen) ? '🟢 Online' : `⚫ Last seen: ${formatDateTime(profile.lastseen)}`}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-bold">{formatPlaytime(profile.playtime)}</p>
                  <p className="text-sm text-muted-foreground">Playtime</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Coins className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                  <p className="text-2xl font-bold">{profile.scrapcoins.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Scrap Coins</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="text-sm font-medium">{formatDateTime(profile.firstjoin)}</p>
                  <p className="text-sm text-muted-foreground">First Join</p>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Copyable Information */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold mb-3">Account Information</h3>
              
              <CopyableField
                label="Display Name"
                value={profile.name}
                field="name"
                icon={User}
              />

              <CopyableField
                label="Steam ID"
                value={profile.uid}
                field="uid"
                icon={Shield}
              />

              {profile.discordid && (
                <CopyableField
                  label="Discord ID"
                  value={profile.discordid}
                  field="discordid"
                  icon={User}
                />
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
