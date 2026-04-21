import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled
        ? 'bg-gray-950/80 backdrop-blur-md border-b border-gray-800'
        : 'bg-transparent border-b border-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <TrendingUp size={24} className="text-green-400" />
          <span className="text-xl font-bold text-white tracking-tight">Bullox</span>
        </Link>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="/#features" className="text-sm text-gray-300 hover:text-white transition-colors">Features</a>
          <a href="/#pricing" className="text-sm text-gray-300 hover:text-white transition-colors">Pricing</a>
          <Link to="/market" className="text-sm text-gray-300 hover:text-white transition-colors">Markets</Link>
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm text-gray-300 hover:text-white transition-colors hidden sm:block"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="bg-green-500 text-gray-950 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-green-400 active:scale-95 transition-all"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
