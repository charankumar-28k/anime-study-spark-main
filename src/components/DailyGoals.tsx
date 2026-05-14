import { useState } from "react";
import { Check, Target, BookOpen, FileText, HelpCircle, Droplet, Coffee, Plus, X } from "lucide-react";
import { useStudy } from "./StudyContext";

const ICONS = [BookOpen, FileText, HelpCircle, Droplet, Coffee];

export function DailyGoals() {
  const { goals: items, toggleGoal, addGoal, removeGoal } = useStudy();
  const [adding, setAdding] = useState(false);
  const [newTask, setNewTask] = useState("");

  const toggle = (i: number) => toggleGoal(i);

  const remove = (i: number, e: React.MouseEvent) => {
    e.stopPropagation();
    removeGoal(i);
  };

  const addTask = () => {
    const label = newTask.trim();
    if (!label) return;
    addGoal(label);
    setNewTask("");
    setAdding(false);
  };

  const completed = items.filter(i => i.done).length;
  const pct = items.length ? (completed / items.length) * 100 : 0;

  return (
    <div className="glass rounded-3xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-neon-cyan" />
          <h3 className="font-bold">Daily Goals</h3>
        </div>
        <button
          onClick={() => setAdding(v => !v)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium text-white hover:scale-105 transition"
          style={{ background: "var(--gradient-cyan)" }}
        >
          <Plus className="w-3 h-3" /> Add Task
        </button>
      </div>

      {/* Add task input */}
      {adding && (
        <div className="flex items-center gap-2 mb-3 glass-strong rounded-xl px-3 py-2">
          <input
            autoFocus
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") addTask();
              if (e.key === "Escape") { setAdding(false); setNewTask(""); }
            }}
            placeholder="Type your task and press Enter…"
            className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground py-1"
          />
          <button onClick={addTask} className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--gradient-cyan)" }}>
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </button>
          <button onClick={() => { setAdding(false); setNewTask(""); }} className="text-muted-foreground hover:text-red-400 transition">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        {items.map((it, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              className="flex items-center gap-3 w-full text-left group"
            >
              <Icon className="w-4 h-4 text-neon-cyan flex-shrink-0" />
              <span className={`flex-1 text-sm ${it.done ? "line-through text-muted-foreground" : ""}`}>
                {it.label}
              </span>
              {it.custom && (
                <span
                  onClick={e => remove(i, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-white/10 text-muted-foreground hover:text-red-400 transition"
                >
                  <X className="w-3 h-3" />
                </span>
              )}
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center transition flex-shrink-0 ${it.done ? "" : "border border-white/20"}`}
                style={it.done ? { background: "var(--gradient-cyan)", boxShadow: "0 0 12px oklch(0.85 0.18 200 / 0.5)" } : {}}
              >
                {it.done && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-semibold">{completed}/{items.length} Completed</span>
          <span className="text-xs text-muted-foreground">{Math.round(pct)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full transition-all duration-500" style={{ width: `${pct}%`, background: "var(--gradient-cyan)" }} />
        </div>
      </div>
    </div>
  );
}
