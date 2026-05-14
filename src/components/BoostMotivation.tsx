import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, RefreshCw } from "lucide-react";
import chibi from "@/assets/chibi-boy.png";

const QUOTES = [
  "You are stronger than your excuses!",
  "Every expert was once a beginner.",
  "Push yourself, no one else will do it for you.",
  "Dream big. Work hard. Stay focused.",
  "Success is the sum of small efforts repeated daily.",
  "Believe you can and you're halfway there.",
  "Don't watch the clock; do what it does. Keep going.",
  "The harder you work, the luckier you get.",
];

export function BoostMotivation() {
  const [idx, setIdx] = useState(0);
  const [stars, setStars] = useState<{ top: string; left: string; fontSize: string; duration: number }[]>([]);

  useEffect(() => {
    setStars([...Array(8)].map(() => ({
      top: `${Math.random() * 80}%`,
      left: `${Math.random() * 90}%`,
      fontSize: `${10 + Math.random() * 14}px`,
      duration: 2 + Math.random() * 2,
    })));
  }, []);

  const next = () => setIdx(i => (i + 1) % QUOTES.length);

  return (
    <div className="glass rounded-3xl p-6 h-full relative overflow-hidden flex flex-col">
      <div className="flex items-center gap-2 mb-1">
        <Zap className="w-5 h-5 text-neon-orange fill-neon-orange" />
        <h3 className="font-bold">Boost Motivation</h3>
      </div>
      <p className="text-xs text-muted-foreground">Need a little push?</p>

      <div className="relative flex-1 flex items-center justify-center my-2">
        {stars.map((s, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -10, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: s.duration, repeat: Infinity, delay: i * 0.3 }}
            className="absolute text-neon-orange"
            style={{
              top: s.top,
              left: s.left,
              fontSize: s.fontSize,
              filter: "drop-shadow(0 0 6px oklch(0.78 0.18 60))",
            }}
          >
            ✦
          </motion.div>
        ))}
        <motion.img
          src={chibi}
          alt="Chibi character"
          loading="lazy"
          width={512}
          height={512}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-40 h-40 object-contain relative z-10 drop-shadow-[0_0_30px_oklch(0.65_0.25_295/0.5)]"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="text-center font-semibold leading-snug mb-3 min-h-[3rem] flex items-center justify-center"
        >
          {QUOTES[idx]}
        </motion.p>
      </AnimatePresence>

      <button
        onClick={next}
        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-white font-medium animate-pulse-glow hover:scale-105 transition"
        style={{ background: "var(--gradient-button)" }}
      >
        Another One <RefreshCw className="w-4 h-4" />
      </button>
    </div>
  );
}
