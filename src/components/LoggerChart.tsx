import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { LogEntry } from "@/types/logger";
import { getChartDataForField } from "@/utils/logParser";

interface LoggerChartProps {
  entries: LogEntry[];
  selectedFields: string[];
  currentTime?: number;
}

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export const LoggerChart = ({ 
  entries, 
  selectedFields,
  currentTime = Infinity
}: LoggerChartProps) => {
  const chartData = useMemo(() => {
    if (selectedFields.length === 0 || entries.length === 0) return [];

    // Use time as x-axis instead of coordinate
    const timePoints = new Map<number, any>();
    
    selectedFields.forEach(field => {
      const fieldData = getChartDataForField(entries, field);
      fieldData.forEach(point => {
        if (!timePoints.has(point.time)) {
          timePoints.set(point.time, { time: point.time });
        }
        timePoints.get(point.time)![field] = point.value;
      });
    });
    
    return Array.from(timePoints.values())
      .sort((a, b) => a.time - b.time);
  }, [entries, selectedFields, currentTime]);


  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="time" 
          stroke="hsl(var(--muted-foreground))"
          label={{ value: 'Time (seconds)', position: 'insideBottom', offset: -5 }}
          domain={[0, 'auto']}
          type="number"
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))"
          label={{ value: 'Value', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px'
          }}
        />
        <Legend />
        {selectedFields.map((field, index) => (
          <Line
            key={field}
            type="monotone"
            dataKey={field}
            stroke={CHART_COLORS[index % CHART_COLORS.length]}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            name={field}
            connectNulls
          />
        ))}
        {currentTime !== Infinity && (
          <ReferenceLine 
            x={currentTime} 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            strokeDasharray="3 3"
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};
