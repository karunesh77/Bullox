import { Outlet, NavLink } from 'react-router-dom';
import Topbar from './Topbar';
import { cn } from '@/lib/utils';
import { TrendingUp, LayoutDashboard, TrendingDown, Newspaper, Calendar, BookMarked, Bell, Users, BarChart3, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Portfolio', path: '/portfolio', icon: BarChart3 },
  { label: 'Watchlist', path: '/watchlist', icon: BookMarked },
  { label: 'Signals', path: '/signals', icon: TrendingUp },
  { label: 'Market', path: '/market', icon: TrendingDown },
  { label: 'News', path: '/news', icon: Newspaper },
  { label: 'Alerts', path: '/alerts', icon: Bell },
  { label: 'Calendar', path: '/calendar', icon: Calendar },
  { label: 'Copy Trading', path: '/copy-trading', icon: Users },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export default function DashboardLayout() {
  return (
    <div className="flex flex-col h-screen bg-dark overflow-hidden">
      {/* Topbar */}
      <div className="border-b border-dark-border bg-dark-secondary sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={24} className="text-primary" />
            <span className="text-xl font-bold text-dark-primary">BullOx</span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <Topbar />
          </div>
        </div>
      </div>

      {/* Main Layout with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-dark-border bg-dark-secondary overflow-hidden flex flex-col">
          <nav className="flex-1 flex flex-col p-4 gap-2 overflow-y-auto">
            {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                className={({ isActive }) => cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all group',
                  isActive
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-dark-secondary hover:text-dark-primary hover:bg-dark-tertiary/50'
                )}
              >
                <Icon size={20} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Upgrade Card */}
          <div className="p-4 border-t border-dark-border">
            <div className="bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 rounded-xl p-4">
              <h3 className="text-sm font-bold text-dark-primary mb-2">Upgrade to Pro</h3>
              <p className="text-xs text-dark-secondary mb-3">Get advanced tools & expert signals</p>
              <button className="w-full px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-all">
                Upgrade Now
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-dark">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
