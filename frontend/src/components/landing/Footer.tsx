import { Link } from 'react-router-dom';
import { TrendingUp, Send, Mail, Globe } from 'lucide-react';

const sections = [
  {
    title: 'Product',
    links: [
      { label: 'Features',     href: '/#features', external: false },
      { label: 'Pricing',      href: '/#pricing',  external: false },
      { label: 'Market',       href: '/market',    external: false },
      { label: 'News',         href: '/news',      external: false },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign In',      href: '/login',         external: false },
      { label: 'Register',     href: '/register',      external: false },
      { label: 'Dashboard',    href: '/dashboard',     external: false },
      { label: 'Subscription', href: '/subscription',  external: false },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy',  href: '/privacy',    external: false },
      { label: 'Terms of Use',    href: '/terms',      external: false },
      { label: 'Disclaimer',      href: '/disclaimer', external: false },
      { label: 'Refund Policy',   href: '/refund',     external: false },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-gray-900 bg-gray-950">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                <TrendingUp size={18} className="text-gray-950" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">Bullox</span>
            </Link>
            <p className="text-sm text-gray-400 max-w-xs mb-4">
              Trade smart. Copy the best. AI-powered market intelligence for modern traders.
            </p>
            <div className="flex gap-3">
              {[Send, Mail, Globe].map((Icon, i) => (
                <a
                  key={i}
                  href="mailto:support@bullox.in"
                  className="w-9 h-9 rounded-lg border border-gray-800 hover:border-gray-600 hover:bg-gray-900 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Bullox. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Trading involves risk. Not financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
