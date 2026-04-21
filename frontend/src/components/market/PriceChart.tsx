import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import { formatPrice } from '@/lib/utils';

interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

interface PriceChartProps {
  candles: Candle[];
  symbol: string;
}

const formatTime = (ts: number) => {
  const d = new Date(ts * 1000);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs">
      <p className="text-gray-400 mb-1">{formatTime(d.time)}</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
        <span className="text-gray-500">Open</span><span className="text-white">${formatPrice(d.open)}</span>
        <span className="text-gray-500">High</span><span className="text-green-400">${formatPrice(d.high)}</span>
        <span className="text-gray-500">Low</span><span className="text-red-400">${formatPrice(d.low)}</span>
        <span className="text-gray-500">Close</span><span className="text-white font-medium">${formatPrice(d.close)}</span>
      </div>
    </div>
  );
};

export default function PriceChart({ candles, symbol }: PriceChartProps) {
  const isUp = candles.length >= 2
    ? candles[candles.length - 1].close >= candles[0].close
    : true;

  const color = isUp ? '#22c55e' : '#ef4444';

  return (
    <div className="w-full h-full p-4">
      <p className="text-xs text-gray-500 mb-3">{symbol} — Price Chart</p>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={candles} margin={{ top: 5, right: 5, bottom: 0, left: 10 }}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.2} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="time"
            tickFormatter={formatTime}
            tick={{ fill: '#6b7280', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={['auto', 'auto']}
            tickFormatter={(v) => `$${formatPrice(v)}`}
            tick={{ fill: '#6b7280', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={75}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="close"
            stroke={color}
            strokeWidth={2}
            fill="url(#priceGradient)"
            dot={false}
            activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
