import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { ChartContainer, TherapeuticTooltip } from '@/components/ui/chart'
import type { ChartConfig } from '@/components/ui/chart'

interface TherapeuticChartData {
  band: string
  power: number
  therapeutic_score: number
  condition: string
}

interface TherapeuticChartProps {
  data: TherapeuticChartData[]
  title?: string
  className?: string
}

const chartConfig: ChartConfig = {
  therapeutic_score: {
    label: "Therapeutic Efficacy",
    color: "hsl(var(--primary))",
  },
  power: {
    label: "Band Power",
    color: "hsl(var(--secondary))",
  },
} satisfies ChartConfig

export const TherapeuticChart: React.FC<TherapeuticChartProps> = ({ 
  data, 
  title = "Therapeutic Efficacy by Frequency Band",
  className = ""
}) => {
  return (
    <div className={`w-full ${className}`}>
      {title && (
        <div className="text-center text-lg font-bold mb-4 text-foreground">
          {title}
        </div>
      )}
      
      <ChartContainer config={chartConfig} className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="band" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
              domain={[0, 1]}
              tickFormatter={(value) => `${Math.round(value * 100)}%`}
            />
            <TherapeuticTooltip />
            <Bar 
              dataKey="therapeutic_score" 
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              className="hover:opacity-80 transition-opacity"
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
      
      {/* Simplified visualization fallback */}
      <div className="mt-6 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-4 p-3 bg-card rounded-lg border">
            <div className="w-16 text-sm font-medium text-primary">
              {item.band}
            </div>
            <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                style={{ width: `${item.therapeutic_score * 100}%` }}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {Math.round(item.therapeutic_score * 100)}%
            </div>
            <div className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
              {item.condition}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TherapeuticChart