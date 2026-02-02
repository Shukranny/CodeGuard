import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const TrendAnalysisChart = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-glow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={`tooltip-${index}`} className="flex items-center justify-between gap-4 text-xs">
              <span className="text-muted-foreground">{entry?.name}:</span>
              <span className="font-medium" style={{ color: entry?.color }}>
                {entry?.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64 md:h-80" aria-label="Vulnerability Trend Analysis Line Chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
          <XAxis 
            dataKey="date" 
            stroke="var(--color-muted-foreground)"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="var(--color-muted-foreground)"
            style={{ fontSize: '12px' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '12px' }}
            iconType="line"
          />
          <Line 
            type="monotone" 
            dataKey="critical" 
            stroke="#EF4444" 
            strokeWidth={2}
            dot={{ fill: '#EF4444', r: 4 }}
            activeDot={{ r: 6 }}
            name="Critical"
          />
          <Line 
            type="monotone" 
            dataKey="high" 
            stroke="#F59E0B" 
            strokeWidth={2}
            dot={{ fill: '#F59E0B', r: 4 }}
            activeDot={{ r: 6 }}
            name="High"
          />
          <Line 
            type="monotone" 
            dataKey="medium" 
            stroke="#F59E0B" 
            strokeWidth={2}
            dot={{ fill: '#F59E0B', r: 4 }}
            activeDot={{ r: 6 }}
            name="Medium"
          />
          <Line 
            type="monotone" 
            dataKey="total" 
            stroke="#2563EB" 
            strokeWidth={2}
            dot={{ fill: '#2563EB', r: 4 }}
            activeDot={{ r: 6 }}
            name="Total"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendAnalysisChart;
