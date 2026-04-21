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
  HIGH:   { color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30',    dot: 'bg-red-400',    label: 'High' },
  MEDIUM: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', dot: 'bg-yellow-400', label: 'Medium' },
  LOW:    { color: 'text-gray-400',   bg: 'bg-gray-500/10',   border: 'border-gray-700',      dot: 'bg-gray-500',   label: 'Low' },
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
      'rounded-xl border transition-all',
      expanded ? 'border-gray-700 bg-gray-900' : 'border-gray-800 bg-gray-900/40 hover:bg-gray-900/70',
      isNear && !isPast && 'border-yellow-500/30'
    )}>
      <button className="w-full text-left px-4 py-3.5 flex items-center gap-3" onClick={onToggle}>
        {/* Impact dot */}
        <div className={cn('w-2.5 h-2.5 rounded-full flex-shrink-0', cfg.dot)} />

        {/* Flag + country */}
        <span className="text-lg flex-shrink-0">{event.countryFlag}</span>

        {/* Time */}
        <div className="flex-shrink-0 text-right w-20">
          <p className="text-xs font-medium text-white">{formatEventTime(event.date)}</p>
          {!isPast ? (
            <p className="text-[10px] text-yellow-400 flex items-center gap-0.5">
              <Clock size={8} /> <Countdown iso={event.date} />
            </p>
          ) : (
            <p className="text-[10px] text-gray-600">Released</p>
          )}
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <p className={cn('text-sm font-medium truncate', isPast ? 'text-gray-400' : 'text-white')}>
            {event.title}
          </p>
          <p className="text-xs text-gray-500">{event.category}</p>
        </div>

        {/* Impact badge */}
        <span className={cn('hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border flex-shrink-0', cfg.bg, cfg.border, cfg.color)}>
          {event.impact === 'HIGH' && <Flame size={10} />}
          {cfg.label}
        </span>

        {/* Actual result */}
        {event.actual ? (
          <span className="text-sm font-semibold text-green-400 flex-shrink-0 w-16 text-right">{event.actual}</span>
        ) : (
          <span className="text-xs text-gray-600 flex-shrink-0 w-16 text-right">Pending</span>
        )}

        {expanded ? <ChevronUp size={14} className="text-gray-500 flex-shrink-0" /> : <ChevronDown size={14} className="text-gray-500 flex-shrink-0" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 grid grid-cols-3 gap-3 border-t border-gray-800 pt-3">
          {[
            { label: 'Forecast', value: event.forecast ?? '—', color: 'text-blue-400' },
            { label: 'Previous', value: event.previous ?? '—', color: 'text-gray-300' },
            { label: 'Actual',   value: event.actual ?? '—',   color: event.actual ? 'text-green-400' : 'text-gray-500' },
          ].map((s) => (
            <div key={s.label} className="rounded-lg bg-gray-800/50 p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">{s.label}</p>
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
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Calendar size={18} className="text-orange-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Economic Calendar</h1>
            <p className="text-sm text-gray-500">Global macro events · Impact rated</p>
          </div>
        </div>

        {upcomingHigh > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20">
            <Flame size={14} className="text-red-400" />
            <span className="text-sm text-red-400 font-medium">{upcomingHigh} high-impact events today</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        <Globe size={14} className="text-gray-500" />
        <span className="text-xs text-gray-500 uppercase tracking-wider mr-1">Impact</span>
        {IMPACT_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setImpactFilter(f.value)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              impactFilter === f.value
                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800 border border-transparent'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Column headers */}
      <div className="hidden sm:grid grid-cols-[20px_32px_80px_1fr_80px_60px_24px] gap-3 px-4 mb-2 text-xs text-gray-600 uppercase tracking-wider">
        <span></span><span></span><span>Time</span><span>Event</span><span>Impact</span><span className="text-right">Actual</span><span></span>
      </div>

      {/* Groups */}
      <div className="space-y-8">
        {groups.map((group) => (
          <div key={group.label}>
            <div className="flex items-center gap-3 mb-3">
              <span className={cn(
                'text-sm font-semibold px-2 py-0.5 rounded-md',
                group.label === 'Today' ? 'bg-green-500/10 text-green-400' : 'text-gray-400'
              )}>
                {group.label}
              </span>
              <div className="flex-1 h-px bg-gray-800" />
              <span className="text-xs text-gray-600">{group.events.length} events</span>
            </div>
            <div className="space-y-2">
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
  );
}
