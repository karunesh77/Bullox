import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import {
  User, Mail, Shield, Bell, Palette, Key,
  LogOut, ChevronRight, Check, Camera, Crown,
  TrendingUp, BookMarked, Zap, Copy
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'profile' | 'notifications' | 'security' | 'appearance';

const TABS: { key: Tab; label: string; icon: typeof User }[] = [
  { key: 'profile',       label: 'Profile',       icon: User },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'security',      label: 'Security',      icon: Shield },
  { key: 'appearance',    label: 'Appearance',    icon: Palette },
];

const STATS = [
  { label: 'Watchlists',    value: '2',   icon: BookMarked, color: 'text-blue-400',   bg: 'bg-blue-500/10' },
  { label: 'Active Alerts', value: '4',   icon: Zap,        color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { label: 'Following',     value: '2',   icon: Copy,       color: 'text-pink-400',   bg: 'bg-pink-500/10' },
  { label: 'P&L (Mock)',    value: '+18%',icon: TrendingUp, color: 'text-green-400',  bg: 'bg-green-500/10' },
];

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={cn(
        'relative w-10 h-5.5 rounded-full transition-colors duration-200 flex-shrink-0',
        value ? 'bg-green-500' : 'bg-gray-700'
      )}
      style={{ height: '22px' }}
    >
      <span className={cn(
        'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200',
        value ? 'translate-x-5' : 'translate-x-0.5'
      )} />
    </button>
  );
}

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const [tab, setTab] = useState<Tab>('profile');
  const [saved, setSaved] = useState(false);

  // Profile form
  const [name, setName]         = useState(user?.username ?? 'devuser');
  const [email, setEmail]       = useState(user?.email ?? 'dev@bullox.in');
  const [bio, setBio]           = useState('Trader & investor. Focused on US tech & Indian equities.');

  // Notification settings
  const [notifs, setNotifs] = useState({
    priceAlerts:   true,
    newsDigest:    true,
    copyTrades:    false,
    weeklyReport:  true,
    emailAlerts:   true,
    pushAlerts:    false,
  });

  // Appearance
  const [theme, setTheme] = useState<'dark' | 'darker'>('dark');

  const saveProfile = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const roleColor = user?.role === 'PRO' ? 'text-green-400' : user?.role === 'EXPERT' ? 'text-purple-400' : 'text-gray-400';
  const roleBg    = user?.role === 'PRO' ? 'bg-green-500/10 border-green-500/20' : user?.role === 'EXPERT' ? 'bg-purple-500/10 border-purple-500/20' : 'bg-gray-500/10 border-gray-700';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Account Settings</h1>
        <p className="text-sm text-gray-500">Manage your profile, notifications and security</p>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Left sidebar */}
        <div className="lg:w-56 flex-shrink-0 space-y-1">
          {/* Avatar card */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-4 mb-4 text-center">
            <div className="relative inline-block mb-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400/30 to-emerald-600/30 border border-gray-700 flex items-center justify-center text-2xl font-bold text-white mx-auto">
                {name.charAt(0).toUpperCase()}
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <Camera size={11} />
              </button>
            </div>
            <p className="text-sm font-semibold text-white">{name}</p>
            <p className="text-xs text-gray-500 mb-2">{email}</p>
            <span className={cn('inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border', roleBg, roleColor)}>
              {user?.role === 'PRO' && <Crown size={10} />}
              {user?.role ?? 'FREE'}
            </span>
          </div>

          {/* Stats */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-3 mb-4">
            <div className="grid grid-cols-2 gap-2">
              {STATS.map((s) => (
                <div key={s.label} className={cn('rounded-xl p-2.5 text-center', s.bg)}>
                  <s.icon size={14} className={cn('mx-auto mb-1', s.color)} />
                  <p className={cn('text-sm font-bold', s.color)}>{s.value}</p>
                  <p className="text-[10px] text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Nav tabs */}
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all',
                tab === t.key
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-900 '
              )}
            >
              <span className="flex items-center gap-2.5">
                <t.icon size={15} />
                {t.label}
              </span>
              <ChevronRight size={13} className="text-gray-600" />
            </button>
          ))}

          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all mt-2"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>

        {/* Right content */}
        <div className="flex-1 min-w-0">
          {/* ── Profile Tab ── */}
          {tab === 'profile' && (
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
              <h2 className="text-base font-semibold text-white mb-5">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Username</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-green-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-green-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Bio</label>
                  <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-green-500 transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Plan</label>
                  <div className={cn('flex items-center justify-between px-4 py-3 rounded-xl border', roleBg)}>
                    <span className={cn('flex items-center gap-2 text-sm font-semibold', roleColor)}>
                      <Crown size={14} />
                      {user?.role === 'PRO' ? 'Bullox Pro' : 'Free Plan'}
                    </span>
                    {user?.role !== 'PRO' && (
                      <a href="/subscription" className="text-xs text-green-400 hover:text-green-300 font-medium">
                        Upgrade →
                      </a>
                    )}
                  </div>
                </div>

                <button
                  onClick={saveProfile}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-500 text-gray-950 font-semibold text-sm hover:bg-green-400 active:scale-95 transition-all"
                >
                  {saved ? <><Check size={14} /> Saved!</> : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* ── Notifications Tab ── */}
          {tab === 'notifications' && (
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
              <h2 className="text-base font-semibold text-white mb-5">Notification Preferences</h2>
              <div className="space-y-1">
                {[
                  { key: 'priceAlerts',  label: 'Price Alerts',       desc: 'Notify when your alert conditions trigger' },
                  { key: 'newsDigest',   label: 'AI News Digest',      desc: 'Daily summary of top market news' },
                  { key: 'copyTrades',   label: 'Copy Trade Updates',  desc: 'When traders you follow place new trades' },
                  { key: 'weeklyReport', label: 'Weekly Report',       desc: 'Portfolio & market summary every Monday' },
                ] .map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-4 border-b border-gray-800 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                    <Toggle
                      value={notifs[item.key as keyof typeof notifs]}
                      onChange={(v) => setNotifs(prev => ({ ...prev, [item.key]: v }))}
                    />
                  </div>
                ))}
              </div>

              <h3 className="text-sm font-semibold text-white mt-6 mb-3">Delivery Channels</h3>
              <div className="space-y-1">
                {[
                  { key: 'emailAlerts', label: 'Email Notifications', desc: 'Send alerts to your email' },
                  { key: 'pushAlerts',  label: 'Push Notifications',  desc: 'Browser push notifications' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-4 border-b border-gray-800 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                    <Toggle
                      value={notifs[item.key as keyof typeof notifs]}
                      onChange={(v) => setNotifs(prev => ({ ...prev, [item.key]: v }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Security Tab ── */}
          {tab === 'security' && (
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
              <h2 className="text-base font-semibold text-white mb-5">Security Settings</h2>
              <div className="space-y-4">
                <div className="rounded-xl border border-gray-800 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Key size={16} className="text-gray-400" />
                      <span className="text-sm font-medium text-white">Change Password</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {['Current Password', 'New Password', 'Confirm New Password'].map((label) => (
                      <input
                        key={label}
                        type="password"
                        placeholder={label}
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-green-500 transition-colors"
                      />
                    ))}
                    <button className="px-5 py-2.5 rounded-xl bg-green-500 text-gray-950 font-semibold text-sm hover:bg-green-400 transition-all">
                      Update Password
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-800 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white flex items-center gap-2">
                        <Shield size={15} className="text-blue-400" />
                        Two-Factor Authentication
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">Add an extra layer of security</p>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg border border-gray-700 text-xs text-gray-300 hover:border-gray-600 hover:text-white transition-all">
                      Enable
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                  <p className="text-sm font-medium text-red-400 mb-1">Danger Zone</p>
                  <p className="text-xs text-gray-500 mb-3">Permanently delete your account and all data.</p>
                  <button className="px-3 py-1.5 rounded-lg border border-red-500/30 text-xs text-red-400 hover:bg-red-500/10 transition-all">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Appearance Tab ── */}
          {tab === 'appearance' && (
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
              <h2 className="text-base font-semibold text-white mb-5">Appearance</h2>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-3 block">Theme</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'dark',   label: 'Dark',        bg: 'bg-gray-900',  border: '#1f2937' },
                    { key: 'darker', label: 'Pure Black',  bg: 'bg-black',     border: '#000' },
                  ].map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setTheme(t.key as 'dark' | 'darker')}
                      className={cn(
                        'relative rounded-xl border-2 p-4 transition-all',
                        theme === t.key ? 'border-green-500' : 'border-gray-700 hover:border-gray-600'
                      )}
                    >
                      <div className={cn('h-16 rounded-lg mb-3 border border-gray-700', t.bg)} />
                      <p className="text-sm font-medium text-white">{t.label}</p>
                      {theme === t.key && (
                        <div className="absolute top-3 right-3 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <Check size={11} className="text-gray-950" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-6">
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-3 block">Accent Color</label>
                  <div className="flex gap-3">
                    {['#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444'].map((color) => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded-full border-2 border-transparent hover:border-white transition-all"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Coming soon — full theme customization</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
