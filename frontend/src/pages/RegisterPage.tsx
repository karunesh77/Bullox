import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Mail, Lock, User, TrendingUp } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/api/auth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function RegisterPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  const setAuth = useAuthStore((s) => s.setAuth);

  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.username) e.username = 'Username is required';
    else if (form.username.length < 3) e.username = 'Min 3 characters';
    else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) e.username = 'Only letters, numbers, underscores';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Min 8 characters';
    else if (!/[A-Z]/.test(form.password)) e.password = 'Must contain uppercase letter';
    else if (!/[0-9]/.test(form.password)) e.password = 'Must contain a number';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError('');
    try {
      const { data } = await authApi.register(form);
      setAuth(data.data.user, data.data.accessToken, data.data.refreshToken);
      navigate('/');
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    if (!form.password) return null;
    const checks = [
      form.password.length >= 8,
      /[A-Z]/.test(form.password),
      /[0-9]/.test(form.password),
      form.password.length >= 12,
    ];
    const score = checks.filter(Boolean).length;
    if (score <= 1) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/4' };
    if (score === 2) return { label: 'Fair', color: 'bg-yellow-500', width: 'w-2/4' };
    if (score === 3) return { label: 'Good', color: 'bg-blue-500', width: 'w-3/4' };
    return { label: 'Strong', color: 'bg-green-500', width: 'w-full' };
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-gray-900 to-gray-950 border-r border-gray-800">
        <div className="flex items-center gap-2">
          <TrendingUp size={28} className="text-green-400" />
          <span className="text-2xl font-bold text-white">Bullox</span>
        </div>
        <div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Start your journey.<br />
            <span className="text-green-400">It's free.</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Join thousands of traders using Bullox to track markets, get AI news insights and copy expert strategies.
          </p>
        </div>
        <ul className="flex flex-col gap-3">
          {[
            'Real-time stock & crypto prices',
            'AI-powered news sentiment',
            'Price alerts & watchlists',
            'Copy top expert traders',
          ].map((item) => (
            <li key={item} className="flex items-center gap-3 text-gray-300 text-sm">
              <span className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-400 text-xs">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <TrendingUp size={24} className="text-green-400" />
            <span className="text-xl font-bold text-white">Bullox</span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">Create account</h1>
          <p className="text-gray-400 text-sm mb-8">Get started for free — no credit card needed</p>

          {apiError && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              label="Username"
              type="text"
              placeholder="johndoe"
              leftIcon={<User size={16} />}
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              error={errors.username}
            />
            <div className="flex flex-col gap-1.5">
              <Input
                label="Password"
                type="password"
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                leftIcon={<Lock size={16} />}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={errors.password}
              />
              {strength && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1 rounded-full bg-gray-700">
                    <div className={`h-1 rounded-full transition-all ${strength.color} ${strength.width}`} />
                  </div>
                  <span className="text-xs text-gray-500">{strength.label}</span>
                </div>
              )}
            </div>

            <Button type="submit" loading={loading} className="w-full mt-2">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-green-400 hover:text-green-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
