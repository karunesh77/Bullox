import { useState } from 'react';
import { BarChart3, TrendingUp, Calendar, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100">
              <BarChart3 size={24} className="text-indigo-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Advanced Analytics</h1>
              <p className="text-sm text-gray-600">Track and analyze your portfolio performance</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-white border border-gray-200"><p className="text-xs text-gray-600">Total P&L</p><p className="text-2xl font-bold text-green-700">₹1,18,400</p></div>
          <div className="p-4 rounded-xl bg-white border border-gray-200"><p className="text-xs text-gray-600">Return</p><p className="text-2xl font-bold text-blue-700">18.40%</p></div>
          <div className="p-4 rounded-xl bg-white border border-gray-200"><p className="text-xs text-gray-600">Win Rate</p><p className="text-2xl font-bold text-purple-700">65%</p></div>
          <div className="p-4 rounded-xl bg-white border border-gray-200"><p className="text-xs text-gray-600">Total Trades</p><p className="text-2xl font-bold text-orange-700">342</p></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="p-6 rounded-2xl bg-white border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Performance by Asset Class</h2>
            <div className="space-y-4">
              <div><div className="flex justify-between mb-2"><span className="font-semibold">Stocks</span><span className="font-bold text-blue-700">+15.2%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{width: "72%"}}></div></div></div>
              <div><div className="flex justify-between mb-2"><span className="font-semibold">Crypto</span><span className="font-bold text-green-700">+24.8%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-600 h-2 rounded-full" style={{width: "85%"}}></div></div></div>
              <div><div className="flex justify-between mb-2"><span className="font-semibold">Forex</span><span className="font-bold text-purple-700">+8.3%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-purple-600 h-2 rounded-full" style={{width: "45%"}}></div></div></div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Risk Analysis</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
                <p className="text-sm text-gray-700">Max Drawdown</p>
                <p className="text-2xl font-bold text-blue-700">-12.5%</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                <p className="text-sm text-gray-700">Sharpe Ratio</p>
                <p className="text-2xl font-bold text-green-700">1.85</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                <p className="text-sm text-gray-700">Profit Factor</p>
                <p className="text-2xl font-bold text-purple-700">2.4</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Monthly Breakdown</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => (
              <div key={month} className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
                <p className="font-bold text-gray-900 mb-2">{month}</p>
                <p className="text-lg font-bold text-green-700">+5.2%</p>
                <p className="text-xs text-gray-600 mt-2">42 trades</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
