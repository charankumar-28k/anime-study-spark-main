import { useState, useRef, useCallback } from "react";
import { Upload, X, Play, Pause, ImagePlus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Photo = { id: number; url: string; name: string };

const ANIMATIONS = [
  { label: "Fade", key: "fade" },
  { label: "Zoom", key: "zoom" },
  { label: "Slide", key: "slide" },
  { label: "Flip", key: "flip" },
];

const variants: Record<string, { initial: object; animate: object; exit: object }> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  zoom: {
    initial: { opacity: 0, scale: 0.6 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.4 },
  },
  slide: {
    initial: { opacity: 0, x: 120 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -120 },
  },
  flip: {
    initial: { opacity: 0, rotateY: 90 },
    animate: { opacity: 1, rotateY: 0 },
    exit: { opacity: 0, rotateY: -90 },
  },
};

let idCounter = 0;

export function PhotoAnimation() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [anim, setAnim] = useState("zoom");
  const [speed, setSpeed] = useState(2000);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startSlideshow = useCallback((photoCount: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent(p => (p + 1) % photoCount);
    }, speed);
  }, [speed]);

  const togglePlay = () => {
    if (photos.length < 2) return;
    if (playing) {
      clearInterval(intervalRef.current!);
      setPlaying(false);
    } else {
      startSlideshow(photos.length);
      setPlaying(true);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const newPhotos: Photo[] = files.map(f => ({
      id: ++idCounter,
      url: URL.createObjectURL(f),
      name: f.name,
    }));
    setPhotos(prev => {
      const updated = [...prev, ...newPhotos];
      if (playing) startSlideshow(updated.length);
      return updated;
    });
    e.target.value = "";
  };

  const removePhoto = (id: number) => {
    setPhotos(prev => {
      const updated = prev.filter(p => p.id !== id);
      if (updated.length === 0) { clearInterval(intervalRef.current!); setPlaying(false); }
      setCurrent(c => Math.min(c, Math.max(0, updated.length - 1)));
      if (playing && updated.length > 1) startSlideshow(updated.length);
      return updated;
    });
  };

  const clearAll = () => {
    clearInterval(intervalRef.current!);
    setPlaying(false);
    photos.forEach(p => URL.revokeObjectURL(p.url));
    setPhotos([]);
    setCurrent(0);
  };

  const activePhoto = photos[current];
  const v = variants[anim];

  return (
    <div className="glass rounded-3xl p-5 h-full flex flex-col gap-3">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImagePlus className="w-5 h-5 text-neon-pink" />
          <h3 className="font-bold">Photo Animation</h3>
        </div>
        <div className="flex items-center gap-2">
          {photos.length > 0 && (
            <button onClick={clearAll} className="text-muted-foreground hover:text-red-400 transition">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium text-white hover:scale-105 transition"
            style={{ background: "var(--gradient-button)" }}
          >
            <Upload className="w-3 h-3" /> Add Photos
          </button>
          <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/jpg,image/gif,image/webp" multiple className="hidden" onChange={handleUpload} />
        </div>
      </div>

      {/* Animation display */}
      <div className="relative rounded-2xl overflow-hidden bg-black/30 flex-shrink-0" style={{ height: 200 }}>
        {photos.length === 0 ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 transition"
          >
            <Upload className="w-8 h-8 text-muted-foreground" />
            <p className="text-xs text-muted-foreground text-center">Click to upload photos<br />and create an animation</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.img
              key={activePhoto?.id}
              src={activePhoto?.url}
              alt={activePhoto?.name}
              className="absolute inset-0 w-full h-full object-cover"
              initial={v.initial}
              animate={v.animate}
              exit={v.exit}
              transition={{ duration: 0.5 }}
            />
          </AnimatePresence>
        )}

        {/* Slide counter */}
        {photos.length > 0 && (
          <div className="absolute bottom-2 right-2 glass-strong rounded-full px-2 py-0.5 text-[10px]">
            {current + 1} / {photos.length}
          </div>
        )}
      </div>

      {/* Controls */}
      {photos.length > 0 && (
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            disabled={photos.length < 2}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white transition hover:scale-105 disabled:opacity-40"
            style={{ background: "var(--gradient-button)" }}
          >
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          {/* Manual prev/next */}
          <button onClick={() => setCurrent(p => (p - 1 + photos.length) % photos.length)}
            className="text-xs px-2 py-1 glass-strong rounded-full hover:bg-white/10 transition">‹ Prev</button>
          <button onClick={() => setCurrent(p => (p + 1) % photos.length)}
            className="text-xs px-2 py-1 glass-strong rounded-full hover:bg-white/10 transition">Next ›</button>

          {/* Speed */}
          <div className="flex items-center gap-1 ml-auto">
            <span className="text-[10px] text-muted-foreground">Speed</span>
            <select
              value={speed}
              onChange={e => { setSpeed(Number(e.target.value)); if (playing) startSlideshow(photos.length); }}
              className="bg-transparent text-[10px] text-white outline-none cursor-pointer"
            >
              <option value={800} className="bg-black">Fast</option>
              <option value={2000} className="bg-black">Normal</option>
              <option value={4000} className="bg-black">Slow</option>
            </select>
          </div>
        </div>
      )}

      {/* Animation style picker */}
      {photos.length > 0 && (
        <div className="flex gap-1.5 flex-shrink-0">
          {ANIMATIONS.map(a => (
            <button
              key={a.key}
              onClick={() => setAnim(a.key)}
              className={`flex-1 text-[10px] py-1.5 rounded-full font-medium transition ${anim === a.key ? "text-white" : "text-muted-foreground bg-white/5 hover:bg-white/10"}`}
              style={anim === a.key ? { background: "var(--gradient-button)" } : {}}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}

      {/* Thumbnail strip */}
      {photos.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 flex-shrink-0">
          {photos.map((p, i) => (
            <div key={p.id} className="relative flex-shrink-0 group">
              <img
                src={p.url}
                alt={p.name}
                onClick={() => setCurrent(i)}
                className={`w-12 h-12 rounded-lg object-cover cursor-pointer transition ${i === current ? "ring-2 ring-neon-pink" : "opacity-60 hover:opacity-100"}`}
              />
              <button
                onClick={() => removePhoto(p.id)}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
