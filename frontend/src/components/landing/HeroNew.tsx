import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeroNew() {
  const navigate = useNavigate();

  return (
    <section className="relative w-full overflow-hidden bg-[#05070D]">
      {/* Background gradient effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-20 -right-40 w-[600px] h-[600px] opacity-40">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blue-500/20 via-purple-500/10 to-transparent blur-3xl rounded-full" />
        </div>
        <div className="absolute top-1/4 right-0 w-1 h-96 bg-gradient-to-b from-transparent via-blue-400/40 to-transparent rotate-45 blur-sm" />
        <div className="absolute top-1/3 right-10 w-1 h-72 bg-gradient-to-b from-transparent via-purple-400/30 to-transparent rotate-45 blur-sm" />
        <div className="absolute top-1/2 right-20 w-1 h-64 bg-gradient-to-b from-transparent via-pink-400/30 to-transparent rotate-45 blur-sm" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/5 blur-3xl rounded-full" />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-8 lg:px-12 pt-2 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center min-h-[640px]">

          {/* LEFT SIDE - Text */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
              <span className="block text-[#3B82F6]">Trade Smarter</span>
              <span className="block text-white mt-2">with AI-Powered Signals</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-xl">
              Get real-time trading signals, advanced analytics, and professional-grade tools all in one platform. Start trading smarter today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.button
                onClick={() => navigate("/dashboard")}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group px-7 py-3.5 rounded-lg font-semibold text-white flex items-center justify-center gap-2.5 bg-[#3B82F6] hover:bg-[#2563EB] transition-all duration-200 shadow-lg shadow-blue-500/30"
              >
                Get Started Free
                <ArrowRight size={18} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-7 py-3.5 rounded-lg font-semibold border border-[#3B82F6] text-[#3B82F6] hover:bg-blue-500/10 flex items-center justify-center gap-2.5 transition-all duration-200"
              >
                Watch Demo
                <Play size={16} fill="currentColor" />
              </motion.button>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 pt-2">
              <span>✓ No credit card required</span>
              <span className="text-gray-700">•</span>
              <span>✓ Free forever plan</span>
              <span className="text-gray-700">•</span>
              <span>✓ Cancel anytime</span>
            </div>
          </motion.div>

          {/* RIGHT SIDE - Hero Scene Image */}
          <motion.div
            className="relative h-[600px] w-full"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.img
              src="/hero-scene.png"
              alt="Trading Scene"
              className="w-full h-full object-contain rounded-sm mb-24"
              style={{
                maskImage: "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
                maskComposite: "intersect",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)",
              }}
            />
            {/* Left fade overlay */}
            <div className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(to right, rgba(5,7,13,0.4) 0%, rgba(5,7,13,0.15) 12%, transparent 30%)",
              }}
            />
            {/* Top fade overlay */}
            <div className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(to bottom, rgba(5,7,13,0.15) 0%, transparent 10%)",
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Bottom ticker */}
      <div className="relative z-10 border-t border-white/5 bg-[#0A0E18]/80 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12 py-5">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { symbol: "BTC/USDT", price: "$66,745.51", change: "+ 2.4%", positive: true, icon: "₿", iconBg: "#F7931A" },
              { symbol: "ETH/USDT", price: "$3,427.63", change: "-1.2%", positive: false, icon: "Ξ", iconBg: "#627EEA" },
              { symbol: "SOL/USDT", price: "$163.97", change: "+ 5.6%", positive: true, icon: "◎", iconBg: "#9945FF" },
              { symbol: "BNB/USDT", price: "$616.15", change: "+ 2.1%", positive: true, icon: "B", iconBg: "#F3BA2F" },
              { symbol: "XRP/USDT", price: "$0.5254", change: "-0.8%", positive: false, icon: "X", iconBg: "#23292F" },
            ].map((coin, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: coin.iconBg }}
                >
                  {coin.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold leading-tight">{coin.symbol}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{coin.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <svg width="40" height="20" viewBox="0 0 40 20" className="flex-shrink-0">
                    <polyline
                      points={coin.positive
                        ? "0,15 8,12 16,14 24,8 32,5 40,3"
                        : "0,5 8,8 16,6 24,12 32,15 40,17"
                      }
                      fill="none"
                      stroke={coin.positive ? "#22C55E" : "#EF4444"}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    className={`text-xs font-bold ${coin.positive ? "text-green-400" : "text-red-400"}`}
                  >
                    {coin.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
