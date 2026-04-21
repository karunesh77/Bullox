import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const tickerItems = [
  { symbol: 'AAPL', price: '213.18', change: -0.54 },
  { symbol: 'TSLA', price: '192.30', change: 2.81 },
  { symbol: 'NVDA', price: '875.40', change: 4.23 },
  { symbol: 'BTCUSDT', price: '76,243', change: 1.93 },
  { symbol: 'ETHUSDT', price: '2,332', change: -1.20 },
  { symbol: 'MSFT', price: '428.72', change: 0.85 },
  { symbol: 'GOOGL', price: '168.50', change: 1.34 },
  { symbol: 'AMZN', price: '215.40', change: -0.20 },
  { symbol: 'META', price: '602.18', change: 2.14 },
  { symbol: 'SOLUSDT', price: '183.40', change: 5.67 },
];

// Duplicate for seamless loop
const items = [...tickerItems, ...tickerItems];

export default function Ticker() {
  return (
    <div className="border-y border-gray-800 bg-gray-900/50 backdrop-blur-sm overflow-hidden py-3">
      <div className="flex gap-8 animate-ticker whitespace-nowrap">
        {items.map((item, i) => {
          const up = item.change >= 0;
          return (
            <div key={i} className="flex items-center gap-2 flex-shrink-0">
              <span className="text-sm font-semibold text-white">{item.symbol}</span>
              <span className="text-sm text-gray-400">${item.price}</span>
              <span className={cn(
                'text-xs font-medium flex items-center gap-0.5',
                up ? 'text-green-400' : 'text-red-400'
              )}>
                {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {up ? '+' : ''}{item.change.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
