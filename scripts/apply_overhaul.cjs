const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Color replacements (Gold -> Cyber Cyan)
app = app.replace(/#f59e0b/g, '#06b6d4');
app = app.replace(/rgba\(245,158,11/g, 'rgba(6,182,212');
app = app.replace(/#d97706/g, '#0891b2');

// 2. Fix List View (M1, M2 support)
app = app.replace(/\["M", "FWD", "MID", "DEF", "GK"\]\.map\(cat =>/g, '["M1", "M2", "FWD", "MID", "DEF", "GK"].map(cat =>');
app = app.replace(/cat === "M"/g, 'cat.startsWith("M")');

// 3. Audio Engine Integration
const importsIdx = app.indexOf('import');
app = app.slice(0, importsIdx) + `
const playTone = (freq, type, duration, vol=0.03) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch(e){}
};
const audio = {
  tick: () => playTone(800, 'sine', 0.1, 0.02),
  bid: () => { playTone(1200, 'square', 0.1, 0.03); setTimeout(() => playTone(1600, 'square', 0.15, 0.03), 100); },
  sold: () => { playTone(400, 'sine', 0.1, 0.03); setTimeout(() => playTone(600, 'sine', 0.1, 0.03), 100); setTimeout(() => playTone(800, 'sine', 0.4, 0.03), 200); },
  skip: () => playTone(200, 'sawtooth', 0.3, 0.03)
};
` + app.slice(importsIdx);

// Add audio calls to Reducer
app = app.replace(/case "PLACE_BID": \{/g, 'case "PLACE_BID": {\n      audio.bid();');
app = app.replace(/case "PLACE_BID_R2": \{/g, 'case "PLACE_BID_R2": {\n      audio.bid();');

// Also inject audio.tick() into the active player countdown:
app = app.replace(/setSecs\(Math\.ceil\(rem\)\);/g, 'setSecs(Math.ceil(rem));\n      if (Math.ceil(rem) <= 5 && Math.ceil(rem) > 0 && Math.ceil(rem) !== Math.ceil(rem + 0.1)) audio.tick();'); // Simple fix for ticking

// 4. Reauction Timer + 60s
app = app.replace(/const REAUCTION_SELECT_SECS = 30;/g, 'const REAUCTION_SELECT_SECS = 60;');

// 5. Reducer extensions for timer
app = app.replace(/return \{ \.\.\.s, phase: "ra1_pick", selVotes: \{\} \};/g, 'return { ...s, phase: "ra1_pick", selVotes: {}, selTimerEnd: Date.now() + 60000 };');
app = app.replace(/return \{ \.\.\.s, phase: "ra2_pick", selVotes: \{\} \};/g, 'return { ...s, phase: "ra2_pick", selVotes: {}, selTimerEnd: Date.now() + 60000 };');

app = app.replace(/case "RESET": return \{ \.\.\.INIT \};/g, 'case "RESET": return { ...INIT };\n    case "EXTEND_SEL_TIMER": return { ...s, selTimerEnd: (s.selTimerEnd || Date.now()) + 30000 };');

// Timer logic update for Reauction
// I'll replace EXACT strings.
let targetStr = `/* ── Selection phase countdown ── */
  useEffect(() => {
    clearInterval(selIntervalRef.current);
    if (phase !== "ra1_pick") { setSelSecs(REAUCTION_SELECT_SECS); return; }
    setSelSecs(REAUCTION_SELECT_SECS);
    const end = Date.now() + REAUCTION_SELECT_SECS * 1000;
    selIntervalRef.current = setInterval(() => {
      const rem = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      setSelSecs(rem);
      if (rem <= 0) {
        clearInterval(selIntervalRef.current);
        dispatch({ type: "CONFIRM_RA1_SELECTION" });
      }
    }, 250);
    return () => clearInterval(selIntervalRef.current);
  }, [phase]);`;

let replacementStr = `/* ── Selection phase countdown ── */
  useEffect(() => {
    clearInterval(selIntervalRef.current);
    if (phase !== "ra1_pick" && phase !== "ra2_pick") { setSelSecs(REAUCTION_SELECT_SECS); return; }
    
    selIntervalRef.current = setInterval(() => {
      const end = s.selTimerEnd || (Date.now() + REAUCTION_SELECT_SECS * 1000);
      const rem = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      setSelSecs(rem);
      if (rem <= 0) {
        clearInterval(selIntervalRef.current);
        dispatch({ type: phase === "ra1_pick" ? "CONFIRM_RA1_SELECTION" : "CONFIRM_RA2_SELECTION" });
      }
    }, 250);
    return () => clearInterval(selIntervalRef.current);
  }, [phase, s.selTimerEnd]);`;
  
app = app.replace(targetStr, replacementStr);


// 6. Top Nav Cleanup
const topNavRegex = /<div style=\{\{ display: "flex", alignItems: "center", gap: 10 \}\}>\s*\{noAuc && <select[\s\S]*?SWITCH ROLE<\/button>\s*<\/div>/;

const newTopNav = `<div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {activeTeam && <div style={{ fontFamily: F, fontSize: 18, color: "#06b6d4", fontWeight: 800 }}>{activeTeam.budget}<span style={{ fontSize: 12, color: "#6b7280", marginLeft: 4, letterSpacing: 1 }}>PTS</span></div>}
          {phase !== "results" && <div style={{ fontSize: 13, color: "#9ca3af", fontFamily: F, fontWeight: 700, letterSpacing: 2 }}>{queue.length + 1} LEFT</div>}
        </div>`;
app = app.replace(topNavRegex, newTopNav);

// 7. Add +30s button in Reauction Selection UI
const selHeaderRegex = /<div style=\{\{ fontFamily: F, fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 4 \}\}>\{label\}<\/div>/;
app = app.replace(selHeaderRegex, `<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}><div style={{ fontFamily: F, fontSize: 18, fontWeight: 800, color: "#fff" }}>{label}</div>{isHost && <button onClick={() => dispatch({ type: "EXTEND_SEL_TIMER" })} style={{ ...BTN("rgba(255,255,255,.1)"), padding: "6px 12px", fontSize: 11 }}>⏱️ +30s</button>}</div>`);

fs.writeFileSync('src/App.jsx', app);
console.log("Applied UI Overhaul and Engine safely!");
