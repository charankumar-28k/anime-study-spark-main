import { motion } from "framer-motion";
import { Target } from "lucide-react";

export function ProgressRing() {
  const pct = 62.5;
  const r = 70;
  const c = 2 * Math.PI * r;

  return (
    <div className="glass rounded-2xl p-6 h-full">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-button)" }}>
          <Target className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold">Keep Going!</h3>
          <p className="text-xs text-muted-foreground">You've got dreams to achieve!</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-5">
        <div className="relative">
          <svg width="170" height="170" className="-rotate-90">
            <defs>
              <linearGradient id="ringGrad" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.85 0.18 200)" />
                <stop offset="50%" stopColor="oklch(0.65 0.25 295)" />
                <stop offset="100%" stopColor="oklch(0.72 0.27 350)" />
              </linearGradient>
            </defs>
            <circle cx="85" cy="85" r={r} fill="none" stroke="oklch(1 0 0 / 0.08)" strokeWidth="12" />
            <motion.circle
              cx="85" cy="85" r={r} fill="none"
              stroke="url(#ringGrad)" strokeWidth="12" strokeLinecap="round"
              strokeDasharray={c}
              initial={{ strokeDashoffset: c }}
              whileInView={{ strokeDashoffset: c - (c * pct) / 100 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: "easeOut" }}
              style={{ filter: "drop-shadow(0 0 8px oklch(0.65 0.25 295))" }}
            />
          </svg>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Study Hours</p>
          <p className="text-3xl font-bold">12.5 <span className="text-base text-muted-foreground">hrs</span></p>
          <p className="text-xs text-muted-foreground mt-3">This Week</p>
          <p className="text-sm font-semibold mt-2">Goal: 20 hrs</p>
          <div className="w-28 h-1.5 rounded-full bg-white/10 mt-1 overflow-hidden">
            <div className="h-full" style={{ width: `${pct}%`, background: "var(--gradient-pink)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
