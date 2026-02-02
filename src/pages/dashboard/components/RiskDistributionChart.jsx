import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const RiskDistributionChart = ({ data }) => {
  const COLORS = {
    critical: '#EF4444',
    high: '#F59E0B',
    medium: '#F59E0B',
    low: '#10B981',
    info: '#94A3B8'
  };

  const chartData = [
    { name: 'Critical', value: data?.critical, color: COLORS?.critical },
    { name: 'High', value: data?.high, color: COLORS?.high },
    { name: 'Medium', value: data?.medium, color: COLORS?.medium },
    { name: 'Low', value: data?.low, color: COLORS?.low },
    { name: 'Info', value: data?.info, color: COLORS?.info }
  ]?.filter(item => item?.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-glow-lg">
          <p className="text-sm font-medium text-foreground">{payload?.[0]?.name}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {payload?.[0]?.value} vulnerabilities
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-4">
        {payload?.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: entry?.color }}
            />
            <span className="text-xs md:text-sm text-foreground font-medium">
              {entry?.value}: {entry?.payload?.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-64 md:h-80" aria-label="Risk Distribution Pie Chart">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius="70%"
            fill="#8884d8"
            dataKey="value"
          >
            {chartData?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry?.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RiskDistributionChart;