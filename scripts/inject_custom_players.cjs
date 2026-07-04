const fs = require('fs');

try {
  // Read the user's custom JSON file
  const rawData = fs.readFileSync('../fc26_auction_list.json', 'utf8');
  const customPlayers = JSON.parse(rawData);

  console.log(`Loaded ${customPlayers.length} players from user file.`);

  // Process the players to ensure all required fields are present
  const POS_MAP = {
    "ST": "FWD", "CF": "FWD", "LW": "FWD", "RW": "FWD",
    "CM": "MID", "CAM": "MID", "CDM": "MID", "LM": "MID", "RM": "MID",
    "CB": "DEF", "LB": "DEF", "RB": "DEF", "LWB": "DEF", "RWB": "DEF",
    "GK": "GK"
  };

  const processedPlayers = customPlayers.map((p, i) => {
    // Generate id and eaId if missing
    const id = p.id || (i + 1);
    const eaId = p.eaId || (10000 + id);
    
    // Calculate category if missing
    let cat = p.cat;
    if (!cat) {
      cat = POS_MAP[p.pos] || "MID"; // default to MID if unknown
    }

    return {
      id,
      n: p.n || p.name || p.Name || "Unknown",
      s: p.s || p.shortName || p.ShortName || p.n || p.name || "Unknown",
      pos: p.pos || p.Position || "CM",
      r: p.r || p.rating || p.Rating || 80,
      pac: p.pac || p.pace || p.Pace || 75,
      sho: p.sho || p.shooting || p.Shooting || 75,
      pas: p.pas || p.passing || p.Passing || 75,
      dri: p.dri || p.dribbling || p.Dribbling || 75,
      def: p.def || p.defending || p.Defending || 75,
      phy: p.phy || p.physical || p.Physical || 75,
      sm: p.sm || p.skillMoves || p.SkillMoves || 3,
      wf: p.wf || p.weakFoot || p.WeakFoot || 3,
      club: p.club || p.Club || "Free Agent",
      nat: p.nat || p.nationality || p.Nationality || "Unknown",
      cat,
      eaId
    };
  });

  // Read App.jsx
  let appStr = fs.readFileSync('src/App.jsx', 'utf8');

  // Replace the empty PLAYERS array
  const targetStr = 'const PLAYERS = [];';
  const newStr = `const PLAYERS = ${JSON.stringify(processedPlayers, null, 2)};`;

  if (appStr.includes(targetStr)) {
    appStr = appStr.replace(targetStr, newStr);
    fs.writeFileSync('src/App.jsx', appStr);
    console.log(`Successfully injected ${processedPlayers.length} custom players into App.jsx!`);
  } else {
    // Fallback if the array isn't exactly empty
    console.error("Could not find 'const PLAYERS = [];' in App.jsx. It may have been formatted differently.");
  }

} catch (err) {
  console.error("Error processing custom players:", err);
}
