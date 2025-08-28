'use client'
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useChart } from './chart-provider'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function BestDaysCard() {
  const { stats, loading, error, fetchStats, days } = useChart()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getBestDaysToShow = () => {
    if (!stats?.best_days) return []
    return stats.best_days.slice(0, 6)
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Best Days</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="p-3 md:p-4 bg-muted/30 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 md:h-5 bg-muted animate-pulse rounded w-32 md:w-40" />
                <div className="h-4 md:h-5 bg-muted animate-pulse rounded w-24 md:w-32" />
              </div>
              <div className="h-3 md:h-4 bg-muted animate-pulse rounded w-20 md:w-24" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Best Days</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[200px] gap-4">
          <p className="text-red-500 text-center text-sm">{error}</p>
          {error.includes('JWT not found') && (
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">
                You need to configure your JWT token
              </p>
              <Button asChild size="sm">
                <Link href="/settings">Go to Settings</Link>
              </Button>
            </div>
          )}
          <Button onClick={() => fetchStats(days)} variant="outline" size="sm">
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  const bestDaysToShow = getBestDaysToShow()

  if (!bestDaysToShow.length) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Best Days</CardTitle>
        </CardHeader>
        <CardContent className="py-8">
          <p className="text-muted-foreground text-center text-sm">
            No best days data available
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Best Days</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 md:space-y-3">
        {bestDaysToShow.map((bestDay) => (
          <Tooltip key={bestDay.date}>
            <TooltipTrigger asChild>
              <div className="p-3 md:p-4 bg-card border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs md:text-sm font-medium">
                    {formatDate(bestDay.date)}
                  </div>
                  <div className="text-xs md:text-sm font-bold text-green-500">
                    +{bestDay.data.new_players.toLocaleString()} players
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Bans: {bestDay.data.bans}, Unbans: {bestDay.data.unbans}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs bg-muted text-muted-foreground border-border drop-shadow-xl">
              <div className="space-y-2">
                <div className="font-medium text-center text-foreground">
                  Extended Data
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>date:</span>
                    <span className="font-mono">"{bestDay.date}"</span>
                  </div>
                  <div className="flex justify-between">
                    <span>new_players:</span>
                    <span className="font-mono">{bestDay.data.new_players}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>bans:</span>
                    <span className="font-mono">{bestDay.data.bans}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>unbans:</span>
                    <span className="font-mono">{bestDay.data.unbans}</span>
                  </div>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </CardContent>
    </Card>
  )
}
