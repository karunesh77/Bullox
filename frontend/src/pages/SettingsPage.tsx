import { useState } from 'react';
import { Settings, Bell, Lock, Eye, User, LogOut, ToggleRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingSection {
  title: string;
  icon: any;
  items: SettingItem[];
}

interface SettingItem {
  label: string;
  description: string;
  type: 'toggle' | 'select' | 'input';
  value?: boolean | string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    priceAlerts: true,
    newsDigest: false,
    twoFactor: false,
    theme: 'light',
    language: 'en',
  });

  const [profile, setProfile] = useState({
    name: 'Trader Name',
    email: 'trader@example.com',
    phone: '+91 98765 43210',
  });

  const sections: SettingSection[] = [
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Email Notifications', description: 'Receive updates about your alerts and trades', type: 'toggle', value: settings.emailNotifications },
        { label: 'Price Alerts', description: 'Get notified when prices reach your targets', type: 'toggle', value: settings.priceAlerts },
        { label: 'News Digest', description: 'Daily summary of market news', type: 'toggle', value: settings.newsDigest },
      ],
    },
    {
      title: 'Security',
      icon: Lock,
      items: [
        { label: 'Two-Factor Authentication', description: 'Add extra security to your account', type: 'toggle', value: settings.twoFactor },
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-cyan-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100">
              <Settings size={24} className="text-blue-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Settings</h1>
              <p className="text-sm text-gray-600">Manage your account and preferences</p>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="mb-8 p-6 rounded-2xl bg-white border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <User size={20} className="text-blue-600" /> Profile Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">Full Name</label>
              <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full mt-1 px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full mt-1 px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Phone</label>
              <input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full mt-1 px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold hover:shadow-lg transition-all">
              Save Changes
            </button>
          </div>
        </div>

        {/* Settings Sections */}
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="mb-8 p-6 rounded-2xl bg-white border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Icon size={20} className="text-blue-600" /> {section.title}
              </h2>

              <div className="space-y-4">
                {section.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>

                    {item.type === 'toggle' && (
                      <button className="p-2 rounded-lg hover:bg-white transition-all">
                        <ToggleRight size={24} className={item.value ? 'text-green-600' : 'text-gray-400'} />
                      </button>
                    )}

                    {item.type === 'select' && (
                      <select className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>{item.value}</option>
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Danger Zone */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-300">
          <h2 className="text-xl font-bold text-red-700 mb-4">Danger Zone</h2>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 rounded-lg border-2 border-red-300 text-red-700 font-bold hover:bg-red-50 transition-all">
              Change Password
            </button>
            <button className="w-full px-4 py-3 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
