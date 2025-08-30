"use client"
import { useState } from 'react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Shield } from "lucide-react"
import { toast } from "sonner"
import { Icons } from "@/components/icons"

interface User {
  avatar: string
  name: string
  uid: string
}

interface CreateWarnDialogProps {
  user: User | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onWarnCreated?: () => void
}

export function CreateWarnDialog({ user, isOpen, onOpenChange, onWarnCreated }: CreateWarnDialogProps) {
  const [reason, setReason] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    setReason('')
    setError(null)
    setIsLoading(false)
    onOpenChange(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!reason.trim()) {
      setError('Reason is required')
      return
    }

    if (!user) return

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/warns/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.uid,
          reason: reason.trim(),
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success(`Warn created successfully for ${user.name}`)
        onWarnCreated?.()
        handleClose()
      } else {
        setError(data.error || 'Failed to create warn')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create warn')
      console.error('Create warn error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-orange-500" />
            <DialogTitle>Warn Player</DialogTitle>
          </div>
          <DialogDescription>
            Issue a warning to this player. Please provide a clear reason.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border">
          <Image
            src={user.avatar}
            alt={user.name}
            width={40}
            height={40}
            className="rounded-full"
            unoptimized
          />
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground font-mono">{user.uid}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="reason">Reason *</Label>
            <Input
              id="reason"
              placeholder="Enter the reason for this warning..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isLoading}
              className="w-full"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !reason.trim()}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isLoading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Warn
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
