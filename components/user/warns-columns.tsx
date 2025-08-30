'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import Image from 'next/image'

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

const formatDateTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')

  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`
}

export const columns: ColumnDef<Warn>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => <div className="font-mono text-sm">#{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'reason',
    header: 'Reason',
    cell: ({ row }) => (
      <Badge variant="destructive" className="text-sm">
        {row.getValue('reason')}
      </Badge>
    ),
  },
  {
    accessorKey: 'adminname',
    header: 'Admin',
    cell: ({ row }) => {
      const warn = row.original
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 cursor-help">
              <Image
                src={warn.adminavatar}
                alt={warn.adminname}
                width={24}
                height={24}
                className="rounded-full"
                unoptimized
              />
              <span className="text-sm truncate max-w-20">{warn.adminname}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <div className="space-y-1">
              <p className="font-medium">{warn.adminname}</p>
              <p className="text-xs font-mono">{warn.admin}</p>
              {warn.admindiscordid && (
                <p className="text-xs">Discord: {warn.admindiscordid}</p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      )
    },
  },
  {
    accessorKey: 'time',
    header: 'Date & Time',
    cell: ({ row }) => (
      <div className="font-mono text-sm">{formatDateTime(row.getValue('time'))}</div>
    ),
  },
]
