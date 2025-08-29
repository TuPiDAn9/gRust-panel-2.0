"use client"
import { createContext, useContext, useEffect, useState, useCallback } from 'react'

export type ChartType = 'bar' | 'area' | 'line'

export type BestDay = {
  data: {
    bans: number
    new_players: number
    unbans: number
  }
  date: string
}

export type Stats = {
  today: {
    bans: number
    new_players: number
    unbans: number
  }
  yesterday: {
    bans: number
    new_players: number
    unbans: number
  }
  week_data: {
    name: string
    bans: number
    new_players: number
    unbans: number
    date?: string | null
  }[]
  best_days: BestDay[]
  total_players: number
  total_bans: number
  new_players: number
}

interface ChartContextType {
  chartType: ChartType
  setChartType: (type: ChartType) => void
  stats: Stats | null
  data: Stats['week_data']
  loading: boolean
  error: string | null
  fetchStats: (days?: number) => Promise<void>
  days: number
  setDays: (days: number) => void
}

const ChartContext = createContext<ChartContextType | undefined>(undefined)
export const ChartProvider = ({ children }: { children: React.ReactNode }) => {
  const [chartType, setChartTypeState] = useState<ChartType>('bar');
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(7);

  useEffect(() => {
    const savedChartType = localStorage.getItem('chartType') as ChartType;
    if (savedChartType) {
      setChartTypeState(savedChartType);
    }
  }, []);

  const setChartType = (type: ChartType) => {
    setChartTypeState(type);
    localStorage.setItem('chartType', type);
  };

  const fetchStats = useCallback(async (selectedDays?: number) => {
    try {
      setLoading(true);
      setError(null);
      const daysParam = selectedDays || days;
      const response = await fetch(`/api/stats?days=${daysParam}`);
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('JWT not found. Please configure your JWT token in settings.');
        }
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch stats');
      console.error('Chart Provider Error:', err);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchStats(days);
  }, [fetchStats, days]);

  const contextValue: ChartContextType = {
    chartType,
    setChartType,
    stats,
    data: stats?.week_data || [],
    loading,
    error,
    fetchStats,
    days,
    setDays,
  };

  return (
    <ChartContext.Provider value={contextValue}>
      {children}
    </ChartContext.Provider>
  )
}


export const useChart = () => {
  const context = useContext(ChartContext)
  if (context === undefined) {
    throw new Error('useChart must be used within a ChartProvider')
  }
  return context
}
