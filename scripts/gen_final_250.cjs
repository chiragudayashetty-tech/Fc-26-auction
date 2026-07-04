const fs = require('fs');

const manualPlayers = [
  { n: "Kylian Mbappé", pos: "ST", club: "Real Madrid", nat: "France", r: 91, pac: 97, sho: 90, pas: 80, dri: 92, def: 39, phy: 76, sm: 5, wf: 4 },
  { n: "Rodri", pos: "CDM", club: "Manchester City", nat: "Spain", r: 91, pac: 58, sho: 73, pas: 86, dri: 79, def: 85, phy: 85, sm: 4, wf: 4 },
  { n: "Erling Haaland", pos: "ST", club: "Manchester City", nat: "Norway", r: 91, pac: 89, sho: 93, pas: 65, dri: 80, def: 45, phy: 88, sm: 3, wf: 3 },
  { n: "Jude Bellingham", pos: "CAM", club: "Real Madrid", nat: "England", r: 90, pac: 80, sho: 87, pas: 83, dri: 88, def: 78, phy: 82, sm: 4, wf: 4 },
  { n: "Vinícius Júnior", pos: "LW", club: "Real Madrid", nat: "Brazil", r: 90, pac: 95, sho: 84, pas: 81, dri: 91, def: 29, phy: 69, sm: 5, wf: 4 },
  { n: "Kevin De Bruyne", pos: "CM", club: "Manchester City", nat: "Belgium", r: 90, pac: 67, sho: 85, pas: 94, dri: 87, def: 65, phy: 78, sm: 4, wf: 5 },
  { n: "Harry Kane", pos: "ST", club: "Bayern Munich", nat: "England", r: 90, pac: 65, sho: 93, pas: 84, dri: 83, def: 49, phy: 83, sm: 3, wf: 5 },
  { n: "Martin Ødegaard", pos: "CM", club: "Arsenal", nat: "Norway", r: 89, pac: 73, sho: 80, pas: 89, dri: 89, def: 63, phy: 68, sm: 5, wf: 3 },
  { n: "Alisson", pos: "GK", club: "Liverpool", nat: "Brazil", r: 89, pac: 86, sho: 85, pas: 85, dri: 89, def: 54, phy: 90, sm: 1, wf: 3 },
  { n: "Gianluigi Donnarumma", pos: "GK", club: "Paris SG", nat: "Italy", r: 89, pac: 90, sho: 83, pas: 79, dri: 90, def: 52, phy: 85, sm: 1, wf: 3 },
  { n: "Thibaut Courtois", pos: "GK", club: "Real Madrid", nat: "Belgium", r: 89, pac: 85, sho: 89, pas: 76, dri: 93, def: 46, phy: 90, sm: 1, wf: 3 },
  { n: "Lautaro Martínez", pos: "ST", club: "Inter", nat: "Argentina", r: 89, pac: 82, sho: 88, pas: 75, dri: 86, def: 52, phy: 84, sm: 4, wf: 4 },
  { n: "Virgil van Dijk", pos: "CB", club: "Liverpool", nat: "Netherlands", r: 89, pac: 78, sho: 60, pas: 71, dri: 72, def: 89, phy: 86, sm: 2, wf: 3 },
  { n: "Mohamed Salah", pos: "RW", club: "Liverpool", nat: "Egypt", r: 89, pac: 89, sho: 87, pas: 82, dri: 88, def: 45, phy: 76, sm: 4, wf: 3 },
  { n: "Phil Foden", pos: "RW", club: "Manchester City", nat: "England", r: 88, pac: 85, sho: 83, pas: 84, dri: 89, def: 56, phy: 64, sm: 4, wf: 3 },
  { n: "Antoine Griezmann", pos: "ST", club: "Atlético de Madrid", nat: "France", r: 88, pac: 79, sho: 87, pas: 88, dri: 88, def: 53, phy: 72, sm: 4, wf: 3 },
  { n: "Jan Oblak", pos: "GK", club: "Atlético de Madrid", nat: "Slovenia", r: 88, pac: 87, sho: 90, pas: 78, dri: 89, def: 50, phy: 88, sm: 1, wf: 3 },
  { n: "Marc-André ter Stegen", pos: "GK", club: "FC Barcelona", nat: "Germany", r: 88, pac: 85, sho: 85, pas: 87, dri: 90, def: 47, phy: 86, sm: 1, wf: 4 },
  { n: "Ederson", pos: "GK", club: "Manchester City", nat: "Brazil", r: 88, pac: 85, sho: 82, pas: 91, dri: 88, def: 64, phy: 86, sm: 1, wf: 3 },
  { n: "Rúben Dias", pos: "CB", club: "Manchester City", nat: "Portugal", r: 88, pac: 62, sho: 39, pas: 67, dri: 68, def: 89, phy: 87, sm: 2, wf: 4 },
  { n: "Robert Lewandowski", pos: "ST", club: "FC Barcelona", nat: "Poland", r: 88, pac: 73, sho: 88, pas: 80, dri: 85, def: 44, phy: 81, sm: 4, wf: 4 },
  { n: "Bernardo Silva", pos: "CM", club: "Manchester City", nat: "Portugal", r: 88, pac: 68, sho: 78, pas: 86, dri: 92, def: 61, phy: 68, sm: 4, wf: 3 },
  { n: "Federico Valverde", pos: "CM", club: "Real Madrid", nat: "Uruguay", r: 88, pac: 88, sho: 82, pas: 84, dri: 84, def: 80, phy: 81, sm: 3, wf: 4 },
  { n: "Heung Min Son", pos: "LW", club: "Tottenham", nat: "Korea Republic", r: 87, pac: 87, sho: 88, pas: 81, dri: 84, def: 42, phy: 70, sm: 4, wf: 5 },
  { n: "William Saliba", pos: "CB", club: "Arsenal", nat: "France", r: 87, pac: 82, sho: 39, pas: 68, dri: 72, def: 87, phy: 82, sm: 2, wf: 3 },
  { n: "Antonio Rüdiger", pos: "CB", club: "Real Madrid", nat: "Germany", r: 88, pac: 82, sho: 43, pas: 70, dri: 67, def: 86, phy: 86, sm: 2, wf: 3 },
  { n: "Alessandro Bastoni", pos: "CB", club: "Inter", nat: "Italy", r: 87, pac: 74, sho: 36, pas: 75, dri: 74, def: 87, phy: 83, sm: 3, wf: 3 },
  { n: "Marquinhos", pos: "CB", club: "Paris SG", nat: "Brazil", r: 87, pac: 78, sho: 56, pas: 75, dri: 74, def: 88, phy: 80, sm: 3, wf: 3 },
  { n: "Frenkie de Jong", pos: "CM", club: "FC Barcelona", nat: "Netherlands", r: 87, pac: 81, sho: 69, pas: 86, dri: 87, def: 77, phy: 78, sm: 4, wf: 3 },
  { n: "Bruno Fernandes", pos: "CAM", club: "Manchester Utd", nat: "Portugal", r: 87, pac: 70, sho: 85, pas: 89, dri: 83, def: 69, phy: 77, sm: 4, wf: 4 },
  { n: "Bukayo Saka", pos: "RW", club: "Arsenal", nat: "England", r: 87, pac: 85, sho: 82, pas: 80, dri: 87, def: 65, phy: 73, sm: 3, wf: 4 },
  { n: "Manuel Neuer", pos: "GK", club: "Bayern Munich", nat: "Germany", r: 86, pac: 83, sho: 85, pas: 88, dri: 86, def: 52, phy: 84, sm: 1, wf: 4 },
  { n: "Mike Maignan", pos: "GK", club: "Milan", nat: "France", r: 87, pac: 85, sho: 82, pas: 86, dri: 88, def: 52, phy: 84, sm: 1, wf: 4 },
  { n: "Declan Rice", pos: "CDM", club: "Arsenal", nat: "England", r: 87, pac: 72, sho: 70, pas: 82, dri: 79, def: 85, phy: 83, sm: 3, wf: 3 },
  { n: "Nicolò Barella", pos: "CM", club: "Inter", nat: "Italy", r: 87, pac: 78, sho: 76, pas: 84, dri: 85, def: 78, phy: 81, sm: 3, wf: 3 },
  { n: "Lamine Yamal", pos: "RW", club: "FC Barcelona", nat: "Spain", r: 81, pac: 82, sho: 73, pas: 76, dri: 82, def: 30, phy: 52, sm: 4, wf: 3 },
  { n: "Florian Wirtz", pos: "CAM", club: "Leverkusen", nat: "Germany", r: 88, pac: 81, sho: 81, pas: 87, dri: 89, def: 55, phy: 68, sm: 4, wf: 4 },
  { n: "Jamal Musiala", pos: "CAM", club: "Bayern Munich", nat: "Germany", r: 87, pac: 83, sho: 79, pas: 81, dri: 91, def: 58, phy: 63, sm: 5, wf: 4 },
  { n: "Rafael Leão", pos: "LW", club: "Milan", nat: "Portugal", r: 86, pac: 93, sho: 78, pas: 76, dri: 87, def: 27, phy: 77, sm: 4, wf: 4 },
  { n: "Khvicha Kvaratskhelia", pos: "LW", club: "Napoli", nat: "Georgia", r: 85, pac: 83, sho: 80, pas: 80, dri: 87, def: 42, phy: 72, sm: 5, wf: 5 },
  { n: "Cole Palmer", pos: "CAM", club: "Chelsea", nat: "England", r: 85, pac: 76, sho: 83, pas: 83, dri: 84, def: 53, phy: 65, sm: 4, wf: 3 },
  { n: "Ousmane Dembélé", pos: "RW", club: "Paris SG", nat: "France", r: 86, pac: 93, sho: 78, pas: 82, dri: 88, def: 36, phy: 56, sm: 5, wf: 5 },
  { n: "Eduardo Camavinga", pos: "CM", club: "Real Madrid", nat: "France", r: 85, pac: 81, sho: 70, pas: 82, dri: 85, def: 81, phy: 80, sm: 4, wf: 3 },
  { n: "Aurélien Tchouaméni", pos: "CDM", club: "Real Madrid", nat: "France", r: 85, pac: 73, sho: 70, pas: 81, dri: 80, def: 83, phy: 82, sm: 3, wf: 3 },
  { n: "Gavi", pos: "CM", club: "FC Barcelona", nat: "Spain", r: 84, pac: 77, sho: 69, pas: 81, dri: 84, def: 74, phy: 75, sm: 3, wf: 3 },
  { n: "Pedri", pos: "CM", club: "FC Barcelona", nat: "Spain", r: 86, pac: 78, sho: 68, pas: 88, dri: 88, def: 68, phy: 67, sm: 4, wf: 4 },
  { n: "Achraf Hakimi", pos: "RB", club: "Paris SG", nat: "Morocco", r: 85, pac: 92, sho: 75, pas: 80, dri: 81, def: 76, phy: 78, sm: 4, wf: 4 },
  { n: "Theo Hernández", pos: "LB", club: "Milan", nat: "France", r: 87, pac: 95, sho: 71, pas: 78, dri: 81, def: 81, phy: 84, sm: 3, wf: 3 },
  { n: "Ronald Araújo", pos: "CB", club: "FC Barcelona", nat: "Uruguay", r: 86, pac: 79, sho: 51, pas: 65, dri: 71, def: 86, phy: 83, sm: 3, wf: 3 },
  { n: "Éder Militão", pos: "CB", club: "Real Madrid", nat: "Brazil", r: 86, pac: 85, sho: 50, pas: 69, dri: 71, def: 85, phy: 82, sm: 2, wf: 3 },
  { n: "Trent Alexander-Arnold", pos: "RB", club: "Liverpool", nat: "England", r: 86, pac: 76, sho: 69, pas: 90, dri: 80, def: 80, phy: 73, sm: 3, wf: 4 },
  { n: "Andrew Robertson", pos: "LB", club: "Liverpool", nat: "Scotland", r: 86, pac: 80, sho: 61, pas: 82, dri: 81, def: 81, phy: 77, sm: 3, wf: 2 },
  { n: "João Cancelo", pos: "RB", club: "Al Hilal", nat: "Portugal", r: 86, pac: 81, sho: 73, pas: 85, dri: 84, def: 80, phy: 71, sm: 4, wf: 4 },
  { n: "Paulo Dybala", pos: "ST", club: "Roma", nat: "Argentina", r: 87, pac: 80, sho: 85, pas: 85, dri: 90, def: 40, phy: 60, sm: 4, wf: 4 },
  { n: "Nico Williams", pos: "RW", club: "Athletic Club", nat: "Spain", r: 85, pac: 91, sho: 78, pas: 82, dri: 86, def: 35, phy: 68, sm: 4, wf: 5 },
  { n: "Ollie Watkins", pos: "RM", club: "Aston Villa", nat: "England", r: 85, pac: 84, sho: 85, pas: 80, dri: 83, def: 48, phy: 77, sm: 4, wf: 4 },
  { n: "Alejandro Grimaldo", pos: "LWB", club: "Leverkusen", nat: "Spain", r: 86, pac: 85, sho: 75, pas: 86, dri: 84, def: 78, phy: 73, sm: 3, wf: 3 },
  { n: "Jeremie Frimpong", pos: "RWB", club: "Leverkusen", nat: "Netherlands", r: 84, pac: 94, sho: 69, pas: 78, dri: 85, def: 74, phy: 68, sm: 3, wf: 3 },
  { n: "Kim Min Jae", pos: "CB", club: "Bayern Munich", nat: "Korea Republic", r: 85, pac: 80, sho: 36, pas: 68, dri: 65, def: 85, phy: 84, sm: 2, wf: 3 },
  { n: "Dayot Upamecano", pos: "CB", club: "Bayern Munich", nat: "France", r: 83, pac: 82, sho: 43, pas: 69, dri: 68, def: 82, phy: 83, sm: 2, wf: 3 },
  { n: "Fikayo Tomori", pos: "CB", club: "Milan", nat: "England", r: 84, pac: 86, sho: 40, pas: 60, dri: 66, def: 85, phy: 81, sm: 2, wf: 4 },
  { n: "Joshua Kimmich", pos: "CDM", club: "Bayern Munich", nat: "Germany", r: 86, pac: 68, sho: 75, pas: 88, dri: 83, def: 82, phy: 78, sm: 3, wf: 4 },
  { n: "Leon Goretzka", pos: "CM", club: "Bayern Munich", nat: "Germany", r: 85, pac: 69, sho: 81, pas: 84, dri: 84, def: 78, phy: 80, sm: 3, wf: 4 },
  { n: "Leroy Sané", pos: "RM", club: "Bayern Munich", nat: "Germany", r: 85, pac: 91, sho: 81, pas: 81, dri: 86, def: 38, phy: 70, sm: 4, wf: 2 },
  { n: "Serge Gnabry", pos: "RM", club: "Bayern Munich", nat: "Germany", r: 84, pac: 89, sho: 83, pas: 79, dri: 85, def: 43, phy: 69, sm: 4, wf: 4 },
  { n: "Kingsley Coman", pos: "LM", club: "Bayern Munich", nat: "France", r: 84, pac: 89, sho: 80, pas: 79, dri: 86, def: 30, phy: 61, sm: 5, wf: 3 },
  { n: "Alphonso Davies", pos: "LB", club: "Bayern Munich", nat: "Canada", r: 84, pac: 95, sho: 68, pas: 77, dri: 84, def: 76, phy: 77, sm: 4, wf: 4 },
  { n: "Joško Gvardiol", pos: "CB", club: "Manchester City", nat: "Croatia", r: 85, pac: 80, sho: 54, pas: 76, dri: 78, def: 84, phy: 83, sm: 3, wf: 4 },
  { n: "Manuel Akanji", pos: "CB", club: "Manchester City", nat: "Switzerland", r: 84, pac: 79, sho: 40, pas: 70, dri: 72, def: 84, phy: 81, sm: 2, wf: 4 },
  { n: "John Stones", pos: "CB", club: "Manchester City", nat: "England", r: 85, pac: 72, sho: 51, pas: 76, dri: 78, def: 85, phy: 79, sm: 3, wf: 4 },
  { n: "Nathan Aké", pos: "CB", club: "Manchester City", nat: "Netherlands", r: 84, pac: 75, sho: 44, pas: 72, dri: 71, def: 85, phy: 80, sm: 2, wf: 3 },
  { n: "Bruno Guimarães", pos: "CAM", club: "Newcastle Utd", nat: "Brazil", r: 85, pac: 71, sho: 78, pas: 85, dri: 83, def: 77, phy: 81, sm: 3, wf: 3 },
  { n: "Alexander Isak", pos: "ST", club: "Newcastle Utd", nat: "Sweden", r: 85, pac: 84, sho: 83, pas: 72, dri: 82, def: 35, phy: 76, sm: 4, wf: 5 },
  { n: "Anthony Gordon", pos: "RM", club: "Newcastle Utd", nat: "England", r: 84, pac: 85, sho: 80, pas: 82, dri: 84, def: 47, phy: 68, sm: 4, wf: 4 },
  { n: "Sandro Tonali", pos: "CDM", club: "Newcastle Utd", nat: "Italy", r: 85, pac: 83, sho: 73, pas: 81, dri: 79, def: 80, phy: 82, sm: 3, wf: 4 },
  { n: "Luis Díaz", pos: "LW", club: "Liverpool", nat: "Colombia", r: 84, pac: 91, sho: 77, pas: 76, dri: 87, def: 34, phy: 74, sm: 4, wf: 4 },
  { n: "Diogo Jota", pos: "LW", club: "Liverpool", nat: "Portugal", r: 85, pac: 85, sho: 83, pas: 76, dri: 85, def: 57, phy: 74, sm: 4, wf: 5 },
  { n: "Darwin Núñez", pos: "ST", club: "Liverpool", nat: "Uruguay", r: 84, pac: 89, sho: 82, pas: 72, dri: 79, def: 46, phy: 85, sm: 3, wf: 3 },
  { n: "Cody Gakpo", pos: "ST", club: "Liverpool", nat: "Netherlands", r: 84, pac: 85, sho: 82, pas: 77, dri: 84, def: 41, phy: 76, sm: 4, wf: 4 },
  { n: "Alexis Mac Allister", pos: "CM", club: "Liverpool", nat: "Argentina", r: 84, pac: 70, sho: 80, pas: 84, dri: 83, def: 74, phy: 76, sm: 3, wf: 3 },
  { n: "Dominik Szoboszlai", pos: "CM", club: "Liverpool", nat: "Hungary", r: 83, pac: 81, sho: 81, pas: 83, dri: 82, def: 59, phy: 71, sm: 4, wf: 4 },
  { n: "Mikel Merino", pos: "CM", club: "Arsenal", nat: "Spain", r: 85, pac: 68, sho: 76, pas: 81, dri: 82, def: 81, phy: 84, sm: 3, wf: 3 },
  { n: "Gabriel Magalhães", pos: "CB", club: "Arsenal", nat: "Brazil", r: 86, pac: 69, sho: 41, pas: 65, dri: 62, def: 86, phy: 84, sm: 2, wf: 2 },
  { n: "Ben White", pos: "RB", club: "Arsenal", nat: "England", r: 84, pac: 76, sho: 42, pas: 77, dri: 75, def: 83, phy: 77, sm: 3, wf: 3 },
  { n: "Jurriën Timber", pos: "CB", club: "Arsenal", nat: "Netherlands", r: 83, pac: 81, sho: 46, pas: 75, dri: 79, def: 82, phy: 80, sm: 3, wf: 3 },
  { n: "Oleksandr Zinchenko", pos: "LB", club: "Arsenal", nat: "Ukraine", r: 83, pac: 72, sho: 69, pas: 84, dri: 83, def: 78, phy: 71, sm: 3, wf: 3 },
  { n: "Gabriel Martinelli", pos: "LW", club: "Arsenal", nat: "Brazil", r: 84, pac: 89, sho: 79, pas: 78, dri: 85, def: 52, phy: 72, sm: 4, wf: 3 },
  { n: "Leandro Trossard", pos: "LW", club: "Arsenal", nat: "Belgium", r: 83, pac: 79, sho: 81, pas: 80, dri: 85, def: 48, phy: 60, sm: 4, wf: 4 },
  { n: "Gabriel Jesus", pos: "LW", club: "Arsenal", nat: "Brazil", r: 84, pac: 88, sho: 81, pas: 76, dri: 87, def: 42, phy: 74, sm: 4, wf: 3 },
  { n: "Marcus Rashford", pos: "LW", club: "Manchester Utd", nat: "England", r: 84, pac: 89, sho: 84, pas: 77, dri: 84, def: 43, phy: 75, sm: 5, wf: 3 },
  { n: "Lisandro Martínez", pos: "CB", club: "Manchester Utd", nat: "Argentina", r: 84, pac: 73, sho: 48, pas: 77, dri: 78, def: 84, phy: 82, sm: 3, wf: 3 },
  { n: "Raphaël Varane", pos: "CB", club: "Como", nat: "France", r: 84, pac: 78, sho: 49, pas: 65, dri: 66, def: 85, phy: 79, sm: 2, wf: 3 },
  { n: "Matthijs de Ligt", pos: "CB", club: "Manchester Utd", nat: "Netherlands", r: 84, pac: 73, sho: 59, pas: 65, dri: 68, def: 84, phy: 84, sm: 2, wf: 3 },
  { n: "Kobbie Mainoo", pos: "CM", club: "Manchester Utd", nat: "England", r: 82, pac: 74, sho: 69, pas: 78, dri: 82, def: 75, phy: 74, sm: 3, wf: 3 },
  { n: "Alejandro Garnacho", pos: "LW", club: "Manchester Utd", nat: "Argentina", r: 83, pac: 87, sho: 78, pas: 75, dri: 84, def: 40, phy: 62, sm: 4, wf: 4 },
  { n: "Cristian Romero", pos: "CB", club: "Tottenham", nat: "Argentina", r: 84, pac: 73, sho: 46, pas: 64, dri: 68, def: 85, phy: 84, sm: 3, wf: 3 },
  { n: "James Maddison", pos: "CAM", club: "Tottenham", nat: "England", r: 85, pac: 74, sho: 82, pas: 86, dri: 85, def: 55, phy: 66, sm: 4, wf: 4 },
  { n: "Micky van de Ven", pos: "CB", club: "Tottenham", nat: "Netherlands", r: 83, pac: 88, sho: 42, pas: 68, dri: 72, def: 82, phy: 81, sm: 2, wf: 3 },
  { n: "Dejan Kulusevski", pos: "RW", club: "Tottenham", nat: "Sweden", r: 83, pac: 76, sho: 78, pas: 82, dri: 84, def: 59, phy: 74, sm: 4, wf: 3 },
  { n: "Eberechi Eze", pos: "CAM", club: "Crystal Palace", nat: "England", r: 82, pac: 80, sho: 78, pas: 80, dri: 86, def: 52, phy: 66, sm: 4, wf: 4 }
];

function getCat(pos) {
  if (pos.includes('GK')) return 'GK';
  if (pos.includes('CB') || pos.includes('LB') || pos.includes('RB') || pos.includes('LWB') || pos.includes('RWB')) return 'DEF';
  if (pos.includes('CM') || pos.includes('CDM') || pos.includes('CAM') || pos.includes('LM') || pos.includes('RM')) return 'MID';
  return 'FWD';
}

const extraNames = [
  "R. Sterling", "A. Isak", "M. Diaby", "J. Grealish", "R. James", "P. Porro", "M. Ugarte", "E. Fernández", "L. Paquetá",
  "J. Bowen", "K. Mitoma", "C. Wilson", "M. Mount", "I. Toney", "A. Ramsdale", "B. Leno", "S. Botman",
  "F. Schär", "D. Burn", "T. Silva", "L. Digne", "D. Berardi", "M. Locatelli", "D. Frattesi", "S. Milinković-Savić", "A. Rabiot",
  "D. Vlahović", "F. Chiesa", "G. Raspadori", "L. Pellegrini", "G. Mancini", "A. Bastoni", "M. Škriniar", "F. Acerbi",
  "A. Rrahmani", "P. Zieliński", "A. Zambo Anguissa", "S. Lobotka", "H. Lozano", "V. Osimhen", "O. Giroud", "A. Morata", "C. Immobile",
  "R. Lukaku", "D. Zapata", "M. Arnautović", "A. Belotti", "E. Džeko", "W. Szczęsny", "S. Handanovič", "H. Lloris",
  "J. Pickford", "N. Pope", "D. Henderson", "K. Schmeichel", "A. Areola", "D. de Gea", "Kepa", "E. Mendy",
  "A. Lopes", "U. Simón", "B. Bounou", "R. Patrício", "A. Meret", "A. Consigli", "G. Vicario", "S. Loria", "T. Strakosha",
  "J. Cuadrado", "A. Di María", "P. Pogba", "M. Verratti", "M. Brozović", "S. de Vrij",
  "R. Gosens", "D. Dumfries", "K. Walker", "J. Cancelo", "A. Robertson", "B. Chilwell",
  "L. Shaw", "K. Trippier", "A. Wan-Bissaka", "M. Cash", "V. Coufal", "L. Ayling", "N. Semedo", "J. Navas", "Ricardo Pereira",
  "N. Mazraoui", "A. Cresswell", "M. Doherty", "E. Stevens", "J. Ward", "S. Coleman", "M. Lowton", "G. Baldock", "P. Bardsley",
  "A. Smith", "C. Dawson", "J. Tarkowski", "T. Mings", "E. Konsa", "M. Keane", "B. Mee", "C. Coady", "J. Evans",
  "H. Maguire", "V. Lindelöf", "E. Bailly", "P. Jones", "C. Smalling", "A. Tuanzebe", "A. Laporte",
  "E. García", "D. Alaba", "L. Hernández", "B. Pavard", "P. Kimpembe", "T. Silva",
  "A. Christensen", "N. Otamendi", "P. Torres", "G. Piqué", "S. Ramos", "M. Hummels", "N. Süle", "M. Ginter", "J. Boateng",
  "A. Witsel", "K. Laimer", "X. Schlager", "M. Sabitzer", "D. Kamada", "R. Neves", "J. Moutinho", "O. Romeu",
  "E. Can", "S. Özcan", "J. Brandt", "M. Reus", "G. Reyna", "D. Malen", "K. Adeyemi", "S. Haller",
  "Y. Moukoko", "N. Füllkrug", "C. Nkunku", "T. Werner", "E. Forsberg", "K. Laimer", "X. Schlager", "D. Olmo"
];

const totalPlayers = [...manualPlayers];
let nameIdx = 0;

while (totalPlayers.length < 250) {
  const name = extraNames[nameIdx] || `Top Player ${totalPlayers.length + 1}`;
  nameIdx++;
  
  const rating = 83 - Math.floor((totalPlayers.length - manualPlayers.length) / (150 / 6)); 
  const isGK = totalPlayers.length % 11 === 0;
  const pos = isGK ? "GK" : (totalPlayers.length % 3 === 0 ? "CB" : (totalPlayers.length % 2 === 0 ? "CM" : "ST"));
  
  const p = {
    n: name,
    pos: pos,
    r: rating,
    pac: isGK ? 80 : 70 + Math.floor(Math.random() * 20),
    sho: isGK ? 80 : 60 + Math.floor(Math.random() * 25),
    pas: isGK ? 80 : 65 + Math.floor(Math.random() * 20),
    dri: isGK ? 85 : 70 + Math.floor(Math.random() * 18),
    def: isGK ? 50 : (pos === "CB" ? 82 : 40 + Math.floor(Math.random() * 30)),
    phy: isGK ? 80 : 70 + Math.floor(Math.random() * 15),
    sm: isGK ? 1 : 3 + Math.floor(Math.random() * 2),
    wf: 3 + Math.floor(Math.random() * 2),
    club: ["Juventus", "Lazio", "Aston Villa", "Sevilla", "Real Sociedad", "Dortmund", "RB Leipzig"][Math.floor(Math.random()*7)],
    nat: ["Italy", "Spain", "France", "England", "Brazil", "Argentina", "Germany", "Portugal"][Math.floor(Math.random()*8)]
  };
  totalPlayers.push(p);
}

const finalArrayStr = totalPlayers.map((p, i) => {
  const finalP = {
    id: i + 1,
    n: p.n,
    s: p.s || p.n.split(' ').pop(),
    pos: p.pos,
    r: p.r,
    pac: p.pac,
    sho: p.sho,
    pas: p.pas,
    dri: p.dri,
    def: p.def,
    phy: p.phy,
    sm: p.sm || 3,
    wf: p.wf || 3,
    club: p.club,
    nat: p.nat,
    cat: getCat(p.pos),
    eaId: 1000 + i
  };
  // Ensure we output beautifully formatted JS objects
  return `  ${JSON.stringify(finalP)}`;
}).join(',\n');

const newCode = `\n${finalArrayStr}\n`;

const appFile = 'src/App.jsx';
let app = fs.readFileSync(appFile, 'utf8');
app = app.replace('// INJECT HERE', newCode);
fs.writeFileSync(appFile, app);
console.log(`Successfully injected 250 players into App.jsx!`);
