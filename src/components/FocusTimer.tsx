import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Clock, Play, Pause, RotateCcw } from "lucide-react";
import roomImg from "@/assets/study-room.jpg";
import { useStudy } from "@/components/StudyContext";

const DURATIONS = { Focus: 25 * 60, "Short Break": 5 * 60, "Long Break": 15 * 60 };
type Tab = keyof typeof DURATIONS;

export function FocusTimer() {
  const [tab, setTab] = useState<Tab>("Focus");
  const [timeLeft, setTimeLeft] = useState(DURATIONS["Focus"]);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { setTimerRunning } = useStudy();

  useEffect(() => { setTimerRunning(running); }, [running]);

  const total = DURATIONS[tab];
  const r = 110;
  const c = 2 * Math.PI * r;
  const pct = timeLeft / total;

  useEffect(() => {
    setRunning(false);
    setTimeLeft(DURATIONS[tab]);
  }, [tab]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current!);
    }
    return () => clearInterval(intervalRef.current!);
  }, [running]);

  const reset = () => {
    setRunning(false);
    setTimeLeft(DURATIONS[tab]);
  };

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="relative rounded-3xl overflow-hidden h-full min-h-[420px]">
      <img src={roomImg} alt="Cozy study room" loading="lazy" width={1024} height={768} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-br from-background/85 via-background/70 to-background/85" />

      <div className="relative z-10 p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-neon-cyan" />
            <h3 className="font-bold text-lg">Focus Timer</h3>
          </div>
          <div className="glass rounded-full px-3 py-1.5 text-xs flex items-center gap-1.5">
            Pomodoro Mode <span>🍅</span>
          </div>
        </div>

        <div className="glass rounded-full p-1 flex w-fit mx-auto text-xs">
          {(Object.keys(DURATIONS) as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full transition ${tab === t ? "text-white" : "text-muted-foreground"}`}
              style={tab === t ? { background: "var(--gradient-button)" } : {}}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 flex items-center justify-center my-4">
          <div className="relative">
            <svg width="260" height="260" className="-rotate-90">
              <defs>
                <linearGradient id="timerGrad" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.85 0.18 200)" />
                  <stop offset="100%" stopColor="oklch(0.78 0.18 60)" />
                </linearGradient>
              </defs>
              <circle cx="130" cy="130" r={r} fill="none" stroke="oklch(1 0 0 / 0.08)" strokeWidth="10" />
              <motion.circle
                cx="130" cy="130" r={r} fill="none"
                stroke="url(#timerGrad)" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={c}
                animate={{ strokeDashoffset: c - c * pct }}
                transition={{ duration: 0.5 }}
                style={{ filter: "drop-shadow(0 0 12px oklch(0.85 0.18 200))" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl font-bold tracking-tight">{mins}:{secs}</div>
              <div className="text-xs text-muted-foreground mt-1">{tab}</div>
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => setRunning(r => !r)}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-strong text-sm font-medium hover:scale-105 transition"
                >
                  {running ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  {running ? "Pause" : "Start"}
                </button>
                <button
                  onClick={reset}
                  className="p-2 rounded-full glass-strong hover:scale-105 transition"
                  title="Reset"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
