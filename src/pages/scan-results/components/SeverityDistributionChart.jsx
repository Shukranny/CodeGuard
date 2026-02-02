import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const SeverityDistributionChart = ({ data }) => {
  const COLORS = {
    critical: '#EF4444',
    high: '#F59E0B',
    medium: '#F59E0B',
    low: '#10B981'
  };

  const chartData = [
    { name: 'Critical', value: data?.critical, color: COLORS?.critical },
    { name: 'High', value: data?.high, color: COLORS?.high },
    { name: 'Medium', value: data?.medium, color: COLORS?.medium },
    { name: 'Low', value: data?.low, color: COLORS?.low }
  ]?.filter(item => item?.value > 0);

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6">
      <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-4">
        Severity Distribution
      </h3>
      <div className="w-full h-48 md:h-64" aria-label="Severity Distribution Pie Chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100)?.toFixed(0)}%`}
              outerRadius="80%"
              fill="#8884d8"
              dataKey="value"
            >
              {chartData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry?.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SeverityDistributionChart;
