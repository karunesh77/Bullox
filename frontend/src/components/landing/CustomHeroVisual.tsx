import { motion } from "framer-motion";

export default function CustomHeroVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Background glow - dynamic */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at center, rgba(59,130,246,0.2) 0%, rgba(139,92,246,0.1) 40%, transparent 80%)",
        }}
        animate={{
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Image with animations */}
      <motion.img
        src="/bull-bg.png"
        alt="Bull"
        className="relative w-full h-full object-contain"
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          filter: "drop-shadow(0 0 30px rgba(59,130,246,0.5)) drop-shadow(0 0 60px rgba(139,92,246,0.3)) brightness(1.1) contrast(1.15)",
        }}
      />

      {/* Overlay glow rings */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: "2px solid rgba(59,130,246,0.2)",
            boxShadow: "0 0 30px rgba(59,130,246,0.3), inset 0 0 30px rgba(139,92,246,0.1)",
          }}
          animate={{
            scale: [0.8, 1.1, 0.8],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: "1px solid rgba(139,92,246,0.15)",
          }}
          animate={{
            scale: [1.1, 0.9, 1.1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </div>
    </div>
  );
}
