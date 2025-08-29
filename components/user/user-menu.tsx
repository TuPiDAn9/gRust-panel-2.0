"use client"
import { useState } from 'react'
import { ExternalLink, Eye, AlertTriangle, Settings, Ban, Shield, Crown } from 'lucide-react'
import { useUser } from '@/contexts/user-context'
import Image from 'next/image'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

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

interface UserMenuProps {
  user: User
  children: React.ReactNode
}

interface CurrentUser {
  rank: string
}

export function UserMenu({ user, children }: UserMenuProps) {
  const { userInfo: currentUser } = useUser()
  const [viewProfileOpen, setViewProfileOpen] = useState(false)
  
  const canSetRank = currentUser?.rank === 'Staff Manager' || currentUser?.rank === 'Owner'

  const handleSteamProfile = () => {
    window.open(`https://steamcommunity.com/profiles/${user.uid}`, '_blank')
  }

  const handleGrustProfile = () => {
    window.open(`https://grust.co/profile/${user.uid}`, '_blank')
  }

  const contextMenuItems = (
    <>
      <ContextMenuLabel>Player Actions</ContextMenuLabel>
      <ContextMenuItem onClick={() => setViewProfileOpen(true)}>
        <Eye className="mr-2 h-4 w-4" />
        View Profile
      </ContextMenuItem>
      <ContextMenuItem>
        <AlertTriangle className="mr-2 h-4 w-4" />
        View Warn
      </ContextMenuItem>
      <ContextMenuItem disabled>
        <Settings className="mr-2 h-4 w-4" />
        Advanced Info
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem disabled>
        <Ban className="mr-2 h-4 w-4" />
        Ban
      </ContextMenuItem>
      <ContextMenuItem disabled>
        <Shield className="mr-2 h-4 w-4" />
        Warn
      </ContextMenuItem>
      {canSetRank && (
        <ContextMenuItem disabled>
          <Crown className="mr-2 h-4 w-4" />
          Set Rank
        </ContextMenuItem>
      )}
    </>
  )

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          {children}
        </ContextMenuTrigger>
        <ContextMenuContent>
          {contextMenuItems}
        </ContextMenuContent>
      </ContextMenu>

      <Dialog open={viewProfileOpen} onOpenChange={setViewProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>View Profile</DialogTitle>
            <DialogDescription>
              Choose where to view {user.name}'s profile:
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 py-4">
            <Image
              src={user.avatar}
              alt={user.name}
              width={48}
              height={48}
              className="rounded-full"
              unoptimized
            />
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground font-mono">{user.uid}</p>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row sm:justify-between">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={handleSteamProfile}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in Steam
              </Button>
              <Button
                onClick={handleGrustProfile}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in gRust
              </Button>
            </div>
            <DialogClose asChild>
              <Button variant="outline" className="hidden sm:flex">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
