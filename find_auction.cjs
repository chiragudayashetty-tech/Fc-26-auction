const fs=require('fs'); 
const app=fs.readFileSync('src/App.jsx','utf8').split('\n'); 
const i = app.findIndex(l => l.includes('phase === "auction"')); 
console.log('Auction starts at:', i); 
console.log(app.slice(i, i+30).join('\n'));
