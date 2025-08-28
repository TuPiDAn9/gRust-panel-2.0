'use client'
import { useEffect, useState, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Users, Shield, UsersRound } from 'lucide-react'
import { useChart } from './chart-provider'

export function Summary() {
  const { stats, loading, error, fetchStats, days } = useChart()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  const summaryItems = [
    {
      icon: Users,
      label: 'NEW PLAYERS (LAST 7 DAYS)',
      value: stats?.new_players || 0,
    },
    {
      icon: UsersRound,
      label: 'TOTAL PLAYERS',
      value: stats?.total_players || 0,
    },
    {
      icon: Shield,
      label: 'TOTAL BANS',
      value: stats?.total_bans || 0,
    }
  ]

  useEffect(() => {
    if (!scrollRef.current || loading || error || !stats) return
    
    const container = scrollRef.current
    container.style.animation = 'none'
    container.offsetHeight // trigger reflow
    container.style.animation = isPaused ? 'none' : 'infinite-scroll 20s linear infinite'
  }, [loading, error, stats, isPaused])

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Summary</h3>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="min-w-[320px] h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </Card>
    )
  }

  if (error || !stats) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          {error || 'No data available'}
        </div>
      </Card>
    )
  }

  const infiniteItems = Array(8).fill(summaryItems).flat()

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Summary</h3>
      </div>
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Градиенты */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-card via-card/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-card via-card/80 to-transparent z-10 pointer-events-none" />
        
        <div
          ref={scrollRef}
          className="flex gap-4"
          style={{
            width: 'fit-content',
          }}
        >
          {infiniteItems.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className="min-w-[320px] flex-shrink-0 p-4 rounded-lg border bg-muted/20 border-muted-foreground/20 transition-all duration-200 hover:shadow-md hover:bg-muted/30 hover:border-muted-foreground/40"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-muted-foreground/10 transition-colors duration-200">
                    <Icon className="h-5 w-5 text-muted-foreground transition-transform duration-200 hover:scale-110" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 transition-colors duration-200">
                      {item.label}
                    </p>
                    <p className="text-2xl font-bold text-foreground transition-colors duration-200">
                      {item.value.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
