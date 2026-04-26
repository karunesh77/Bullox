import { CreditCard, Check, Download, AlertCircle } from 'lucide-react';

/* ─── Colors ─────────────────────────────────────────── */
const BG        = '#0B0F19';
const CARD      = '#111827';
const ELEVATED  = '#1F2937';
const BORDER    = '#1F2937';
const TEXT1     = '#E5E7EB';
const TEXT2     = '#9CA3AF';
const TEXT3     = '#6B7280';
const GREEN     = '#22C55E';
const BLUE      = '#3B82F6';

export default function BillingPage() {

  const plans = [
    {
      name: 'Free',
      price: '0',
      description: 'For beginners',
      features: ['Real-time quotes', 'Economic calendar', 'Basic news feed', 'Limited alerts', 'Community access'],
      current: false,
      cta: 'Current Plan',
    },
    {
      name: 'Pro',
      price: '299',
      description: 'Most popular',
      features: ['All Free features', 'Advanced charts', 'Copy trading', 'Premium signals', 'Priority support', 'Custom alerts (50)', 'API access'],
      current: true,
      cta: 'Upgrade',
    },
    {
      name: 'Elite',
      price: '999',
      description: 'For professionals',
      features: ['All Pro features', 'Unlimited alerts', 'Portfolio analytics', '1-on-1 coaching', 'Bot trading', 'Custom strategies', '24/7 VIP support'],
      current: false,
      cta: 'Upgrade',
    },
  ];

  const invoices = [
    { date: 'Apr 25, 2026', amount: '₹299', status: 'Paid', invoice: 'INV-2026-0425' },
    { date: 'Mar 25, 2026', amount: '₹299', status: 'Paid', invoice: 'INV-2026-0325' },
    { date: 'Feb 25, 2026', amount: '₹299', status: 'Paid', invoice: 'INV-2026-0225' },
  ];

  return (
    <div style={{ backgroundColor: BG }} className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ─────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div style={{ backgroundColor: BLUE }} className="p-2.5 rounded-xl">
              <CreditCard size={20} style={{ color: '#fff' }} />
            </div>
            <div>
              <h1 style={{ color: TEXT1 }} className="text-2xl font-bold">Billing & Subscription</h1>
              <p style={{ color: TEXT2 }} className="text-sm">Manage your subscription and payments</p>
            </div>
          </div>
        </div>

        {/* ── Plans Section ─────────────────────– */}
        <div className="mb-12">
          <h2 style={{ color: TEXT1 }} className="text-xl font-bold mb-6">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                style={{
                  backgroundColor: plan.current ? ELEVATED : CARD,
                  borderColor: plan.current ? GREEN : BORDER,
                }}
                className="border rounded-2xl p-6 transition-all relative"
              >
                {plan.current && (
                  <div
                    style={{ backgroundColor: GREEN, color: '#000' }}
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4"
                  >
                    Current Plan
                  </div>
                )}

                <h3 style={{ color: TEXT1 }} className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p style={{ color: TEXT3 }} className="text-sm mb-4">{plan.description}</p>

                <div className="mb-6">
                  <span style={{ color: TEXT1 }} className="text-4xl font-bold">₹{plan.price}</span>
                  <span style={{ color: TEXT3 }} className="text-sm">/month</span>
                </div>

                <button
                  style={{
                    backgroundColor: plan.current ? 'transparent' : BLUE,
                    borderColor: plan.current ? GREEN : 'transparent',
                    color: plan.current ? GREEN : '#fff',
                  }}
                  className="w-full py-2.5 rounded-lg font-bold mb-6 transition-all border hover:opacity-90"
                >
                  {plan.cta}
                </button>

                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check size={16} style={{ color: GREEN }} className="flex-shrink-0" />
                      <span style={{ color: TEXT2 }} className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Subscription Details Grid ────────– */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">

          {/* Current Subscription */}
          <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-2xl p-5">
            <h3 style={{ color: TEXT1 }} className="text-lg font-bold mb-4">Current Subscription</h3>
            <div className="space-y-4">
              <div>
                <p style={{ color: TEXT3 }} className="text-xs font-semibold uppercase mb-1">Plan</p>
                <p style={{ color: TEXT1 }} className="font-bold">Pro Plan</p>
              </div>
              <div>
                <p style={{ color: TEXT3 }} className="text-xs font-semibold uppercase mb-1">Billing Cycle</p>
                <p style={{ color: TEXT1 }} className="font-bold">Monthly</p>
              </div>
              <div>
                <p style={{ color: TEXT3 }} className="text-xs font-semibold uppercase mb-1">Next Billing Date</p>
                <p style={{ color: TEXT1 }} className="font-bold">May 25, 2026</p>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-2xl p-5">
            <h3 style={{ color: TEXT1 }} className="text-lg font-bold mb-4">Payment Method</h3>
            <div className="space-y-3 mb-4">
              <div style={{ backgroundColor: ELEVATED, borderColor: BORDER }} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p style={{ color: TEXT1 }} className="text-sm font-semibold">Visa Card</p>
                    <p style={{ color: TEXT3 }} className="text-xs mt-1">****4242</p>
                  </div>
                </div>
              </div>
            </div>
            <button
              style={{ backgroundColor: BLUE, color: '#fff' }}
              className="w-full px-4 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition-all"
            >
              Update Payment
            </button>
          </div>

          {/* Billing Address */}
          <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-2xl p-5">
            <h3 style={{ color: TEXT1 }} className="text-lg font-bold mb-4">Billing Address</h3>
            <div style={{ color: TEXT2 }} className="text-sm space-y-1 mb-4">
              <p>Trader Name</p>
              <p>123 Trading Street</p>
              <p>Mumbai, MH 400001</p>
              <p>India</p>
            </div>
            <button
              style={{ backgroundColor: BLUE, color: '#fff' }}
              className="w-full px-4 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition-all"
            >
              Edit Address
            </button>
          </div>

        </div>

        {/* ── Billing History ─────────────────── */}
        <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border rounded-2xl p-5 mb-6">
          <h2 style={{ color: TEXT1 }} className="text-lg font-bold mb-5">Billing History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: ELEVATED, borderColor: BORDER }} className="border-b">
                  {['Date', 'Invoice', 'Amount', 'Status', 'Action'].map(h => (
                    <th key={h} style={{ color: TEXT3 }} className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice, idx) => (
                  <tr
                    key={invoice.invoice}
                    style={{ borderColor: BORDER }}
                    className={`border-b transition-all ${idx % 2 === 0 ? '' : ''}`}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = ELEVATED; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                  >
                    <td style={{ color: TEXT1 }} className="py-3 px-4">{invoice.date}</td>
                    <td style={{ color: TEXT2 }} className="py-3 px-4 font-mono text-xs">{invoice.invoice}</td>
                    <td style={{ color: TEXT1 }} className="py-3 px-4 font-bold">{invoice.amount}</td>
                    <td className="py-3 px-4">
                      <span style={{ backgroundColor: 'rgba(34,197,94,0.15)', color: GREEN, border: '1px solid rgba(34,197,94,0.3)' }} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold">
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button style={{ color: BLUE }} className="flex items-center gap-2 text-sm font-bold hover:opacity-80 transition-all">
                        <Download size={14} /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Billing Alert ────────────────────– */}
        <div style={{ backgroundColor: 'rgba(59,130,246,0.15)', borderColor: 'rgba(59,130,246,0.3)' }} className="border rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} style={{ color: BLUE }} className="flex-shrink-0 mt-0.5" />
            <div>
              <p style={{ color: TEXT1 }} className="font-bold text-sm mb-1">Auto-renewal enabled</p>
              <p style={{ color: TEXT3 }} className="text-xs">Your Pro plan will automatically renew on May 25, 2026. You can cancel anytime from your subscription settings.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
