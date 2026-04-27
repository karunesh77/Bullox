import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TradingChart from "./TradingChart";
import Bull3DPremium from "./Bull3DPremium";
import AnimatedBackground from "./AnimatedBackground";

export default function HeroNew() {
  const navigate = useNavigate();

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden bg-slate-950">
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <AnimatedBackground />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-5 z-0" style={{
        backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(59, 130, 246, 0.1) 25%, rgba(59, 130, 246, 0.1) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, 0.1) 75%, rgba(59, 130, 246, 0.1) 76%, transparent 77%, transparent),
                         linear-gradient(90deg, transparent 24%, rgba(59, 130, 246, 0.1) 25%, rgba(59, 130, 246, 0.1) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, 0.1) 75%, rgba(59, 130, 246, 0.1) 76%, transparent 77%, transparent)`,
        backgroundSize: "60px 60px",
      }} />

      {/* Light rays background effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/2 -right-96 w-96 h-96 bg-gradient-to-l from-blue-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl opacity-30" />
        <div className="absolute -bottom-96 -left-96 w-96 h-96 bg-gradient-to-t from-purple-500/15 via-blue-500/10 to-transparent rounded-full blur-3xl opacity-20" />
      </div>

      {/* Main content */}
      <motion.div
        className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* LEFT SIDE */}
        <motion.div className="space-y-8" variants={itemVariants}>
          <div className="space-y-6">
            <motion.h1 className="text-6xl sm:text-7xl lg:text-7xl font-bold leading-tight tracking-tight" variants={itemVariants}>
              <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">Trade Smarter</span>
              <br />
              <span className="text-gray-100">with AI-Powered Signals</span>
            </motion.h1>

            <motion.p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-lg" variants={itemVariants}>
              Get real-time trading signals, advanced analytics, and professional-grade tools all in one platform. Start trading smarter today.
            </motion.p>
          </div>

          <motion.div className="flex flex-col sm:flex-row gap-4 pt-4" variants={itemVariants}>
            <motion.button
              onClick={() => navigate("/dashboard")}
              className="group relative px-8 py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #3B82F6 0%, #1e40af 100%)",
                boxShadow: "0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(59, 130, 246, 0.2)",
              }}
              whileHover={{ boxShadow: "0 0 40px rgba(59, 130, 246, 0.7), 0 0 80px rgba(59, 130, 246, 0.3)" }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started Free
                <ArrowRight size={19} strokeWidth={2.5} />
              </span>
            </motion.button>

            <motion.button
              className="group px-8 py-4 rounded-xl font-semibold border-2 flex items-center justify-center gap-2 transition-all duration-300 backdrop-blur-md"
              style={{
                borderColor: "#3B82F6",
                color: "#3B82F6",
                backgroundColor: "rgba(59, 130, 246, 0.05)",
                boxShadow: "0 0 20px rgba(59, 130, 246, 0.2), inset 0 0 20px rgba(59, 130, 246, 0.05)",
              }}
              whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.15)", boxShadow: "0 0 30px rgba(59, 130, 246, 0.3)" }}
            >
              <Play size={18} fill="currentColor" />
              Watch Demo
            </motion.button>
          </motion.div>

          <motion.div className="space-y-2 text-sm text-gray-400 pt-4" variants={itemVariants}>
            <p>✓ No credit card required</p>
            <p>✓ Free forever plan</p>
            <p>✓ Cancel anytime</p>
          </motion.div>
        </motion.div>

        {/* RIGHT SIDE - DASHBOARD */}
        <motion.div className="relative h-[600px] lg:h-[700px]" variants={itemVariants}>
          {/* Glowing platform base */}
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-40 rounded-full blur-3xl -z-10"
            style={{
              background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
              opacity: 0.15,
            }}
          />

          {/* Main dashboard card */}
          <div
            className="relative w-full h-full backdrop-blur-xl rounded-3xl p-8 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.7) 0%, rgba(15, 23, 42, 0.4) 100%)",
              border: "1.5px solid rgba(59, 130, 246, 0.3)",
              boxShadow: "0 0 50px rgba(59, 130, 246, 0.25), 0 0 100px rgba(59, 130, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            }}
          >
            {/* Inner glow */}
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100" style={{
              boxShadow: "inset 0 0 30px rgba(59, 130, 246, 0.1)",
            }} />

            {/* Header */}
            <div className="relative mb-8 pb-8 border-b border-white/10">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm mb-3 font-semibold tracking-wide">BTC/USDT</p>
                  <p className="text-4xl font-bold text-white">$66,745.51</p>
                </div>
                <p className="text-green-400 text-xl font-bold">▲ 2.4%</p>
              </div>
            </div>

            {/* Chart container */}
            <div className="relative h-44 mb-8 rounded-xl p-4" style={{
              background: "rgba(15, 23, 42, 0.5)",
              border: "1px solid rgba(59, 130, 246, 0.1)",
            }}>
              <TradingChart />
            </div>

            {/* 3D Bull - positioned on right bottom */}
            <div className="absolute -right-12 -bottom-12 w-64 h-64 opacity-80 z-20">
              <Bull3DPremium />
            </div>
          </div>

          {/* LEFT FLOATING CARD - AI Signal */}
          <motion.div
            className="absolute left-0 top-1/3 -translate-x-20"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div
              className="backdrop-blur-xl rounded-2xl p-5 w-56"
              style={{
                background: "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.4) 100%)",
                border: "1.5px solid rgba(59, 130, 246, 0.3)",
                boxShadow: "0 0 30px rgba(59, 130, 246, 0.2), 0 0 60px rgba(59, 130, 246, 0.1)",
              }}
            >
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">AI Signal</p>
              <p className="text-green-400 text-3xl font-bold mb-4">BUY</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-gray-400 text-sm">Confidence</p>
                  <p className="text-white font-bold">87%</p>
                </div>
                <div className="w-full h-2 bg-gray-700/50 rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-gradient-to-r from-green-400 to-green-500 rounded-full" style={{ boxShadow: "0 0 10px #22C55E" }} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* BOTTOM FLOATING CARD - Market Sentiment */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
          >
            <div
              className="backdrop-blur-xl rounded-2xl p-6 text-center w-64"
              style={{
                background: "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.4) 100%)",
                border: "1.5px solid rgba(59, 130, 246, 0.3)",
                boxShadow: "0 0 30px rgba(59, 130, 246, 0.2), 0 0 60px rgba(59, 130, 246, 0.1)",
              }}
            >
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">Market Sentiment</p>
              <p className="text-green-400 text-2xl font-bold mb-4">Bullish</p>
              <svg width="100" height="50" viewBox="0 0 100 50" className="mx-auto">
                <circle cx="50" cy="50" r="50" fill="none" stroke="rgba(34, 197, 94, 0.1)" strokeWidth="2" />
                <path
                  d="M 50 50 A 50 50 0 0 1 91.42 25"
                  fill="none"
                  stroke="#22C55E"
                  strokeWidth="4"
                  strokeLinecap="round"
                  style={{ filter: "drop-shadow(0 0 8px #22C55E)" }}
                />
              </svg>
            </div>
          </motion.div>

          {/* RIGHT FLOATING CARD - Top Gainers */}
          <motion.div
            className="absolute right-0 top-1/4 -translate-x-20"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, delay: 1 }}
          >
            <div
              className="backdrop-blur-xl rounded-2xl p-5 w-60"
              style={{
                background: "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.4) 100%)",
                border: "1.5px solid rgba(59, 130, 246, 0.3)",
                boxShadow: "0 0 30px rgba(59, 130, 246, 0.2), 0 0 60px rgba(59, 130, 246, 0.1)",
              }}
            >
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">Top Gainers</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-white text-sm">SOL/USDT</p>
                  <p className="text-green-400 font-bold">+5.6%</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-white text-sm">ETH/USDT</p>
                  <p className="text-green-400 font-bold">+2.1%</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-white text-sm">BNB/USDT</p>
                  <p className="text-green-400 font-bold">+1.8%</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

