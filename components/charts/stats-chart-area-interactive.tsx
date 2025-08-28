'use client';
import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useChart } from './chart-provider';

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

export function ChartAreaInteractive() {
  const { data } = useChart();

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[250px] w-full"
    >
      <AreaChart data={data} margin={{
        top: 5,
        right: 30,
        left: 30,
        bottom: 5,
      }}>
        <defs>
          <linearGradient id="fillNewPlayers" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--chart-1)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--chart-1)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillBans" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--chart-2)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--chart-2)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillUnbans" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--chart-3)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--chart-3)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval={0}
        />
        <ChartTooltip
          cursor={false}
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
              indicator="dot"
            />
          }
        />
        <Area
          dataKey="new_players"
          type="natural"
          fill="url(#fillNewPlayers)"
          stroke="var(--chart-1)"
          stackId="a"
        />
        <Area
          dataKey="bans"
          type="natural"
          fill="url(#fillBans)"
          stroke="var(--chart-2)"
          stackId="a"
        />
        <Area
          dataKey="unbans"
          type="natural"
          fill="url(#fillUnbans)"
          stroke="var(--chart-3)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}
