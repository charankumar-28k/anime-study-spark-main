import { createContext, useContext, useState } from "react";

export type Goal = { label: string; done: boolean; custom?: boolean };

const XP_PER_TASK = 50;

export const BADGE_THRESHOLDS = [
  { label: "Study Warrior",  xp: 50  },
  { label: "Focus Master",   xp: 150 },
  { label: "Exam Champion",  xp: 300 },
  { label: "7-Day Streak",   xp: 450 },
  { label: "Bookworm",       xp: 600 },
  { label: "Early Bird",     xp: 800 },
  { label: "Speed Learner",  xp: 1000 },
  { label: "Top Scorer",     xp: 1250 },
];

const INITIAL_GOALS: Goal[] = [
  { label: "Complete a chapter",   done: false },
  { label: "Revise notes",         done: false },
  { label: "Practice questions",   done: false },
  { label: "Drink enough water",   done: false },
  { label: "Take short breaks",    done: false },
];

type StudyContextType = {
  timerRunning: boolean;
  setTimerRunning: (v: boolean) => void;
  xp: number;
  goals: Goal[];
  toggleGoal: (i: number) => void;
  addGoal: (label: string) => void;
  removeGoal: (i: number) => void;
  resetDay: () => void;
  earnedBadges: string[];
};

const StudyContext = createContext<StudyContextType>({
  timerRunning: false,
  setTimerRunning: () => {},
  xp: 0,
  goals: INITIAL_GOALS,
  toggleGoal: () => {},
  addGoal: () => {},
  removeGoal: () => {},
  resetDay: () => {},
  earnedBadges: [],
});

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const [timerRunning, setTimerRunning] = useState(false);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [xp, setXp] = useState(0);

  const earnedBadges = BADGE_THRESHOLDS.filter(b => xp >= b.xp).map(b => b.label);

  const toggleGoal = (i: number) => {
    setGoals(prev => {
      const updated = prev.map((g, idx) => idx === i ? { ...g, done: !g.done } : g);
      const wasCompleted = prev[i].done;
      setXp(x => wasCompleted ? Math.max(0, x - XP_PER_TASK) : x + XP_PER_TASK);
      return updated;
    });
  };

  const addGoal = (label: string) =>
    setGoals(prev => [...prev, { label, done: false, custom: true }]);

  const removeGoal = (i: number) => {
    setGoals(prev => {
      if (prev[i].done) setXp(x => Math.max(0, x - XP_PER_TASK));
      return prev.filter((_, idx) => idx !== i);
    });
  };

  const resetDay = () => {
    setGoals(INITIAL_GOALS);
    setXp(0);
  };

  return (
    <StudyContext.Provider value={{ timerRunning, setTimerRunning, xp, goals, toggleGoal, addGoal, removeGoal, resetDay, earnedBadges }}>
      {children}
    </StudyContext.Provider>
  );
}

export const useStudy = () => useContext(StudyContext);
