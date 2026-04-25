import { Search, Bell } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function Topbar() {
  const { user } = useAuthStore();
  const isPro = user?.role === 'PRO' || user?.role === 'ADMIN';

  return (
    <>
      <div className="flex-1 max-w-md mx-6 flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-lg px-3 py-2">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search symbols, news..."
          className="bg-transparent text-sm text-gray-900 placeholder-gray-500 outline-none w-full"
        />
      </div>

      <div className="flex items-center gap-4">
        {isPro && (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-300">
            PRO
          </span>
        )}

        <button className="relative text-gray-600 hover:text-gray-900 transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
        </button>

        <div className="h-8 w-8 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-xs font-bold text-blue-600">
          {user?.username?.[0] ?? 'U'}
        </div>
      </div>
    </>
  );
}
