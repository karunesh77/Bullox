import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
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
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <main>
        <Hero />
        <Ticker />
        <Features />
        <Pricing />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
