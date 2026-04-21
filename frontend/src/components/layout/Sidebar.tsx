import { NavLink, useNavigate } from 'react-router-dom';
import {
  TrendingUp, LayoutDashboard, Bell, BookMarked,
  Newspaper, Calendar, Users, CreditCard, User, LogOut, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/api/auth';

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/market', icon: TrendingUp, label: 'Market' },
  { to: '/news', icon: Newspaper, label: 'News' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/watchlist', icon: BookMarked, label: 'Watchlist' },
  { to: '/alerts', icon: Bell, label: 'Alerts' },
  { to: '/copy-trading', icon: Users, label: 'Copy Trading' },
];

const BOTTOM_NAV = [
  { to: '/subscription', icon: CreditCard, label: 'Upgrade' },
  { to: '/profile', icon: User, label: 'Profile' },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        'fixed top-0 left-0 z-30 h-full w-64 bg-gray-900 border-r border-gray-800',
        'flex flex-col transition-transform duration-300',
        'lg:translate-x-0 lg:static lg:z-auto',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <TrendingUp size={22} className="text-green-400" />
            <span className="text-lg font-bold text-white">Bullox</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Main nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              onClick={onClose}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              )}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom nav */}
        <div className="px-3 pb-3 flex flex-col gap-1 border-t border-gray-800 pt-3">
          {BOTTOM_NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                to === '/subscription'
                  ? 'text-yellow-400 hover:bg-yellow-500/10'
                  : isActive
                  ? 'bg-green-500/10 text-green-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              )}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}

          {/* User + logout */}
          <div className="mt-2 flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-800/50 border border-gray-700">
            <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 text-xs font-bold uppercase flex-shrink-0">
              {user?.username?.[0] ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.username ?? 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.role}</p>
            </div>
            <button onClick={handleLogout} className="text-gray-500 hover:text-red-400 transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
