const fs = require('fs');
const app = fs.readFileSync('src/App.jsx', 'utf8').split('\n');

const setupIdx = app.findIndex(l => l.includes('phase === "setup"'));
console.log("--- SETUP ---");
if (setupIdx !== -1) console.log(app.slice(setupIdx, setupIdx + 100).join('\n'));

const cardIdx = app.findIndex(l => l.includes('function PlayerCard'));
console.log("--- CARD ---");
if (cardIdx !== -1) console.log(app.slice(cardIdx, cardIdx + 60).join('\n'));
else {
  const inlineCardIdx = app.findIndex(l => l.includes('const r = cur.player.r;'));
  if (inlineCardIdx !== -1) console.log(app.slice(inlineCardIdx-20, inlineCardIdx + 60).join('\n'));
}

const skipIdx = app.findIndex(l => l.includes('onClick={() => dispatch({ type: "SKIP" })}'));
console.log("--- SKIP ---");
if (skipIdx !== -1) console.log(app.slice(skipIdx-5, skipIdx + 15).join('\n'));

const resultsIdx = app.findIndex(l => l.includes('phase === "results"'));
console.log("--- RESULTS ---");
if (resultsIdx !== -1) console.log(app.slice(resultsIdx, resultsIdx + 40).join('\n'));
