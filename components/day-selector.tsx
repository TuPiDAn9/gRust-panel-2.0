"use client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useChart } from './charts/chart-provider'

export function DaySelector() {
  const { days, setDays, fetchStats } = useChart()
  
  const handleDaysChange = (value: string) => {
    const selectedDays = parseInt(value)
    setDays(selectedDays)
    fetchStats(selectedDays)
  }

  const getDisplayValue = () => {
    switch (days) {
      case 5: return '5 Days'
      case 3: return '3 Days'
      case 7: return '7 Days'
      default: return '7 Days'
    }
  }

  return (
    <Select value={days.toString()} onValueChange={handleDaysChange}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder={getDisplayValue()} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="3">3 Days</SelectItem>
        <SelectItem value="5">5 Days</SelectItem>
        <SelectItem value="7">7 Days</SelectItem>
      </SelectContent>
    </Select>
  )
}
