import { useState, useRef, useEffect, useCallback } from "react";

// ─── THEME DATA ───────────────────────────────────────────────────────────────
const FRAMES = {
  Minimalist: [
    { id: "white", label: "White Clean", border: "8px solid #ffffff", bg: "#ffffff", text: "#333" },
    { id: "black", label: "Midnight Black", border: "8px solid #111111", bg: "#111111", text: "#fff" },
    { id: "cream", label: "Cream", border: "8px solid #f5f0e8", bg: "#f5f0e8", text: "#555" },
    { id: "gray", label: "Stone Gray", border: "8px solid #d1d5db", bg: "#e5e7eb", text: "#374151" },
  ],
  Pastel: [
    { id: "pink", label: "Pink Pastel", border: "8px solid #fbcfe8", bg: "#fce7f3", text: "#9d174d" },
    { id: "blue", label: "Baby Blue", border: "8px solid #bfdbfe", bg: "#dbeafe", text: "#1e40af" },
    { id: "lavender", label: "Lavender", border: "8px solid #c4b5fd", bg: "#ede9fe", text: "#5b21b6" },
    { id: "mint", label: "Mint", border: "8px solid #a7f3d0", bg: "#d1fae5", text: "#065f46" },
  ],
  "Korean Style": [
    { id: "kwhite", label: "K-White", border: "10px solid #fff", bg: "#fff", text: "#222", accent: "#f9a8d4" },
    { id: "kpink", label: "Soft Pink", border: "10px solid #fda4af", bg: "#fff1f2", text: "#881337", accent: "#fb7185" },
    { id: "kbeige", label: "Beige", border: "10px solid #e7d9c7", bg: "#fdf8f0", text: "#78350f", accent: "#d97706" },
    { id: "ksky", label: "Sky Blue", border: "10px solid #7dd3fc", bg: "#f0f9ff", text: "#0c4a6e", accent: "#38bdf8" },
  ],
  Birthday: [
    { id: "bday", label: "🎂 Cake", border: "8px dashed #f472b6", bg: "#fdf2f8", text: "#9d174d" },
    { id: "balloon", label: "🎈 Balloon", border: "8px solid #fb923c", bg: "#fff7ed", text: "#9a3412" },
    { id: "confetti", label: "🎉 Confetti", border: "8px dotted #a855f7", bg: "#faf5ff", text: "#581c87" },
    { id: "rainbow", label: "🌈 Rainbow", border: "8px solid transparent", bg: "linear-gradient(white,white) padding-box, linear-gradient(135deg,#f87171,#fb923c,#fbbf24,#4ade80,#60a5fa,#c084fc) border-box", text: "#333" },
  ],
  Romantic: [
    { id: "love", label: "❤️ Love", border: "8px solid #f43f5e", bg: "#fff1f2", text: "#9f1239" },
    { id: "rose", label: "🌹 Rose", border: "8px solid #e11d48", bg: "#fce7f3", text: "#9d174d" },
    { id: "heart", label: "💕 Soft Heart", border: "8px solid #fb7185", bg: "#fff5f7", text: "#be123c" },
    { id: "velvet", label: "🪷 Velvet", border: "8px solid #a21caf", bg: "#fdf4ff", text: "#701a75" },
  ],
  Neon: [
    { id: "cyber", label: "⚡ Cyberpunk", border: "8px solid #facc15", bg: "#0a0a0a", text: "#facc15" },
    { id: "neonpurple", label: "💜 Purple Neon", border: "8px solid #a855f7", bg: "#0f0a1e", text: "#d8b4fe" },
    { id: "neonblue", label: "💙 Blue Neon", border: "8px solid #38bdf8", bg: "#030712", text: "#7dd3fc" },
    { id: "neongreen", label: "💚 Green Neon", border: "8px solid #4ade80", bg: "#011007", text: "#86efac" },
  ],
  Graduation: [
    { id: "grad", label: "🎓 Gold & Navy", border: "8px solid #ca8a04", bg: "#fefce8", text: "#713f12" },
    { id: "school", label: "📚 School", border: "8px solid #1d4ed8", bg: "#eff6ff", text: "#1e3a8a" },
  ],
  Anime: [
    { id: "sakura", label: "🌸 Sakura", border: "8px solid #f9a8d4", bg: "#fdf2f8", text: "#831843" },
    { id: "kawaii", label: "✨ Kawaii", border: "8px solid #c084fc", bg: "#faf5ff", text: "#581c87" },
    { id: "sky", label: "☁️ Sky Anime", border: "8px solid #7dd3fc", bg: "#f0f9ff", text: "#0c4a6e" },
  ],
};

const FILTERS = [
  { id: "none", label: "Original", css: "none" },
  { id: "vintage", label: "Vintage", css: "sepia(0.5) contrast(1.1) brightness(0.9)" },
  { id: "retro", label: "Retro", css: "sepia(0.8) saturate(0.7) hue-rotate(10deg)" },
  { id: "warm", label: "Warm", css: "sepia(0.2) saturate(1.4) brightness(1.05) hue-rotate(-10deg)" },
  { id: "cool", label: "Cool", css: "saturate(0.9) hue-rotate(20deg) brightness(1.05)" },
  { id: "bw", label: "B&W", css: "grayscale(1) contrast(1.1)" },
  { id: "glow", label: "Soft Glow", css: "brightness(1.15) saturate(1.2) blur(0px) contrast(0.9)" },
  { id: "vivid", label: "Vivid", css: "saturate(1.6) contrast(1.1)" },
];

const PHOTO_MODES = [
  { id: 1, label: "Single", icon: "▪", desc: "1 foto" },
  { id: 2, label: "Double", icon: "▪▪", desc: "2 foto" },
  { id: 3, label: "Triple", icon: "▪▪▪", desc: "3 foto" },
  { id: 4, label: "Classic Strip", icon: "▪▪▪▪", desc: "4 foto" },
];

const COUNTDOWN_OPTIONS = [3, 5, 10];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function applyFilterToCanvas(imgSrc, filterCss, cb) {
  const img = new Image();
  img.onload = () => {
    const c = document.createElement("canvas");
    c.width = img.width; c.height = img.height;
    const ctx = c.getContext("2d");
    if (filterCss !== "none") ctx.filter = filterCss;
    ctx.drawImage(img, 0, 0);
    cb(c.toDataURL("image/png"));
  };
  img.src = imgSrc;
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("welcome"); // welcome | camera | preview | gallery
  const [photos, setPhotos] = useState([]); // gallery
  const [session, setSession] = useState([]); // current session captures
  const [photoMode, setPhotoMode] = useState(4);
  const [frame, setFrame] = useState(FRAMES["Korean Style"][0]);
  const [filter, setFilter] = useState(FILTERS[0]);
  const [countdown, setCountdown] = useState(3);
  const [facingMode, setFacingMode] = useState("user");
  const [countdownActive, setCountdownActive] = useState(false);
  const [countdownVal, setCountdownVal] = useState(null);
  const [flash, setFlash] = useState(false);
  const [captureIndex, setCaptureIndex] = useState(0);
  const [frameCategory, setFrameCategory] = useState("Korean Style");
  const [customText, setCustomText] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Camera
  const startCamera = useCallback(async (mode = facingMode) => {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); }
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: mode }, audio: false });
      streamRef.current = s;
      if (videoRef.current) { videoRef.current.srcObject = s; }
    } catch (e) { console.error("Camera error", e); }
  }, [facingMode]);

  useEffect(() => {
    if (screen === "camera") startCamera(facingMode);
    return () => { if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop()); };
  }, [screen, facingMode]);

  const switchCamera = () => {
    const next = facingMode === "user" ? "environment" : "user";
    setFacingMode(next);
  };

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (facingMode === "user") { ctx.translate(canvas.width, 0); ctx.scale(-1, 1); }
    if (filter.css !== "none") ctx.filter = filter.css;
    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL("image/png");
  }, [facingMode, filter]);

  const triggerCapture = useCallback(async () => {
    if (countdownActive) return;
    setCountdownActive(true);
    const total = photoMode;
    const newSession = [...session];

    for (let i = captureIndex; i < total; i++) {
      // Countdown
      for (let c = countdown; c > 0; c--) {
        setCountdownVal(c);
        await new Promise(r => setTimeout(r, 1000));
      }
      setCountdownVal(null);
      setFlash(true);
      await new Promise(r => setTimeout(r, 120));
      setFlash(false);
      const img = capturePhoto();
      if (img) newSession.push(img);
      setSession([...newSession]);
      setCaptureIndex(i + 1);
      if (i < total - 1) await new Promise(r => setTimeout(r, 600));
    }
    setCountdownActive(false);
    if (newSession.length >= total) {
      streamRef.current?.getTracks().forEach(t => t.stop());
      setScreen("preview");
    }
  }, [countdownActive, photoMode, captureIndex, countdown, capturePhoto, session]);

  const resetSession = () => {
    setSession([]);
    setCaptureIndex(0);
    setScreen("camera");
  };

  const saveToGallery = () => {
    const entry = { id: Date.now(), photos: session, frame, filter, text: customText, mode: photoMode, date: new Date() };
    setPhotos(p => [entry, ...p]);
    setSession([]);
    setCaptureIndex(0);
    setCustomText("");
    setScreen("gallery");
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#1a0829 0%,#2d1b4e 40%,#1a2744 100%)", fontFamily: "'Segoe UI',system-ui,sans-serif", color: "#fff", overflow: "hidden" }}>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {flash && <div style={{ position: "fixed", inset: 0, background: "#fff", zIndex: 9999, opacity: 0.95, animation: "flashAnim 0.2s ease-out" }} />}

      <style>{`
        @keyframes flashAnim { 0%{opacity:0.95} 100%{opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(1.08)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes slideIn { from{transform:translateX(-30px);opacity:0} to{transform:translateX(0);opacity:1} }
        .fadeUp { animation: fadeUp 0.6s ease both; }
        .float { animation: float 3s ease-in-out infinite; }
        .pulse-count { animation: pulse 0.6s ease-in-out infinite; }
        .btn-glow { box-shadow: 0 0 20px rgba(196,130,247,0.5); transition: all 0.2s; }
        .btn-glow:hover { box-shadow: 0 0 35px rgba(196,130,247,0.8); transform: translateY(-2px); }
        .glass { background: rgba(255,255,255,0.08); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.15); }
        .glass-dark { background: rgba(0,0,0,0.3); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.1); }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
        .frame-btn:hover { transform: scale(1.05); }
        .nav-tab.active { background: rgba(196,130,247,0.3); border-color: #c084fc; }
      `}</style>

      {screen === "welcome" && <WelcomeScreen setScreen={setScreen} photos={photos} />}
      {screen === "camera" && (
        <CameraScreen
          videoRef={videoRef} facingMode={facingMode} switchCamera={switchCamera}
          photoMode={photoMode} setPhotoMode={setPhotoMode}
          countdown={countdown} setCountdown={setCountdown}
          countdownVal={countdownVal} countdownActive={countdownActive}
          session={session} captureIndex={captureIndex}
          triggerCapture={triggerCapture}
          filter={filter} setFilter={setFilter}
          setScreen={setScreen}
          frame={frame} setFrame={setFrame}
          frameCategory={frameCategory} setFrameCategory={setFrameCategory}
        />
      )}
      {screen === "preview" && (
        <PreviewScreen
          session={session} frame={frame} filter={filter}
          photoMode={photoMode} customText={customText} setCustomText={setCustomText}
          showTextInput={showTextInput} setShowTextInput={setShowTextInput}
          saveToGallery={saveToGallery} resetSession={resetSession}
          setFrame={setFrame} frameCategory={frameCategory} setFrameCategory={setFrameCategory}
          setFilter={setFilter}
        />
      )}
      {screen === "gallery" && (
        <GalleryScreen photos={photos} setPhotos={setPhotos} setScreen={setScreen} />
      )}
    </div>
  );
}

// ─── WELCOME SCREEN ───────────────────────────────────────────────────────────
function WelcomeScreen({ setScreen, photos }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", position: "relative", overflow: "hidden" }}>
      {/* BG orbs */}
      {[{ top: "10%", left: "15%", c: "#c084fc33", s: 280 }, { top: "60%", right: "10%", c: "#fb7185330", s: 200 }, { top: "30%", right: "25%", c: "#38bdf833", s: 150 }].map((o, i) => (
        <div key={i} style={{ position: "absolute", top: o.top, left: o.left, right: o.right, width: o.s, height: o.s, borderRadius: "50%", background: o.c, filter: "blur(60px)", animation: `float ${3 + i}s ease-in-out infinite`, animationDelay: `${i * 0.8}s` }} />
      ))}

      <div className="fadeUp" style={{ textAlign: "center", zIndex: 1 }}>
        {/* Logo */}
        <div className="float" style={{ fontSize: 72, marginBottom: 8 }}>📸</div>
        <div style={{ fontSize: 13, letterSpacing: "0.3em", color: "#c084fc", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>✦ MODERN PHOTO BOOTH ✦</div>
        <h1 style={{ fontSize: "clamp(36px,8vw,64px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 12, background: "linear-gradient(135deg,#f9a8d4,#c084fc,#7dd3fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          SnapBooth
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, marginBottom: 40, maxWidth: 300, margin: "0 auto 40px" }}>
          Korean-style photo booth experience · capture & create ✨
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 280, margin: "0 auto" }}>
          <button className="btn-glow" onClick={() => setScreen("camera")}
            style={{ padding: "16px 32px", borderRadius: 50, background: "linear-gradient(135deg,#c084fc,#fb7185)", border: "none", color: "#fff", fontSize: 17, fontWeight: 700, cursor: "pointer", letterSpacing: "0.05em" }}>
            📷 Mulai Foto
          </button>
          <button onClick={() => setScreen("gallery")}
            style={{ padding: "14px 32px", borderRadius: 50, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", backdropFilter: "blur(8px)" }}>
            🖼 Galeri Hasil {photos.length > 0 && `(${photos.length})`}
          </button>
        </div>

        {/* Feature badges */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 40, maxWidth: 360 }}>
          {["🎞 Strip Mode", "✨ 20+ Frames", "🎨 8 Filters", "💾 Gallery", "📥 Download"].map(f => (
            <span key={f} style={{ padding: "5px 12px", borderRadius: 20, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{f}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CAMERA SCREEN ────────────────────────────────────────────────────────────
function CameraScreen({ videoRef, facingMode, switchCamera, photoMode, setPhotoMode, countdown, setCountdown, countdownVal, countdownActive, session, captureIndex, triggerCapture, filter, setFilter, setScreen, frame, setFrame, frameCategory, setFrameCategory }) {
  const [tab, setTab] = useState("mode"); // mode | frame | filter

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div className="glass-dark" style={{ display: "flex", alignItems: "center", padding: "12px 16px", gap: 12 }}>
        <button onClick={() => setScreen("welcome")} style={{ background: "none", border: "none", color: "#fff", fontSize: 20, cursor: "pointer", padding: "4px 8px" }}>←</button>
        <div style={{ flex: 1, textAlign: "center", fontWeight: 700, fontSize: 16, color: "#c084fc" }}>📷 Camera</div>
        <button onClick={switchCamera} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "6px 10px", borderRadius: 8, cursor: "pointer", fontSize: 16 }}>🔄</button>
      </div>

      {/* Video */}
      <div style={{ position: "relative", background: "#000", display: "flex", justifyContent: "center" }}>
        <video ref={videoRef} autoPlay playsInline muted
          style={{ width: "100%", maxWidth: 480, aspectRatio: "3/4", objectFit: "cover", display: "block", transform: facingMode === "user" ? "scaleX(-1)" : "none", filter: filter.css !== "none" ? filter.css : undefined }} />

        {/* Countdown overlay */}
        {countdownVal !== null && (
          <div className="pulse-count" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", fontSize: 100, fontWeight: 900, color: "#fff" }}>
            {countdownVal}
          </div>
        )}

        {/* Strip progress */}
        <div style={{ position: "absolute", top: 12, right: 12, display: "flex", flexDirection: "column", gap: 6 }}>
          {Array.from({ length: photoMode }).map((_, i) => (
            <div key={i} style={{ width: 36, height: 28, borderRadius: 4, border: "2px solid rgba(255,255,255,0.5)", background: session[i] ? `url(${session[i]}) center/cover` : "rgba(0,0,0,0.4)", overflow: "hidden" }}>
              {i === captureIndex && !session[i] && <div style={{ width: "100%", height: "100%", background: "rgba(196,130,247,0.6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>▶</div>}
            </div>
          ))}
        </div>

        {/* Frame overlay hint */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", border: frame.border, borderRadius: 0, boxSizing: "border-box", opacity: 0.4 }} />
      </div>

      {/* Tabs */}
      <div className="glass-dark" style={{ borderTop: "1px solid rgba(255,255,255,0.1)", padding: "0 16px" }}>
        <div style={{ display: "flex", gap: 4, padding: "8px 0" }}>
          {[["mode", "🎞 Mode"], ["frame", "🖼 Frame"], ["filter", "🎨 Filter"]].map(([id, label]) => (
            <button key={id} className={`nav-tab ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}
              style={{ flex: 1, padding: "8px 4px", borderRadius: 8, background: tab === id ? "rgba(196,130,247,0.25)" : "transparent", border: `1px solid ${tab === id ? "#c084fc" : "transparent"}`, color: tab === id ? "#c084fc" : "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
              {label}
            </button>
          ))}
        </div>

        {/* Mode tab */}
        {tab === "mode" && (
          <div style={{ paddingBottom: 12 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {PHOTO_MODES.map(m => (
                <button key={m.id} onClick={() => setPhotoMode(m.id)}
                  style={{ flex: 1, padding: "8px 4px", borderRadius: 10, background: photoMode === m.id ? "linear-gradient(135deg,#c084fc,#fb7185)" : "rgba(255,255,255,0.08)", border: `1px solid ${photoMode === m.id ? "transparent" : "rgba(255,255,255,0.15)"}`, color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                  <div style={{ fontSize: 8, marginBottom: 3 }}>{m.icon}</div>{m.label}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginRight: 4 }}>⏱</span>
              {COUNTDOWN_OPTIONS.map(s => (
                <button key={s} onClick={() => setCountdown(s)}
                  style={{ padding: "6px 14px", borderRadius: 20, background: countdown === s ? "#c084fc" : "rgba(255,255,255,0.08)", border: "none", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  {s}s
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Frame tab */}
        {tab === "frame" && (
          <div style={{ paddingBottom: 12 }}>
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, marginBottom: 8 }}>
              {Object.keys(FRAMES).map(cat => (
                <button key={cat} onClick={() => setFrameCategory(cat)}
                  style={{ padding: "5px 12px", borderRadius: 20, whiteSpace: "nowrap", background: frameCategory === cat ? "#c084fc" : "rgba(255,255,255,0.08)", border: "none", color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>
                  {cat}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
              {FRAMES[frameCategory].map(f => (
                <button key={f.id} className="frame-btn" onClick={() => setFrame(f)}
                  style={{ width: 56, height: 56, flexShrink: 0, borderRadius: 10, border: frame.id === f.id ? "2px solid #c084fc" : "2px solid transparent", background: f.bg?.includes("gradient") ? f.bg : f.bg, cursor: "pointer", outline: frame.id === f.id ? "2px solid rgba(196,130,247,0.5)" : "none", boxSizing: "border-box", transition: "all 0.2s", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  <div style={{ width: "80%", height: "80%", border: f.border, borderRadius: 4, boxSizing: "border-box" }} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filter tab */}
        {tab === "filter" && (
          <div style={{ paddingBottom: 12 }}>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
              {FILTERS.map(f => (
                <button key={f.id} onClick={() => setFilter(f)}
                  style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 10, background: "linear-gradient(135deg,#a78bfa,#f9a8d4)", filter: f.css !== "none" ? f.css : undefined, border: filter.id === f.id ? "2px solid #c084fc" : "2px solid transparent", boxSizing: "border-box", transition: "all 0.2s" }} />
                  <span style={{ fontSize: 10, color: filter.id === f.id ? "#c084fc" : "rgba(255,255,255,0.5)", fontWeight: 600, whiteSpace: "nowrap" }}>{f.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Capture button */}
      <div style={{ padding: "16px", display: "flex", justifyContent: "center", background: "rgba(0,0,0,0.3)" }}>
        <button onClick={triggerCapture} disabled={countdownActive}
          style={{ width: 72, height: 72, borderRadius: "50%", background: countdownActive ? "rgba(255,255,255,0.2)" : "linear-gradient(135deg,#c084fc,#fb7185)", border: "4px solid rgba(255,255,255,0.4)", cursor: countdownActive ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, boxShadow: countdownActive ? "none" : "0 0 30px rgba(196,130,247,0.6)", transition: "all 0.2s" }}>
          {countdownActive ? "⏳" : "📷"}
        </button>
      </div>
    </div>
  );
}

// ─── PREVIEW SCREEN ───────────────────────────────────────────────────────────
function PhotoStrip({ session, frame, filter, photoMode, customText }) {
  const stripBg = frame.bg?.includes("gradient") ? frame.bg : (frame.bg || "#fff");
  const isMulti = photoMode > 1;

  return (
    <div style={{ display: "inline-block", background: stripBg, padding: isMulti ? 10 : 8, borderRadius: 8, maxWidth: isMulti ? 200 : 260 }}>
      {/* Photos */}
      <div style={{ display: "flex", flexDirection: "column", gap: isMulti ? 6 : 0 }}>
        {session.slice(0, photoMode).map((img, i) => (
          <div key={i} style={{ borderRadius: 4, overflow: "hidden", lineHeight: 0, border: frame.border }}>
            <img src={img} alt={`photo-${i}`} style={{ width: "100%", display: "block", filter: filter.css !== "none" ? filter.css : undefined }} />
          </div>
        ))}
      </div>
      {/* Caption */}
      {customText && (
        <div style={{ textAlign: "center", marginTop: 8, fontSize: 11, fontWeight: 700, color: frame.text || "#333", letterSpacing: "0.1em" }}>
          {customText}
        </div>
      )}
      {/* Branding */}
      <div style={{ textAlign: "center", marginTop: 4, fontSize: 9, color: frame.text ? frame.text + "88" : "#33333388", letterSpacing: "0.15em" }}>
        ✦ SNAPBOOTH ✦
      </div>
    </div>
  );
}

function PreviewScreen({ session, frame, filter, photoMode, customText, setCustomText, showTextInput, setShowTextInput, saveToGallery, resetSession, setFrame, frameCategory, setFrameCategory, setFilter }) {
  const stripRef = useRef(null);
  const [tab, setTab] = useState("frame");

  const downloadStrip = () => {
    const node = stripRef.current;
    if (!node) return;
    const html2canvas = window._html2canvas;
    if (!html2canvas) {
      // Fallback: download first photo
      if (session[0]) {
        const a = document.createElement("a");
        a.href = session[0];
        a.download = `snapbooth-${Date.now()}.png`;
        a.click();
      }
      return;
    }
  };

  // Build composite canvas for download
  const downloadComposite = useCallback(() => {
    const w = 400;
    const padOuter = 20;
    const gap = 10;
    const frameW = 4;
    const imgH = Math.round(w * 0.75);
    const totalH = padOuter * 2 + photoMode * imgH + (photoMode - 1) * gap + 40;
    const c = document.createElement("canvas");
    c.width = w; c.height = totalH;
    const ctx = c.getContext("2d");

    // Background
    const bg = frame.bg || "#fff";
    if (bg.includes("gradient")) {
      const grad = ctx.createLinearGradient(0, 0, w, totalH);
      grad.addColorStop(0, "#f9a8d4"); grad.addColorStop(1, "#c084fc");
      ctx.fillStyle = grad;
    } else { ctx.fillStyle = bg; }
    ctx.fillRect(0, 0, w, totalH);

    const loadAndDraw = (imgs, idx) => {
      if (idx >= imgs.length) {
        // Text
        if (customText) {
          ctx.fillStyle = frame.text || "#333";
          ctx.font = "bold 18px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(customText, w / 2, totalH - 22);
        }
        ctx.fillStyle = (frame.text || "#333") + "66";
        ctx.font = "11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("✦ SNAPBOOTH ✦", w / 2, totalH - 6);
        const a = document.createElement("a");
        a.href = c.toDataURL("image/png");
        a.download = `snapbooth-${Date.now()}.png`;
        a.click();
        return;
      }
      const img = new Image();
      img.onload = () => {
        const y = padOuter + idx * (imgH + gap);
        if (filter.css !== "none") ctx.filter = filter.css;
        ctx.drawImage(img, padOuter, y, w - padOuter * 2, imgH);
        ctx.filter = "none";
        // Border
        const bc = frame.border?.match(/#[0-9a-f]{3,6}/i)?.[0] || "#fff";
        ctx.strokeStyle = bc; ctx.lineWidth = frameW;
        ctx.strokeRect(padOuter, y, w - padOuter * 2, imgH);
        loadAndDraw(imgs, idx + 1);
      };
      img.src = imgs[idx];
    };
    loadAndDraw(session.slice(0, photoMode), 0);
  }, [session, frame, filter, photoMode, customText]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div className="glass-dark" style={{ display: "flex", alignItems: "center", padding: "12px 16px", gap: 12 }}>
        <button onClick={resetSession} style={{ background: "none", border: "none", color: "#fff", fontSize: 20, cursor: "pointer" }}>←</button>
        <div style={{ flex: 1, textAlign: "center", fontWeight: 700, fontSize: 16, color: "#c084fc" }}>✨ Preview</div>
        <button onClick={saveToGallery} style={{ background: "linear-gradient(135deg,#c084fc,#fb7185)", border: "none", color: "#fff", padding: "8px 16px", borderRadius: 20, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>💾 Simpan</button>
      </div>

      {/* Strip preview */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", overflowY: "auto" }}>
        <div ref={stripRef}>
          <PhotoStrip session={session} frame={frame} filter={filter} photoMode={photoMode} customText={customText} />
        </div>
      </div>

      {/* Editor Tabs */}
      <div className="glass-dark" style={{ borderTop: "1px solid rgba(255,255,255,0.1)", padding: "0 16px" }}>
        <div style={{ display: "flex", gap: 4, padding: "8px 0" }}>
          {[["frame", "🖼 Frame"], ["filter", "🎨 Filter"], ["text", "✏️ Teks"]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ flex: 1, padding: "8px 4px", borderRadius: 8, background: tab === id ? "rgba(196,130,247,0.25)" : "transparent", border: `1px solid ${tab === id ? "#c084fc" : "transparent"}`, color: tab === id ? "#c084fc" : "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              {label}
            </button>
          ))}
        </div>

        {tab === "frame" && (
          <div style={{ paddingBottom: 12 }}>
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8 }}>
              {Object.keys(FRAMES).map(cat => (
                <button key={cat} onClick={() => setFrameCategory(cat)}
                  style={{ padding: "5px 12px", borderRadius: 20, whiteSpace: "nowrap", background: frameCategory === cat ? "#c084fc" : "rgba(255,255,255,0.08)", border: "none", color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>
                  {cat}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
              {FRAMES[frameCategory].map(f => (
                <button key={f.id} className="frame-btn" onClick={() => setFrame(f)}
                  style={{ width: 56, height: 56, flexShrink: 0, borderRadius: 10, border: frame.id === f.id ? "2px solid #c084fc" : "2px solid rgba(255,255,255,0.1)", background: f.bg?.includes("gradient") ? "#a78bfa" : (f.bg || "#fff"), cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: "80%", height: "80%", border: f.border, borderRadius: 4, boxSizing: "border-box" }} />
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === "filter" && (
          <div style={{ paddingBottom: 12 }}>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
              {FILTERS.map(f => (
                <button key={f.id} onClick={() => setFilter(f)}
                  style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 10, background: "linear-gradient(135deg,#a78bfa,#f9a8d4)", filter: f.css !== "none" ? f.css : undefined, border: filter.id === f.id ? "2px solid #c084fc" : "2px solid transparent", boxSizing: "border-box" }} />
                  <span style={{ fontSize: 10, color: filter.id === f.id ? "#c084fc" : "rgba(255,255,255,0.5)", fontWeight: 600, whiteSpace: "nowrap" }}>{f.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === "text" && (
          <div style={{ paddingBottom: 12 }}>
            <input value={customText} onChange={e => setCustomText(e.target.value)} placeholder="Tambahkan caption... (nama, tanggal, quotes)"
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              {["Best Day Ever ✨", "Happy Birthday! 🎂", "Friends Forever 💕", new Date().toLocaleDateString("id-ID")].map(t => (
                <button key={t} onClick={() => setCustomText(t)}
                  style={{ padding: "5px 10px", borderRadius: 20, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", fontSize: 11, cursor: "pointer" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div style={{ display: "flex", gap: 10, padding: "12px 16px", background: "rgba(0,0,0,0.3)" }}>
        <button onClick={resetSession}
          style={{ flex: 1, padding: "12px", borderRadius: 12, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          🔄 Ambil Ulang
        </button>
        <button onClick={downloadComposite}
          style={{ flex: 1, padding: "12px", borderRadius: 12, background: "linear-gradient(135deg,#c084fc,#fb7185)", border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          📥 Download
        </button>
      </div>
    </div>
  );
}

// ─── GALLERY SCREEN ───────────────────────────────────────────────────────────
function GalleryScreen({ photos, setPhotos, setScreen }) {
  const [selected, setSelected] = useState(null);

  const deletePhoto = (id) => {
    setPhotos(p => p.filter(x => x.id !== id));
    setSelected(null);
  };

  const downloadEntry = (entry) => {
    // Simple download of first photo
    const a = document.createElement("a");
    a.href = entry.photos[0];
    a.download = `snapbooth-${entry.id}.png`;
    a.click();
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="glass-dark" style={{ display: "flex", alignItems: "center", padding: "12px 16px", gap: 12 }}>
        <button onClick={() => setScreen("welcome")} style={{ background: "none", border: "none", color: "#fff", fontSize: 20, cursor: "pointer" }}>←</button>
        <div style={{ flex: 1, textAlign: "center", fontWeight: 700, fontSize: 16, color: "#c084fc" }}>🖼 Galeri ({photos.length})</div>
        <button onClick={() => setScreen("camera")} style={{ background: "linear-gradient(135deg,#c084fc,#fb7185)", border: "none", color: "#fff", padding: "8px 12px", borderRadius: 20, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>+ Foto</button>
      </div>

      {photos.length === 0 ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, opacity: 0.5 }}>
          <div style={{ fontSize: 60 }}>📭</div>
          <p>Belum ada foto tersimpan</p>
          <button onClick={() => setScreen("camera")} style={{ padding: "10px 24px", borderRadius: 20, background: "#c084fc", border: "none", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
            Mulai Foto
          </button>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            {photos.map(entry => (
              <div key={entry.id} onClick={() => setSelected(entry)}
                style={{ borderRadius: 12, overflow: "hidden", cursor: "pointer", background: entry.frame.bg?.includes("gradient") ? "#a78bfa" : (entry.frame.bg || "#fff"), border: "1px solid rgba(255,255,255,0.15)", transition: "transform 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                <div style={{ padding: 8 }}>
                  {entry.photos.slice(0, Math.min(entry.mode, 2)).map((img, i) => (
                    <img key={i} src={img} alt="" style={{ width: "100%", display: "block", borderRadius: 4, marginBottom: i < entry.photos.length - 1 ? 4 : 0, filter: entry.filter.css !== "none" ? entry.filter.css : undefined }} />
                  ))}
                </div>
                <div style={{ padding: "4px 8px 8px", textAlign: "center", fontSize: 10, color: (entry.frame.text || "#333") + "aa", fontWeight: 600 }}>
                  {entry.date.toLocaleDateString("id-ID", { day: "numeric", month: "short" })} · {entry.mode} foto
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }} onClick={() => setSelected(null)}>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: 320, width: "100%", borderRadius: 16, overflow: "hidden", background: selected.frame.bg?.includes("gradient") ? "#a78bfa" : (selected.frame.bg || "#fff") }}>
            <div style={{ padding: 12 }}>
              {selected.photos.slice(0, selected.mode).map((img, i) => (
                <img key={i} src={img} alt="" style={{ width: "100%", borderRadius: 4, display: "block", marginBottom: i < selected.photos.length - 1 ? 6 : 0, filter: selected.filter.css !== "none" ? selected.filter.css : undefined, border: selected.frame.border }} />
              ))}
              {selected.text && <div style={{ textAlign: "center", padding: "6px 0", fontSize: 12, fontWeight: 700, color: selected.frame.text || "#333" }}>{selected.text}</div>}
              <div style={{ textAlign: "center", fontSize: 9, color: (selected.frame.text || "#333") + "77" }}>✦ SNAPBOOTH ✦</div>
            </div>
            <div style={{ display: "flex", gap: 8, padding: "0 12px 12px" }}>
              <button onClick={() => downloadEntry(selected)}
                style={{ flex: 1, padding: "10px", borderRadius: 10, background: "#c084fc", border: "none", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
                📥 Download
              </button>
              <button onClick={() => deletePhoto(selected.id)}
                style={{ padding: "10px 16px", borderRadius: 10, background: "#f43f5e", border: "none", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
                🗑
              </button>
            </div>
          </div>
          <button onClick={() => setSelected(null)} style={{ marginTop: 16, background: "none", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", padding: "8px 24px", borderRadius: 20, cursor: "pointer" }}>Tutup</button>
        </div>
      )}
    </div>
  );
}
