const fs = require('fs');

let app = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Redesign Card
const cardTargetStart = app.indexOf('{/* PLAYER CARD */}');
const cardTargetEnd = app.indexOf('{/* BIG VOTE/BID BUTTONS */}');

if (cardTargetStart !== -1 && cardTargetEnd !== -1) {
  const newCard = `
            {/* PREMIUM PLAYER CARD */}
            <div style={{ position: "relative", width: 340, height: 480, margin: "0 auto", perspective: 1000, animation: "float 6s ease-in-out infinite" }}>
              <div style={{ 
                width: "100%", height: "100%", borderRadius: 24, 
                background: g.r >= 88 ? "linear-gradient(135deg, #fbbf24 0%, #b45309 100%)" : 
                            g.r >= 84 ? "linear-gradient(135deg, #d1d5db 0%, #6b7280 100%)" : 
                            "linear-gradient(135deg, #b45309 0%, #78350f 100%)",
                padding: 4,
                boxShadow: g.r >= 88 ? "0 20px 50px rgba(245,158,11,.3)" : "0 20px 50px rgba(0,0,0,.5)",
                display: "flex", flexDirection: "column"
              }}>
                <div style={{ 
                  flex: 1, borderRadius: 20, 
                  background: "linear-gradient(180deg, rgba(0,0,0,.6) 0%, rgba(0,0,0,.9) 100%)",
                  position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", padding: 24
                }}>
                  {/* Rating & Position */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: F, fontWeight: 900, fontSize: 52, color: g.col, lineHeight: 1, textShadow: "0 4px 12px rgba(0,0,0,.5)" }}>{g.r}</div>
                      <div style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,.8)" }}>{cur.player.pos}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 24, marginBottom: 4 }}>{cur.player.nat === "France" ? "🇫🇷" : cur.player.nat === "Spain" ? "🇪🇸" : cur.player.nat === "England" ? "🏴󠁧󠁢󠁥󠁮󠁧󠁿" : cur.player.nat === "Brazil" ? "🇧🇷" : cur.player.nat === "Argentina" ? "🇦🇷" : cur.player.nat === "Germany" ? "🇩🇪" : cur.player.nat === "Portugal" ? "🇵🇹" : "🌍"}</div>
                      <div style={{ fontFamily: F, fontSize: 11, color: "rgba(255,255,255,.6)", letterSpacing: 1, textTransform: "uppercase" }}>{cur.player.club}</div>
                    </div>
                  </div>
                  
                  {/* Name */}
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ fontFamily: F, fontWeight: 900, fontSize: cur.player.n.length > 15 ? 28 : 36, textAlign: "center", color: "#fff", textTransform: "uppercase", letterSpacing: 2, lineHeight: 1.1 }}>
                      {cur.player.n}
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ height: 2, background: \`linear-gradient(90deg, transparent, \${g.col}88, transparent)\`, margin: "16px 0" }} />

                  {/* Stats Grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px", padding: "0 10px" }}>
                    {[['PAC', cur.player.pac], ['SHO', cur.player.sho], ['PAS', cur.player.pas], ['DRI', cur.player.dri], ['DEF', cur.player.def], ['PHY', cur.player.phy]].map(([l, v]) => (
                      <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: "#fff" }}>{v}</span>
                        <span style={{ fontFamily: F, fontSize: 12, color: "rgba(255,255,255,.5)" }}>{l}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 16 }}>
                    <div style={{ fontFamily: F, fontSize: 11, color: "rgba(255,255,255,.6)" }}>SM <span style={{ color: "#fff", fontWeight: 700 }}>{cur.player.sm}★</span></div>
                    <div style={{ fontFamily: F, fontSize: 11, color: "rgba(255,255,255,.6)" }}>WF <span style={{ color: "#fff", fontWeight: 700 }}>{cur.player.wf}★</span></div>
                  </div>
                </div>
              </div>
            </div>

            `;
  app = app.substring(0, cardTargetStart) + newCard + app.substring(cardTargetEnd);
}

// 2. Remove SKIP button from Host Panel
const skipRegex = /<button[^>]*onClick=\{\(\) => dispatch\(\{ type: "SKIP" \}\)\}[^>]*>⏭️ SKIP<\/button>/;
if (app.match(skipRegex)) {
  app = app.replace(skipRegex, "");
  // Change grid template column
  app = app.replace('gridTemplateColumns: "2fr 1fr"', 'gridTemplateColumns: "1fr"');
}

// 3. Add manual setupPool
// State init
app = app.replace('setup: [{ name: "Host", team: "FC Host", online: true, uid: "host" }],', 'setup: [{ name: "Host", team: "FC Host", online: true, uid: "host" }], setupPool: null,');

// Reducer actions
const actionCode = `
    case "TOGGLE_POOL_PLAYER":
      return { ...s, setupPool: s.setupPool ? (s.setupPool.includes(a.id) ? s.setupPool.filter(id => id !== a.id) : [...s.setupPool, a.id]) : PLAYERS.filter(p => p.id !== a.id).map(p => p.id) };
    case "TOGGLE_ALL_POOL":
      return { ...s, setupPool: s.setupPool && s.setupPool.length === 0 ? null : [] };
`;
app = app.replace('case "SET_SETUP":', actionCode + '\n    case "SET_SETUP":');

// Render in UI
const uiTarget = '{/* START BUTTON */}';
const uiInsert = `
        {/* MANUAL PLAYER SELECTION */}
        <div style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.05)", borderRadius: 16, padding: 16 }}>
          <div style={{ fontFamily: F, fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 12, display: "flex", justifyContent: "space-between" }}>
            <span>PLAYER POOL: {setupPool ? setupPool.length : PLAYERS.length}/250</span>
            {session.isHost && (
              <button onClick={() => dispatch({ type: "TOGGLE_ALL_POOL" })} style={{ background: "none", border: "1px solid #6b7280", color: "#9ca3af", borderRadius: 6, cursor: "pointer", fontSize: 10, padding: "2px 8px" }}>TOGGLE ALL</button>
            )}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxHeight: 300, overflowY: "auto", paddingRight: 8 }}>
            {PLAYERS.map(pl => {
               const isSel = !setupPool || setupPool.includes(pl.id);
               return (
                 <div key={pl.id} onClick={() => session.isHost && dispatch({ type: "TOGGLE_POOL_PLAYER", id: pl.id })}
                   style={{ padding: "6px 10px", borderRadius: 8, background: isSel ? "rgba(34,197,94,.1)" : "rgba(255,255,255,.05)", border: \`1px solid \${isSel ? "rgba(34,197,94,.4)" : "rgba(255,255,255,.1)"}\`, color: isSel ? "#4ade80" : "#6b7280", fontSize: 11, cursor: session.isHost ? "pointer" : "default", opacity: isSel ? 1 : 0.4, transition: "all .2s" }}>
                   {pl.n} <span style={{ opacity: .5 }}>{pl.r}</span>
                 </div>
               )
            })}
          </div>
        </div>

`;
app = app.replace(uiTarget, uiInsert + uiTarget);

// START_AUCTION needs to use setupPool
app = app.replace('let pool = PLAYERS.slice(0, 160);', 'let pool = s.setupPool ? PLAYERS.filter(p => s.setupPool.includes(p.id)) : PLAYERS;');

fs.writeFileSync('src/App.jsx', app);
console.log("App.jsx successfully patched!");
