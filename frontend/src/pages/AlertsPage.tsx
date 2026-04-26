import { useState, useEffect } from 'react';
import { Bell, Plus, X, AlertCircle, CheckCircle } from 'lucide-react';

/* ─── Colors ─────────────────────────────────────────── */
const BG        = '#0B0F19';
const CARD      = '#111827';
const ELEVATED  = '#1F2937';
const BORDER    = '#1F2937';
const TEXT1     = '#E5E7EB';
const TEXT2     = '#9CA3AF';
const TEXT3     = '#6B7280';
const GREEN     = '#22C55E';
const RED       = '#EF4444';
const BLUE      = '#3B82F6';
const YELLOW    = '#F59E0B';

interface PriceAlert {
  id: string;
  symbol: string;
  name: string;
  condition: 'above' | 'below';
  targetPrice: number;
  currentPrice: number;
  basePrice: number;
  createdAt: string;
  triggered: boolean;
}

const generateMockPrice = (basePrice: number, vol = 0.02) =>
  Math.round((basePrice + (Math.random() - 0.5) * vol * basePrice) * 100) / 100;

const MOCK_ALERTS: PriceAlert[] = [
  { id: '1', symbol: 'AAPL', name: 'Apple Inc', condition: 'above', targetPrice: 185, currentPrice: 182.45, basePrice: 182.45, createdAt: '2026-04-25', triggered: false },
  { id: '2', symbol: 'BTC/USDT', name: 'Bitcoin', condition: 'below', targetPrice: 67000, currentPrice: 68420, basePrice: 68420, createdAt: '2026-04-24', triggered: false },
  { id: '3', symbol: 'ETH/USDT', name: 'Ethereum', condition: 'above', targetPrice: 3500, currentPrice: 3420, basePrice: 3420, createdAt: '2026-04-23', triggered: false },
];

function AlertCard({ alert, onDelete }: { alert: PriceAlert; onDelete: (id: string) => void }) {
  const isConditionMet = alert.condition === 'above' ? alert.currentPrice >= alert.targetPrice : alert.currentPrice <= alert.targetPrice;
  const distancePercent = ((Math.abs(alert.currentPrice - alert.targetPrice) / alert.targetPrice) * 100).toFixed(2);

  return (
    <div
      style={{ backgroundColor: CARD, borderColor: BORDER }}
      className="border rounded-2xl p-4 transition-all duration-150 hover:border-opacity-100"
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = ELEVATED; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = CARD; }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div
            style={{ backgroundColor: isConditionMet ? GREEN : YELLOW }}
            className="p-2 rounded-lg mt-0.5 flex-shrink-0"
          >
            {isConditionMet ? (
              <CheckCircle size={16} style={{ color: '#fff' }} />
            ) : (
              <AlertCircle size={16} style={{ color: '#000' }} />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p style={{ color: TEXT1 }} className="text-sm font-bold">{alert.symbol}</p>
              {isConditionMet && (
                <span style={{ backgroundColor: 'rgba(34,197,94,0.15)', color: GREEN }} className="text-[10px] font-bold px-2 py-0.5 rounded-lg">
                  Triggered
                </span>
              )}
            </div>
            <p style={{ color: TEXT3 }} className="text-xs">{alert.name}</p>
          </div>
        </div>
        <button
          onClick={() => onDelete(alert.id)}
          style={{ color: RED }}
          className="p-1.5 hover:bg-red-500 hover:bg-opacity-20 rounded-lg transition-all"
        >
          <X size={16} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div style={{ backgroundColor: ELEVATED }} className="rounded-lg p-3">
          <p style={{ color: TEXT3 }} className="text-xs mb-1">Current</p>
          <p style={{ color: TEXT1 }} className="font-bold text-sm">${alert.currentPrice.toLocaleString()}</p>
        </div>
        <div style={{ backgroundColor: ELEVATED, borderColor: alert.condition === 'above' ? GREEN : RED, border: `1px solid rgba(${alert.condition === 'above' ? '34,197,94' : '239,68,68'},0.3)` }} className="rounded-lg p-3">
          <p style={{ color: alert.condition === 'above' ? GREEN : RED }} className="text-xs mb-1 font-semibold">
            Alert {alert.condition === 'above' ? 'ABOVE' : 'BELOW'}
          </p>
          <p style={{ color: alert.condition === 'above' ? GREEN : RED }} className="font-bold text-sm">${alert.targetPrice.toLocaleString()}</p>
        </div>
        <div style={{ backgroundColor: ELEVATED }} className="rounded-lg p-3">
          <p style={{ color: TEXT3 }} className="text-xs mb-1">Distance</p>
          <p style={{ color: isConditionMet ? GREEN : YELLOW }} className="font-bold text-sm">{distancePercent}%</p>
        </div>
      </div>

      <div style={{ color: TEXT3 }} className="text-xs">
        Created: {new Date(alert.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<PriceAlert[]>(MOCK_ALERTS);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ symbol: '', condition: 'above', targetPrice: '' });

  // Real-time updates every 3s
  useEffect(() => {
    const id = setInterval(() => {
      setAlerts(prev =>
        prev.map(alert => ({
          ...alert,
          currentPrice: generateMockPrice(alert.basePrice, alert.symbol.includes('BTC') ? 0.03 : 0.015),
        }))
      );
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const triggeredCount = alerts.filter(a => {
    return a.condition === 'above' ? a.currentPrice >= a.targetPrice : a.currentPrice <= a.targetPrice;
  }).length;

  const handleCreateAlert = () => {
    if (formData.symbol && formData.targetPrice) {
      const newAlert: PriceAlert = {
        id: String(Date.now()),
        symbol: formData.symbol.toUpperCase(),
        name: formData.symbol,
        condition: formData.condition as 'above' | 'below',
        targetPrice: parseFloat(formData.targetPrice),
        currentPrice: 100,
        basePrice: 100,
        createdAt: new Date().toISOString().split('T')[0],
        triggered: false,
      };
      setAlerts([newAlert, ...alerts]);
      setFormData({ symbol: '', condition: 'above', targetPrice: '' });
      setShowForm(false);
    }
  };

  return (
    <div style={{ backgroundColor: BG }} className="min-h-screen p-4">
      <div className="max-w-5xl mx-auto">

        {/* ── Header ─────────────────────────── */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div style={{ backgroundColor: YELLOW }} className="p-2.5 rounded-xl">
              <Bell size={20} style={{ color: '#000' }} />
            </div>
            <div>
              <h1 style={{ color: TEXT1 }} className="text-2xl font-bold">Price Alerts</h1>
              <p style={{ color: TEXT2 }} className="text-sm">Get notified when prices reach your targets</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-xl p-4">
              <p style={{ color: TEXT3 }} className="text-xs font-semibold uppercase mb-2">Active Alerts</p>
              <p style={{ color: TEXT1 }} className="text-3xl font-bold">{alerts.length}</p>
            </div>
            <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-xl p-4">
              <p style={{ color: TEXT3 }} className="text-xs font-semibold uppercase mb-2">Triggered</p>
              <p style={{ color: GREEN }} className="text-3xl font-bold">{triggeredCount}</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              style={{ backgroundColor: BLUE, color: '#fff' }}
              className="rounded-xl p-4 font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
            >
              <Plus size={18} /> New Alert
            </button>
          </div>
        </div>

        {/* ── Create Alert Form ───────────────── */}
        {showForm && (
          <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ color: TEXT1 }} className="text-lg font-bold">Create Price Alert</h2>
              <button onClick={() => setShowForm(false)} style={{ color: TEXT2 }} className="hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Symbol (e.g., AAPL, BTC/USDT)"
                value={formData.symbol}
                onChange={e => setFormData({ ...formData, symbol: e.target.value })}
                style={{ backgroundColor: ELEVATED, borderColor: BORDER, color: TEXT1 }}
                className="w-full px-4 py-2.5 rounded-lg border text-sm placeholder-shown:text-gray-600 focus:outline-none"
              />
              <select
                value={formData.condition}
                onChange={e => setFormData({ ...formData, condition: e.target.value })}
                style={{ backgroundColor: ELEVATED, borderColor: BORDER, color: TEXT1 }}
                className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none"
              >
                <option>above</option>
                <option>below</option>
              </select>
              <input
                type="number"
                placeholder="Target Price"
                value={formData.targetPrice}
                onChange={e => setFormData({ ...formData, targetPrice: e.target.value })}
                style={{ backgroundColor: ELEVATED, borderColor: BORDER, color: TEXT1 }}
                className="w-full px-4 py-2.5 rounded-lg border text-sm placeholder-shown:text-gray-600 focus:outline-none"
              />
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCreateAlert}
                  style={{ backgroundColor: BLUE, color: '#fff' }}
                  className="flex-1 px-4 py-2.5 rounded-lg font-bold hover:opacity-90 transition-all"
                >
                  Create Alert
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  style={{ backgroundColor: ELEVATED, color: TEXT2, borderColor: BORDER }}
                  className="flex-1 px-4 py-2.5 rounded-lg font-bold border hover:text-white transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Alerts List ─────────────────────── */}
        {alerts.length === 0 ? (
          <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-2xl py-16 px-4 text-center">
            <Bell size={40} style={{ color: TEXT3 }} className="mx-auto mb-3 opacity-50" />
            <p style={{ color: TEXT2 }} className="text-sm">No alerts yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map(alert => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onDelete={id => setAlerts(alerts.filter(a => a.id !== id))}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
