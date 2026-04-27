import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const CARD = '#111827';
const BORDER = '#1F2937';
const TEXT1 = '#E5E7EB';
const TEXT2 = '#9CA3AF';
const BLUE = '#3B82F6';

export default function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'About', href: '#about' },
  ];

  return (
    <nav className="backdrop-blur-lg bg-slate-950/80 border-b border-white/10 sticky top-0 z-50" style={{ boxShadow: "0 0 20px rgba(59, 130, 246, 0.1)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <img src="/bullox-logo.svg" alt="Bullox" className="w-8 h-8" />
          <span className="text-xl font-bold" style={{ color: TEXT1 }}>Bullox</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} style={{ color: TEXT2 }} className="hover:text-white transition text-sm font-medium">
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden sm:flex gap-3 items-center">
          <button onClick={() => navigate('/dashboard')} style={{ borderColor: BLUE, color: BLUE }} className="px-4 py-2 rounded-lg border transition-all hover:bg-opacity-10">
            Sign In
          </button>
          <button onClick={() => navigate('/dashboard')} style={{ backgroundColor: BLUE }} className="px-4 py-2 rounded-lg text-white font-semibold transition-all hover:opacity-90">
            Get Started
          </button>
        </div>

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg" style={{ backgroundColor: 'rgba(59,130,246,0.15)', color: BLUE }}>
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div style={{ backgroundColor: CARD, borderColor: BORDER }} className="border-t md:hidden">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} style={{ color: TEXT2 }} className="block py-2 hover:text-white transition" onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </a>
            ))}
            <div className="flex gap-2 pt-2">
              <button onClick={() => navigate('/dashboard')} style={{ borderColor: BLUE, color: BLUE }} className="flex-1 px-4 py-2 rounded-lg border transition-all text-sm">
                Sign In
              </button>
              <button onClick={() => navigate('/dashboard')} style={{ backgroundColor: BLUE }} className="flex-1 px-4 py-2 rounded-lg text-white font-semibold transition-all text-sm">
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
