import { useState } from 'react';
import { Award, Copy, MessageCircle, Share2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TraderDetailPage() {
  const [isCopying, setIsCopying] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-purple-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 p-6 rounded-2xl bg-white border border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-2xl font-bold">AM</div>
              <div>
                <div className="flex items-center gap-2 mb-2"><h1 className="text-3xl font-bold text-gray-900">Arjun Mehta</h1><Award size={24} className="text-yellow-500" /></div>
                <p className="text-gray-600 mb-2">@arjun_quant</p>
                <p className="text-gray-700 mb-4">Quant algo trader. High frequency crypto + US equities.</p>
                <div className="flex gap-6 text-sm"><span><strong>5,200</strong> Followers</span><span><strong>340</strong> Copying</span><span className="bg-amber-100 text-amber-700 px-3 rounded-lg font-bold">High Risk</span></div>
              </div>
            </div>
            <button onClick={() => setIsCopying(!isCopying)} className={cn('flex items-center gap-2 px-6 py-3 rounded-xl font-bold', isCopying ? 'bg-white text-red-700 border-2 border-red-300' : 'bg-green-600 text-white')}><Copy size={18} /> {isCopying ? 'Stop' : 'Copy'}</button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-gray-200"><p className="text-xs text-gray-600 font-semibold mb-2">All-time Return</p><p className="text-2xl font-bold text-green-700">+421%</p></div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-gray-200"><p className="text-xs text-gray-600 font-semibold mb-2">This Month</p><p className="text-2xl font-bold text-blue-700">+24.1%</p></div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-gray-200"><p className="text-xs text-gray-600 font-semibold mb-2">Win Rate</p><p className="text-2xl font-bold text-purple-700">61%</p></div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 border border-gray-200"><p className="text-xs text-gray-600 font-semibold mb-2">Total Trades</p><p className="text-2xl font-bold text-orange-700">9,870</p></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-2xl bg-white border border-gray-200"><h2 className="text-xl font-bold text-gray-900 mb-4">Key Metrics</h2><div className="space-y-3"><div className="flex justify-between p-3 rounded-lg bg-gray-50"><span className="text-gray-700">Sharpe Ratio</span><span className="font-bold">1.45</span></div><div className="flex justify-between p-3 rounded-lg bg-gray-50"><span className="text-gray-700">Profit Factor</span><span className="font-bold">2.1</span></div><div className="flex justify-between p-3 rounded-lg bg-gray-50"><span className="text-gray-700">Max Drawdown</span><span className="font-bold text-red-700">-28.4%</span></div><div className="flex justify-between p-3 rounded-lg bg-gray-50"><span className="text-gray-700">Avg Win/Loss</span><span className="font-bold">1.8</span></div></div></div>
          <div className="p-6 rounded-2xl bg-white border border-gray-200"><h2 className="text-xl font-bold text-gray-900 mb-4">Statistics</h2><div className="space-y-3"><div><p className="text-sm text-gray-600 mb-1">Member Since</p><p className="font-bold">March 15, 2020</p></div><div><p className="text-sm text-gray-600 mb-1">Top Symbol</p><p className="font-bold">SOLUSDT</p></div><div><p className="text-sm text-gray-600 mb-1">Strategy</p><p className="font-bold">High Freq Quant</p></div><div><p className="text-sm text-gray-600 mb-1">Avg Duration</p><p className="font-bold">2.5 hours</p></div></div></div>
          <div className="p-6 rounded-2xl bg-white border border-gray-200"><h2 className="text-xl font-bold text-gray-900 mb-4">Top Symbols</h2><div className="space-y-3">{['SOLUSDT', 'AVAXUSDT', 'NVDA', 'AAPL'].map(s => <div key={s} className="flex justify-between p-3 rounded-lg bg-blue-50 border border-blue-200"><span className="font-bold">{s}</span><TrendingUp size={18} className="text-green-600" /></div>)}</div></div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-gray-200 mb-8"><h2 className="text-xl font-bold text-gray-900 mb-6">Monthly Performance</h2><div className="grid grid-cols-4 gap-4">{[{m:'Jan',r:12.5,t:45},{m:'Feb',r:8.3,t:52},{m:'Mar',r:24.1,t:67},{m:'Apr',r:5.2,t:38}].map(p => <div key={p.m} className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 text-center"><p className="font-bold mb-2">{p.m}</p><p className="text-2xl font-bold text-green-700 mb-2">+{p.r}%</p><p className="text-xs text-gray-600">{p.t} trades</p></div>)}</div></div>

        <div className="grid grid-cols-2 gap-4"><button className="px-6 py-4 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-blue-700"><MessageCircle size={20} /> Message</button><button className="px-6 py-4 rounded-xl border-2 border-gray-300 font-bold flex items-center justify-center gap-2 hover:bg-gray-50"><Share2 size={20} /> Share</button></div>
      </div>
    </div>
  );
}
