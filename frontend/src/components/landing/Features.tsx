import { TrendingUp, BarChart3, Shield, Users, Calendar } from "lucide-react";

const BG = "#0B0F19";
const CARD = "#111827";
const BORDER = "#1F2937";
const TEXT1 = "#E5E7EB";
const TEXT2 = "#9CA3AF";
const BLUE = "#3B82F6";

const features = [
  { icon: TrendingUp, title: "AI Trading Signals", desc: "Get intelligent BUY/SELL recommendations powered by advanced algorithms" },
  { icon: BarChart3, title: "Real-time Analytics", desc: "Track your portfolio performance with detailed charts and metrics" },
  { icon: TrendingUp, title: "Market Intelligence", desc: "Live market data, economic calendar, and news aggregation" },
  { icon: Shield, title: "Risk Management", desc: "Set stop losses, take profits, and manage risk effectively" },
  { icon: Users, title: "Copy Trading", desc: "Follow and copy trades from expert and professional traders" },
  { icon: Calendar, title: "Economic Calendar", desc: "Global economic events and their market impact at a glance" },
];

export default function Features() {
  return (
    <section id="features" style={{ backgroundColor: CARD }} className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4" style={{ color: TEXT1 }}>Powerful Features Built for Traders</h2>
        <p style={{ color: TEXT2 }} className="text-center max-w-2xl mx-auto mb-16">Everything you need to make informed trading decisions and manage your portfolio professionally.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} style={{ backgroundColor: BG, borderColor: BORDER }} className="border rounded-xl p-6 transition-all hover:border-blue-500 hover:translate-y-[-4px]">
                <Icon size={32} style={{ color: BLUE }} className="mb-4" />
                <h3 className="text-lg font-bold mb-2" style={{ color: TEXT1 }}>{feat.title}</h3>
                <p style={{ color: TEXT2 }} className="text-sm">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
