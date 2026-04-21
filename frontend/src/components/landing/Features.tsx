import { TrendingUp, Newspaper, Bell, Users, Calendar, BookMarked } from 'lucide-react';

const features = [
  {
    icon: TrendingUp,
    title: 'Live Market Data',
    desc: 'Real-time prices for stocks, forex, and crypto from Finnhub, CoinGecko, and more. Zero delay.',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
  },
  {
    icon: Newspaper,
    title: 'AI News Sentiment',
    desc: 'Every news article analyzed by Claude AI for sentiment, impact, and affected symbols.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
  {
    icon: Bell,
    title: 'Smart Price Alerts',
    desc: 'Set alerts for price levels or % changes. Instant notifications when your condition triggers.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
  },
  {
    icon: BookMarked,
    title: 'Custom Watchlists',
    desc: 'Organize symbols into multiple watchlists. Track everything you care about, nothing you don\'t.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    icon: Users,
    title: 'Copy Trading',
    desc: 'Follow top-performing traders. Mirror their moves with one click. Learn while you earn.',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
  },
  {
    icon: Calendar,
    title: 'Economic Calendar',
    desc: 'Never miss an NFP, CPI, or FOMC. High-impact events flagged before they move markets.',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Everything you need.<br />
            <span className="text-gray-500">Nothing you don't.</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Built for traders who value clarity, speed, and data-driven decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc, color, bg, border }) => (
            <div
              key={title}
              className="group rounded-2xl border border-gray-800 bg-gray-900/50 p-6 hover:bg-gray-900 hover:border-gray-700 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${bg} border ${border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon size={22} className={color} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
