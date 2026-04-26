import { useState } from 'react';
import { Settings, Bell, Lock, Eye, User, LogOut, ToggleRight } from 'lucide-react';

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

interface SettingItem {
  label: string;
  description: string;
  type: 'toggle' | 'select' | 'input';
  value?: boolean | string;
}

interface SettingSection {
  title: string;
  icon: any;
  items: SettingItem[];
}

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: 'Trader Name',
    email: 'trader@example.com',
    phone: '+91 98765 43210',
  });

  const [toggles, setToggles] = useState({
    emailNotifications: true,
    priceAlerts: true,
    newsDigest: false,
    twoFactor: false,
  });

  const [settings] = useState({
    theme: 'dark',
    language: 'en',
  });

  const sections: SettingSection[] = [
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Email Notifications', description: 'Receive updates about your alerts and trades', type: 'toggle', value: toggles.emailNotifications },
        { label: 'Price Alerts', description: 'Get notified when prices reach your targets', type: 'toggle', value: toggles.priceAlerts },
        { label: 'News Digest', description: 'Daily summary of market news', type: 'toggle', value: toggles.newsDigest },
      ],
    },
    {
      title: 'Security',
      icon: Lock,
      items: [
        { label: 'Two-Factor Authentication', description: 'Add extra security to your account', type: 'toggle', value: toggles.twoFactor },
        { label: 'Privacy Level', description: 'Control profile visibility', type: 'select', value: 'public' },
        { label: 'Session Timeout', description: 'Auto logout after inactivity', type: 'select', value: '30min' },
      ],
    },
    {
      title: 'Preferences',
      icon: Eye,
      items: [
        { label: 'Theme', description: 'Choose your preferred theme', type: 'select', value: settings.theme },
        { label: 'Language', description: 'Select your preferred language', type: 'select', value: settings.language },
      ],
    },
  ];

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles({ ...toggles, [key]: !toggles[key] });
  };

  return (
    <div style={{ backgroundColor: BG }} className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">

        {/* ── Header ─────────────────────────── */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div style={{ backgroundColor: BLUE }} className="p-2.5 rounded-xl">
              <Settings size={20} style={{ color: '#fff' }} />
            </div>
            <div>
              <h1 style={{ color: TEXT1 }} className="text-2xl font-bold">Settings</h1>
              <p style={{ color: TEXT2 }} className="text-sm">Manage your account and preferences</p>
            </div>
          </div>
        </div>

        {/* ── Profile Section ─────────────────── */}
        <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-2xl p-5 mb-6">
          <h2 style={{ color: TEXT1 }} className="text-lg font-bold mb-5 flex items-center gap-2">
            <User size={18} style={{ color: BLUE }} /> Profile Information
          </h2>

          <div className="space-y-4 mb-5">
            <div>
              <label style={{ color: TEXT2 }} className="text-sm font-semibold block mb-2">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
                style={{ backgroundColor: ELEVATED, borderColor: BORDER, color: TEXT1 }}
                className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none"
              />
            </div>
            <div>
              <label style={{ color: TEXT2 }} className="text-sm font-semibold block mb-2">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={e => setProfile({ ...profile, email: e.target.value })}
                style={{ backgroundColor: ELEVATED, borderColor: BORDER, color: TEXT1 }}
                className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none"
              />
            </div>
            <div>
              <label style={{ color: TEXT2 }} className="text-sm font-semibold block mb-2">Phone</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={e => setProfile({ ...profile, phone: e.target.value })}
                style={{ backgroundColor: ELEVATED, borderColor: BORDER, color: TEXT1 }}
                className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none"
              />
            </div>
          </div>
          <button
            style={{ backgroundColor: BLUE, color: '#fff' }}
            className="w-full px-4 py-2.5 rounded-lg font-bold hover:opacity-90 transition-all"
          >
            Save Changes
          </button>
        </div>

        {/* ── Settings Sections ──────────────── */}
        {sections.map(section => {
          const Icon = section.icon;
          return (
            <div key={section.title} style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-2xl p-5 mb-6">
              <h2 style={{ color: TEXT1 }} className="text-lg font-bold mb-5 flex items-center gap-2">
                <Icon size={18} style={{ color: BLUE }} /> {section.title}
              </h2>

              <div className="space-y-3">
                {section.items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{ backgroundColor: ELEVATED, borderColor: BORDER }}
                    className="border rounded-xl p-4 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p style={{ color: TEXT1 }} className="font-semibold text-sm">{item.label}</p>
                      <p style={{ color: TEXT3 }} className="text-xs mt-1">{item.description}</p>
                    </div>

                    {item.type === 'toggle' && (
                      <button
                        onClick={() => {
                          const keyMap: Record<string, keyof typeof toggles> = {
                            'Email Notifications': 'emailNotifications',
                            'Price Alerts': 'priceAlerts',
                            'News Digest': 'newsDigest',
                            'Two-Factor Authentication': 'twoFactor',
                          };
                          const key = keyMap[item.label];
                          if (key) handleToggle(key);
                        }}
                        className="p-2 rounded-lg hover:bg-opacity-50 transition-all ml-4"
                      >
                        <ToggleRight
                          size={20}
                          style={{ color: item.value ? GREEN : TEXT3 }}
                          fill={item.value ? GREEN : TEXT3}
                        />
                      </button>
                    )}

                    {item.type === 'select' && (
                      <select
                        defaultValue={String(item.value)}
                        style={{ backgroundColor: CARD, borderColor: BORDER, color: TEXT1 }}
                        className="px-3 py-2 rounded-lg border text-sm font-semibold focus:outline-none ml-4"
                      >
                        <option>{item.value}</option>
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* ── Danger Zone ────────────────────── */}
        <div style={{ backgroundColor: 'rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.3)', border: '1px solid' }} className="rounded-2xl p-5">
          <h2 style={{ color: RED }} className="text-lg font-bold mb-4">Danger Zone</h2>
          <div className="space-y-3">
            <button
              style={{ borderColor: RED, color: RED }}
              className="w-full px-4 py-2.5 rounded-lg border-2 font-bold hover:bg-opacity-20 transition-all text-sm"
            >
              Change Password
            </button>
            <button
              style={{ backgroundColor: RED, color: '#fff' }}
              className="w-full px-4 py-2.5 rounded-lg font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
