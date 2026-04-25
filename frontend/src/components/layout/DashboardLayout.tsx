import { Outlet, NavLink } from 'react-router-dom';
import Topbar from './Topbar';
import { cn } from '@/lib/utils';
import { TrendingUp, LayoutDashboard, TrendingDown, Newspaper, Calendar, BookMarked, Bell, Users, BarChart3, Settings, CreditCard } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Market', path: '/market', icon: TrendingDown },
  { label: 'News', path: '/news', icon: Newspaper },
  { label: 'Calendar', path: '/calendar', icon: Calendar },
  { label: 'Watchlist', path: '/watchlist', icon: BookMarked },
  { label: 'Alerts', path: '/alerts', icon: Bell },
  { label: 'Copy Trading', path: '/copy-trading', icon: Users },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Billing', path: '/billing', icon: CreditCard },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export default function DashboardLayout() {
  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* Topbar */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <TrendingUp size={24} className="text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Bullox</span>
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
        <aside className="w-64 border-r border-gray-300 bg-gradient-to-b from-gray-50 via-blue-50 to-purple-50 overflow-hidden flex flex-col">
          <nav className="flex-1 flex flex-col p-5 gap-2.5 overflow-y-auto">
            {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                className={({ isActive }) => cn(
                  'flex items-center gap-3 px-4 py-3.5 rounded-lg text-sm font-semibold transition-all',
                  isActive
                    ? 'bg-white text-gray-900 shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                )}
              >
                <Icon size={20} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50 via-white to-blue-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
