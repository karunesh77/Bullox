import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/landing/Navbar';
import HeroNew from '@/components/landing/HeroNew';
import Ticker from '@/components/landing/Ticker';
import Features from '@/components/landing/Features';
import Pricing from '@/components/landing/Pricing';
import CtaSection from '@/components/landing/CtaSection';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Agar logged in hai toh seedha dashboard
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main>
        <HeroNew />
        <Ticker />
        <Features />
        <Pricing />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
