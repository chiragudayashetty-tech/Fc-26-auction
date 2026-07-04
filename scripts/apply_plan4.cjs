const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

// 1. PDF Imports
const importsIdx = app.indexOf('import');
app = app.slice(0, importsIdx) + `import jsPDF from 'jspdf';\nimport 'jspdf-autotable';\n` + app.slice(importsIdx);

// 2. Remove Admin Login Block EXACTLY
const adminBlock = `<div style={{ marginTop: 40, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
              {adminUser ? (
                <div style={{ color: "#9ca3af", fontSize: 13, textAlign: "center" }}>
                  Logged in as Admin ({adminUser.email}) 
                  <button onClick={() => supabase.auth.signOut()} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", marginLeft: 10, textDecoration: "underline" }}>Logout</button>
                </div>
              ) : (
                <button onClick={() => setRAction("admin_login")} style={{ width: "100%", background: "none", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", cursor: "pointer", padding: "12px", borderRadius: "8px", fontSize: 14 }}>
                  🔑 Admin Login
                </button>
              )}
              
              <button onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = window.location.pathname + '?nocache=' + Date.now();
              }} style={{ width: "100%", background: "none", border: "none", color: "#6b7280", cursor: "pointer", padding: "8px", fontSize: 12, textDecoration: "underline" }}>
                🧹 Clear App Cache & Reload
              </button>
            </div>`;
app = app.replace(adminBlock, '');

const adminLoginAction = `) : rAction === "admin_login" ? (
          <div style={{ width: "100%", maxWidth: 340, background: "rgba(255,255,255,.02)", padding: 24, borderRadius: 20, border: "1px solid rgba(255,255,255,.05)", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontFamily: F, fontSize: 24, fontWeight: 800, color: "#fff", textAlign: "center", letterSpacing: 2 }}>ADMIN LOGIN</div>
            <input className="ti" value={myTeamN} onChange={e => setMyTeamN(e.target.value)} placeholder="Email" type="email" style={INP} />
            <input className="ti" value={myName} onChange={e => setMyName(e.target.value)} placeholder="Password" type="password" style={INP} />
            {err && <div style={{ color: "#f87171", fontSize: 12, textAlign: "center" }}>{err}</div>}
            <button onClick={async () => {
              if(!myTeamN || !myName) return flash("Enter email and password");
              const { error } = await supabase.auth.signInWithPassword({ email: myTeamN, password: myName });
              if (error) { flash(error.message); } else { setRAction(null); setMyTeamN(""); setMyName(""); }
            }} style={{ ...BTN("linear-gradient(135deg,#3b82f6,#7c3aed)"), padding: "16px 0", fontSize: 15, letterSpacing: 2 }}>LOGIN</button>
            <button onClick={() => setRAction(null)} style={{ ...BTN("transparent"), padding: "12px 0", fontSize: 13, border: "1px solid rgba(255,255,255,.1)" }}>CANCEL</button>
          </div>`;
app = app.replace(adminLoginAction, '');

// 3. Mobile UI Bidding Controls
const bidControls = `<div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
                      {[1, 2, 5, 10].map(inc => { const nxt = (current?.bid || 0) + inc, can = nxt <= (activeTeam?.budget || 0) && (activeTeam?.squad?.length || 0) < 20; return (<button key={inc} className="bb" onClick={() => bidInc(inc, isR2)} disabled={!can} style={{ padding: "15px 0", borderRadius: 14, background: can ? "linear-gradient(135deg,#3b82f6,#1d4ed8)" : "rgba(255,255,255,.04)", color: can ? "#fff" : "#2d3748", fontFamily: F, fontWeight: 700, fontSize: 17, border: "none", cursor: can ? "pointer" : "not-allowed", letterSpacing: 1 }}>+{inc}</button>); })}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                      {[20, 50].map(inc => { const nxt = (current?.bid || 0) + inc, can = nxt <= (activeTeam?.budget || 0) && (activeTeam?.squad?.length || 0) < 20; return (<button key={inc} className="bb" onClick={() => bidInc(inc, isR2)} disabled={!can} style={{ padding: "13px 0", borderRadius: 14, background: can ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "rgba(255,255,255,.04)", color: can ? "#fff" : "#2d3748", fontFamily: F, fontWeight: 700, fontSize: 14, border: "none", cursor: can ? "pointer" : "not-allowed" }}>+{inc}→{nxt}pt</button>); })}
                      {(() => { const b = activeTeam?.budget || 0, can = b > 0 && (activeTeam?.squad?.length || 0) < 20 && b > (current?.bid || 0); return (<button className="bb" onClick={() => bidAll(isR2)} disabled={!can} style={{ padding: "13px 0", borderRadius: 14, background: can ? "linear-gradient(135deg,#dc2626,#991b1b)" : "rgba(255,255,255,.04)", color: can ? "#fff" : "#2d3748", fontFamily: F, fontWeight: 700, fontSize: 11, border: "none", cursor: can ? "pointer" : "not-allowed", lineHeight: 1.4 }}>ALL IN<br /><span style={{ fontSize: 9 }}>{b}pt</span></button>); })()}
                    </div>`;

const newBidControls = `<div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                      {[1, 2, 5].map(inc => { const nxt = (current?.bid || 0) + inc, can = nxt <= (activeTeam?.budget || 0) && (activeTeam?.squad?.length || 0) < 20; return (<button key={inc} className="bb" onClick={() => { audio.bid(); bidInc(inc, isR2); }} disabled={!can} style={{ padding: "15px 0", borderRadius: 14, background: can ? "linear-gradient(135deg,#3b82f6,#1d4ed8)" : "rgba(255,255,255,.04)", color: can ? "#fff" : "#2d3748", fontFamily: F, fontWeight: 700, fontSize: 17, border: "none", cursor: can ? "pointer" : "not-allowed", letterSpacing: 1 }}>+{inc}</button>); })}
                    </div>`;
                    
app = app.replace(bidControls, newBidControls);

app = app.replace(
  /<button className="bb" onClick=\{\(\) => bidCustom\(isR2\)\} style=\{\{ padding: "13px 20px", borderRadius: 14, background: "linear-gradient\(135deg,#06b6d4,#0891b2\)", border: "none", color: "#000", fontFamily: F, fontWeight: 800, fontSize: 14, cursor: "pointer", letterSpacing: 2, flexShrink: 0 \}\}>BID<\/button>/,
  `<button className="bb" onClick={() => { audio.bid(); bidCustom(isR2); }} style={{ padding: "13px 20px", borderRadius: 14, background: "linear-gradient(135deg,#06b6d4,#0891b2)", border: "none", color: "#000", fontFamily: F, fontWeight: 800, fontSize: 14, cursor: "pointer", letterSpacing: 2, flexShrink: 0 }}>BID</button>`
);

// 4. PDF Download Button + Safe New Auction Button
const btnRegex = /<button onClick=\{\(\) => dispatch\(\{ type: "RESET" \}\)\} style=\{\{ \.\.\.BTN\("linear-gradient\(135deg,#3b82f6,#7c3aed\)"\), padding: "14px", fontSize: 14, letterSpacing: 3 \}\}>NEW AUCTION<\/button>/;

const newFooter = `<div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <button onClick={() => {
            const doc = new jsPDF();
            doc.setFont("helvetica", "bold");
            doc.setFontSize(22);
            doc.setTextColor(6, 182, 212);
            doc.text("FC 26 Auction Results", 14, 20);
            let y = 30;
            teams.forEach(t => {
              doc.setFontSize(16);
              doc.setTextColor(30, 41, 59);
              doc.text(t.team, 14, y);
              doc.setFontSize(11);
              doc.setTextColor(100, 116, 139);
              doc.text(\`Budget Remaining: \${t.budget}pt | Squad Size: \${t.squad.length}/20\`, 14, y + 6);
              y += 12;
              const tableData = t.squad.map(p => [p.n, p.r.toString(), p.pos, p.club, \`\${p.price} pt\`]);
              doc.autoTable({
                startY: y,
                head: [['Player', 'OVR', 'Pos', 'Club', 'Price']],
                body: tableData,
                theme: 'grid',
                headStyles: { fillColor: [6, 182, 212] },
                margin: { left: 14, right: 14 }
              });
              y = doc.lastAutoTable.finalY + 15;
              if (y > 270) { doc.addPage(); y = 20; }
            });
            doc.save("fc26-auction-results.pdf");
          }} style={{ ...BTN("linear-gradient(135deg,#06b6d4,#0891b2)"), padding: "14px", fontSize: 14, letterSpacing: 2, flex: 1 }}>📄 EXPORT PDF</button>
        </div>
        <button onClick={() => { 
          if(window.confirm('WARNING: If you leave to start a new auction, you will lose access to this room! Ensure you exported the PDF first. Proceed?')) { 
             sessionStorage.clear(); 
             window.location.reload(); 
          } 
        }} style={{ background: "none", border: "none", color: "#6b7280", fontFamily: F, fontSize: 11, letterSpacing: 1, textDecoration: "underline", cursor: "pointer", marginTop: 24, textAlign: "center", width: "100%" }}>Leave & Start New Auction</button>`;
        
app = app.replace(btnRegex, newFooter);

// 5. Skip UI & Logic
const skipVotesBlock = `SKIP VOTES ({skipVotes.length}/{teams.length})`;
app = app.replace(skipVotesBlock, 'SKIP VOTES ({skipVotes.length}/{teams.length - (current?.bidderIdx != null ? 1 : 0)} REQUIRED)');

const canVoteBlock = `const canVote = myTeamIdx != null && !voted;`;
app = app.replace(canVoteBlock, 'const canVote = myTeamIdx != null && !voted && myTeamIdx !== current?.bidderIdx;');

const voteBlock = `{voted ? "✓ VOTED TO SKIP" : "⏭️ VOTE TO SKIP"}`;
app = app.replace(voteBlock, '{myTeamIdx === current?.bidderIdx ? "🏆 WINNING BID" : voted ? "✓ VOTED TO SKIP" : "⏭️ VOTE TO SKIP"}');

// Remove audio calls from reducer side-effects
app = app.replace(/audio\.bid\(\);\n\s*/g, '');

// Audio logic for sold/skipped
app = app.replace(
  /prevStatusRef\.current = current\.status;/g,
  `if (current.status === "sold" && prevStatusRef.current !== "sold") { audio.sold(); }
    if (current.status === "skipped" && prevStatusRef.current !== "skipped") { audio.skip(); }
    prevStatusRef.current = current.status;`
);


// 6. Fix cardGrade (Remove Gold/Silver)
const oldCardGrade = `function cardGrade(r, cat) {
  if (cat.startsWith("M") || r >= 84) return { a: "#fbbf24", bg: "linear-gradient(155deg,#eab308,#854d0e)", lbl: "GOLD", lc: "#000" };
  if (r >= 75) return { a: "#cbd5e1", bg: "linear-gradient(155deg,#94a3b8,#475569)", lbl: "SILVER", lc: "#000" };
  return { a: "#0891b2", bg: "linear-gradient(155deg,#b45309,#78350f)", lbl: "BRONZE", lc: "#fff" };
}`;

const newCardGrade = `function cardGrade(r, cat) {
  if (cat.startsWith("M") || r >= 84) return { a: "#06b6d4", bg: "linear-gradient(155deg,#083344,#164e63)", lbl: "ELITE", lc: "#fff" };
  if (r >= 75) return { a: "#67e8f9", bg: "linear-gradient(155deg,#164e63,#0f172a)", lbl: "PRO", lc: "#fff" };
  return { a: "#94a3b8", bg: "linear-gradient(155deg,#0f172a,#020617)", lbl: "BASE", lc: "#fff" };
}`;
app = app.replace(oldCardGrade, newCardGrade);

fs.writeFileSync('src/App.jsx', app);
console.log("Applied Phase 4 changes perfectly safely!");
