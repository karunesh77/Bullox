import { Menu, Search, Bell } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

interface TopbarProps {
  onMenuClick: () => void;
  title?: string;
}

export default function Topbar({ onMenuClick, title }: TopbarProps) {
  const user = useAuthStore((s) => s.user);
  const isPro = user?.role === 'PRO' || user?.role === 'ADMIN';

  return (
    <header className="h-14 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm flex items-center px-4 gap-4 sticky top-0 z-10">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden text-gray-400 hover:text-white transition-colors"
      >
        <Menu size={22} />
      </button>

      {/* Page title */}
      {title && (
        <h1 className="text-sm font-semibold text-white hidden sm:block">{title}</h1>
      )}

      {/* Search */}
      <div className="flex-1 max-w-sm hidden md:flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5">
        <Search size={14} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search symbols, news..."
          className="bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none w-full"
        />
      </div>

      <div className="flex-1" />

      {/* PRO badge */}
      {isPro && (
        <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
          PRO
        </span>
      )}

      {/* Notifications */}
      <button className="relative text-gray-400 hover:text-white transition-colors">
        <Bell size={20} />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-400" />
      </button>

      {/* Avatar */}
      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold uppercase',
        'bg-green-500/20 border border-green-500/30 text-green-400'
      )}>
        {user?.username?.[0] ?? 'U'}
      </div>
    </header>
  );
}
