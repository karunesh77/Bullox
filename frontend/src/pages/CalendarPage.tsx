import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, Flame, ChevronDown, ChevronUp, Globe } from 'lucide-react';
import api from '@/api/axios';
import { cn } from '@/lib/utils';

interface CalendarEvent {
  id: string;
  title: string;
  country: string;
  countryFlag: string;
  date: string; // ISO
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  forecast?: string;
  previous?: string;
  actual?: string;
  unit?: string;
  category: string;
}

const MOCK_EVENTS: CalendarEvent[] = [
  { id: '1',  title: 'US Non-Farm Payrolls',        country: 'US', countryFlag: '🇺🇸', date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),   impact: 'HIGH',   forecast: '185K',  previous: '175K',  actual: undefined,  unit: 'K',   category: 'Employment' },
  { id: '2',  title: 'US CPI (MoM)',                country: 'US', countryFlag: '🇺🇸', date: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),   impact: 'HIGH',   forecast: '0.3%',  previous: '0.4%',  actual: undefined,  unit: '%',   category: 'Inflation' },
  { id: '3',  title: 'ECB Interest Rate Decision',  country: 'EU', countryFlag: '🇪🇺', date: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),   impact: 'HIGH',   forecast: '3.50%', previous: '3.75%', actual: undefined,  unit: '%',   category: 'Central Bank' },
  { id: '4',  title: 'UK GDP (QoQ)',                country: 'UK', countryFlag: '🇬🇧', date: new Date(Date.now() + 11 * 60 * 60 * 1000).toISOString(),  impact: 'MEDIUM', forecast: '0.2%',  previous: '0.1%',  actual: undefined,  unit: '%',   category: 'GDP' },
  { id: '5',  title: 'US Initial Jobless Claims',   country: 'US', countryFlag: '🇺🇸', date: new Date(Date.now() + 14 * 60 * 60 * 1000).toISOString(),  impact: 'MEDIUM', forecast: '210K',  previous: '215K',  actual: undefined,  unit: 'K',   category: 'Employment' },
  { id: '6',  title: 'RBI Repo Rate Decision',      country: 'IN', countryFlag: '🇮🇳', date: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),  impact: 'HIGH',   forecast: '6.25%', previous: '6.50%', actual: undefined,  unit: '%',   category: 'Central Bank' },
  { id: '7',  title: 'Japan Core CPI (YoY)',        country: 'JP', countryFlag: '🇯🇵', date: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),  impact: 'MEDIUM', forecast: '2.1%',  previous: '2.3%',  actual: undefined,  unit: '%',   category: 'Inflation' },
  { id: '8',  title: 'US FOMC Meeting Minutes',     country: 'US', countryFlag: '🇺🇸', date: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),  impact: 'HIGH',   forecast: undefined, previous: undefined, actual: undefined, unit: undefined, category: 'Central Bank' },
  { id: '9',  title: 'Germany Manufacturing PMI',   country: 'DE', countryFlag: '🇩🇪', date: new Date(Date.now() + 30 * 60 * 60 * 1000).toISOString(),  impact: 'MEDIUM', forecast: '48.2',  previous: '47.8',  actual: undefined,  unit: '',    category: 'PMI' },
  { id: '10', title: 'China Trade Balance',         country: 'CN', countryFlag: '🇨🇳', date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),   impact: 'HIGH',   forecast: '$72B',  previous: '$68B',  actual: '$74.3B',   unit: 'B',   category: 'Trade' },
  { id: '11', title: 'US Retail Sales (MoM)',       country: 'US', countryFlag: '🇺🇸', date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),   impact: 'MEDIUM', forecast: '0.4%',  previous: '0.6%',  actual: '0.5%',     unit: '%',   category: 'Retail' },
  { id: '12', title: 'India WPI Inflation',         country: 'IN', countryFlag: '🇮🇳', date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),   impact: 'LOW',    forecast: '2.1%',  previous: '2.4%',  actual: '1.9%',     unit: '%',   category: 'Inflation' },
];

const impactConfig = {
  HIGH:   { color: 'text-red-700',    bg: 'bg-red-100',    border: 'border-red-300',    dot: 'bg-red-500',    label: 'High' },
  MEDIUM: { color: 'text-amber-700', bg: 'bg-amber-100', border: 'border-amber-300', dot: 'bg-amber-500', label: 'Medium' },
  LOW:    { color: 'text-gray-700',   bg: 'bg-gray-100',   border: 'border-gray-300',      dot: 'bg-gray-500',   label: 'Low' },
};

const IMPACT_FILTERS = [
  { label: 'All', value: '' },
  { label: '🔴 High', value: 'HIGH' },
  { label: '🟡 Medium', value: 'MEDIUM' },
  { label: '⚪ Low', value: 'LOW' },
];

function formatEventTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function formatEventDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

function Countdown({ iso }: { iso: string }) {
  const [remaining, setRemaining] = useState('');

  useEffect(() => {
    const calc = () => {
      const diff = new Date(iso).getTime() - Date.now();
      if (diff <= 0) { setRemaining('Released'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      if (h > 0) setRemaining(`${h}h ${m}m`);
      else if (m > 0) setRemaining(`${m}m ${s}s`);
      else setRemaining(`${s}s`);
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [iso]);

  return <span>{remaining}</span>;
}

function EventRow({ event, expanded, onToggle }: { event: CalendarEvent; expanded: boolean; onToggle: () => void }) {
  const cfg = impactConfig[event.impact];
  const isPast = new Date(event.date) < new Date();
  const isNear = !isPast && new Date(event.date).getTime() - Date.now() < 2 * 60 * 60 * 1000;

  return (
    <div className={cn(
      'rounded-2xl border transition-all',
      expanded ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50' : 'border-gray-200 bg-white hover:shadow-md',
      isNear && !isPast && 'border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50'
    )}>
      <button className="w-full text-left px-5 py-4 flex items-center gap-3" onClick={onToggle}>
        {/* Impact dot */}
        <div className={cn('w-3 h-3 rounded-full flex-shrink-0', cfg.dot)} />

        {/* Flag + country */}
        <span className="text-xl flex-shrink-0">{event.countryFlag}</span>

        {/* Time */}
        <div className="flex-shrink-0 text-right w-20">
          <p className="text-xs font-bold text-gray-900">{formatEventTime(event.date)}</p>
          {!isPast ? (
            <p className="text-[10px] text-amber-600 font-semibold flex items-center justify-end gap-0.5">
              <Clock size={8} /> <Countdown iso={event.date} />
            </p>
          ) : (
            <p className="text-[10px] text-gray-600">Released</p>
          )}
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <p className={cn('text-sm font-bold truncate', isPast ? 'text-gray-500' : 'text-gray-900')}>
            {event.title}
          </p>
          <p className="text-xs text-gray-600">{event.category}</p>
        </div>

        {/* Impact badge */}
        <span className={cn('hidden sm:flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold border flex-shrink-0', cfg.bg, cfg.border, cfg.color)}>
          {event.impact === 'HIGH' && <Flame size={11} />}
          {cfg.label}
        </span>

        {/* Actual result */}
        {event.actual ? (
          <span className="text-sm font-bold text-green-700 flex-shrink-0 w-16 text-right">{event.actual}</span>
        ) : (
          <span className="text-xs text-gray-500 flex-shrink-0 w-16 text-right">Pending</span>
        )}

        {expanded ? <ChevronUp size={16} className="text-gray-600 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-600 flex-shrink-0" />}
      </button>

      {expanded && (
        <div className="px-5 pb-5 grid grid-cols-3 gap-3 border-t border-gray-200 pt-4">
          {[
            { label: 'Forecast', value: event.forecast ?? '—', color: 'text-blue-700' },
            { label: 'Previous', value: event.previous ?? '—', color: 'text-gray-700' },
            { label: 'Actual',   value: event.actual ?? '—',   color: event.actual ? 'text-green-700' : 'text-gray-600' },
          ].map((s) => (
            <div key={s.label} className="rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 p-3 text-center border border-gray-200">
              <p className="text-xs text-gray-600 font-semibold mb-1">{s.label}</p>
              <p className={cn('text-base font-bold', s.color)}>{s.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CalendarPage() {
  const [impactFilter, setImpactFilter] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data } = useQuery({
    queryKey: ['calendar'],
    queryFn: async () => {
      try {
        const res = await api.get('/calendar');
        return (res.data?.events || res.data || []) as CalendarEvent[];
      } catch {
        return MOCK_EVENTS;
      }
    },
    refetchInterval: 5 * 60 * 1000,
  });

  const events = data || MOCK_EVENTS;

  const filtered = events.filter((e) => !impactFilter || e.impact === impactFilter);

  // Group by date label
  const today = new Date().toDateString();
  const tomorrow = new Date(Date.now() + 86400000).toDateString();

  const groups: { label: string; events: CalendarEvent[] }[] = [];
  const groupMap: Record<string, CalendarEvent[]> = {};

  filtered.forEach((e) => {
    const d = new Date(e.date).toDateString();
    const label = d === today ? 'Today' : d === tomorrow ? 'Tomorrow' : formatEventDate(e.date);
    if (!groupMap[label]) groupMap[label] = [];
    groupMap[label].push(e);
  });

  const labelOrder = ['Today', 'Tomorrow'];
  Object.keys(groupMap).forEach((k) => {
    if (!labelOrder.includes(k)) labelOrder.push(k);
  });
  labelOrder.forEach((label) => {
    if (groupMap[label]) groups.push({ label, events: groupMap[label] });
  });

  const upcomingHigh = events.filter(e => e.impact === 'HIGH' && new Date(e.date) > new Date()).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-orange-50 to-red-50 p-6">
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-100 to-red-100">
            <Calendar size={24} className="text-orange-700" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Economic Calendar</h1>
            <p className="text-sm text-gray-600">Global macro events · Impact rated</p>
          </div>
        </div>

        {upcomingHigh > 0 && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-red-100 to-orange-100 border border-red-300 shadow-sm">
            <Flame size={16} className="text-red-600" />
            <span className="text-sm text-red-700 font-bold">{upcomingHigh} high-impact events today</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-300">
        <Globe size={16} className="text-gray-600" />
        <span className="text-xs text-gray-600 uppercase tracking-wider font-bold">Impact</span>
        {IMPACT_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setImpactFilter(f.value)}
            className={cn(
              'px-4 py-2 rounded-lg text-xs font-bold transition-all',
              impactFilter === f.value
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Column headers */}
      <div className="hidden sm:grid grid-cols-[20px_32px_80px_1fr_80px_60px_24px] gap-3 px-5 mb-3 text-xs text-gray-700 uppercase tracking-wider font-bold">
        <span></span><span></span><span>Time</span><span>Event</span><span>Impact</span><span className="text-right">Actual</span><span></span>
      </div>

      {/* Groups */}
      <div className="space-y-8">
        {groups.map((group) => (
          <div key={group.label}>
            <div className="flex items-center gap-3 mb-4">
              <span className={cn(
                'text-sm font-bold px-3 py-1 rounded-lg',
                group.label === 'Today' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800' : 'bg-gray-100 text-gray-700'
              )}>
                {group.label}
              </span>
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-xs text-gray-700 font-semibold">{group.events.length} events</span>
            </div>
            <div className="space-y-3">
              {group.events.map((event) => (
                <EventRow
                  key={event.id}
                  event={event}
                  expanded={expandedId === event.id}
                  onToggle={() => setExpandedId(expandedId === event.id ? null : event.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
