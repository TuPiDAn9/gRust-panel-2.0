"use client";
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
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

export function ChartLineMultiple() {
  const { data } = useChart();

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 30,
          bottom: 5,
        }}
      >
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
            />
          }
        />
        <Line
          dataKey="new_players"
          type="monotone"
          stroke="var(--chart-1)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="bans"
          type="monotone"
          stroke="var(--chart-2)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="unbans"
          type="monotone"
          stroke="var(--chart-3)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
