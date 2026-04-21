import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CtaSection() {
  return (
    <section className="relative py-24 border-t border-gray-900">
      <div className="max-w-4xl mx-auto px-6">
        <div className="relative rounded-3xl border border-gray-800 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 p-12 md:p-16 text-center overflow-hidden">
          {/* Glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-green-500/10 rounded-full blur-3xl" />
          </div>

          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Ready to trade smarter?
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
              Join thousands of traders already using Bullox to track markets and copy experts.
            </p>
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 bg-green-500 text-gray-950 font-semibold px-7 py-3.5 rounded-xl hover:bg-green-400 active:scale-95 transition-all"
            >
              Start Free Today
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-xs text-gray-600 mt-4">No credit card · No commitment</p>
          </div>
        </div>
      </div>
    </section>
  );
}
