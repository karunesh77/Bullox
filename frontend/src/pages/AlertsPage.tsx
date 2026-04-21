import { useState } from 'react';
import { Bell, Plus, Trash2, TrendingUp, TrendingDown, Check, X, Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

type AlertCondition = 'ABOVE' | 'BELOW' | 'PERCENT_UP' | 'PERCENT_DOWN';
type AlertStatus = 'ACTIVE' | 'TRIGGERED' | 'EXPIRED';

interface Alert {
  id: string;
  symbol: string;
  condition: AlertCondition;
  value: number;
  currentPrice: number;
  status: AlertStatus;
  createdAt: string;
  triggeredAt?: string;
  note?: string;
}

const MOCK_ALERTS: Alert[] = [
  { id: '1', symbol: 'AAPL',    condition: 'ABOVE',       value: 220,   currentPrice: 213.18, status: 'ACTIVE',    createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: '2', symbol: 'BTCUSDT', condition: 'ABOVE',       value: 80000, currentPrice: 76243,  status: 'ACTIVE',    createdAt: new Date(Date.now() - 5 * 3600000).toISOString() },
  { id: '3', symbol: 'TSLA',    condition: 'BELOW',       value: 180,   currentPrice: 192.30, status: 'ACTIVE',    createdAt: new Date(Date.now() - 1 * 3600000).toISOString() },
  { id: '4', symbol: 'NVDA',    condition: 'PERCENT_UP',  value: 5,     currentPrice: 875.40, status: 'ACTIVE',    createdAt: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: '5', symbol: 'ETHUSDT', condition: 'ABOVE',       value: 2500,  currentPrice: 2332,   status: 'TRIGGERED', createdAt: new Date(Date.now() - 24 * 3600000).toISOString(), triggeredAt: new Date(Date.now() - 3 * 3600000).toISOString() },
  { id: '6', symbol: 'MSFT',    condition: 'BELOW',       value: 400,   currentPrice: 428.72, status: 'TRIGGERED', createdAt: new Date(Date.now() - 48 * 3600000).toISOString(), triggeredAt: new Date(Date.now() - 12 * 3600000).toISOString() },
];

const SYMBOLS = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL', 'AMZN', 'META', 'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'RELIANCE', 'TCS', 'INFY'];

const conditionConfig: Record<AlertCondition, { label: string; icon: typeof TrendingUp; color: string }> = {
  ABOVE:       { label: 'Price goes above', icon: TrendingUp,   color: 'text-green-400' },
  BELOW:       { label: 'Price goes below', icon: TrendingDown, color: 'text-red-400' },
  PERCENT_UP:  { label: '% moves up by',   icon: TrendingUp,   color: 'text-emerald-400' },
  PERCENT_DOWN:{ label: '% moves down by', icon: TrendingDown, color: 'text-orange-400' },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function progressToTarget(current: number, target: number, condition: AlertCondition) {
  if (condition === 'ABOVE') {
    return Math.min(100, Math.max(0, (current / target) * 100));
  }
  if (condition === 'BELOW') {
    return Math.min(100, Math.max(0, (target / current) * 100));
  }
  return 50;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [tab, setTab] = useState<'active' | 'triggered'>('active');
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [fSymbol, setFSymbol] = useState('AAPL');
  const [fCondition, setFCondition] = useState<AlertCondition>('ABOVE');
  const [fValue, setFValue] = useState('');
  const [fNote, setFNote] = useState('');

  const activeAlerts    = alerts.filter(a => a.status === 'ACTIVE');
  const triggeredAlerts = alerts.filter(a => a.status === 'TRIGGERED');

  const deleteAlert = (id: string) => setAlerts(prev => prev.filter(a => a.id !== id));

  const createAlert = () => {
    if (!fValue || isNaN(Number(fValue))) return;
    const newAlert: Alert = {
      id: Date.now().toString(),
      symbol: fSymbol,
      condition: fCondition,
      value: Number(fValue),
      currentPrice: 0,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      note: fNote || undefined,
    };
    setAlerts(prev => [newAlert, ...prev]);
    setShowForm(false);
    setFValue('');
    setFNote('');
    setTab('active');
  };

  const displayed = tab === 'active' ? activeAlerts : triggeredAlerts;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
            <Bell size={18} className="text-yellow-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Price Alerts</h1>
            <p className="text-sm text-gray-500">{activeAlerts.length} active · {triggeredAlerts.length} triggered</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500 text-gray-950 font-semibold text-sm hover:bg-green-400 active:scale-95 transition-all"
        >
          <Plus size={16} />
          New Alert
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="mb-6 rounded-2xl border border-gray-700 bg-gray-900 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-white">Create Alert</h3>
            <button onClick={() => setShowForm(false)}><X size={16} className="text-gray-500 hover:text-white" /></button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Symbol */}
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Symbol</label>
              <select
                value={fSymbol}
                onChange={(e) => setFSymbol(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-green-500 transition-colors"
              >
                {SYMBOLS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Condition</label>
              <select
                value={fCondition}
                onChange={(e) => setFCondition(e.target.value as AlertCondition)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-green-500 transition-colors"
              >
                <option value="ABOVE">Price goes above</option>
                <option value="BELOW">Price goes below</option>
                <option value="PERCENT_UP">% moves up by</option>
                <option value="PERCENT_DOWN">% moves down by</option>
              </select>
            </div>

            {/* Value */}
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">
                {fCondition.includes('PERCENT') ? 'Percentage (%)' : 'Target Price ($)'}
              </label>
              <input
                type="number"
                value={fValue}
                onChange={(e) => setFValue(e.target.value)}
                placeholder={fCondition.includes('PERCENT') ? 'e.g. 5' : 'e.g. 220'}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-green-500 transition-colors"
              />
            </div>

            {/* Note */}
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Note (optional)</label>
              <input
                type="text"
                value={fNote}
                onChange={(e) => setFNote(e.target.value)}
                placeholder="e.g. Breakout level"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-green-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl border border-gray-700 text-sm text-gray-400 hover:text-white hover:border-gray-600 transition-all">
              Cancel
            </button>
            <button
              onClick={createAlert}
              disabled={!fValue}
              className="px-5 py-2 rounded-xl bg-green-500 text-gray-950 font-semibold text-sm hover:bg-green-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Create Alert
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-900 rounded-xl mb-6 w-fit">
        {([['active', 'Active', activeAlerts.length], ['triggered', 'Triggered', triggeredAlerts.length]] as const).map(([key, label, count]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              tab === key ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300'
            )}
          >
            {label}
            <span className={cn(
              'text-xs px-1.5 py-0.5 rounded-md font-semibold',
              tab === key
                ? key === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                : 'bg-gray-700 text-gray-500'
            )}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Alerts list */}
      {displayed.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Bell size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No {tab} alerts</p>
          {tab === 'active' && (
            <button onClick={() => setShowForm(true)} className="mt-3 text-green-400 text-sm hover:text-green-300">
              + Create your first alert
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((alert) => {
            const cfg = conditionConfig[alert.condition];
            const Icon = cfg.icon;
            const isTriggered = alert.status === 'TRIGGERED';
            const progress = progressToTarget(alert.currentPrice, alert.value, alert.condition);

            return (
              <div
                key={alert.id}
                className={cn(
                  'rounded-2xl border p-4 transition-all',
                  isTriggered
                    ? 'border-orange-500/20 bg-orange-500/5'
                    : 'border-gray-800 bg-gray-900/50 hover:border-gray-700 hover:bg-gray-900'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Status icon */}
                    <div className={cn(
                      'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5',
                      isTriggered ? 'bg-orange-500/10' : 'bg-yellow-500/10'
                    )}>
                      {isTriggered
                        ? <Check size={16} className="text-orange-400" />
                        : <Zap size={16} className="text-yellow-400" />
                      }
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-base font-bold text-white font-mono">{alert.symbol}</span>
                        <span className={cn('flex items-center gap-1 text-xs font-medium', cfg.color)}>
                          <Icon size={11} />
                          {cfg.label} {alert.condition.includes('PERCENT') ? `${alert.value}%` : `$${alert.value.toLocaleString()}`}
                        </span>
                        {isTriggered && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-medium">
                            Triggered
                          </span>
                        )}
                      </div>

                      {alert.note && (
                        <p className="text-xs text-gray-500 mb-2">📝 {alert.note}</p>
                      )}

                      {/* Progress bar (only for active, price-based) */}
                      {!isTriggered && !alert.condition.includes('PERCENT') && alert.currentPrice > 0 && (
                        <div className="mb-2">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Current: ${alert.currentPrice.toLocaleString()}</span>
                            <span>Target: ${alert.value.toLocaleString()}</span>
                          </div>
                          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          Created {timeAgo(alert.createdAt)}
                        </span>
                        {alert.triggeredAt && (
                          <span className="text-orange-400">
                            Triggered {timeAgo(alert.triggeredAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
