import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    desc: 'Perfect to get started with Bullox.',
    features: [
      'Live market data (stocks + crypto)',
      'Up to 3 watchlists (20 symbols each)',
      'Up to 10 price alerts',
      'AI news feed',
      'Economic calendar',
    ],
    cta: 'Get Started',
    link: '/register',
    popular: false,
  },
  {
    name: 'Pro',
    price: '₹999',
    period: 'per month',
    yearly: '₹7,999 / year',
    desc: 'For serious traders who need unlimited power.',
    features: [
      'Everything in Free',
      'Unlimited watchlists & alerts',
      'Copy trading (follow experts)',
      'Priority data feeds',
      'Advanced AI sentiment analysis',
      'Email + push notifications',
      'Priority support',
    ],
    cta: 'Upgrade to Pro',
    link: '/register',
    popular: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-24 md:py-32 border-t border-gray-900">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Simple pricing.<br />
            <span className="text-gray-500">No surprises.</span>
          </h2>
          <p className="text-lg text-gray-400">
            Start free. Upgrade when you're ready.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'relative rounded-2xl p-8 transition-all duration-300',
                plan.popular
                  ? 'border-2 border-green-500/40 bg-gradient-to-br from-green-500/5 to-transparent'
                  : 'border border-gray-800 bg-gray-900/50'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-gray-950 text-xs font-bold px-3 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-400">{plan.desc}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm text-gray-500">/ {plan.period}</span>
                </div>
                {plan.yearly && (
                  <p className="text-xs text-green-400 mt-1">or {plan.yearly} — save 33%</p>
                )}
              </div>

              <Link
                to={plan.link}
                className={cn(
                  'block w-full text-center font-semibold px-5 py-3 rounded-xl transition-all mb-8',
                  plan.popular
                    ? 'bg-green-500 text-gray-950 hover:bg-green-400 active:scale-95'
                    : 'border border-gray-700 text-white hover:bg-gray-800 hover:border-gray-600'
                )}
              >
                {plan.cta}
              </Link>

              <ul className="space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <span className={cn(
                      'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                      plan.popular ? 'bg-green-500/20' : 'bg-gray-800'
                    )}>
                      <Check size={12} className={plan.popular ? 'text-green-400' : 'text-gray-400'} />
                    </span>
                    <span className="text-gray-300">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-600 mt-12">
          All prices in INR. Cancel anytime. Secure payments via Razorpay.
        </p>
      </div>
    </section>
  );
}
