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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle } from "lucide-react"
import { DataTable } from '../ui/data-table'
import { columns } from './warns-columns'

interface User {
  avatar: string
  name: string
  uid: string
}

interface Warn {
  admin: string
  adminavatar: string
  admindiscordid: string
  adminname: string
  id: string
  reason: string
  time: number
  uid: string
}

interface WarnsDialogProps {
  user: User | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function WarnsDialog({ user, isOpen, onOpenChange }: WarnsDialogProps) {
  const [warns, setWarns] = useState<Warn[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWarns = async (uid: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/warns/${uid}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }
      
      const data = await response.json()
      setWarns(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch warns')
      console.error('Warns Error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && user?.uid) {
      fetchWarns(user.uid)
    }
  }, [isOpen, user?.uid])

  const LoadingSkeleton = () => (
    <div className="space-y-2">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="flex items-center space-x-4">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-32" />
        </div>
      ))}
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex gap-3 mb-2">
            {user && (
              <>
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={45}
                  height={45}
                  className="rounded-full"
                  unoptimized
                />
                <div>
                  <DialogTitle className="text-xl text-left">Warnings for {user.name}</DialogTitle>
                  <DialogDescription className="font-mono text-sm text-left">
                    {user.uid}
                  </DialogDescription>
                </div>
              </>
            )}
          </div>
        </DialogHeader>

        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <DataTable columns={columns} data={warns} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
