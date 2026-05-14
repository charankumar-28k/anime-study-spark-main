import { useState, useRef, useEffect } from "react";
import { Bot, Send, Loader2 } from "lucide-react";
import robot from "@/assets/ai-robot.png";
import { motion } from "framer-motion";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

const SYSTEM_PROMPT =
  "You are a highly intelligent AI assistant. " +
  "Answer every question accurately, clearly and in detail. " +
  "For study/academic questions: give structured explanations with examples and steps. " +
  "For general questions: answer naturally and helpfully. " +
  "Format answers with bullet points or numbered steps when it helps clarity. " +
  "Be concise but never skip important details.";

type Message = { from: "ai" | "me"; text: string };

const INITIAL: Message[] = [
  { from: "ai", text: "Hey! 👋 I'm your AI assistant. Ask me anything — studies, doubts, or general questions!" },
];

async function askGemini(userMessage: string, history: Message[]): Promise<string> {
  const contents = [
    ...history.slice(-8).map(m => ({
      role: m.from === "me" ? "user" : "model",
      parts: [{ text: m.text }],
    })),
    { role: "user", parts: [{ text: userMessage }] },
  ];

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
          { role: "model", parts: [{ text: "Understood! I will answer every question accurately and helpfully." }] },
          ...contents,
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 512,
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `HTTP ${res.status}`);
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sorry, I couldn't generate a response. Please try again.";
}

export function AIBuddy() {
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { from: "me", text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const reply = await askGemini(text, [...messages, userMsg]);
      setMessages(prev => [...prev, { from: "ai", text: reply }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { from: "ai", text: `⚠️ ${err?.message ?? "Something went wrong. Try again."}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-3xl p-5 h-full flex flex-col relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-neon-cyan" />
          <h3 className="font-bold">AI Study Buddy</h3>
        </div>
        <div className="flex items-center gap-1.5 text-[10px]">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" style={{ boxShadow: "0 0 8px #4ade80" }} />
          {API_KEY ? "Gemini Pro" : "No API Key"}
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto max-h-52 pr-1">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                m.from === "me" ? "text-white rounded-br-sm" : "glass-strong rounded-bl-sm"
              }`}
              style={m.from === "me" ? { background: "var(--gradient-button)" } : {}}
            >
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="glass-strong px-4 py-2 rounded-2xl rounded-bl-sm flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin text-neon-cyan" />
              <span className="text-xs text-muted-foreground">Thinking…</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <motion.img
        src={robot}
        alt="AI robot"
        loading="lazy"
        width={512}
        height={512}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute bottom-14 right-2 w-20 h-20 object-contain drop-shadow-[0_0_20px_oklch(0.85_0.18_200/0.6)] pointer-events-none"
      />

      <div className="mt-3 flex items-center gap-2 glass-strong rounded-full pl-4 pr-1 py-1">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Ask me anything…"
          disabled={loading}
          className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground py-2 disabled:opacity-50"
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "var(--gradient-button)" }}
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" /> : <Send className="w-3.5 h-3.5 text-white" />}
        </button>
      </div>
    </div>
  );
}
