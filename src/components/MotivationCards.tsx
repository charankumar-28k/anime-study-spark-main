import { motion } from "framer-motion";
import { Sparkles, Star, Heart, BookOpen, Trophy } from "lucide-react";

const cards = [
  { icon: Star, title: "One step", subtitle: "at a time.", note: "You're getting closer!", grad: "var(--gradient-pink)", glow: "oklch(0.72 0.27 350 / 0.4)" },
  { icon: Heart, title: "You're doing", subtitle: "better than you think.", note: "Keep it up!", grad: "linear-gradient(135deg, oklch(0.7 0.25 20), oklch(0.72 0.27 350))", glow: "oklch(0.7 0.25 20 / 0.4)" },
  { icon: BookOpen, title: "Focus today,", subtitle: "shine tomorrow.", note: "Your future is bright!", grad: "var(--gradient-orange)", glow: "oklch(0.78 0.18 60 / 0.4)" },
  { icon: Trophy, title: "Hard work always", subtitle: "pays off.", note: "Never give up!", grad: "var(--gradient-cyan)", glow: "oklch(0.85 0.18 200 / 0.4)" },
];

export function MotivationCards() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-neon-orange" />
        <h2 className="text-2xl font-bold">Daily Motivation</h2>
        <Sparkles className="w-4 h-4 text-neon-cyan" />
      </div>
      <p className="text-sm text-muted-foreground mb-5">A little push for your amazing journey!</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, boxShadow: `0 0 50px ${c.glow}` }}
              className="glass rounded-2xl p-5 cursor-pointer transition-shadow"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: c.grad, boxShadow: `0 0 24px ${c.glow}` }}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold leading-tight">
                {c.title}<br/>{c.subtitle}
              </h3>
              <p className="text-xs text-muted-foreground mt-3">{c.note}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
