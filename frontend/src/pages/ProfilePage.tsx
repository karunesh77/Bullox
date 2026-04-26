import { useState } from 'react';
import { User, Mail, Shield, Bell, Key, LogOut, ChevronRight, Check, Camera, Crown, TrendingUp, BookMarked, Zap } from 'lucide-react';

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

type Tab = 'profile' | 'notifications' | 'security';

const TABS: { key: Tab; label: string; icon: typeof User }[] = [
  { key: 'profile',       label: 'Profile',       icon: User },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'security',      label: 'Security',      icon: Shield },
];

const STATS = [
  { label: 'Watchlists',    value: '2',   icon: BookMarked, color: BLUE },
  { label: 'Active Alerts', value: '4',   icon: Zap,        color: '#F59E0B' },
  { label: 'Following',     value: '2',   icon: TrendingUp, color: GREEN },
  { label: 'P&L (Mock)',    value: '+18%',icon: TrendingUp, color: GREEN },
];

export default function ProfilePage() {
  const [tab, setTab] = useState<Tab>('profile');
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: 'Trader Name',
    email: 'trader@bullox.in',
    bio: 'Trader & investor. Focused on US tech & Indian equities.',
  });

  const [notifs, setNotifs] = useState({
    priceAlerts: true,
    newsDigest: true,
    copyTrades: false,
    weeklyReport: true,
  });

  const handleToggle = (key: keyof typeof notifs) => {
    setNotifs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const saveProfile = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ backgroundColor: BG }} className="min-h-screen p-4">
      <div className="max-w-5xl mx-auto">

        {/* ── Header ─────────────────────────── */}
        <div className="mb-6">
          <h1 style={{ color: TEXT1 }} className="text-2xl font-bold mb-1">Account Settings</h1>
          <p style={{ color: TEXT2 }} className="text-sm">Manage your profile, notifications and security</p>
        </div>

        <div className="flex gap-6 flex-col lg:flex-row">

          {/* ── Left Sidebar ─────────────────── */}
          <div className="lg:w-56 flex-shrink-0 space-y-3">

            {/* Avatar Card */}
            <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-2xl p-4 text-center">
              <div className="relative inline-block mb-3">
                <div
                  style={{ backgroundColor: ELEVATED, color: TEXT1 }}
                  className="w-16 h-16 rounded-2xl border border-blue-500 flex items-center justify-center text-2xl font-bold mx-auto"
                >
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <button
                  style={{ backgroundColor: CARD, borderColor: BORDER, color: TEXT2 }}
                  className="absolute -bottom-1 -right-1 w-6 h-6 border rounded-full flex items-center justify-center hover:text-white transition-colors"
                >
                  <Camera size={11} />
                </button>
              </div>
              <p style={{ color: TEXT1 }} className="text-sm font-semibold mb-0.5">{profile.name}</p>
              <p style={{ color: TEXT3 }} className="text-xs mb-2">{profile.email}</p>
              <span style={{ backgroundColor: 'rgba(34,197,94,0.15)', color: GREEN, border: '1px solid rgba(34,197,94,0.3)' }} className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full">
                <Crown size={10} />
                Pro
              </span>
            </div>

            {/* Stats */}
            <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-2xl p-4">
              <div className="grid grid-cols-2 gap-2">
                {STATS.map(s => (
                  <div key={s.label} style={{ backgroundColor: ELEVATED }} className="rounded-xl p-3 text-center">
                    <s.icon size={14} style={{ color: s.color }} className="mx-auto mb-1" />
                    <p style={{ color: s.color }} className="text-sm font-bold">{s.value}</p>
                    <p style={{ color: TEXT3 }} className="text-[10px]">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Nav Tabs */}
            <div className="space-y-1">
              {TABS.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  style={{
                    backgroundColor: tab === t.key ? ELEVATED : 'transparent',
                    color: tab === t.key ? TEXT1 : TEXT2,
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all hover:text-white"
                >
                  <span className="flex items-center gap-2.5">
                    <t.icon size={14} />
                    {t.label}
                  </span>
                  <ChevronRight size={12} style={{ color: TEXT3 }} />
                </button>
              ))}
            </div>

            <button
              style={{ color: RED }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm hover:bg-opacity-20 transition-all mt-2"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>

          {/* ── Right Content ────────────────── */}
          <div className="flex-1 min-w-0">

            {/* ── Profile Tab ── */}
            {tab === 'profile' && (
              <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-2xl p-5">
                <h2 style={{ color: TEXT1 }} className="text-lg font-bold mb-5">Profile Information</h2>
                <div className="space-y-4">
                  <div>
                    <label style={{ color: TEXT3 }} className="text-xs font-semibold uppercase block mb-2">Username</label>
                    <div className="relative">
                      <User size={14} style={{ color: TEXT3 }} className="absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        value={profile.name}
                        onChange={e => setProfile({ ...profile, name: e.target.value })}
                        style={{ backgroundColor: ELEVATED, borderColor: BORDER, color: TEXT1 }}
                        className="w-full border rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ color: TEXT3 }} className="text-xs font-semibold uppercase block mb-2">Email</label>
                    <div className="relative">
                      <Mail size={14} style={{ color: TEXT3 }} className="absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        value={profile.email}
                        onChange={e => setProfile({ ...profile, email: e.target.value })}
                        style={{ backgroundColor: ELEVATED, borderColor: BORDER, color: TEXT1 }}
                        className="w-full border rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ color: TEXT3 }} className="text-xs font-semibold uppercase block mb-2">Bio</label>
                    <textarea
                      value={profile.bio}
                      onChange={e => setProfile({ ...profile, bio: e.target.value })}
                      rows={3}
                      style={{ backgroundColor: ELEVATED, borderColor: BORDER, color: TEXT1 }}
                      className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none resize-none"
                    />
                  </div>

                  <div style={{ backgroundColor: ELEVATED, borderColor: BORDER }} className="border rounded-lg px-4 py-3">
                    <div className="flex items-center justify-between">
                      <span style={{ color: GREEN }} className="flex items-center gap-2 text-sm font-semibold">
                        <Crown size={14} />
                        Bullox Pro
                      </span>
                      <a href="/subscription" style={{ color: BLUE }} className="text-xs font-medium hover:opacity-80">
                        Manage →
                      </a>
                    </div>
                  </div>

                  <button
                    onClick={saveProfile}
                    style={{ backgroundColor: BLUE, color: '#fff' }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-all w-full justify-center"
                  >
                    {saved ? <><Check size={14} /> Saved!</> : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* ── Notifications Tab ── */}
            {tab === 'notifications' && (
              <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-2xl p-5">
                <h2 style={{ color: TEXT1 }} className="text-lg font-bold mb-5">Notification Preferences</h2>
                <div className="space-y-3">
                  {[
                    { key: 'priceAlerts' as const,  label: 'Price Alerts',       desc: 'Notify when your alert conditions trigger' },
                    { key: 'newsDigest' as const,   label: 'AI News Digest',      desc: 'Daily summary of top market news' },
                    { key: 'copyTrades' as const,   label: 'Copy Trade Updates',  desc: 'When traders you follow place new trades' },
                    { key: 'weeklyReport' as const, label: 'Weekly Report',       desc: 'Portfolio & market summary every Monday' },
                  ].map(item => (
                    <div key={item.key} style={{ backgroundColor: ELEVATED, borderColor: BORDER }} className="border rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <p style={{ color: TEXT1 }} className="text-sm font-medium">{item.label}</p>
                        <p style={{ color: TEXT3 }} className="text-xs mt-1">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => handleToggle(item.key)}
                        style={{ backgroundColor: notifs[item.key] ? GREEN : TEXT3 }}
                        className="w-10 h-6 rounded-full flex items-center transition-all px-1"
                      >
                        <div
                          style={{ backgroundColor: '#fff', transform: notifs[item.key] ? 'translateX(16px)' : 'translateX(0)' }}
                          className="w-5 h-5 rounded-full transition-transform"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Security Tab ── */}
            {tab === 'security' && (
              <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-2xl p-5">
                <h2 style={{ color: TEXT1 }} className="text-lg font-bold mb-5">Security Settings</h2>
                <div className="space-y-4">
                  <div style={{ backgroundColor: ELEVATED, borderColor: BORDER }} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Key size={16} style={{ color: BLUE }} />
                      <span style={{ color: TEXT1 }} className="text-sm font-medium">Change Password</span>
                    </div>
                    <div className="space-y-3">
                      {['Current Password', 'New Password', 'Confirm New Password'].map(label => (
                        <input
                          key={label}
                          type="password"
                          placeholder={label}
                          style={{ backgroundColor: CARD, borderColor: BORDER, color: TEXT1 }}
                          className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none placeholder-shown:text-gray-600"
                        />
                      ))}
                      <button style={{ backgroundColor: BLUE, color: '#fff' }} className="w-full px-5 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-all">
                        Update Password
                      </button>
                    </div>
                  </div>

                  <div style={{ backgroundColor: ELEVATED, borderColor: BORDER }} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p style={{ color: TEXT1 }} className="text-sm font-medium flex items-center gap-2">
                          <Shield size={14} style={{ color: BLUE }} />
                          Two-Factor Authentication
                        </p>
                        <p style={{ color: TEXT3 }} className="text-xs mt-1">Add extra layer of security</p>
                      </div>
                      <button style={{ borderColor: BORDER, color: TEXT2 }} className="border rounded-lg px-3 py-1.5 text-xs hover:text-white transition-all">
                        Enable
                      </button>
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.3)' }} className="border rounded-lg p-4">
                    <p style={{ color: RED }} className="text-sm font-medium mb-1">Danger Zone</p>
                    <p style={{ color: TEXT3 }} className="text-xs mb-3">Permanently delete your account and all data.</p>
                    <button style={{ borderColor: RED, color: RED }} className="border rounded-lg px-3 py-1.5 text-xs hover:bg-opacity-10 transition-all">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
