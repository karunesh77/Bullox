import { useState, useEffect } from 'react';
import { Calendar, Clock, Flame, ChevronDown, Globe } from 'lucide-react';

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

interface CalendarEvent {
  id: string;
  title: string;
  country: string;
  countryFlag: string;
  date: string;
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
  { id: '10', title: 'China Trade Balance',         country: 'CN', countryFlag: '🇨🇳', date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),   impact: 'HIGH',   forecast: '$72B',  previous: '$68B',  actual: '$74.3B',   unit: 'B',   category: 'Trade' },
  { id: '11', title: 'US Retail Sales (MoM)',       country: 'US', countryFlag: '🇺🇸', date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),   impact: 'MEDIUM', forecast: '0.4%',  previous: '0.6%',  actual: '0.5%',     unit: '%',   category: 'Retail' },
];

const impactConfig = {
  HIGH: { color: RED, label: 'High', bgColor: 'rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.3)' },
  MEDIUM: { color: YELLOW, label: 'Medium', bgColor: 'rgba(245,158,11,0.15)', borderColor: 'rgba(245,158,11,0.3)' },
  LOW: { color: TEXT3, label: 'Low', bgColor: 'rgba(107,114,128,0.15)', borderColor: 'rgba(107,114,128,0.3)' },
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

  return (
    <div
      style={{ backgroundColor: expanded ? ELEVATED : CARD, borderColor: BORDER }}
      className="border rounded-2xl transition-all cursor-pointer"
      onClick={onToggle}
    >
      <div className="px-4 py-3 flex items-center gap-3">
        {/* Impact dot */}
        <div
          style={{ backgroundColor: cfg.color }}
          className="w-3 h-3 rounded-full flex-shrink-0"
        />

        {/* Flag */}
        <span className="text-lg flex-shrink-0">{event.countryFlag}</span>

        {/* Time */}
        <div className="flex-shrink-0 text-right w-24">
          <p style={{ color: TEXT1 }} className="text-xs font-bold">{formatEventTime(event.date)}</p>
          {!isPast ? (
            <p style={{ color: YELLOW }} className="text-[10px] font-semibold flex items-center justify-end gap-0.5 mt-0.5">
              <Clock size={8} /> <Countdown iso={event.date} />
            </p>
          ) : (
            <p style={{ color: TEXT3 }} className="text-[10px]">Released</p>
          )}
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <p style={{ color: isPast ? TEXT3 : TEXT1 }} className="text-sm font-bold truncate">
            {event.title}
          </p>
          <p style={{ color: TEXT3 }} className="text-xs">{event.category}</p>
        </div>

        {/* Impact badge */}
        <span
          style={{ backgroundColor: cfg.bgColor, color: cfg.color, border: `1px solid ${cfg.borderColor}` }}
          className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold flex-shrink-0"
        >
          {event.impact === 'HIGH' && <Flame size={10} />}
          {cfg.label}
        </span>

        {/* Actual result */}
        {event.actual ? (
          <span style={{ color: GREEN }} className="text-sm font-bold flex-shrink-0 w-16 text-right text-xs">{event.actual}</span>
        ) : (
          <span style={{ color: TEXT3 }} className="text-xs flex-shrink-0 w-16 text-right">Pending</span>
        )}

        <ChevronDown size={16} style={{ color: TEXT2, transform: expanded ? 'rotate(180deg)' : 'rotate(0)' }} className="flex-shrink-0 transition-transform" />
      </div>

      {expanded && (
        <div style={{ backgroundColor: ELEVATED, borderColor: BORDER }} className="border-t px-4 py-4 grid grid-cols-3 gap-3">
          {[
            { label: 'Forecast', value: event.forecast ?? '—', color: BLUE },
            { label: 'Previous', value: event.previous ?? '—', color: TEXT1 },
            { label: 'Actual', value: event.actual ?? '—', color: event.actual ? GREEN : TEXT3 },
          ].map(s => (
            <div key={s.label} style={{ backgroundColor: CARD }} className="rounded-xl p-3 text-center">
              <p style={{ color: TEXT3 }} className="text-xs font-semibold mb-1">{s.label}</p>
              <p style={{ color: s.color }} className="text-sm font-bold">{s.value}</p>
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
  const events = MOCK_EVENTS;
  const filtered = events.filter(e => !impactFilter || e.impact === impactFilter);

  const today = new Date().toDateString();
  const tomorrow = new Date(Date.now() + 86400000).toDateString();

  const groups: { label: string; events: CalendarEvent[] }[] = [];
  const groupMap: Record<string, CalendarEvent[]> = {};

  filtered.forEach(e => {
    const d = new Date(e.date).toDateString();
    const label = d === today ? 'Today' : d === tomorrow ? 'Tomorrow' : formatEventDate(e.date);
    if (!groupMap[label]) groupMap[label] = [];
    groupMap[label].push(e);
  });

  const labelOrder = ['Today', 'Tomorrow'];
  Object.keys(groupMap).forEach(k => {
    if (!labelOrder.includes(k)) labelOrder.push(k);
  });
  labelOrder.forEach(label => {
    if (groupMap[label]) groups.push({ label, events: groupMap[label] });
  });

  const upcomingHigh = events.filter(e => e.impact === 'HIGH' && new Date(e.date) > new Date()).length;

  return (
    <div style={{ backgroundColor: BG }} className="min-h-screen p-4">
      <div className="max-w-5xl mx-auto">

        {/* ── Header ─────────────────────────── */}
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div style={{ backgroundColor: YELLOW }} className="p-2.5 rounded-xl">
              <Calendar size={20} style={{ color: '#000' }} />
            </div>
            <div>
              <h1 style={{ color: TEXT1 }} className="text-2xl font-bold">Economic Calendar</h1>
              <p style={{ color: TEXT2 }} className="text-sm">Global macro events · Impact rated</p>
            </div>
          </div>

          {upcomingHigh > 0 && (
            <div style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: RED, border: '1px solid rgba(239,68,68,0.3)' }} className="flex items-center gap-2 px-4 py-3 rounded-xl">
              <Flame size={16} />
              <span className="text-sm font-bold">{upcomingHigh} high-impact event{upcomingHigh > 1 ? 's' : ''} upcoming</span>
            </div>
          )}
        </div>

        {/* ── Filters ─────────────────────────── */}
        <div style={{ borderColor: BORDER }} className="flex items-center gap-3 mb-6 pb-4 border-b">
          <Globe size={16} style={{ color: TEXT3 }} />
          <span style={{ color: TEXT3 }} className="text-xs uppercase tracking-wider font-bold">Impact</span>
          {IMPACT_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setImpactFilter(f.value)}
              style={impactFilter === f.value
                ? { backgroundColor: BLUE, color: '#fff' }
                : { backgroundColor: ELEVATED, color: TEXT2, borderColor: BORDER }
              }
              className="px-4 py-2 rounded-lg text-xs font-bold transition-all border"
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ── Events by Date ────────────────────── */}
        <div className="space-y-6">
          {groups.map(group => (
            <div key={group.label}>
              <div className="flex items-center gap-3 mb-3">
                <span
                  style={{
                    backgroundColor: group.label === 'Today' ? 'rgba(34,197,94,0.15)' : ELEVATED,
                    color: group.label === 'Today' ? GREEN : TEXT2,
                  }}
                  className="text-sm font-bold px-3 py-1 rounded-lg"
                >
                  {group.label}
                </span>
                <div style={{ backgroundColor: BORDER }} className="flex-1 h-px" />
                <span style={{ color: TEXT3 }} className="text-xs font-semibold">{group.events.length} events</span>
              </div>
              <div className="space-y-2">
                {group.events.map(event => (
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
