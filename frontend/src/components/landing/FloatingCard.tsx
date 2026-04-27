import { motion } from "framer-motion";

interface FloatingCardProps {
  position: "left" | "bottom" | "right";
  children: React.ReactNode;
}

export default function FloatingCard({ position, children }: FloatingCardProps) {
  const positions = {
    left: "absolute -left-12 top-1/4",
    bottom: "absolute -bottom-6 left-1/2 transform -translate-x-1/2",
    right: "absolute -right-8 top-0",
  };

  const variants = {
    left: { y: [0, -20, 0] },
    bottom: { y: [0, 15, 0] },
    right: { y: [0, -25, 0] },
  };

  return (
    <motion.div
      className={`${positions[position]}`}
      animate={variants[position]}
      transition={{ duration: 3 + Math.random() * 2, repeat: Infinity }}
    >
      <div
        className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4 w-max shadow-2xl hover:bg-white/10 transition-all"
        style={{
          boxShadow: "0 0 20px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}

