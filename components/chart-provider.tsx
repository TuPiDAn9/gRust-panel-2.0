'use client'

import { createContext, useContext, useState } from 'react';

export type ChartType = 'bar' | 'area' | 'line';

interface ChartContextType {
  chartType: ChartType;
  setChartType: (type: ChartType) => void;
}

const ChartContext = createContext<ChartContextType | undefined>(undefined);

export function ChartProvider({ children }: { children: React.ReactNode }) {
  const [chartType, setChartType] = useState<ChartType>('bar');

  return (
    <ChartContext.Provider value={{ chartType, setChartType }}>
      {children}
    </ChartContext.Provider>
  );
}

export function useChart() {
  const context = useContext(ChartContext);
  if (context === undefined) {
    throw new Error('useChart must be used within a ChartProvider');
  }
  return context;
}
