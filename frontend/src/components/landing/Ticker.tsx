import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const GREEN = "#22C55E";
const RED = "#EF4444";

const generateMockPrice = (basePrice: number): number => Math.round((basePrice + (Math.random() - 0.5) * basePrice * 0.015) * 100) / 100;

const coins = [
  { symbol: "BTC/USDT", icon: "₿", basePrice: 66745, change: 2.4, iconBg: "#F7931A" },
  { symbol: "ETH/USDT", icon: "◆", basePrice: 3427, change: -1.2, iconBg: "#627EEA" },
  { symbol: "SOL/USDT", icon: "◎", basePrice: 163.97, change: 5.6, iconBg: "#9945FF" },
  { symbol: "BNB/USDT", icon: "⬥", basePrice: 616.15, change: 2.1, iconBg: "#F3BA2F" },
  { symbol: "XRP/USDT", icon: "✕", basePrice: 0.5254, change: -0.8, iconBg: "#23F7DD" },
];

export default function Ticker() {
  const [prices, setPrices] = useState(coins.map(c => ({
    ...c,
    price: c.basePrice,
  })));

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => prev.map(p => ({
        ...p,
        price: generateMockPrice(p.basePrice),
        basePrice: p.basePrice,
      })));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="border-t border-white/10 py-8 bg-gradient-to-r from-slate-950 via-slate-950 to-slate-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex overflow-x-auto gap-4 pb-2 scroll-smooth">
          {prices.map((item) => {
            const isPositive = item.change >= 0;
            return (
              <div
                key={item.symbol}
                className="flex-shrink-0 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 group"
                style={{
                  background: "rgba(15, 23, 42, 0.5)",
                  boxShadow: "0 0 20px rgba(59, 130, 246, 0.1)",
                  minWidth: "200px",
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{
                      backgroundColor: item.iconBg,
                      boxShadow: `0 0 15px ${item.iconBg}66`,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">{item.symbol}</p>
                    <p className="text-gray-400 text-xs">${item.price.toLocaleString("en-US", { maximumFractionDigits: 2 })}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isPositive ? (
                      <TrendingUp size={16} style={{ color: GREEN, filter: `drop-shadow(0 0 4px ${GREEN})` }} />
                    ) : (
                      <TrendingDown size={16} style={{ color: RED, filter: `drop-shadow(0 0 4px ${RED})` }} />
                    )}
                    <span
                      style={{ color: isPositive ? GREEN : RED }}
                      className="text-sm font-bold"
                    >
                      {isPositive ? "+" : ""}{item.change}%
                    </span>
                  </div>
                  <div className="w-16 h-6 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
