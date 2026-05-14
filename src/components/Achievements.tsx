import { useState, useMemo, useEffect } from "react";
import { Trophy, Shield, Smile, Star, Flame, BookOpen, Clock, Zap, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudy, BADGE_THRESHOLDS } from "./StudyContext";

const BADGE_META: Record<string, { icon: React.ElementType; color: string }> = {
  "Study Warrior":  { icon: Shield,   color: "var(--gradient-pink)" },
  "Focus Master":   { icon: Smile,    color: "var(--gradient-orange)" },
  "Exam Champion":  { icon: Star,     color: "var(--gradient-cyan)" },
  "7-Day Streak":   { icon: Flame,    color: "linear-gradient(135deg, oklch(0.7 0.25 20), oklch(0.78 0.18 60))" },
  "Bookworm":       { icon: BookOpen, color: "linear-gradient(135deg, oklch(0.5 0.1 270), oklch(0.65 0.25 295))" },
  "Early Bird":     { icon: Clock,    color: "linear-gradient(135deg, oklch(0.6 0.15 150), oklch(0.78 0.18 60))" },
  "Speed Learner":  { icon: Zap,      color: "var(--gradient-button)" },
  "Top Scorer":     { icon: Trophy,   color: "linear-gradient(135deg, oklch(0.78 0.18 60), oklch(0.72 0.27 350))" },
};

const MAX_XP = BADGE_THRESHOLDS[BADGE_THRESHOLDS.length - 1].xp;

export function Achievements() {
  const { xp, earnedBadges, resetDay } = useStudy();
  const [showAll, setShowAll] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const confetti = ["#ec4899", "#06b6d4", "#a855f7", "#fbbf24", "#10b981"];
  const confettiProps = useMemo(
    () => Array.from({ length: 20 }, (_, i) => ({
      left: `${Math.random() * 100}%`,
      duration: 4 + Math.random() * 3,
      delay: Math.random() * 4,
      color: confetti[i % confetti.length],
    })),
    []
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  const nextBadge = BADGE_THRESHOLDS.find(b => xp < b.xp);
  const level = earnedBadges.length;
  const pct = nextBadge ? Math.round((xp / nextBadge.xp) * 100) : 100;

  const allBadges = BADGE_THRESHOLDS.map(b => ({
    ...BADGE_META[b.label],
    label: b.label,
    earned: earnedBadges.includes(b.label),
  }));
  const badges = showAll ? allBadges : allBadges.slice(0, 3);

  return (
    <div className="glass rounded-3xl p-6 h-full relative overflow-hidden">
      {isClient && confettiProps.map((c, i) => (
        <motion.div
          key={i}
          initial={{ y: -20, opacity: 0, rotate: 0 }}
          animate={{ y: [0, 200], opacity: [0, 1, 0], rotate: 360 }}
          transition={{ duration: c.duration, repeat: Infinity, delay: c.delay }}
          className="absolute w-1.5 h-3 rounded-sm pointer-events-none"
          style={{ left: c.left, top: 0, background: c.color }}
        />
      ))}

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-neon-orange fill-neon-orange/30" />
          <h3 className="font-bold">Achievements</h3>
        </div>
        <button
          onClick={resetDay}
          title="Reset Day"
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium text-white hover:scale-105 transition"
          style={{ background: "var(--gradient-pink)" }}
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      <div className="flex items-center gap-4 mb-5 relative z-10">
        <div className="w-14 h-14 rounded-xl flex flex-col items-center justify-center" style={{ background: "var(--gradient-button)" }}>
          <span className="text-[10px] font-bold opacity-80">XP</span>
          <span className="text-sm font-bold">{xp}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{xp}</span>
            <span className="text-xs text-muted-foreground ml-auto">level <span className="font-bold text-foreground">{level}</span></span>
          </div>
          <div className="text-[10px] text-muted-foreground mb-1">
            {nextBadge ? `Next: ${nextBadge.label} at ${nextBadge.xp} XP` : "Max level reached!"}
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full transition-all duration-500" style={{ width: `${pct}%`, background: "var(--gradient-pink)" }} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        <div className="grid grid-cols-3 gap-3 relative z-10">
          {badges.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                whileHover={{ y: -4, scale: 1.05 }}
                className="flex flex-col items-center"
              >
                <div
                  className="w-14 h-14 flex items-center justify-center mb-2"
                  style={{
                    background: b.earned ? b.color : "rgba(255,255,255,0.05)",
                    clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
                    filter: b.earned ? "drop-shadow(0 0 12px oklch(0.65 0.25 295 / 0.5))" : "none",
                    opacity: b.earned ? 1 : 0.35,
                  }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-[10px] text-center text-muted-foreground leading-tight">{b.label}</span>
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>

      <button
        onClick={() => setShowAll(v => !v)}
        className="w-full mt-5 py-2.5 rounded-full glass-strong text-xs font-medium hover:bg-white/10 transition relative z-10"
      >
        {showAll ? "Show Less" : `View All Badges (${BADGE_THRESHOLDS.length})`}
      </button>
    </div>
  );
}
