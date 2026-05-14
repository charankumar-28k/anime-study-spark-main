import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const links = [
  { label: "Home", id: "home" },
  { label: "Focus", id: "focus" },
  { label: "Goals", id: "goals" },
  { label: "Progress", id: "progress" },
  { label: "Motivation", id: "motivation" },
  { label: "AI Buddy", id: "ai-buddy" },
];

export function Navbar() {
  const [active, setActive] = useState("home");

  const scrollTo = (id: string) => {
    setActive(id);
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative z-50 flex items-center justify-between px-6 lg:px-12 py-5"
    >
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo("home")}>
        <Star className="w-9 h-9 text-neon-orange fill-neon-orange drop-shadow-[0_0_12px_oklch(0.78_0.18_60)]" />
        <div>
          <div className="text-xl font-bold tracking-tight">Mahh</div>
          <div className="text-[10px] text-muted-foreground tracking-widest uppercase">
             Deepumah Your Success, Our Mission
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-1 glass rounded-full px-2 py-2">
        {links.map(l => (
          <button
            key={l.label}
            onClick={() => scrollTo(l.id)}
            className={`relative px-4 py-2 text-sm rounded-full transition-all ${
              active === l.id ? "text-white" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {l.label}
            {active === l.id && (
              <motion.span
                layoutId="nav-active"
                className="absolute inset-0 -z-10 rounded-full"
                style={{ background: "var(--gradient-button)" }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="w-11 h-11 rounded-full p-[2px] bg-[var(--gradient-aurora)]">
        <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-sm font-bold">
          ✨
        </div>
      </div>
    </motion.nav>
  );
}
