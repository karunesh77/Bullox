import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ChartDataPoint {
  time: string;
  value: number;
}

interface PortfolioChartProps {
  data: ChartDataPoint[];
  title?: string;
  subtitle?: string;
  showTimeFilters?: boolean;
  onTimeFilterChange?: (filter: string) => void;
}

// ── Custom Tooltip Component ────────────────────────
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;

  return (
    <div
      style={{ backgroundColor: '#0B0F19', borderColor: '#1F2937' }}
      className="border rounded-xl px-4 py-2.5 shadow-2xl"
    >
      <p style={{ color: '#9CA3AF' }} className="text-xs mb-1">
        {data.time}
      </p>
      <p style={{ color: '#22C55E' }} className="font-bold text-sm">
        ${data.value.toLocaleString()}
      </p>
    </div>
  );
};

// ── Time Filter Button Component ────────────────────
const TimeFilterButton = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      style={isActive
        ? { backgroundColor: '#3B82F6', color: '#fff' }
        : { backgroundColor: 'transparent', color: '#9CA3AF', borderColor: '#1F2937' }
      }
      className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 border ${
        isActive ? 'border-blue-500' : 'border-transparent'
      } hover:text-white`}
      onMouseEnter={e => {
        if (!isActive) (e.currentTarget as HTMLElement).style.borderColor = '#3B82F6';
      }}
      onMouseLeave={e => {
        if (!isActive) (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
      }}
    >
      {label}
    </button>
  );
};

// ── Main PortfolioChart Component ────────────────────
export default function PortfolioChart({
  data,
  title = 'Portfolio Overview',
  subtitle = '',
  showTimeFilters = true,
  onTimeFilterChange,
}: PortfolioChartProps) {
  const [activeFilter, setActiveFilter] = useState('1D');

  const timeFilters = ['1D', '1W', '1M', '3M', '1Y', 'All'];

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    onTimeFilterChange?.(filter);
  };

  // Get current value for display
  const currentValue = data[data.length - 1]?.value || 0;
  const previousValue = data[0]?.value || 0;
  const changePercent = previousValue
    ? (((currentValue - previousValue) / previousValue) * 100).toFixed(2)
    : '0.00';
  const isPositive = parseFloat(changePercent) >= 0;

  return (
    <div
      style={{ backgroundColor: '#111827', borderColor: '#1F2937' }}
      className="border rounded-2xl p-5 transition-all duration-200"
    >
      {/* ── Header ────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          {/* Title and Subtitle */}
          <div className="mb-1">
            <p style={{ color: '#9CA3AF' }} className="text-xs font-semibold uppercase tracking-wider">
              {title}
            </p>
          </div>

          {/* Current Value */}
          <div className="flex items-baseline gap-3">
            <p style={{ color: '#E5E7EB' }} className="text-3xl font-bold">
              ${currentValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </p>
            <p
              style={{ color: isPositive ? '#22C55E' : '#EF4444' }}
              className="text-sm font-semibold flex items-center gap-1"
            >
              {isPositive ? '↗' : '↘'} {changePercent}%
            </p>
          </div>

          {/* Subtitle */}
          {subtitle && (
            <p style={{ color: '#6B7280' }} className="text-xs mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Time Filters */}
        {showTimeFilters && (
          <div
            style={{ backgroundColor: '#0B0F19' }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl flex-shrink-0"
          >
            {timeFilters.map(filter => (
              <TimeFilterButton
                key={filter}
                label={filter}
                isActive={activeFilter === filter}
                onClick={() => handleFilterChange(filter)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Chart ────────────────────────────────── */}
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart
          data={data}
          margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
        >
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22C55E" stopOpacity={0.65} />
              <stop offset="40%" stopColor="#22C55E" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#22C55E" stopOpacity={0.15} />
            </linearGradient>

            {/* Glow Filter */}
            <filter id="lineGlow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1F2937"
            horizontal={true}
            vertical={false}
            opacity={0.5}
          />

          {/* X Axis */}
          <XAxis
            dataKey="time"
            stroke="#6B7280"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            interval={Math.floor(data.length / 5) || 0}
          />

          {/* Y Axis */}
          <YAxis
            stroke="#6B7280"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            domain={['dataMin - buffer', 'dataMax + buffer']}
            width={60}
            tickFormatter={value => `$${(value / 1000).toFixed(0)}K`}
          />

          {/* Tooltip */}
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: '#4B5563', strokeWidth: 1, strokeDasharray: '4 4' }}
          />

          {/* Area */}
          <Area
            type="monotone"
            dataKey="value"
            stroke="#22C55E"
            strokeWidth={3.5}
            fill="url(#portfolioGradient)"
            dot={false}
            activeDot={{
              r: 6,
              fill: '#22C55E',
              stroke: '#111827',
              strokeWidth: 2.5,
            }}
            isAnimationActive={true}
            animationDuration={800}
            style={{ filter: 'url(#lineGlow)' } as React.CSSProperties}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* ── Footer Info ────────────────────────────── */}
      <div style={{ borderColor: '#1F2937' }} className="border-t mt-4 pt-3 flex items-center justify-between text-xs">
        <div style={{ color: '#9CA3AF' }}>
          <p>
            <span style={{ color: '#22C55E' }} className="font-semibold">
              High:
            </span>{' '}
            ${Math.max(...data.map(d => d.value)).toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </p>
        </div>
        <div style={{ color: '#9CA3AF' }}>
          <p>
            <span style={{ color: '#EF4444' }} className="font-semibold">
              Low:
            </span>{' '}
            ${Math.min(...data.map(d => d.value)).toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </p>
        </div>
        <div style={{ color: '#9CA3AF' }}>
          <p>
            <span style={{ color: '#3B82F6' }} className="font-semibold">
              Avg:
            </span>{' '}
            ${(data.reduce((sum, d) => sum + d.value, 0) / data.length).toLocaleString('en-US', {
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
