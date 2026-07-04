const https = require('https');
const fs = require('fs');

const url = "https://raw.githubusercontent.com/prashantghimire/sofifa-web-scraper/master/player_stats.csv";

const femaleLeagues = [
  "Barclays WSL", "NWSL", "D1 Arkema", "Liga F", "Frauen-Bundesliga", "Women's Super League"
];

function getCat(pos) {
  if (pos.includes('GK')) return 'GK';
  if (pos.includes('CB') || pos.includes('LB') || pos.includes('RB') || pos.includes('LWB') || pos.includes('RWB')) return 'DEF';
  if (pos.includes('CM') || pos.includes('CDM') || pos.includes('CAM') || pos.includes('LM') || pos.includes('RM')) return 'MID';
  return 'FWD';
}

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    
    const getCol = (l, name) => {
      const idx = headers.indexOf(name);
      if (idx === -1) return null;
      // Handle CSV quotes
      const match = l.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
      if (!match || !match[idx]) return '';
      return match[idx].replace(/(^"|"$)/g, '');
    };
    
    let players = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;
      
      const league = getCol(line, 'club_league_name') || '';
      if (femaleLeagues.some(fl => league.includes(fl))) continue;
      
      const r = parseInt(getCol(line, 'overall_rating'));
      if (isNaN(r) || r < 78) continue;
      
      const full_name = getCol(line, 'full_name');
      const name = getCol(line, 'name');
      const posStr = getCol(line, 'positions') || '';
      const pos = posStr.split(',')[0].trim();
      const club = getCol(line, 'club_name');
      const nat = getCol(line, 'country_name');
      const sm = parseInt(getCol(line, 'skill_moves')) || 1;
      const wf = parseInt(getCol(line, 'weak_foot')) || 1;
      const eaId = parseInt(getCol(line, 'player_id')) || i;
      
      const acc = parseInt(getCol(line, 'movement_acceleration')) || 0;
      const spr = parseInt(getCol(line, 'movement_sprint_speed')) || 0;
      const pac = Math.round((acc + spr) / 2) || 50;
      
      const fin = parseInt(getCol(line, 'attacking_finishing')) || 0;
      const shoP = parseInt(getCol(line, 'power_shot_power')) || 0;
      const lon = parseInt(getCol(line, 'power_long_shots')) || 0;
      const sho = Math.round(fin*0.5 + shoP*0.3 + lon*0.2) || 50;
      
      const shoP_pass = parseInt(getCol(line, 'attacking_short_passing')) || 0;
      const vis = parseInt(getCol(line, 'mentality_vision')) || 0;
      const pas = Math.round(shoP_pass*0.6 + vis*0.4) || 50;
      
      const dri_stat = parseInt(getCol(line, 'skill_dribbling')) || 0;
      const bal = parseInt(getCol(line, 'skill_ball_control')) || 0;
      const dri = Math.round(dri_stat*0.6 + bal*0.4) || 50;
      
      const stand = parseInt(getCol(line, 'defending_standing_tackle')) || 0;
      const slide = parseInt(getCol(line, 'defending_sliding_tackle')) || 0;
      const def = Math.round(stand*0.5 + slide*0.5) || 50;
      
      const str = parseInt(getCol(line, 'power_strength')) || 0;
      const sta = parseInt(getCol(line, 'power_stamina')) || 0;
      const phy = Math.round(str*0.6 + sta*0.4) || 50;
      
      const div = parseInt(getCol(line, 'goalkeeping_gk_diving')) || 0;
      const han = parseInt(getCol(line, 'goalkeeping_gk_handling')) || 0;
      const kic = parseInt(getCol(line, 'goalkeeping_gk_kicking')) || 0;
      const ref = parseInt(getCol(line, 'goalkeeping_gk_reflexes')) || 0;
      const gkPos = parseInt(getCol(line, 'goalkeeping_gk_positioning')) || 0;
      
      let pObj = {
        id: players.length + 1,
        n: full_name || name,
        s: name,
        pos: pos,
        r: r,
        pac: pos === 'GK' ? div : pac,
        sho: pos === 'GK' ? han : sho,
        pas: pos === 'GK' ? kic : pas,
        dri: pos === 'GK' ? ref : dri,
        def: pos === 'GK' ? pac : def,
        phy: pos === 'GK' ? gkPos : phy,
        sm: sm,
        wf: wf,
        club: club,
        nat: nat,
        cat: getCat(pos),
        eaId: eaId
      };
      
      players.push(pObj);
    }
    
    // Sort by rating desc
    players.sort((a,b) => b.r - a.r);
    
    // Top 250
    players = players.slice(0, 250);
    
    // Reassign IDs
    players.forEach((p, idx) => p.id = idx + 1);
    
    console.log(`Generated ${players.length} players. Top player: ${players[0].n} (${players[0].r})`);
    
    // Inject into App.jsx
    const appFile = 'src/App.jsx';
    let app = fs.readFileSync(appFile, 'utf8');
    const startIdx = app.indexOf('const PLAYERS = [');
    const endIdx = app.indexOf('];\n', startIdx) + 2;
    
    if (startIdx !== -1 && endIdx !== -1) {
      const newCode = `const PLAYERS = ${JSON.stringify(players, null, 2)};`;
      app = app.substring(0, startIdx) + newCode + app.substring(endIdx);
      fs.writeFileSync(appFile, app);
      console.log('Successfully updated App.jsx with 250 players.');
    } else {
      console.log('Could not find PLAYERS array in App.jsx');
    }
    
  });
}).on('error', e => console.error(e));
