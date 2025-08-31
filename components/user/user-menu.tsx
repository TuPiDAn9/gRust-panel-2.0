"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ExternalLink, Eye, AlertTriangle, Settings, Ban, Shield, Crown, OctagonAlert } from 'lucide-react'
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
import { WarnsDialog } from "@/components/user/warns-dialog"
import { UserProfileDialog } from "@/components/user/user-profile-dialog"
import { CreateWarnDialog } from "@/components/user/create-warn-dialog"
import { CreateBanDialog } from "@/components/user/create-ban-dialog"

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

export function UserMenu({ user, children }: UserMenuProps) {
  const router = useRouter()
  const { userInfo: currentUser } = useUser()
  const [viewProfileOpen, setViewProfileOpen] = useState(false)
  const [viewWarnsOpen, setViewWarnsOpen] = useState(false)
  const [advancedInfoOpen, setAdvancedInfoOpen] = useState(false)
  const [createWarnOpen, setCreateWarnOpen] = useState(false)
  const [createBanOpen, setCreateBanOpen] = useState(false)

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
      <ContextMenuItem onClick={() => setViewWarnsOpen(true)}>
        <AlertTriangle className="mr-2 h-4 w-4" />
        View Warns
      </ContextMenuItem>
      <ContextMenuItem onClick={() => setAdvancedInfoOpen(true)}>
        <Settings className="mr-2 h-4 w-4" />
        Advanced Info
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem 
        onClick={() => setCreateBanOpen(true)}
        className={user.banned ? "text-green-500 focus:text-green-500" : "text-destructive focus:text-destructive"}
      >
        {user.banned ? (
          <Shield className="mr-2 h-4 w-4 text-green-500" />
        ) : (
          <Ban className="mr-2 h-4 w-4 text-destructive" />
        )}
        {user.banned ? 'Unban' : 'Ban'}
      </ContextMenuItem>
      <ContextMenuItem 
        onClick={() => setCreateWarnOpen(true)}
        className="text-orange-500 focus:text-orange-500"
      >
        <OctagonAlert className="mr-2 h-4 w-4 text-orange-500" />
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

      <WarnsDialog
        user={user}
        isOpen={viewWarnsOpen}
        onOpenChange={setViewWarnsOpen}
      />

      <UserProfileDialog
        uid={user.uid}
        isOpen={advancedInfoOpen}
        onOpenChange={setAdvancedInfoOpen}
      />

      <CreateWarnDialog
        user={user}
        isOpen={createWarnOpen}
        onOpenChange={setCreateWarnOpen}
        onWarnCreated={() => {
          setViewWarnsOpen(true)
        }}
      />

      <CreateBanDialog
        user={user}
        isOpen={createBanOpen}
        onOpenChange={setCreateBanOpen}
        onBanCreated={() => {
          router.refresh()
        }}
      />
    </>
  )
}
