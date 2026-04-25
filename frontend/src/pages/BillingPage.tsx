import { useState } from 'react';
import { CreditCard, Check, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BillingPage() {
  const [billingPeriod, setBillingPeriod] = useState('monthly');

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-green-50 to-emerald-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100">
              <CreditCard size={24} className="text-green-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Billing & Subscription</h1>
              <p className="text-sm text-gray-600">Manage your subscription and payments</p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.name} className={cn('p-6 rounded-2xl border-2 transition-all', plan.current ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400 shadow-lg' : 'bg-white border-gray-200 hover:shadow-md')}>
                {plan.current && <div className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold mb-4">Current Plan</div>}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                <div className="mb-6"><span className="text-4xl font-bold text-gray-900">₹{plan.price}</span><span className="text-gray-600 text-sm">/month</span></div>
                <button className={cn('w-full py-3 rounded-lg font-bold mb-6 transition-all', plan.current ? 'bg-white border-2 border-green-600 text-green-700 hover:bg-green-50' : 'bg-green-600 text-white hover:bg-green-700')}>{plan.cta}</button>
                <div className="space-y-3">{plan.features.map((feature) => <div key={feature} className="flex items-center gap-2"><Check size={18} className="text-green-600 flex-shrink-0" /><span className="text-sm text-gray-700">{feature}</span></div>)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-white border border-gray-200"><h3 className="text-lg font-bold text-gray-900 mb-4">Current Subscription</h3><div className="space-y-3"><div><p className="text-sm text-gray-600">Plan</p><p className="font-bold text-gray-900">Pro Plan</p></div><div><p className="text-sm text-gray-600">Billing Cycle</p><p className="font-bold text-gray-900">Monthly</p></div><div><p className="text-sm text-gray-600">Next Billing Date</p><p className="font-bold text-gray-900">May 25, 2026</p></div></div></div>
          <div className="p-6 rounded-2xl bg-white border border-gray-200"><h3 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h3><div className="space-y-3"><div className="p-4 rounded-lg bg-blue-50 border border-blue-200"><div className="flex items-start justify-between"><div><p className="text-sm font-semibold text-gray-900">Visa Card</p><p className="text-xs text-gray-600">****4242</p></div></div></div></div><button className="w-full mt-3 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-50">Update Payment</button></div>
          <div className="p-6 rounded-2xl bg-white border border-gray-200"><h3 className="text-lg font-bold text-gray-900 mb-4">Billing Address</h3><div className="text-sm text-gray-700 space-y-1"><p>Trader Name</p><p>123 Trading Street</p><p>Mumbai, MH 400001</p><p>India</p></div><button className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-50">Edit Address</button></div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Billing History</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-gray-200"><th className="text-left py-3 px-4 font-bold text-gray-900">Date</th><th className="text-left py-3 px-4 font-bold text-gray-900">Invoice</th><th className="text-left py-3 px-4 font-bold text-gray-900">Amount</th><th className="text-left py-3 px-4 font-bold text-gray-900">Status</th><th className="text-left py-3 px-4 font-bold text-gray-900">Action</th></tr></thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.invoice} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">{invoice.date}</td>
                    <td className="py-3 px-4 text-gray-900 font-mono text-sm">{invoice.invoice}</td>
                    <td className="py-3 px-4 text-gray-900 font-bold">{invoice.amount}</td>
                    <td className="py-3 px-4"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">{invoice.status}</span></td>
                    <td className="py-3 px-4"><button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold"><Download size={16} /> Download</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
