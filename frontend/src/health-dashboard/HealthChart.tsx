import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './HealthChart.css';

interface HealthMetric {
  type: string;
  value: number | string;
  unit: string;
  timestamp: string;
}

interface HealthChartProps {
  data: HealthMetric[];
  dataType: string;
  color: string;
}

const HealthChart: React.FC<HealthChartProps> = ({ data, dataType, color }) => {
  // Filter and format data for this specific type
  const chartData = data
    .filter(item => item.type === dataType)
    .map(item => ({
      date: new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: new Date(item.timestamp).toLocaleString(),
      value: typeof item.value === 'number' ? item.value : parseFloat(item.value as string),
      unit: item.unit
    }))
    .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());

  if (chartData.length === 0) {
    return null;
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-date">{payload[0].payload.fullDate}</p>
          <p className="tooltip-value">
            {payload[0].value} {payload[0].payload.unit}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="health-chart-container">
      <h3 className="chart-title">{dataType}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="date" 
            stroke="rgba(255,255,255,0.5)"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.5)"
            style={{ fontSize: '12px' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color}
            strokeWidth={3}
            dot={{ fill: color, r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HealthChart;
