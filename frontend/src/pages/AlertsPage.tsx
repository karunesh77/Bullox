import { useState } from 'react';
import { Bell, Plus, X, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PriceAlert {
  id: string;
  symbol: string;
  name: string;
  condition: 'above' | 'below';
  targetPrice: number;
  currentPrice: number;
  createdAt: string;
  triggered: boolean;
}

const MOCK_ALERTS: PriceAlert[] = [
  { id: '1', symbol: 'AAPL', name: 'Apple Inc', condition: 'above', targetPrice: 185, currentPrice: 182.45, createdAt: '2026-04-25', triggered: false },
  { id: '2', symbol: 'BTCUSDT', name: 'Bitcoin', condition: 'below', targetPrice: 67000, currentPrice: 68420, createdAt: '2026-04-24', triggered: false },
  { id: '3', symbol: 'NIFTY50', name: 'NIFTY 50', condition: 'above', targetPrice: 22000, currentPrice: 21845, createdAt: '2026-04-23', triggered: false },
];

function AlertCard({ alert, onDelete }: { alert: PriceAlert; onDelete: (id: string) => void }) {
  const isTriggered = alert.triggered;
  const isConditionMet = alert.condition === 'above' ? alert.currentPrice >= alert.targetPrice : alert.currentPrice <= alert.targetPrice;

  return (
    <div className={cn('p-5 rounded-2xl border transition-all', isTriggered ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' : 'bg-white border-gray-200 hover:shadow-md')}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-lg font-bold text-gray-900">{alert.symbol}</p>
            {isConditionMet && <CheckCircle size={18} className="text-green-600" />}
            {isTriggered && <span className="text-xs font-bold px-2 py-1 rounded-lg bg-green-100 text-green-700">Triggered</span>}
          </div>
          <p className="text-xs text-gray-600 mt-1">{alert.name}</p>
        </div>
        <button onClick={() => onDelete(alert.id)} className="p-2 hover:bg-red-100 rounded-lg text-red-600">
          <X size={18} />
        </button>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Current Price:</span>
          <p className="font-bold text-gray-900">${alert.currentPrice}</p>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Alert when {alert.condition === 'above' ? 'above' : 'below'}:</span>
          <p className="font-bold text-blue-700">${alert.targetPrice}</p>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-200 text-xs text-gray-600">Created: {new Date(alert.createdAt).toLocaleDateString()}</div>
    </div>
  );
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<PriceAlert[]>(MOCK_ALERTS);
  const [showForm, setShowForm] = useState(false);

  const triggeredCount = alerts.filter((a) => a.triggered).length;
  const activeCount = alerts.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-red-50 to-orange-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-red-100 to-orange-100">
              <Bell size={24} className="text-red-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Price Alerts</h1>
              <p className="text-sm text-gray-600">Get notified when prices reach your targets</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white border border-gray-200">
              <p className="text-xs text-gray-600 font-semibold">Active Alerts</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">{activeCount}</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-gray-200">
              <p className="text-xs text-gray-600 font-semibold">Triggered</p>
              <p className="text-2xl font-bold text-green-700 mt-1">{triggeredCount}</p>
            </div>
            <button onClick={() => setShowForm(true)} className="p-4 rounded-xl bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all">
              <Plus size={20} /> New Alert
            </button>
          </div>
        </div>

        {showForm && (
          <div className="mb-8 p-6 rounded-2xl bg-white border-2 border-orange-300">
            <h2 className="text-xl font-bold mb-4">Create Price Alert</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Symbol (e.g., AAPL)" className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white" />
              <select className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white">
                <option>Alert when price goes ABOVE</option>
                <option>Alert when price goes BELOW</option>
              </select>
              <input type="number" placeholder="Target Price" className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white" />
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-3 rounded-lg bg-orange-600 text-white font-bold hover:bg-orange-700">Create Alert</button>
                <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-3 rounded-lg border border-gray-300 font-bold hover:bg-gray-50">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {alerts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Bell size={40} className="mx-auto mb-3 opacity-30" />
            <p>No alerts yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} onDelete={(id) => setAlerts(alerts.filter((a) => a.id !== id))} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
