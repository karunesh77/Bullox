import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TradingChart from "./TradingChart";
import FloatingCard from "./FloatingCard";
import Bull3D from "./Bull3D";
import AnimatedBackground from "./AnimatedBackground";

const TEXT1 = "#E5E7EB";
const TEXT2 = "#9CA3AF";
const TEXT3 = "#6B7280";
const BLUE = "#3B82F6";
const GREEN = "#22C55E";

export default function HeroNew() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <AnimatedBackground />
      </div>

      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(59, 130, 246, 0.05) 25%, rgba(59, 130, 246, 0.05) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, 0.05) 75%, rgba(59, 130, 246, 0.05) 76%, transparent 77%, transparent),
                           linear-gradient(90deg, transparent 24%, rgba(59, 130, 246, 0.05) 25%, rgba(59, 130, 246, 0.05) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, 0.05) 75%, rgba(59, 130, 246, 0.05) 76%, transparent 77%, transparent)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Content */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* LEFT SIDE */}
        <motion.div className="space-y-8" variants={itemVariants}>
          <div className="space-y-4">
            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight"
              variants={itemVariants}
            >
              <span style={{ color: BLUE }}>Trade Smarter</span>
              <br />
              <span style={{ color: TEXT1 }}>with AI-Powered Signals</span>
            </motion.h1>

            <motion.p style={{ color: TEXT2 }} className="text-lg sm:text-xl leading-relaxed" variants={itemVariants}>
              Get real-time trading signals, advanced analytics, and professional-grade tools all in one platform. Start trading smarter today.
            </motion.p>
          </div>

          <motion.div className="flex flex-col sm:flex-row gap-4" variants={itemVariants}>
            <button
              onClick={() => navigate("/dashboard")}
              className="group relative px-8 py-4 rounded-lg font-semibold text-white flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${BLUE} 0%, #2563EB 100%)`,
                boxShadow: `0 0 20px ${BLUE}66`,
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started Free
                <ArrowRight size={18} />
              </span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>

            <button
              className="px-8 py-4 rounded-lg font-semibold border-2 flex items-center justify-center gap-2 transition-all duration-300 hover:bg-white/5"
              style={{
                borderColor: BLUE,
                color: BLUE,
                boxShadow: `inset 0 0 20px ${BLUE}22`,
              }}
            >
              <Play size={18} />
              Watch Demo
            </button>
          </motion.div>

          <motion.div style={{ color: TEXT3 }} className="text-sm space-y-2" variants={itemVariants}>
            <p>✓ No credit card required</p>
            <p>✓ Free forever plan</p>
            <p>✓ Cancel anytime</p>
          </motion.div>
        </motion.div>

        {/* RIGHT SIDE - TRADING DASHBOARD */}
        <motion.div className="relative h-full min-h-96 lg:min-h-[600px]" variants={itemVariants}>
          {/* Main Platform Base with glow */}
          <div className="relative h-full">
            {/* Bottom glowing platform */}
            <div
              className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-96 h-32 rounded-full blur-3xl opacity-40 z-0"
              style={{
                background: `linear-gradient(135deg, ${BLUE} 0%, #8B5CF6 100%)`,
              }}
            />

            {/* Main card with trading dashboard */}
            <div
              className="relative w-full h-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl"
              style={{
                boxShadow: `0 0 40px ${BLUE}33, inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
              }}
            >
              {/* Header */}
              <div className="mb-6 pb-6 border-b border-white/10">
                <div className="flex justify-between items-start">
                  <div>
                    <p style={{ color: TEXT3 }} className="text-sm mb-2">
                      BTC/USDT
                    </p>
                    <p style={{ color: TEXT1 }} className="text-3xl font-bold">
                      $66,745.51
                    </p>
                  </div>
                  <p style={{ color: GREEN }} className="text-lg font-semibold">
                    ▲ 2.4%
                  </p>
                </div>
              </div>

              {/* Chart */}
              <div className="h-40 mb-6">
                <TradingChart />
              </div>

              {/* Bull 3D on right side bottom */}
              <div className="absolute -right-16 -bottom-16 w-48 h-48 opacity-70">
                <Bull3D />
              </div>
            </div>

            {/* FLOATING CARDS */}

            {/* Left floating card - AI Signal */}
            <FloatingCard position="left">
              <div className="space-y-3">
                <p style={{ color: TEXT3 }} className="text-xs font-semibold uppercase tracking-wider">
                  AI Signal
                </p>
                <p style={{ color: GREEN }} className="text-2xl font-bold">
                  BUY
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p style={{ color: TEXT3 }} className="text-xs">
                      Confidence
                    </p>
                    <p style={{ color: TEXT1 }} className="text-sm font-semibold">
                      87%
                    </p>
                  </div>
                  <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-4/5" style={{ backgroundColor: GREEN }} />
                  </div>
                </div>
              </div>
            </FloatingCard>

            {/* Bottom floating card - Market Sentiment */}
            <FloatingCard position="bottom">
              <div className="text-center space-y-3">
                <p style={{ color: TEXT3 }} className="text-xs font-semibold uppercase tracking-wider">
                  Market Sentiment
                </p>
                <p style={{ color: GREEN }} className="text-xl font-bold">
                  Bullish
                </p>
                <div className="flex justify-center">
                  <svg width="60" height="30" viewBox="0 0 60 30">
                    <circle cx="30" cy="30" r="30" fill="none" stroke={`${GREEN}33`} strokeWidth="2" />
                    <path
                      d="M 30 30 A 30 30 0 0 1 58.66 16.18"
                      fill="none"
                      stroke={GREEN}
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </FloatingCard>

            {/* Right floating card - Top Gainers */}
            <FloatingCard position="right">
              <div className="space-y-3 w-56">
                <p style={{ color: TEXT3 }} className="text-xs font-semibold uppercase tracking-wider">
                  Top Gainers
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p style={{ color: TEXT1 }} className="text-sm">
                      SOL/USDT
                    </p>
                    <p style={{ color: GREEN }} className="text-sm font-semibold">
                      +5.6%
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p style={{ color: TEXT1 }} className="text-sm">
                      ETH/USDT
                    </p>
                    <p style={{ color: GREEN }} className="text-sm font-semibold">
                      +2.1%
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p style={{ color: TEXT1 }} className="text-sm">
                      BNB/USDT
                    </p>
                    <p style={{ color: GREEN }} className="text-sm font-semibold">
                      +1.8%
                    </p>
                  </div>
                </div>
              </div>
            </FloatingCard>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

