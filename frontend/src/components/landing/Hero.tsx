import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative min-h-[100vh] overflow-hidden bg-gray-950 flex items-center justify-center">
      {/* Deep space gradient base */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-[#04110a] to-gray-950" />

      {/* Aurora streaks — vertical light beams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => {
          const left = (i * 2.5) + (Math.sin(i) * 1);
          const height = 30 + ((i * 7) % 40);
          const delay = (i * 0.15) % 4;
          const duration = 3 + ((i * 0.3) % 3);
          const colors = ['#22c55e', '#10b981', '#14b8a6', '#059669', '#34d399'];
          const color = colors[i % colors.length];
          return (
            <div
              key={i}
              className="absolute top-0 animate-aurora"
              style={{
                left: `${left}%`,
                width: '2px',
                height: `${height}%`,
                background: `linear-gradient(to bottom, ${color}00 0%, ${color}cc 20%, ${color}66 60%, transparent 100%)`,
                filter: 'blur(1px)',
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                opacity: 0.6,
              }}
            />
          );
        })}
      </div>

      {/* Big glow at top center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-green-500/30 via-emerald-500/20 to-transparent blur-[100px] rounded-full" />

      {/* Horizontal light band */}
      <div className="absolute top-[35%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400/60 to-transparent" />
      <div className="absolute top-[35%] left-0 right-0 h-24 bg-gradient-to-b from-green-400/20 to-transparent blur-2xl" />

      {/* Stars/particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              left: `${(i * 13.7) % 100}%`,
              top: `${(i * 17.3) % 100}%`,
              width: `${1 + (i % 2)}px`,
              height: `${1 + (i % 2)}px`,
              opacity: 0.1 + ((i * 7) % 40) / 100,
              animationDelay: `${(i * 0.2) % 3}s`,
            }}
          />
        ))}
      </div>

      {/* Bottom fade to show scroll content */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-gray-950 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center pt-20 pb-32">
        <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-bold text-white leading-[0.95] tracking-tight mb-8">
          Trade first.<br />
          <span className="text-gray-400">Win</span>
          <span className="text-white"> next.</span>
        </h1>

        <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed">
          The best traders research before they risk. Bullox gives you the edge.
        </p>

        <div className="flex flex-col items-center gap-4">
          <Link
            to="/register"
            className="group relative bg-white text-gray-950 font-semibold text-lg px-10 py-5 rounded-2xl hover:bg-gray-100 active:scale-95 transition-all shadow-[0_0_60px_rgba(255,255,255,0.25)] hover:shadow-[0_0_80px_rgba(34,197,94,0.4)]"
          >
            Get started for free
          </Link>
          <p className="text-sm text-gray-400">
            $0 forever, no credit card needed
          </p>
        </div>

        {/* Featured trader card — bottom right */}
        <div className="absolute bottom-8 right-4 md:right-8 hidden md:block">
          <div className="flex items-center gap-3 bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-2xl p-3 pr-5 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-gray-950 font-bold text-lg">
              R
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-white">Rakesh Jhunjhunwala</p>
              <p className="text-xs text-gray-400">Top copy trader · +284%</p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-end gap-1.5 pr-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-gray-500">Live trading now</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow">
        <div className="w-6 h-10 rounded-full border-2 border-gray-600 flex items-start justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-gray-500" />
        </div>
      </div>
    </section>
  );
}
