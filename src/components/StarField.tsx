import { useState, useEffect } from "react";

function generateStars(count: number) {
  return Array.from({ length: count }, () => ({
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 5,
    duration: 2 + Math.random() * 4,
  }));
}

export function StarField({ count = 80 }: { count?: number }) {
  const [stars, setStars] = useState<ReturnType<typeof generateStars>>([]);

  useEffect(() => {
    setStars(generateStars(count));
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            boxShadow: `0 0 ${s.size * 3}px white`,
          }}
        />
      ))}
    </div>
  );
}
