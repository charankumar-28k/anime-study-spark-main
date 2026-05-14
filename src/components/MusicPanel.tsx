import { useState, useRef, useEffect, useCallback } from "react";
import { Music, Upload, X, Volume2, Search, Play, Pause, SkipForward, SkipBack, Loader, RefreshCw } from "lucide-react";
import { useStudy } from "@/components/StudyContext";

type Song = { id: number; title: string; artist: string; album: string; artwork: string; preview: string };

const DEFAULT_QUERIES = ["Arijit Singh", "Bollywood hits", "Punjabi hits", "Telugu hits", "AR Rahman", "Shreya Ghoshal"];

function Equalizer() {
  return (
    <div className="flex items-end gap-0.5 h-4 flex-shrink-0">
      {[3, 5, 2, 6, 4, 3, 5].map((h, i) => (
        <div key={i} className="w-0.5 rounded-full bg-neon-cyan animate-pulse"
          style={{ height: `${h * 3}px`, animationDelay: `${i * 0.1}s` }} />
      ))}
    </div>
  );
}

function formatTime(s: number) {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

type LocalTrack = { name: string; file: string };

export function MusicPanel() {
  const [tab, setTab] = useState<"songs" | "local">("songs");

  // ── Online songs state ──────────────────────────────────────────────────
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("Arijit Singh");
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ── Local songs state ───────────────────────────────────────────────────
  const [localTracks, setLocalTracks] = useState<LocalTrack[]>([]);
  const [localIdx, setLocalIdx] = useState<number | null>(null);
  const [localVol, setLocalVol] = useState(0.8);
  const localAudioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { timerRunning } = useStudy();

  // pause music when focus timer starts
  useEffect(() => {
    if (timerRunning) { audioRef.current?.pause(); setIsPlaying(false); }
  }, [timerRunning]);

  // ── Fetch songs from iTunes API ─────────────────────────────────────────
  const [page, setPage] = useState(0); // used to trigger refresh with same query

  const fetchSongs = useCallback(async (q: string, offset: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&country=IN&media=music&limit=30&entity=song&offset=${offset * 5}`
      );
      const data = await res.json();
      const all: Song[] = (data.results ?? [])
        .filter((r: any) => r.previewUrl)
        .map((r: any) => ({
          id: r.trackId,
          title: r.trackName,
          artist: r.artistName,
          album: r.collectionName,
          artwork: r.artworkUrl100,
          preview: r.previewUrl,
        }));
      // pick 5 random from results
      const shuffled = all.sort(() => Math.random() - 0.5).slice(0, 5);
      setSongs(shuffled);
      setActiveIdx(shuffled.length > 0 ? 0 : null);
      setIsPlaying(false);
      setProgress(0);
    } catch {
      setSongs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSongs(query, page); }, [query, page]);

  const refresh = () => { audioRef.current?.pause(); setIsPlaying(false); setPage(p => p + 1); };

  // ── Audio engine ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;
    audio.volume = volume;

    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onDuration = () => setDuration(audio.duration);
    const onEnded = () => {
      setActiveIdx(prev => {
        if (prev === null) return null;
        const next = (prev + 1) % songs.length;
        return next;
      });
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onDuration);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onDuration);
      audio.removeEventListener("ended", onEnded);
    };
  }, [songs.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || activeIdx === null || tab !== "songs") return;
    const song = songs[activeIdx];
    if (!song) return;
    if (audio.src !== song.preview) {
      audio.src = song.preview;
      setProgress(0);
      setDuration(0);
    }
    if (isPlaying) audio.play().catch(() => setIsPlaying(false));
    else audio.pause();
  }, [activeIdx, isPlaying, songs, tab]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // pause online audio when switching tab
  useEffect(() => {
    if (tab !== "songs") { audioRef.current?.pause(); setIsPlaying(false); }
    if (tab !== "local") { localAudioRef.current?.pause(); setLocalIdx(null); }
  }, [tab]);

  const playSong = (idx: number) => {
    if (activeIdx === idx) { setIsPlaying(p => !p); }
    else { setActiveIdx(idx); setIsPlaying(true); }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = t;
    setProgress(t);
  };

  const prev = () => setActiveIdx(i => i === null ? 0 : (i - 1 + songs.length) % songs.length);
  const next = () => setActiveIdx(i => i === null ? 0 : (i + 1) % songs.length);

  // ── Local audio ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!localAudioRef.current) localAudioRef.current = new Audio();
    const audio = localAudioRef.current;
    audio.volume = localVol;
    if (tab !== "local" || localIdx === null) { audio.pause(); return; }
    const src = localTracks[localIdx]?.file ?? "";
    if (audio.src !== src) { audio.src = src; audio.loop = true; }
    audio.play().catch(() => {});
    return () => { audio.pause(); };
  }, [localIdx, tab, localTracks]);

  useEffect(() => { if (localAudioRef.current) localAudioRef.current.volume = localVol; }, [localVol]);

  useEffect(() => {
    return () => {
      localTracks.forEach(t => URL.revokeObjectURL(t.file));
      localAudioRef.current?.pause();
      audioRef.current?.pause();
    };
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setLocalTracks(prev => [...prev, ...files.map(f => ({ name: f.name.replace(/\.[^.]+$/, ""), file: URL.createObjectURL(f) }))]);
    e.target.value = "";
  };

  const removeLocal = (i: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalTracks(prev => { URL.revokeObjectURL(prev[i].file); return prev.filter((_, idx) => idx !== i); });
    setLocalIdx(prev => { if (prev === null || prev === i) return null; return prev > i ? prev - 1 : prev; });
  };

  const activeSong = activeIdx !== null ? songs[activeIdx] : null;

  const filtered = songs.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.artist.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) { setQuery(search.trim()); }
  };

  return (
    <div className="glass rounded-3xl p-5 h-full flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-neon-pink" />
          <h3 className="font-bold">Study Music</h3>
        </div>
        {tab === "local" && (
          <>
            <button onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium text-white hover:scale-105 transition"
              style={{ background: "var(--gradient-button)" }}>
              <Upload className="w-3 h-3" /> Add Song
            </button>
            <input ref={fileInputRef} type="file" accept="audio/*" multiple className="hidden" onChange={handleUpload} />
          </>
        )}
      </div>

      {/* Tab switcher */}
      <div className="glass rounded-full p-1 flex text-xs mb-3">
        <button onClick={() => setTab("songs")}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-full transition font-medium ${tab === "songs" ? "text-white" : "text-muted-foreground"}`}
          style={tab === "songs" ? { background: "var(--gradient-button)" } : {}}>
          🎵 Indian Songs
        </button>
        <button onClick={() => setTab("local")}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-full transition font-medium ${tab === "local" ? "text-white" : "text-muted-foreground"}`}
          style={tab === "local" ? { background: "var(--gradient-button)" } : {}}>
          <Music className="w-3 h-3" /> My Songs
        </button>
      </div>

      {/* ── Indian Songs tab ── */}
      {tab === "songs" && (
        <div className="flex-1 flex flex-col gap-3 min-h-0">

          {/* Now Playing card */}
          {activeSong && (
            <div className="glass-strong rounded-2xl p-3 flex-shrink-0">
              <div className="flex items-center gap-3 mb-3">
                <img src={activeSong.artwork} alt={activeSong.title}
                  className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold truncate">{activeSong.title}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{activeSong.artist}</div>
                  <div className="text-[10px] text-muted-foreground truncate opacity-60">{activeSong.album}</div>
                </div>
                {isPlaying && <Equalizer />}
              </div>

              {/* Progress bar */}
              <input type="range" min={0} max={duration || 30} step={0.1} value={progress}
                onChange={seek}
                className="w-full h-1 accent-pink-500 cursor-pointer mb-1" />
              <div className="flex justify-between text-[10px] text-muted-foreground mb-2">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration || 30)}</span>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-muted-foreground" />
                  <input type="range" min={0} max={1} step={0.01} value={volume}
                    onChange={e => setVolume(Number(e.target.value))}
                    className="w-16 h-1 accent-cyan-400 cursor-pointer" />
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={prev}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition">
                    <SkipBack className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsPlaying(p => !p)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white transition hover:scale-105"
                    style={{ background: "var(--gradient-button)" }}>
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                  <button onClick={next}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition">
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>
                <div className="w-20" />
              </div>
            </div>
          )}

          {/* Search bar + Refresh */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 glass-strong rounded-full px-3 py-1.5 flex-shrink-0">
            <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <input type="text" placeholder="Search songs, artist…" value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground" />
            {search && (
              <button type="button" onClick={() => { setSearch(""); setQuery("Arijit Singh"); }}
                className="text-muted-foreground hover:text-white transition">
                <X className="w-3 h-3" />
              </button>
            )}
            <button type="submit"
              className="text-[10px] font-medium px-2 py-0.5 rounded-full text-white"
              style={{ background: "var(--gradient-button)" }}>
              Go
            </button>
            <button type="button" onClick={refresh} title="Refresh songs"
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition text-muted-foreground hover:text-white">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </form>

          {/* Quick genre chips */}
          <div className="flex gap-1.5 flex-wrap flex-shrink-0">
            {DEFAULT_QUERIES.map(q => (
              <button key={q} onClick={() => { setQuery(q); setSearch(""); }}
                className={`text-[10px] px-2.5 py-1 rounded-full transition font-medium ${query === q ? "text-white" : "text-muted-foreground bg-white/5 hover:bg-white/10"}`}
                style={query === q ? { background: "var(--gradient-button)" } : {}}>
                {q}
              </button>
            ))}
          </div>

          {/* Song list */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-1 min-h-0">
            {loading ? (
              <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground">
                <Loader className="w-4 h-4 animate-spin" />
                <span className="text-xs">Loading songs…</span>
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No songs found</p>
            ) : (
              filtered.map(s => {
                const idx = songs.indexOf(s);
                const isActive = idx === activeIdx;
                return (
                  <button key={s.id} onClick={() => playSong(idx)}
                    className={`flex items-center gap-3 p-2 rounded-xl w-full text-left transition ${isActive ? "bg-white/10 ring-1 ring-white/20" : "hover:bg-white/5"}`}>
                    <img src={s.artwork} alt={s.title} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-semibold truncate ${isActive ? "text-neon-pink" : ""}`}>{s.title}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{s.artist}</div>
                    </div>
                    {isActive && isPlaying ? <Equalizer /> : <Play className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ── My Songs tab ── */}
      {tab === "local" && (
        <div className="flex-1 flex flex-col min-h-0">
          {localTracks.length === 0 ? (
            <div onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/10 cursor-pointer hover:border-neon-pink/40 transition py-8">
              <Upload className="w-8 h-8 text-muted-foreground" />
              <p className="text-xs text-muted-foreground text-center">Click to upload your songs<br />(mp3, wav, ogg…)</p>
            </div>
          ) : (
            <div className="flex-1 space-y-2 overflow-y-auto pr-1">
              {localTracks.map((t, i) => {
                const isPlaying = localIdx === i;
                return (
                  <button key={i} onClick={() => setLocalIdx(prev => prev === i ? null : i)}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition w-full text-left group">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--gradient-button)" }}>
                      {isPlaying ? <span className="text-white text-sm">⏸</span> : <Music className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{t.name}</div>
                      <div className="text-[11px] text-muted-foreground">My Song</div>
                    </div>
                    {isPlaying && <Equalizer />}
                    <span onClick={e => removeLocal(i, e)}
                      className="ml-1 p-1 rounded-full hover:bg-white/10 text-muted-foreground hover:text-red-400 transition opacity-0 group-hover:opacity-100">
                      <X className="w-3 h-3" />
                    </span>
                  </button>
                );
              })}
            </div>
          )}
          <div className="mt-3 flex items-center gap-2 glass-strong rounded-full px-4 py-2">
            <Volume2 className="w-4 h-4 text-neon-cyan flex-shrink-0" />
            <input type="range" min={0} max={1} step={0.01} value={localVol}
              onChange={e => setLocalVol(Number(e.target.value))}
              className="flex-1 h-1 accent-cyan-400 cursor-pointer" />
            <span className="text-[10px] text-muted-foreground w-6 text-right">{Math.round(localVol * 100)}</span>
          </div>
          <button onClick={() => setLocalIdx(null)}
            className="mt-2 flex items-center gap-3 glass-strong rounded-full px-4 py-2 w-full hover:bg-white/10 transition">
            <span className="text-neon-cyan text-sm">⏸</span>
            <span className="text-xs truncate flex-1 text-left">
              {localIdx !== null ? localTracks[localIdx]?.name : "No track playing"}
            </span>
            {localIdx !== null && <Equalizer />}
          </button>
        </div>
      )}
    </div>
  );
}
