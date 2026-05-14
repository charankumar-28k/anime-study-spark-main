import { Smile, Target, Calendar } from "lucide-react";
import sunrise from "@/assets/footer-sunrise.jpg";

export function FooterCTA() {
  return (
    <section className="relative rounded-3xl overflow-hidden mx-4 lg:mx-12 mt-8">
      <img src={sunrise} alt="Sunrise mountain" loading="lazy" width={1920} height={768} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/30 to-background/60" />

      <div className="relative z-10 px-8 lg:px-16 py-20 lg:py-28">
        <div className="max-w-3xl">
          <p className="text-2xl lg:text-3xl font-light text-white/90 mb-2">
            No matter how difficult it feels now,
          </p>
          <h2 className="text-5xl lg:text-7xl font-bold leading-[1.05]">
            <span className="text-white">keep moving </span>
            <span className="text-gradient-aurora">forward.</span>
          </h2>
          <p className="text-lg text-white/80 mt-6">
            You've got this, and I'll always be cheering for you! <span className="text-neon-cyan">💙</span>
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            {[
              { icon: Smile, label: "Stay Positive", color: "text-neon-orange" },
              { icon: Target, label: "Stay Focused", color: "text-neon-pink" },
              { icon: Calendar, label: "Stay Consistent", color: "text-neon-cyan" },
            ].map((it, i) => {
              const Icon = it.icon;
              return (
                <div key={i} className="glass rounded-full px-5 py-2.5 flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${it.color}`} />
                  <span className="text-sm font-medium">{it.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="absolute right-8 lg:right-20 top-1/2 -translate-y-1/2 hidden md:block text-neon-orange text-5xl lg:text-7xl italic font-bold leading-tight text-right"
          style={{
            fontFamily: "cursive",
            textShadow: "0 0 20px oklch(0.78 0.18 60), 0 0 40px oklch(0.78 0.18 60 / 0.6)",
          }}
        >
          Your<br/>Future is<br/>Bright ✦
        </div>
      </div>

      <div className="relative z-10 glass-strong border-t border-white/10 py-5 px-8 text-center">
        <p className="text-sm text-muted-foreground">
          <span className="text-neon-pink">💗</span> Made with friendship & lots of belief in you! <span className="text-neon-cyan">💙</span>
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          You are going to make it. We are so proud of you already! ✨
        </p>
      </div>
    </section>
  );
}
