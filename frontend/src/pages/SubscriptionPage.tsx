import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import {
  Crown, Check, Zap, Shield, TrendingUp, Bell,
  Users, BookMarked, Newspaper, Calendar, ArrowRight,
  CreditCard, Lock, RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

const FREE_FEATURES = [
  { icon: TrendingUp, text: 'Live market data (stocks + crypto)' },
  { icon: BookMarked, text: 'Up to 3 watchlists (20 symbols each)' },
  { icon: Bell,       text: 'Up to 10 price alerts' },
  { icon: Newspaper,  text: 'AI news feed' },
  { icon: Calendar,   text: 'Economic calendar' },
];

const PRO_FEATURES = [
  { icon: Check,      text: 'Everything in Free' },
  { icon: BookMarked, text: 'Unlimited watchlists & alerts' },
  { icon: Users,      text: 'Copy trading (follow experts)' },
  { icon: Zap,        text: 'Priority data feeds' },
  { icon: Newspaper,  text: 'Advanced AI sentiment analysis' },
  { icon: Bell,       text: 'Email + push notifications' },
  { icon: Shield,     text: 'Priority support' },
];

const FAQ = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel anytime from your profile — no questions asked. Your Pro access continues till the end of the billing period.',
  },
  {
    q: 'Is my payment secure?',
    a: 'All payments are processed via Razorpay — PCI DSS compliant. We never store your card details.',
  },
  {
    q: 'Will I lose my data if I downgrade?',
    a: 'No. Your watchlists and alerts are saved. If you have more than the free limit, extras will be archived and restored when you upgrade again.',
  },
  {
    q: 'Do you offer a free trial for Pro?',
    a: 'We offer a 7-day free trial for new users. No credit card required to start.',
  },
];

export default function SubscriptionPage() {
  const { user } = useAuthStore();
  const isPro = user?.role === 'PRO' || user?.role === 'EXPERT';
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const price     = billing === 'monthly' ? '₹999' : '₹666';
  const yearTotal = '₹7,999';
  const saving    = '33%';

  const handleUpgrade = () => {
    setLoading(true);
    // Razorpay integration will go here when backend is connected
    setTimeout(() => {
      setLoading(false);
      alert('Razorpay integration ready — connect backend to activate payments!');
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-4">
          <Crown size={14} className="text-yellow-400" />
          <span className="text-xs font-medium text-yellow-400">Bullox Pro</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
          Upgrade your trading game
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto">
          Unlock unlimited power. Copy the best traders. Never miss a signal.
        </p>
      </div>

      {/* Current plan banner (if Pro) */}
      {isPro && (
        <div className="mb-8 rounded-2xl border border-green-500/30 bg-green-500/5 p-5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Crown size={18} className="text-green-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">You're on Bullox Pro</p>
              <p className="text-xs text-gray-400">Next billing: May 21, 2026 · ₹999/month</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-700 text-sm text-gray-300 hover:border-gray-600 hover:text-white transition-all">
            <RefreshCw size={13} />
            Manage Subscription
          </button>
        </div>
      )}

      {/* Billing toggle */}
      {!isPro && (
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-1 p-1 bg-gray-900 rounded-xl border border-gray-800">
            <button
              onClick={() => setBilling('monthly')}
              className={cn(
                'px-5 py-2 rounded-lg text-sm font-medium transition-all',
                billing === 'monthly' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300'
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={cn(
                'px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                billing === 'yearly' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300'
              )}
            >
              Yearly
              <span className="text-xs px-1.5 py-0.5 rounded-md bg-green-500/20 text-green-400 font-semibold">
                -{saving}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Free Plan */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-7">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-1">Free</h2>
            <p className="text-sm text-gray-400">Perfect to get started</p>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-white">₹0</span>
              <span className="text-sm text-gray-500">/ forever</span>
            </div>
          </div>

          <div className={cn(
            'block w-full text-center font-semibold px-5 py-3 rounded-xl mb-7 text-sm transition-all',
            isPro
              ? 'border border-gray-700 text-gray-400 cursor-default'
              : (!isPro && user?.role === 'USER')
                ? 'border border-green-500/30 text-green-400 cursor-default bg-green-500/5'
                : 'border border-gray-700 text-gray-300'
          )}>
            {(!isPro && user?.role === 'USER') ? '✓ Current Plan' : 'Free Plan'}
          </div>

          <ul className="space-y-3">
            {FREE_FEATURES.map((f) => (
              <li key={f.text} className="flex items-center gap-3 text-sm">
                <span className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <Check size={11} className="text-gray-400" />
                </span>
                <span className="text-gray-300">{f.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pro Plan */}
        <div className="relative rounded-2xl border-2 border-green-500/40 bg-gradient-to-br from-green-500/5 to-transparent p-7">
          {/* Popular badge */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-green-500 text-gray-950 text-xs font-bold px-4 py-1 rounded-full">
            MOST POPULAR
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              Pro
              <Crown size={16} className="text-yellow-400" />
            </h2>
            <p className="text-sm text-gray-400">For serious traders</p>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-white">{price}</span>
              <span className="text-sm text-gray-500">/ month</span>
            </div>
            {billing === 'yearly' && (
              <p className="text-xs text-green-400 mt-1">
                Billed as {yearTotal}/year · Save {saving}
              </p>
            )}
          </div>

          {isPro ? (
            <div className="block w-full text-center font-semibold px-5 py-3 rounded-xl mb-7 text-sm bg-green-500/10 border border-green-500/30 text-green-400">
              ✓ Current Plan
            </div>
          ) : (
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-green-500 text-gray-950 font-semibold px-5 py-3 rounded-xl mb-7 text-sm hover:bg-green-400 active:scale-95 transition-all disabled:opacity-60 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
            >
              {loading ? (
                <><RefreshCw size={14} className="animate-spin" /> Processing...</>
              ) : (
                <>Upgrade to Pro <ArrowRight size={14} /></>
              )}
            </button>
          )}

          <ul className="space-y-3">
            {PRO_FEATURES.map((f) => (
              <li key={f.text} className="flex items-center gap-3 text-sm">
                <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Check size={11} className="text-green-400" />
                </span>
                <span className="text-gray-300">{f.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Trust badges */}
      <div className="flex items-center justify-center gap-8 mb-12 flex-wrap">
        {[
          { icon: Lock,       text: 'Secure payments via Razorpay' },
          { icon: RefreshCw,  text: 'Cancel anytime' },
          { icon: Shield,     text: 'PCI DSS compliant' },
          { icon: CreditCard, text: 'UPI, Cards, NetBanking' },
        ].map((b) => (
          <div key={b.text} className="flex items-center gap-2 text-xs text-gray-500">
            <b.icon size={13} className="text-gray-600" />
            {b.text}
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
        <h2 className="text-lg font-bold text-white mb-5">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {FAQ.map((item, i) => (
            <div key={i} className="border border-gray-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-gray-800/50 transition-colors"
              >
                <span className="text-sm font-medium text-white">{item.q}</span>
                <span className={cn(
                  'text-gray-500 transition-transform flex-shrink-0 ml-3',
                  openFaq === i && 'rotate-180'
                )}>
                  ▾
                </span>
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-sm text-gray-400 leading-relaxed border-t border-gray-800 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-gray-600 mt-6">
        All prices in INR · GST applicable · Cancel anytime
      </p>
    </div>
  );
}
