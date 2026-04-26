import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Topbar from './Topbar';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, BarChart3, BookMarked, Newspaper,
  Calendar, Bell, Users, Settings, ChevronRight, Menu, X, TrendingUp
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard',    path: '/',             icon: LayoutDashboard },
  { label: 'Portfolio',    path: '/portfolio',    icon: BarChart3 },
  { label: 'Watchlist',   path: '/watchlist',    icon: BookMarked },
  { label: 'Signals',     path: '/signals',      icon: TrendingUp },
  { label: 'Market',      path: '/market',       icon: TrendingUp },
  { label: 'News',        path: '/news',         icon: Newspaper },
  { label: 'Alerts',      path: '/alerts',       icon: Bell },
  { label: 'Calendar',    path: '/calendar',     icon: Calendar },
  { label: 'Copy Trading',path: '/copy-trading', icon: Users },
  { label: 'Settings',    path: '/settings',     icon: Settings },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const SidebarContent = () => (
    <>
      {/* Nav */}
      <nav className="flex-1 flex flex-col p-3 gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all group',
              isActive
                ? 'text-white'
                : 'hover:text-white'
            )}
            style={({ isActive }) => isActive
              ? { backgroundColor: '#3B82F6', color: '#fff' }
              : { color: '#9CA3AF' }
            }
          >
            <Icon size={18} />
            <span className="flex-1">{label}</span>
            {/* subtle arrow on hover */}
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-50 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* Upgrade Card */}
      <div className="p-3 border-t" style={{ borderColor: '#1F2937' }}>
        <div
          className="rounded-xl p-4 mb-3"
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(59,130,246,0.05) 100%)', border: '1px solid rgba(59,130,246,0.25)' }}
        >
          <p className="text-sm font-bold mb-1" style={{ color: '#E5E7EB' }}>Upgrade to Pro</p>
          <p className="text-xs mb-3" style={{ color: '#9CA3AF' }}>Advanced tools & expert signals</p>
          <button
            className="w-full py-2 rounded-lg text-xs font-bold text-white transition-all"
            style={{ backgroundColor: '#3B82F6' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#2563EB')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#3B82F6')}
          >
            Upgrade Now
          </button>
        </div>

        {/* User profile */}
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl cursor-pointer hover:bg-opacity-50 transition-all"
          style={{ backgroundColor: 'rgba(31,41,55,0.6)' }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ backgroundColor: '#3B82F6' }}
          >
            J
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: '#E5E7EB' }}>John Doe</p>
            <p className="text-xs truncate" style={{ color: '#F59E0B' }}>Pro Trader</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ backgroundColor: '#0B0F19' }}
    >
      {/* ── Topbar ─────────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b sticky top-0 z-20"
        style={{ backgroundColor: '#111827', borderColor: '#1F2937' }}
      >
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-2.5">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-1.5 rounded-lg transition-all"
            style={{ backgroundColor: 'rgba(59,130,246,0.15)', color: '#3B82F6' }}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <img
            src="/bullox-logo.svg"
            alt="Bullox"
            className="w-8 h-8"
          />
          <span className="text-lg font-bold" style={{ color: '#E5E7EB' }}>Bullox</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <Topbar />
        </div>
      </div>

      {/* ── Body ───────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar (Desktop) ─────────────────────── */}
        <aside
          className="hidden md:flex w-60 flex-col border-r overflow-hidden"
          style={{ backgroundColor: '#111827', borderColor: '#1F2937' }}
        >
          <SidebarContent />
        </aside>

        {/* ── Sidebar (Mobile Overlay) ─────────────── */}
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10 md:hidden"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
              onClick={() => setSidebarOpen(false)}
            />

            {/* Mobile Sidebar */}
            <aside
              className="fixed left-0 top-16 h-[calc(100vh-64px)] w-60 flex flex-col border-r z-30 md:hidden overflow-hidden"
              style={{ backgroundColor: '#111827', borderColor: '#1F2937' }}
            >
              <SidebarContent />
            </aside>
          </>
        )}

        {/* ── Main Content ────────────────────── */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ backgroundColor: '#0B0F19' }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
