import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Mail, Lock, TrendingUp } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/api/auth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  const setAuth = useAuthStore((s) => s.setAuth);

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email) e.email = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError('');
    try {
      const { data } = await authApi.login(form);
      setAuth(data.data.user, data.data.accessToken, data.data.refreshToken);
      navigate('/');
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Left — Branding & Illustration */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="flex items-center gap-2">
          <TrendingUp size={28} className="text-cyan-400" />
          <span className="text-2xl font-bold text-white">Bullox</span>
        </div>

        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Faster Trading,<br />
            <span className="text-cyan-400">Smarter Decisions</span>
          </h2>
          <p className="text-gray-300 text-lg mb-12">
            Real-time data • Expert insights • Copy trading
          </p>

          {/* Illustration placeholder */}
          <div className="w-full h-64 bg-gradient-to-b from-cyan-400/10 to-transparent rounded-2xl border border-cyan-400/20 flex items-center justify-center">
            <div className="text-center">
              <TrendingUp size={64} className="text-cyan-400 mx-auto mb-4 opacity-20" />
              <p className="text-gray-500 text-sm">Premium Trading Platform</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Live Symbols', value: '10,000+' },
            { label: 'Expert Traders', value: '500+' },
            { label: 'News/Day', value: '1,200+' },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
              <div className="text-xl font-bold text-cyan-400">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Form Card */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-900">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <TrendingUp size={24} className="text-cyan-400" />
            <span className="text-xl font-bold text-white">Bullox</span>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <span className="text-2xl font-bold text-cyan-500">Bullox</span>
              <p className="text-gray-600 text-sm mt-2">Welcome back, trader</p>
            </div>

            {apiError && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-300 px-4 py-3 text-sm text-red-700">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                leftIcon={<Mail size={16} />}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                error={errors.email}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock size={16} />}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={errors.password}
              />

              <Button type="submit" loading={loading} className="w-full mt-6 bg-cyan-500 text-white hover:bg-cyan-600 border-0">
                Sign In
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-sm text-gray-500">or</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                🔍 Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                📘 Facebook
              </button>
            </div>

            {/* Footer */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-cyan-600 hover:text-cyan-700 font-semibold">
                  Register now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
