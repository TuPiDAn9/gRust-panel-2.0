"use client";

import { type ChartConfig } from '@/components/ui/chart';

interface ChartLegendHeaderProps {
  chartConfig: ChartConfig;
}

export function ChartLegendHeader({ chartConfig }: ChartLegendHeaderProps) {
  if (!chartConfig) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      {Object.entries(chartConfig).map(([key, config]) => {
        const color = config.color;
        return (
          <div key={key} className="flex items-center gap-1.5">
            {color && (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: color }}
              />
            )}
            <span className="text-sm text-muted-foreground">{config.label}</span>
          </div>
        );
      })}
    </div>
  );
}
