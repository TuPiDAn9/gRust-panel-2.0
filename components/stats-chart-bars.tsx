'use client';
import { useEffect, useState } from 'react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useChart } from './chart-provider';
import { ChartAreaInteractive } from './stats-chart-area-interactive';
import { ChartLineMultiple } from './stats-chart-line-multiple';

const chartConfig = {
  new_players: {
    label: 'New Players',
    color: 'var(--chart-1)',
  },
  bans: {
    label: 'Bans',
    color: 'var(--chart-2)',
  },
  unbans: {
    label: 'Unbans',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig;

export function StatsChart() {
  const { chartType } = useChart();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/stats');
      const result = await response.json();
      
      if (result.success) {
        const weekData = result.data.week_data;
        const today = new Date();
        const dates = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() - 6 + i);
          return date;
        });

        const chartData = weekData.map((d: any, i: number) => ({
          ...d,
          name: `${dates[i].toLocaleDateString('en-US', { weekday: 'short' })} (${dates[i].getDate()})`,
          date: dates[i].toISOString().split('T')[0],
        }));
        
        setData(chartData);
      } else {
        setError(result.message || 'Failed to fetch data');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Week Stats</CardTitle>
          <CardDescription>Loading statistics...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Week Stats</CardTitle>
          <CardDescription>Error loading statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
            <p className="text-red-500 text-center">{error}</p>
            {error.includes('JWT not found') && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  You need to configure your JWT token first
                </p>
                <Button asChild>
                  <Link href="/settings">Go to Settings</Link>
                </Button>
              </div>
            )}
            <Button onClick={fetchStats} variant="outline">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderChart = () => {
    if (!data) return null;
    
    switch (chartType) {
      case 'area':
        return <ChartAreaInteractive />;
      case 'line':
        return <ChartLineMultiple />;
      case 'bar':
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Week Stats</CardTitle>
              <CardDescription>New players, bans and unbans in the last 7 days</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <BarChart data={data} margin={{ top: 0, right: 50, bottom: 0, left: 0 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => `Day: ${value}`}
                        formatter={(value, name) => (
                          <div className="flex items-center justify-between w-full min-w-[120px]">
                            <div className="flex items-center gap-2">
                              <div
                                className="h-3 w-3 rounded-full"
                                style={{
                                  backgroundColor: chartConfig[name as keyof typeof chartConfig]?.color,
                                }}
                              />
                              <span className="text-muted-foreground">
                                {chartConfig[name as keyof typeof chartConfig]?.label}:
                              </span>
                            </div>
                            <span className="font-medium">{value}</span>
                          </div>
                        )}
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="new_players" fill="var(--chart-1)" radius={4} />
                  <Bar dataKey="bans" fill="var(--chart-2)" radius={4} />
                  <Bar dataKey="unbans" fill="var(--chart-3)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        );
    }
  };

  return renderChart();
}
