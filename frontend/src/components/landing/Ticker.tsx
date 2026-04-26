import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const CARD = "#111827";
const BORDER = "#1F2937";
const TEXT1 = "#E5E7EB";
const TEXT2 = "#9CA3AF";
const GREEN = "#22C55E";
const RED = "#EF4444";

const generateMockPrice = (basePrice: number): number => Math.round((basePrice + (Math.random() - 0.5) * basePrice * 0.015) * 100) / 100;

export default function Ticker() {
  const [prices, setPrices] = useState([
    { symbol: "BTC/USDT", basePrice: 67500, change: 2.4 },
    { symbol: "ETH/USDT", basePrice: 3420, change: -1.2 },
    { symbol: "SOL/USDT", basePrice: 165, change: 5.6 },
    { symbol: "BNB/USDT", basePrice: 610, change: 2.1 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => prev.map(p => ({ ...p, basePrice: generateMockPrice(p.basePrice) })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section style={{ backgroundColor: CARD, borderColor: BORDER }} className="border-y py-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex overflow-x-auto gap-6 pb-2">
          {prices.map(item => {
            const isPositive = item.change >= 0;
            return (
              <div key={item.symbol} className="flex-shrink-0 flex items-center gap-3">
                <div>
                  <p style={{ color: TEXT1 }} className="text-sm font-semibold">{item.symbol}</p>
                  <p style={{ color: TEXT2 }} className="text-sm">${item.basePrice.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-1">
                  {isPositive ? <TrendingUp size={16} style={{ color: GREEN }} /> : <TrendingDown size={16} style={{ color: RED }} />}
                  <span style={{ color: isPositive ? GREEN : RED }} className="text-sm font-semibold">
                    {isPositive ? "+" : ""}{item.change}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
