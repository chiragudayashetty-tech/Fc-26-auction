const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

// 1. mkQueue logic
const mkQueueRegex = /function mkQueue\([\s\S]*?return \[\.\.\.marquee[\s\S]*?\}\);?\s*\n\}/;
const newMkQueue = `function mkQueue(cfg, setupPool) {
  const sh = a => [...a].sort(() => Math.random() - 0.5);
  const poolIds = setupPool || PLAYERS.map(p => p.id);
  const activePlayers = PLAYERS.filter(p => poolIds.includes(p.id));
  
  // Sort descending by rating
  activePlayers.sort((a, b) => b.r - a.r);
  
  const m1 = sh(activePlayers.slice(0, 20).map(p => ({...p, cat: "M1"})));
  const m2 = sh(activePlayers.slice(20, 40).map(p => ({...p, cat: "M2"})));
  const rest = activePlayers.slice(40);
  
  const fwd = sh(rest.filter(p => p.cat === "FWD"));
  const mid = sh(rest.filter(p => p.cat === "MID"));
  const def = sh(rest.filter(p => p.cat === "DEF"));
  const gk = sh(rest.filter(p => p.cat === "GK"));
  
  return [...m1, ...m2, ...fwd, ...mid, ...def, ...gk];
}`;
app = app.replace(mkQueueRegex, newMkQueue);

// 2. START_AUCTION to pass setupPool
app = app.replace('const q = mkQueue(a.cfg);', 'const q = mkQueue(a.cfg, s.setupPool);');

// 3. CAT_META updates
const oldCatMeta = /M: \{ label: "MARQUEE", icon: "⭐", color: "#f59e0b", bg: "rgba\(245,158,11,\.1\)" \},/;
const newCatMeta = `M1: { label: "MARQUEE 1", icon: "💎", color: "#fbbf24", bg: "rgba(251,191,36,.1)" },
  M2: { label: "MARQUEE 2", icon: "⭐", color: "#f59e0b", bg: "rgba(245,158,11,.1)" },`;
app = app.replace(oldCatMeta, newCatMeta);

// 4. NEXT_PLAYER banner logic
app = app.replace(
  'const showBanner = prevCat && next.cat !== prevCat && prevCat !== "M" && next.cat !== "M";',
  'const showBanner = prevCat && next.cat !== prevCat;'
);

// 5. Sleek Dark Futuristic Player Card
const cardStart = app.indexOf('{/* FC26 CARD */}');
const cardEnd = app.indexOf('{/* TIMER + BID */}');

const newCard = `
                {/* FC26 CARD */}
                <div key={p.id + (current?.uid || 0)} style={{ 
                  width: "100%", maxWidth: 360, margin: "0 auto 16px", borderRadius: 20, 
                  background: "linear-gradient(145deg, #0f172a 0%, #020617 100%)", 
                  border: "1px solid rgba(56, 189, 248, 0.15)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.05), inset 0 0 40px rgba(56,189,248,0.03)",
                  padding: 24, position: "relative", overflow: "hidden", animation: "cardIn .4s cubic-bezier(0.34,1.2,0.64,1)"
                }}>
                  {/* Subtle top-left glow */}
                  <div style={{ position: "absolute", top: -50, left: -50, width: 150, height: 150, background: "rgba(56, 189, 248, 0.1)", filter: "blur(40px)", borderRadius: "50%" }} />
                  {isReauction && <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", padding: "5px 16px", borderRadius: 99, background: "rgba(59,130,246,.25)", border: "1px solid rgba(59,130,246,.5)", fontFamily: F, fontSize: 10, color: "#93c5fd", letterSpacing: 3, zIndex: 10, backdropFilter: "blur(4px)" }}>🔄 REAUCTION</div>}
                  
                  {/* TOP HEADER */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, position: "relative", zIndex: 2 }}>
                    
                    {/* Rating & Position */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", minWidth: 80 }}>
                      <div style={{ fontFamily: "Impact, sans-serif", fontSize: 64, color: "#fff", lineHeight: 0.8, letterSpacing: -2, fontStyle: "italic", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }}>{p.r}</div>
                      <div style={{ fontFamily: F, fontSize: 18, fontWeight: 900, color: "#38bdf8", letterSpacing: 2, fontStyle: "italic", marginTop: 8 }}>{p.pos}</div>
                    </div>

                    {/* Name & Meta */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", flex: 1, textAlign: "right", marginTop: p.s.length > 10 ? -4 : 0 }}>
                      <div style={{ fontFamily: F, fontSize: 14, color: "#9ca3af", letterSpacing: 3, fontWeight: 600, textTransform: "uppercase", marginBottom: -4 }}>{p.n.split(' ')[0] || ""}</div>
                      <div style={{ fontFamily: F, fontSize: p.s.length > 10 ? 28 : 36, color: "#fff", fontWeight: 900, letterSpacing: 1, textTransform: "uppercase", fontStyle: "italic", textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>{p.s}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                        <div style={{ fontFamily: F, fontSize: 12, color: "#6b7280", letterSpacing: 1, textTransform: "uppercase" }}>{p.club}</div>
                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#38bdf8", boxShadow: "0 0 6px #38bdf8" }} />
                        <div style={{ fontFamily: F, fontSize: 12, color: "#6b7280", letterSpacing: 1, textTransform: "uppercase" }}>{p.nat}</div>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.2), transparent)", marginBottom: 24 }} />

                  {/* STATS GRID */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24, position: "relative", zIndex: 2 }}>
                    {[
                      ["PAC", p.pac], ["SHO", p.sho], ["PAS", p.pas], 
                      ["DRI", p.dri], ["DEF", p.def], ["PHY", p.phy]
                    ].map(([lbl, val]) => {
                      const col = val >= 90 ? '#4ade80' : val >= 80 ? '#38bdf8' : val >= 70 ? '#facc15' : '#f87171';
                      return (
                        <div key={lbl} style={{ 
                          background: "rgba(15, 23, 42, 0.6)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.03)", 
                          padding: "12px 0", display: "flex", flexDirection: "column", alignItems: "center",
                          boxShadow: "inset 0 2px 10px rgba(0,0,0,0.5)"
                        }}>
                          <div style={{ fontFamily: F, fontSize: 11, color: "#6b7280", fontWeight: 700, letterSpacing: 1 }}>{lbl}</div>
                          <div style={{ fontFamily: "Impact, sans-serif", fontSize: 32, color: col, fontStyle: "italic", lineHeight: 1.1, margin: "4px 0", textShadow: \`0 0 15px \${col}44\` }}>{val}</div>
                          <div style={{ width: "60%", height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 99, marginTop: 4, overflow: "hidden" }}>
                            <div style={{ width: \`\${val}%\`, height: "100%", background: col, boxShadow: \`0 0 8px \${col}\`, borderRadius: 99 }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* FOOTER: SKILLS & WF */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.03)", paddingTop: 16, position: "relative", zIndex: 2 }}>
                    
                    {/* Tiny hexagon icon decoration */}
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(30, 58, 138, 0.3)", border: "1px solid rgba(59, 130, 246, 0.4)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 15px rgba(30, 58, 138, 0.5)" }}>
                      <span style={{ fontSize: 14, color: "#60a5fa" }}>⚽</span>
                    </div>

                    <div style={{ display: "flex", gap: 24 }}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontFamily: F, fontSize: 9, color: "#6b7280", letterSpacing: 1.5, fontWeight: 700, marginBottom: 4 }}>SKILL MOVES</div>
                        <div style={{ display: "flex", gap: 2, justifyContent: "center" }}>
                          {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 12, color: s <= p.sm ? "#4f46e5" : "#1f2937", textShadow: s <= p.sm ? "0 0 6px rgba(79, 70, 229, 0.6)" : "none" }}>★</span>)}
                        </div>
                      </div>
                      <div style={{ width: 1, background: "rgba(255,255,255,0.05)" }} />
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontFamily: F, fontSize: 9, color: "#6b7280", letterSpacing: 1.5, fontWeight: 700, marginBottom: 4 }}>WEAK FOOT</div>
                        <div style={{ display: "flex", gap: 2, justifyContent: "center" }}>
                          {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 12, color: s <= p.wf ? "#4f46e5" : "#1f2937", textShadow: s <= p.wf ? "0 0 6px rgba(79, 70, 229, 0.6)" : "none" }}>★</span>)}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                `;

if (cardStart > -1 && cardEnd > -1) {
  app = app.substring(0, cardStart) + newCard + app.substring(cardEnd);
} else {
  console.log("Could not find card injection points");
}

fs.writeFileSync('src/App.jsx', app);
console.log("Dark Theme and Queue Patch successfully applied.");
