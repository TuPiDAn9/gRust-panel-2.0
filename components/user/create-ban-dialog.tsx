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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { AlertTriangle, Ban, Shield } from "lucide-react"
import { toast } from "sonner"
import { Icons } from "@/components/icons"

interface User {
  avatar: string
  name: string
  uid: string
  banned: boolean
}

interface CreateBanDialogProps {
  user: User | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onBanCreated?: () => void
}

const presetReasons = [
  'Cheating',
  'Exploiting', 
  'Toxicity',
  'Griefing',
  'Alting',
  'Custom'
] as const

const timeUnits = [
  { value: 'seconds', label: 'Seconds', multiplier: 1 },
  { value: 'minutes', label: 'Minutes', multiplier: 60 },
  { value: 'days', label: 'Days', multiplier: 86400 },
  { value: 'weeks', label: 'Weeks', multiplier: 604800 },
  { value: 'months', label: 'Months', multiplier: 2592000 },
  { value: 'years', label: 'Years', multiplier: 31536000 },
] as const

export function CreateBanDialog({ user, isOpen, onOpenChange, onBanCreated }: CreateBanDialogProps) {
  const [banType, setBanType] = useState<'permanent' | 'temporary'>('permanent')
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [hours, setHours] = useState('0')
  const [minutes, setMinutes] = useState('0') 
  const [seconds, setSeconds] = useState('0')
  const [calculatorValue, setCalculatorValue] = useState('')
  const [calculatorUnit, setCalculatorUnit] = useState('days')
  const [reason, setReason] = useState('')
  const [customReason, setCustomReason] = useState('')
  const [unbanReason, setUnbanReason] = useState('')
  const [proof, setProof] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isUnbanning, setIsUnbanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showUnbanConfirm, setShowUnbanConfirm] = useState(false)

  const handleClose = () => {
    setBanType('permanent')
    setSelectedDate(undefined)
    setHours('0')
    setMinutes('0') 
    setSeconds('0')
    setCalculatorValue('')
    setCalculatorUnit('days')
    setReason('')
    setCustomReason('')
    setUnbanReason('')
    setProof('')
    setError(null)
    setIsLoading(false)
    setShowConfirm(false)
    setShowUnbanConfirm(false)
    onOpenChange(false)
  }

  const calculateDuration = (): number => {
    if (banType === 'permanent') {
      return 0
    }

    let duration = 0

    if (selectedDate) {
      const now = new Date()
      const targetDate = new Date(selectedDate)
      targetDate.setHours(parseInt(hours) || 0)
      targetDate.setMinutes(parseInt(minutes) || 0)
      targetDate.setSeconds(parseInt(seconds) || 0)
      
      duration = Math.floor((targetDate.getTime() - now.getTime()) / 1000)
    }

    if (calculatorValue) {
      const value = parseInt(calculatorValue) || 0
      const unit = timeUnits.find(u => u.value === calculatorUnit)
      if (unit) {
        duration += value * unit.multiplier
      }
    }

    return Math.max(0, duration)
  }

  const formatDuration = (durationInSeconds: number): string => {
    if (durationInSeconds === 0) {
      return 'Permanently'
    }

    const parts = []
    const intervals = [
      { name: 'year', seconds: 31536000 },
      { name: 'month', seconds: 2592000 },
      { name: 'week', seconds: 604800 },
      { name: 'day', seconds: 86400 },
      { name: 'hour', seconds: 3600 },
      { name: 'minute', seconds: 60 },
      { name: 'second', seconds: 1 },
    ]

    let remaining = durationInSeconds
    for (const interval of intervals) {
      const count = Math.floor(remaining / interval.seconds)
      if (count > 0) {
        remaining -= count * interval.seconds
        parts.push(`${count} ${interval.name}${count > 1 ? 's' : ''}`)
      }
    }

    return parts.join(' ')
  }

  const isFormValid = (): boolean => {
    const reasonValid = reason.length > 0 && (reason !== 'Custom' || customReason.trim().length > 0)
    const proofValid = proof.trim().length > 0
    const durationValid = banType === 'permanent' || calculateDuration() > 0
    return reasonValid && proofValid && durationValid
  }

  const handleBan = () => {
    if (!isFormValid()) {
      setError('Please fill in all required fields')
      return
    }
    setShowConfirm(true)
  }

  const handleUnban = () => {
    if (unbanReason.trim().length === 0) {
      setError('Please provide a reason for the unban.')
      return
    }
    setShowUnbanConfirm(true)
  }

  const confirmBan = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      setError(null)

      const duration = calculateDuration()
      const finalReason = reason === 'Custom' ? customReason.trim() : reason

      const response = await fetch('/api/bans/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.uid,
          duration,
          reason: finalReason,
          proof: proof.trim(),
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success(`User ${user.name} has been banned successfully`)
        onBanCreated?.()
        handleClose()
      } else {
        setError(data.error || 'Failed to ban user')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to ban user')
      console.error('Create ban error:', err)
    } finally {
      setIsLoading(false)
      setShowConfirm(false)
    }
  }

  const confirmUnban = async () => {
    if (!user) return

    try {
      setIsUnbanning(true)
      setError(null)

      const response = await fetch('/api/bans/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          uid: user.uid,
          reason: unbanReason.trim()
         }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success(`User ${user.name} has been unbanned successfully`)
        onBanCreated?.()
        handleClose()
      } else {
        setError(data.error || 'Failed to unban user')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to unban user')
      console.error('Unban error:', err)
    } finally {
      setIsUnbanning(false)
      setShowUnbanConfirm(false)
    }
  }

  if (!user) return null

  const duration = calculateDuration()
  const formattedDuration = formatDuration(duration)

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              {user.banned ? (
                <Shield className="h-5 w-5 text-green-500" />
              ) : (
                <Ban className="h-5 w-5 text-red-500" />
              )}
              <DialogTitle>{user.banned ? 'Unban Player' : 'Ban Player'}</DialogTitle>
            </div>
            <DialogDescription>
              {user.banned
                ? `This player is currently banned. Unbanning will allow them to reconnect to the server.`
                : `Ban this player from the server. Please provide all required information.`}
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

          {user.banned ? (
            <div className="space-y-4">
               {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label>Reason for Unban *</Label>
                <Textarea
                  placeholder="Provide a reason for unbanning the player..."
                  value={unbanReason}
                  onChange={(e) => setUnbanReason(e.target.value)}
                  className="min-h-20"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label>Ban Type *</Label>
                <Select value={banType} onValueChange={(value: 'permanent' | 'temporary') => setBanType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ban type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="permanent">Permanent</SelectItem>
                    <SelectItem value="temporary">Temporary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {banType === 'temporary' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select End Date & Time</Label>
                    <div className="space-y-3">
                    <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => {
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        return date < today
                    }}
                    className="rounded-md border w-fit"
                    />
                      <div className="flex items-center gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Hours</Label>
                          <Input
                            type="number"
                            min="0"
                            max="23"
                            value={hours}
                            onChange={(e) => setHours(e.target.value)}
                            className="w-16 text-center"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Minutes</Label>
                          <Input
                            type="number"
                            min="0"
                            max="59"
                            value={minutes}
                            onChange={(e) => setMinutes(e.target.value)}
                            className="w-16 text-center"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Seconds</Label>
                          <Input
                            type="number"
                            min="0"
                            max="59"
                            value={seconds}
                            onChange={(e) => setSeconds(e.target.value)}
                            className="w-16 text-center"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">or</span>
                  </div>

                  <div className="space-y-2">
                    <Label>Duration Calculator</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="0"
                        placeholder="Enter amount"
                        value={calculatorValue}
                        onChange={(e) => setCalculatorValue(e.target.value)}
                        className="flex-1"
                        showClearButton
                      />
                      <Select value={calculatorUnit} onValueChange={setCalculatorUnit}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeUnits.map((unit) => (
                            <SelectItem key={unit.value} value={unit.value}>
                              {unit.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {duration > 0 && (
                    <div className="p-3 bg-muted/30 rounded-md">
                      <p className="text-sm font-medium">Total Duration: {formattedDuration}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label>Reason *</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {presetReasons.map((presetReason) => (
                      <SelectItem key={presetReason} value={presetReason}>
                        {presetReason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {reason === 'Custom' && (
                <div className="space-y-2">
                  <Label>Custom Reason *</Label>
                  <Input
                    placeholder="Enter custom reason..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    showClearButton
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Proof *</Label>
                <Textarea
                  placeholder="Provide proof of the violation (links, descriptions, etc.)..."
                  value={proof}
                  onChange={(e) => setProof(e.target.value)}
                  className="min-h-20"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading || isUnbanning}
            >
              Cancel
            </Button>
            {user.banned ? (
              <Button
                onClick={handleUnban}
                disabled={isUnbanning || unbanReason.trim().length === 0}
                className="bg-green-500 hover:bg-green-600"
              >
                {isUnbanning ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Unbanning...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Unban Player
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleBan}
                disabled={!isFormValid() || isLoading}
                className="bg-red-500 hover:bg-red-600"
              >
                {isLoading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Banning...
                  </>
                ) : (
                  <>
                    <Ban className="mr-2 h-4 w-4" />
                    Ban Player
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Ban</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to ban <strong>{user.name}</strong>?
              <br />
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBan}
              className="bg-red-500 hover:bg-red-600"
            >
              Ban {formattedDuration === 'Permanently' ? 'Permanently' : `for ${formattedDuration}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showUnbanConfirm} onOpenChange={setShowUnbanConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Unban</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unban <strong>{user.name}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmUnban}
              className="bg-green-500 hover:bg-green-600"
            >
              Unban
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
