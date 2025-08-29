"use client";
import { useEffect } from 'react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useChart } from './chart-provider';
import { ChartAreaInteractive } from './stats-chart-area-interactive';
import { ChartLineMultiple } from './stats-chart-line-multiple';
import { DaySelector } from '../day-selector';
import { ChartLegendHeader } from './chart-legend-header';

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
  const { chartType, data, loading, error, fetchStats, days } = useChart();

  const renderChart = () => {
    switch (chartType) {
      case 'area':
        return <ChartAreaInteractive />;
      case 'line':
        return <ChartLineMultiple />;
      case 'bar':
      default:
        return (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart data={data} margin={{ top: 0, right: 50, bottom: 0, left: 0 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => value}
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
              <Bar dataKey="new_players" fill="var(--chart-1)" radius={4} />
              <Bar dataKey="bans" fill="var(--chart-2)" radius={4} />
              <Bar dataKey="unbans" fill="var(--chart-3)" radius={4} />
            </BarChart>
          </ChartContainer>
        );
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
            <CardTitle>Week Stats</CardTitle>
            <DaySelector />
        </div>
        <div className="mt-4">
            <ChartLegendHeader chartConfig={chartConfig} />
        </div>
      </CardHeader>
      <CardContent className="px-0 flex-1 flex flex-col">
        {loading ? (
          <div className="flex items-center justify-center flex-1">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-4">
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
            <Button onClick={() => fetchStats(days)} variant="outline">
              Retry
            </Button>
          </div>
        ) : (
          <div className="h-full">{renderChart()}</div>
        )}
      </CardContent>
    </Card>
  );
}
