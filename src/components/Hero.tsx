import { motion } from "framer-motion";
import { Rocket, Quote } from "lucide-react";
import heroImg from "/hero-bg.png";

export function Hero() {
  const startStudying = () => {
    document.getElementById("focus")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-[88vh] overflow-hidden rounded-3xl mx-4 lg:mx-12 mt-2">
      <img
        src={heroImg}
        alt="Tom and Jerry fantasy night scene"
        width={1920}
        height={1088}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-background/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      <div className="relative z-10 grid lg:grid-cols-12 gap-8 px-6 lg:px-16 py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 space-y-7"
        >
          <div className="inline-flex items-center gap-2 text-neon-orange font-medium">
            <span className="text-2xl">👋</span>
            <span className="text-lg">Hey <span className="text-foreground font-bold">Champion!</span></span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05]">
            You are capable of{" "}
            <span className="text-gradient-aurora">amazing</span> things.
          </h1>

          <div className="space-y-2 text-lg text-muted-foreground max-w-lg">
            <p>Small progress every day leads to big success.</p>
            <p>Believe in yourself and keep going. <span className="text-neon-pink">💗</span></p>
          </div>

          <motion.button
            onClick={startStudying}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full text-white font-semibold animate-pulse-glow"
            style={{ background: "var(--gradient-button)" }}
          >
            Start Studying
            <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </motion.button>

          <div className="flex items-center gap-3 pt-2">
            <div className="flex -space-x-2">
              {["🌸", "🌟", "🎀", "🦋"].map((e, i) => (
                <div key={i} className="w-9 h-9 rounded-full bg-[var(--gradient-aurora)] border-2 border-background flex items-center justify-center text-sm">{e}</div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              You are not alone. We are with you! <span className="text-neon-pink">💗</span>
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="lg:col-span-5 lg:col-start-8 self-center"
        >
          <div className="glass-strong rounded-3xl p-7 relative max-w-sm ml-auto">
            <Quote className="absolute -top-3 -left-3 w-10 h-10 text-neon-cyan fill-neon-cyan/20 rotate-180" />
            <Quote className="absolute -bottom-3 -right-3 w-10 h-10 text-neon-cyan fill-neon-cyan/20" />
            <div className="text-xs uppercase tracking-widest text-neon-cyan mb-3">✦ Today's Quote</div>
            <p className="text-2xl font-display leading-snug">
              "Don't stop when you're tired. Stop when you're done."
            </p>
            <p className="mt-4 text-sm text-muted-foreground">—LUSU</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
