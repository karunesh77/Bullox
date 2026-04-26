import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TEXT2 = '#9CA3AF';
const TEXT3 = '#6B7280';
const BLUE = '#3B82F6';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
          <span style={{ color: BLUE }}>Trade Smarter</span>
          <br />
          with AI-Powered Signals
        </h1>
        <p style={{ color: TEXT2 }} className="text-lg mb-8">
          Get real-time trading signals, advanced analytics, and professional-grade tools all in one platform. Start trading smarter today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={() => navigate('/dashboard')} style={{ backgroundColor: BLUE }} className="px-8 py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90">
            Get Started Free
            <ArrowRight size={18} />
          </button>
          <button style={{ borderColor: BLUE, color: BLUE }} className="px-8 py-3 rounded-lg border-2 font-semibold transition-all hover:bg-opacity-10">
            Watch Demo
          </button>
        </div>
        <p style={{ color: TEXT3 }} className="text-sm mt-6">✓ No credit card required • ✓ Free forever plan • ✓ Cancel anytime</p>
      </div>
      <div style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(34,197,94,0.1) 100%)', borderColor: '#1F2937' }} className="border rounded-2xl p-8 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <p style={{ color: TEXT2 }}>Professional Trading Dashboard</p>
        </div>
      </div>
    </section>
  );
}
