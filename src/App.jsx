import { useReducer, useEffect, useRef, useState } from "react";
import { useMultiplayer, clearSession } from "./useMultiplayer";

/* ═══════ PLAYER DATABASE — 200 players, official FC 26 2025-26 ratings ═══════ */
const PLAYERS = [
  { id: 1, n: "Kylian Mbappé", s: "Mbappé", pos: "ST", r: 91, pac: 97, sho: 90, pas: 80, dri: 92, def: 39, phy: 76, sm: 5, wf: 4, club: "Real Madrid", nat: "🇫🇷", cat: "M", eaId: 231747 },
  { id: 2, n: "Mohamed Salah", s: "Salah", pos: "RM", r: 91, pac: 90, sho: 88, pas: 81, dri: 90, def: 46, phy: 77, sm: 4, wf: 3, club: "Liverpool", nat: "🇪🇬", cat: "M", eaId: 209331 },
  { id: 3, n: "Ousmane Dembélé", s: "Dembélé", pos: "ST", r: 90, pac: 91, sho: 88, pas: 77, dri: 93, def: 33, phy: 68, sm: 4, wf: 4, club: "Paris SG", nat: "🇫🇷", cat: "M", eaId: 231443 },
  { id: 4, n: "Erling Haaland", s: "Haaland", pos: "ST", r: 90, pac: 89, sho: 91, pas: 65, dri: 80, def: 45, phy: 88, sm: 3, wf: 3, club: "Man City", nat: "🇳🇴", cat: "M", eaId: 239085 },
  { id: 5, n: "Virgil van Dijk", s: "Van Dijk", pos: "CB", r: 90, pac: 79, sho: 61, pas: 73, dri: 63, def: 90, phy: 90, sm: 2, wf: 3, club: "Liverpool", nat: "🇳🇱", cat: "M", eaId: 203376 },
  { id: 6, n: "Jude Bellingham", s: "Bellingham", pos: "CAM", r: 90, pac: 80, sho: 83, pas: 87, dri: 88, def: 75, phy: 82, sm: 4, wf: 4, club: "Real Madrid", nat: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", cat: "M", eaId: 246101 },
  { id: 7, n: "Rodri", s: "Rodri", pos: "CDM", r: 90, pac: 64, sho: 72, pas: 91, dri: 81, def: 91, phy: 82, sm: 3, wf: 4, club: "Man City", nat: "🇪🇸", cat: "M", eaId: 231866 },
  { id: 8, n: "Harry Kane", s: "Kane", pos: "ST", r: 89, pac: 71, sho: 92, pas: 84, dri: 81, def: 48, phy: 84, sm: 3, wf: 4, club: "Bayern Munich", nat: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", cat: "M", eaId: 202126 },
  { id: 9, n: "Vinicius Júnior", s: "Vini Jr.", pos: "LW", r: 89, pac: 95, sho: 84, pas: 79, dri: 91, def: 35, phy: 73, sm: 5, wf: 3, club: "Real Madrid", nat: "🇧🇷", cat: "M", eaId: 238794 },
  { id: 10, n: "Thibaut Courtois", s: "Courtois", pos: "GK", r: 89, pac: 39, sho: 15, pas: 61, dri: 16, def: 90, phy: 86, sm: 1, wf: 3, club: "Real Madrid", nat: "🇧🇪", cat: "M", eaId: 192119 },
  { id: 11, n: "Lamine Yamal", s: "Yamal", pos: "RM", r: 89, pac: 91, sho: 83, pas: 84, dri: 91, def: 36, phy: 66, sm: 4, wf: 3, club: "FC Barcelona", nat: "🇪🇸", cat: "M", eaId: 266724 },
  { id: 12, n: "Raphinha", s: "Raphinha", pos: "LM", r: 89, pac: 88, sho: 83, pas: 79, dri: 87, def: 44, phy: 69, sm: 4, wf: 4, club: "FC Barcelona", nat: "🇧🇷", cat: "M", eaId: 231048 },
  { id: 13, n: "Achraf Hakimi", s: "Hakimi", pos: "RB", r: 89, pac: 96, sho: 69, pas: 79, dri: 85, def: 79, phy: 74, sm: 3, wf: 3, club: "Paris SG", nat: "🇲🇦", cat: "M", eaId: 235212 },
  { id: 14, n: "Joshua Kimmich", s: "Kimmich", pos: "CDM", r: 89, pac: 71, sho: 71, pas: 89, dri: 80, def: 86, phy: 76, sm: 3, wf: 3, club: "Bayern Munich", nat: "🇩🇪", cat: "M", eaId: 212622 },
  { id: 15, n: "Alisson Becker", s: "Alisson", pos: "GK", r: 89, pac: 37, sho: 15, pas: 63, dri: 17, def: 89, phy: 79, sm: 1, wf: 3, club: "Liverpool", nat: "🇧🇷", cat: "M", eaId: 212831 },
  { id: 16, n: "Federico Valverde", s: "Valverde", pos: "CM", r: 89, pac: 85, sho: 81, pas: 85, dri: 83, def: 79, phy: 83, sm: 3, wf: 4, club: "Real Madrid", nat: "🇺🇾", cat: "M", eaId: 242100 },
  { id: 17, n: "Pedri", s: "Pedri", pos: "CM", r: 89, pac: 79, sho: 75, pas: 89, dri: 91, def: 73, phy: 64, sm: 4, wf: 3, club: "FC Barcelona", nat: "🇪🇸", cat: "M", eaId: 248566 },
  { id: 18, n: "Florian Wirtz", s: "Wirtz", pos: "CAM", r: 89, pac: 80, sho: 81, pas: 86, dri: 90, def: 46, phy: 68, sm: 4, wf: 4, club: "Liverpool", nat: "🇩🇪", cat: "M", eaId: 247043 },
  { id: 19, n: "Vitinha", s: "Vitinha", pos: "CM", r: 89, pac: 74, sho: 74, pas: 87, dri: 87, def: 62, phy: 68, sm: 3, wf: 3, club: "Paris SG", nat: "🇵🇹", cat: "M", eaId: 241930 },
  { id: 20, n: "Gianluigi Donnarumma", s: "Donnarumma", pos: "GK", r: 89, pac: 44, sho: 14, pas: 62, dri: 16, def: 87, phy: 84, sm: 1, wf: 3, club: "Man City", nat: "🇮🇹", cat: "M", eaId: 230621 },
  { id: 21, n: "Éderson", s: "Éderson", pos: "GK", r: 88, pac: 46, sho: 15, pas: 73, dri: 18, def: 87, phy: 81, sm: 1, wf: 3, club: "Man City", nat: "🇧🇷", cat: "GK", eaId: 210257 },
  { id: 22, n: "Emiliano Martínez", s: "Emi Martínez", pos: "GK", r: 88, pac: 39, sho: 14, pas: 59, dri: 15, def: 87, phy: 83, sm: 1, wf: 3, club: "Aston Villa", nat: "🇦🇷", cat: "GK", eaId: 215614 },
  { id: 23, n: "Jan Oblak", s: "Oblak", pos: "GK", r: 87, pac: 39, sho: 14, pas: 61, dri: 15, def: 87, phy: 79, sm: 1, wf: 3, club: "Atlético", nat: "🇸🇮", cat: "GK", eaId: 200389 },
  { id: 24, n: "ter Stegen", s: "ter Stegen", pos: "GK", r: 87, pac: 41, sho: 14, pas: 69, dri: 16, def: 86, phy: 79, sm: 1, wf: 3, club: "FC Barcelona", nat: "🇩🇪", cat: "GK", eaId: 192448 },
  { id: 25, n: "Mike Maignan", s: "Maignan", pos: "GK", r: 87, pac: 41, sho: 14, pas: 59, dri: 15, def: 86, phy: 81, sm: 1, wf: 3, club: "AC Milan", nat: "🇫🇷", cat: "GK", eaId: 228904 },
  { id: 26, n: "Manuel Neuer", s: "Neuer", pos: "GK", r: 87, pac: 53, sho: 15, pas: 72, dri: 19, def: 87, phy: 82, sm: 1, wf: 3, club: "Bayern Munich", nat: "🇩🇪", cat: "GK", eaId: 167495 },
  { id: 27, n: "Gregor Kobel", s: "Kobel", pos: "GK", r: 86, pac: 39, sho: 14, pas: 58, dri: 15, def: 85, phy: 79, sm: 1, wf: 3, club: "B. Dortmund", nat: "🇨🇭", cat: "GK", eaId: 232474 },
  { id: 28, n: "David Raya", s: "D. Raya", pos: "GK", r: 86, pac: 40, sho: 14, pas: 60, dri: 16, def: 85, phy: 78, sm: 1, wf: 3, club: "Arsenal", nat: "🇪🇸", cat: "GK", eaId: 220834 },
  { id: 29, n: "Yann Sommer", s: "Sommer", pos: "GK", r: 85, pac: 39, sho: 14, pas: 58, dri: 15, def: 84, phy: 73, sm: 1, wf: 3, club: "Inter Milan", nat: "🇨🇭", cat: "GK", eaId: 177683 },
  { id: 30, n: "André Onana", s: "Onana", pos: "GK", r: 85, pac: 42, sho: 13, pas: 62, dri: 16, def: 83, phy: 80, sm: 1, wf: 3, club: "Man United", nat: "🇨🇲", cat: "GK", eaId: 234721 },
  { id: 31, n: "Jordan Pickford", s: "Pickford", pos: "GK", r: 85, pac: 41, sho: 13, pas: 56, dri: 14, def: 83, phy: 75, sm: 1, wf: 3, club: "Everton", nat: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", cat: "GK", eaId: 209504 },
  { id: 32, n: "Trent Alexander-Arnold", s: "T. Arnold", pos: "RB", r: 88, pac: 86, sho: 71, pas: 89, dri: 80, def: 79, phy: 71, sm: 3, wf: 3, club: "Real Madrid", nat: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", cat: "DEF", eaId: 231281 },
  { id: 33, n: "Reece James", s: "R. James", pos: "RB", r: 86, pac: 83, sho: 69, pas: 78, dri: 78, def: 85, phy: 81, sm: 3, wf: 3, club: "Chelsea", nat: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", cat: "DEF", eaId: 243568 },
  { id: 34, n: "Dani Carvajal", s: "Carvajal", pos: "RB", r: 86, pac: 81, sho: 61, pas: 81, dri: 77, def: 87, phy: 79, sm: 3, wf: 3, club: "Real Madrid", nat: "🇪🇸", cat: "DEF", eaId: 203404 },
  { id: 35, n: "João Cancelo", s: "Cancelo", pos: "RB", r: 86, pac: 84, sho: 66, pas: 82, dri: 83, def: 84, phy: 73, sm: 3, wf: 3, club: "FC Barcelona", nat: "🇵🇹", cat: "DEF", eaId: 210514 },
  { id: 36, n: "Kyle Walker", s: "K. Walker", pos: "RB", r: 85, pac: 92, sho: 56, pas: 73, dri: 74, def: 83, phy: 79, sm: 2, wf: 3, club: "Man City", nat: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", cat: "DEF", eaId: 188377 },
  { id: 37, n: "Pedro Porro", s: "P. Porro", pos: "RB", r: 84, pac: 85, sho: 64, pas: 76, dri: 78, def: 80, phy: 74, sm: 3, wf: 3, club: "Tottenham", nat: "🇪🇸", cat: "DEF", eaId: 243082 },
  { id: 38, n: "Ben White", s: "B. White", pos: "RB", r: 84, pac: 79, sho: 56, pas: 73, dri: 74, def: 82, phy: 76, sm: 2, wf: 3, club: "Arsenal", nat: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", cat: "DEF", eaId: 235181 },
  { id: 39, n: "Denzel Dumfries", s: "Dumfries", pos: "RB", r: 84, pac: 88, sho: 66, pas: 74, dri: 77, def: 79, phy: 83, sm: 3, wf: 3, club: "Inter Milan", nat: "🇳🇱", cat: "DEF", eaId: 225471 },
  { id: 40, n: "Alphonso Davies", s: "A. Davies", pos: "LB", r: 88, pac: 98, sho: 62, pas: 76, dri: 85, def: 82, phy: 74, sm: 3, wf: 3, club: "Bayern Munich", nat: "🇨🇦", cat: "DEF", eaId: 240799 },
  { id: 41, n: "Theo Hernandez", s: "T. Hernandez", pos: "LB", r: 87, pac: 92, sho: 64, pas: 76, dri: 82, def: 80, phy: 82, sm: 3, wf: 3, club: "AC Milan", nat: "🇫🇷", cat: "DEF", eaId: 232765 },
  { id: 42, n: "Nuno Mendes", s: "N. Mendes", pos: "LB", r: 87, pac: 95, sho: 59, pas: 75, dri: 82, def: 80, phy: 76, sm: 3, wf: 3, club: "Paris SG", nat: "🇵🇹", cat: "DEF", eaId: 257564 },
  { id: 43, n: "Andrew Robertson", s: "Robertson", pos: "LB", r: 86, pac: 87, sho: 65, pas: 83, dri: 78, def: 83, phy: 80, sm: 3, wf: 3, club: "Liverpool", nat: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", cat: "DEF", eaId: 216267 },
  { id: 44, n: "Josko Gvardiol", s: "Gvardiol", pos: "LB", r: 86, pac: 84, sho: 58, pas: 71, dri: 72, def: 83, phy: 82, sm: 2, wf: 3, club: "Man City", nat: "🇭🇷", cat: "DEF", eaId: 253306 },
  { id: 45, n: "Alejandro Grimaldo", s: "Grimaldo", pos: "LB", r: 85, pac: 85, sho: 70, pas: 82, dri: 81, def: 80, phy: 74, sm: 3, wf: 3, club: "Leverkusen", nat: "🇪🇸", cat: "DEF", eaId: 205260 },
  { id: 46, n: "Alejandro Balde", s: "Balde", pos: "LB", r: 85, pac: 93, sho: 57, pas: 74, dri: 81, def: 79, phy: 72, sm: 3, wf: 3, club: "FC Barcelona", nat: "🇪🇸", cat: "DEF", eaId: 259060 },
  { id: 47, n: "Oleks. Zinchenko", s: "Zinchenko", pos: "LB", r: 83, pac: 76, sho: 64, pas: 80, dri: 79, def: 78, phy: 66, sm: 2, wf: 3, club: "Arsenal", nat: "🇺🇦", cat: "DEF", eaId: 231074 },
  { id: 48, n: "Rúben Dias", s: "R. Dias", pos: "CB", r: 89, pac: 74, sho: 47, pas: 70, dri: 57, def: 91, phy: 89, sm: 2, wf: 3, club: "Man City", nat: "🇵🇹", cat: "DEF", eaId: 239817 },
  { id: 49, n: "Marquinhos", s: "Marquinhos", pos: "CB", r: 89, pac: 75, sho: 52, pas: 74, dri: 64, def: 89, phy: 84, sm: 2, wf: 3, club: "Paris SG", nat: "🇧🇷", cat: "DEF", eaId: 210044 },
  { id: 50, n: "Alessandro Bastoni", s: "Bastoni", pos: "CB", r: 89, pac: 75, sho: 50, pas: 77, dri: 67, def: 88, phy: 84, sm: 2, wf: 3, club: "Inter Milan", nat: "🇮🇹", cat: "DEF", eaId: 241936 },
  { id: 51, n: "Gabriel", s: "Gabriel", pos: "CB", r: 88, pac: 74, sho: 54, pas: 66, dri: 57, def: 88, phy: 90, sm: 2, wf: 3, club: "Arsenal", nat: "🇧🇷", cat: "DEF", eaId: 235616 },
  { id: 52, n: "William Saliba", s: "Saliba", pos: "CB", r: 88, pac: 80, sho: 46, pas: 69, dri: 59, def: 88, phy: 87, sm: 2, wf: 3, club: "Arsenal", nat: "🇫🇷", cat: "DEF", eaId: 246768 },
  { id: 53, n: "Pau Cubarsí", s: "Cubarsí", pos: "CB", r: 87, pac: 74, sho: 44, pas: 72, dri: 64, def: 87, phy: 82, sm: 2, wf: 3, club: "FC Barcelona", nat: "🇪🇸", cat: "DEF", eaId: 271118 },
  { id: 54, n: "Antonio Rüdiger", s: "Rüdiger", pos: "CB", r: 87, pac: 82, sho: 57, pas: 67, dri: 60, def: 87, phy: 90, sm: 2, wf: 3, club: "Real Madrid", nat: "🇩🇪", cat: "DEF", eaId: 205452 },
  { id: 55, n: "Jonathan Tah", s: "Tah", pos: "CB", r: 87, pac: 82, sho: 50, pas: 67, dri: 57, def: 88, phy: 87, sm: 2, wf: 3, club: "Bayern Munich", nat: "🇩🇪", cat: "DEF", eaId: 216438 },
  { id: 56, n: "Kim Min-jae", s: "Kim Min-jae", pos: "CB", r: 86, pac: 82, sho: 46, pas: 66, dri: 59, def: 87, phy: 88, sm: 2, wf: 3, club: "Bayern Munich", nat: "🇰🇷", cat: "DEF", eaId: 240098 },
  { id: 57, n: "Dayot Upamecano", s: "Upamecano", pos: "CB", r: 86, pac: 84, sho: 45, pas: 64, dri: 57, def: 85, phy: 87, sm: 2, wf: 3, club: "Bayern Munich", nat: "🇫🇷", cat: "DEF", eaId: 232576 },
  { id: 58, n: "Gleison Bremer", s: "Bremer", pos: "CB", r: 85, pac: 80, sho: 46, pas: 65, dri: 57, def: 87, phy: 87, sm: 2, wf: 3, club: "Juventus", nat: "🇧🇷", cat: "DEF", eaId: 237949 },
  { id: 59, n: "Micky van de Ven", s: "Van de Ven", pos: "CB", r: 85, pac: 90, sho: 41, pas: 64, dri: 58, def: 84, phy: 84, sm: 2, wf: 3, club: "Tottenham", nat: "🇳🇱", cat: "DEF", eaId: 253090 },
  { id: 60, n: "Pau Torres", s: "P. Torres", pos: "CB", r: 85, pac: 72, sho: 50, pas: 72, dri: 60, def: 86, phy: 82, sm: 2, wf: 3, club: "Aston Villa", nat: "🇪🇸", cat: "DEF", eaId: 236143 },
  { id: 61, n: "Fikayo Tomori", s: "Tomori", pos: "CB", r: 85, pac: 84, sho: 44, pas: 62, dri: 57, def: 85, phy: 84, sm: 2, wf: 3, club: "AC Milan", nat: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", cat: "DEF", eaId: 235214 },
  { id: 62, n: "John Stones", s: "J. Stones", pos: "CB", r: 84, pac: 75, sho: 52, pas: 75, dri: 68, def: 85, phy: 80, sm: 2, wf: 3, club: "Man City", nat: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", cat: "DEF", eaId: 203574 },
  { id: 63, n: "Kevin De Bruyne", s: "De Bruyne", pos: "CDM", r: 88, pac: 76, sho: 86, pas: 92, dri: 88, def: 64, phy: 78, sm: 4, wf: 5, club: "Man City", nat: "🇧🇪", cat: "MID", eaId: 192985 },
  { id: 64, n: "Declan Rice", s: "D. Rice", pos: "CDM", r: 87, pac: 75, sho: 73, pas: 81, dri: 76, def: 88, phy: 84, sm: 2, wf: 3, club: "Arsenal", nat: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", cat: "MID", eaId: 234176 },
  { id: 65, n: "Aurélien Tchouaméni", s: "Tchouaméni", pos: "CDM", r: 87, pac: 74, sho: 71, pas: 81, dri: 79, def: 87, phy: 85, sm: 3, wf: 4, club: "Real Madrid", nat: "🇫🇷", cat: "MID", eaId: 247713 },
  { id: 66, n: "Hakan Çalhanoğlu", s: "Çalhanoğlu", pos: "CDM", r: 87, pac: 69, sho: 79, pas: 88, dri: 83, def: 79, phy: 74, sm: 3, wf: 4, club: "Inter Milan", nat: "🇹🇷", cat: "MID", eaId: 199556 },
  { id: 67, n: "Moisés Caicedo", s: "Caicedo", pos: "CDM", r: 86, pac: 75, sho: 65, pas: 79, dri: 78, def: 85, phy: 83, sm: 3, wf: 3, club: "Chelsea", nat: "🇪🇨", cat: "MID", eaId: 247521 },
  { id: 68, n: "Granit Xhaka", s: "Xhaka", pos: "CDM", r: 85, pac: 65, sho: 71, pas: 85, dri: 75, def: 83, phy: 79, sm: 2, wf: 4, club: "Leverkusen", nat: "🇨🇭", cat: "MID", eaId: 215698 },
  { id: 69, n: "Thomas Partey", s: "Partey", pos: "CDM", r: 85, pac: 74, sho: 70, pas: 80, dri: 76, def: 85, phy: 84, sm: 3, wf: 3, club: "Arsenal", nat: "🇬🇭", cat: "MID", eaId: 212127 },
  { id: 70, n: "Martin Zubimendi", s: "Zubimendi", pos: "CDM", r: 85, pac: 67, sho: 68, pas: 84, dri: 78, def: 85, phy: 76, sm: 3, wf: 3, club: "Arsenal", nat: "🇪🇸", cat: "MID", eaId: 243557 },
  { id: 71, n: "João Neves", s: "J. Neves", pos: "CDM", r: 84, pac: 76, sho: 68, pas: 82, dri: 80, def: 82, phy: 74, sm: 3, wf: 3, club: "Paris SG", nat: "🇵🇹", cat: "MID", eaId: 265747 },
  { id: 72, n: "Sandro Tonali", s: "Tonali", pos: "CDM", r: 84, pac: 69, sho: 72, pas: 82, dri: 79, def: 83, phy: 80, sm: 3, wf: 3, club: "Newcastle", nat: "🇮🇹", cat: "MID", eaId: 240508 },
  { id: 73, n: "Nicolò Barella", s: "Barella", pos: "CM", r: 88, pac: 74, sho: 76, pas: 87, dri: 85, def: 82, phy: 80, sm: 3, wf: 4, club: "Inter Milan", nat: "🇮🇹", cat: "MID", eaId: 233538 },
  { id: 74, n: "Bernardo Silva", s: "B. Silva", pos: "CM", r: 88, pac: 82, sho: 81, pas: 89, dri: 89, def: 70, phy: 69, sm: 4, wf: 4, club: "Man City", nat: "🇵🇹", cat: "MID", eaId: 218667 },
  { id: 75, n: "Luka Modrić", s: "Modrić", pos: "CM", r: 87, pac: 74, sho: 78, pas: 92, dri: 90, def: 74, phy: 68, sm: 4, wf: 4, club: "Real Madrid", nat: "🇭🇷", cat: "MID", eaId: 177003 },
  { id: 76, n: "Eduardo Camavinga", s: "Camavinga", pos: "CM", r: 87, pac: 82, sho: 70, pas: 82, dri: 84, def: 80, phy: 78, sm: 4, wf: 3, club: "Real Madrid", nat: "🇫🇷", cat: "MID", eaId: 247080 },
  { id: 77, n: "Bruno Fernandes", s: "B. Fernandes", pos: "CM", r: 87, pac: 73, sho: 83, pas: 89, dri: 84, def: 63, phy: 73, sm: 4, wf: 3, club: "Man United", nat: "🇵🇹", cat: "MID", eaId: 212198 },
  { id: 78, n: "Gavi", s: "Gavi", pos: "CM", r: 86, pac: 77, sho: 71, pas: 86, dri: 88, def: 79, phy: 66, sm: 4, wf: 3, club: "FC Barcelona", nat: "🇪🇸", cat: "MID", eaId: 257071 },
  { id: 79, n: "Fabian Ruiz", s: "F. Ruiz", pos: "CM", r: 85, pac: 68, sho: 76, pas: 87, dri: 82, def: 66, phy: 72, sm: 3, wf: 3, club: "Paris SG", nat: "🇪🇸", cat: "MID", eaId: 217935 },
  { id: 80, n: "Dominik Szoboszlai", s: "Szoboszlai", pos: "CM", r: 85, pac: 81, sho: 79, pas: 83, dri: 84, def: 66, phy: 79, sm: 3, wf: 4, club: "Liverpool", nat: "🇭🇺", cat: "MID", eaId: 243544 },
  { id: 81, n: "Enzo Fernández", s: "E. Fernández", pos: "CM", r: 85, pac: 73, sho: 73, pas: 84, dri: 83, def: 77, phy: 75, sm: 3, wf: 4, club: "Chelsea", nat: "🇦🇷", cat: "MID", eaId: 256546 },
  { id: 82, n: "Ryan Gravenberch", s: "Gravenberch", pos: "CM", r: 85, pac: 79, sho: 67, pas: 82, dri: 82, def: 74, phy: 80, sm: 3, wf: 3, club: "Liverpool", nat: "🇳🇱", cat: "MID", eaId: 246432 },
  { id: 83, n: "Alexis Mac Allister", s: "Mac Allister", pos: "CM", r: 85, pac: 74, sho: 75, pas: 84, dri: 80, def: 74, phy: 77, sm: 3, wf: 4, club: "Liverpool", nat: "🇦🇷", cat: "MID", eaId: 237169 },
  { id: 84, n: "Tijjani Reijnders", s: "Reijnders", pos: "CM", r: 85, pac: 76, sho: 74, pas: 83, dri: 83, def: 73, phy: 75, sm: 3, wf: 4, club: "AC Milan", nat: "🇳🇱", cat: "MID", eaId: 242620 },
  { id: 85, n: "Warren Zaïre-Emery", s: "Zaïre-Emery", pos: "CM", r: 85, pac: 81, sho: 72, pas: 82, dri: 83, def: 74, phy: 75, sm: 3, wf: 3, club: "Paris SG", nat: "🇫🇷", cat: "MID", eaId: 264254 },
  { id: 86, n: "Douglas Luiz", s: "D. Luiz", pos: "CM", r: 84, pac: 74, sho: 72, pas: 80, dri: 79, def: 76, phy: 79, sm: 3, wf: 3, club: "Juventus", nat: "🇧🇷", cat: "MID", eaId: 232564 },
  { id: 87, n: "Jamal Musiala", s: "Musiala", pos: "CAM", r: 88, pac: 83, sho: 81, pas: 84, dri: 91, def: 49, phy: 70, sm: 4, wf: 3, club: "Bayern Munich", nat: "🇩🇪", cat: "MID", eaId: 247659 },
  { id: 88, n: "Cole Palmer", s: "C. Palmer", pos: "CAM", r: 88, pac: 78, sho: 84, pas: 86, dri: 88, def: 52, phy: 70, sm: 4, wf: 4, club: "Chelsea", nat: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", cat: "MID", eaId: 255055 },
  { id: 89, n: "Martin Ødegaard", s: "Ødegaard", pos: "CAM", r: 88, pac: 76, sho: 80, pas: 90, dri: 89, def: 61, phy: 66, sm: 4, wf: 4, club: "Arsenal", nat: "🇳🇴", cat: "MID", eaId: 222665 },
  { id: 90, n: "Phil Foden", s: "Foden", pos: "CAM", r: 88, pac: 84, sho: 84, pas: 85, dri: 89, def: 56, phy: 71, sm: 4, wf: 3, club: "Man City", nat: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", cat: "MID", eaId: 238789 },
  { id: 91, n: "Antoine Griezmann", s: "Griezmann", pos: "CAM", r: 87, pac: 79, sho: 88, pas: 83, dri: 85, def: 59, phy: 75, sm: 4, wf: 4, club: "Atlético", nat: "🇫🇷", cat: "MID", eaId: 194765 },
  { id: 92, n: "Dani Olmo", s: "D. Olmo", pos: "CAM", r: 87, pac: 83, sho: 80, pas: 84, dri: 87, def: 54, phy: 72, sm: 3, wf: 3, club: "FC Barcelona", nat: "🇪🇸", cat: "MID", eaId: 226603 },
  { id: 93, n: "Christopher Nkunku", s: "Nkunku", pos: "CAM", r: 87, pac: 84, sho: 84, pas: 80, dri: 88, def: 42, phy: 72, sm: 4, wf: 3, club: "Chelsea", nat: "🇫🇷", cat: "MID", eaId: 230666 },
  { id: 94, n: "Xavi Simons", s: "X. Simons", pos: "CAM", r: 86, pac: 84, sho: 78, pas: 84, dri: 89, def: 50, phy: 64, sm: 4, wf: 3, club: "RB Leipzig", nat: "🇳🇱", cat: "MID", eaId: 253098 },
  { id: 95, n: "Eberechi Eze", s: "E. Eze", pos: "CAM", r: 84, pac: 80, sho: 80, pas: 80, dri: 85, def: 46, phy: 68, sm: 4, wf: 3, club: "Crystal Palace", nat: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", cat: "MID", eaId: 237097 },
  { id: 96, n: "Leroy Sané", s: "Sané", pos: "LM", r: 86, pac: 94, sho: 81, pas: 77, dri: 88, def: 36, phy: 73, sm: 4, wf: 3, club: "Bayern Munich", nat: "🇩🇪", cat: "MID", eaId: 210325 },
  { id: 97, n: "Gabriel Martinelli", s: "Martinelli", pos: "LM", r: 85, pac: 91, sho: 81, pas: 74, dri: 84, def: 46, phy: 73, sm: 3, wf: 4, club: "Arsenal", nat: "🇧🇷", cat: "MID", eaId: 243519 },
  { id: 98, n: "Kaoru Mitoma", s: "Mitoma", pos: "LM", r: 85, pac: 94, sho: 79, pas: 74, dri: 88, def: 41, phy: 69, sm: 4, wf: 3, club: "Brighton", nat: "🇯🇵", cat: "MID", eaId: 252183 },
  { id: 99, n: "Pedro Neto", s: "P. Neto", pos: "RM", r: 85, pac: 92, sho: 76, pas: 74, dri: 86, def: 40, phy: 64, sm: 4, wf: 3, club: "Chelsea", nat: "🇵🇹", cat: "MID", eaId: 247163 },
  { id: 100, n: "Bryan Mbeumo", s: "Mbeumo", pos: "RM", r: 84, pac: 88, sho: 80, pas: 74, dri: 83, def: 40, phy: 70, sm: 3, wf: 3, club: "Brentford", nat: "🇨🇲", cat: "MID", eaId: 243558 },
  { id: 101, n: "Son Heung-min", s: "Son", pos: "LW", r: 88, pac: 89, sho: 87, pas: 81, dri: 86, def: 47, phy: 71, sm: 4, wf: 4, club: "Tottenham", nat: "🇰🇷", cat: "FWD", eaId: 200104 },
  { id: 102, n: "K. Kvaratskhelia", s: "Kvara", pos: "LW", r: 88, pac: 91, sho: 84, pas: 81, dri: 92, def: 39, phy: 73, sm: 5, wf: 3, club: "Paris SG", nat: "🇬🇪", cat: "FWD", eaId: 249147 },
  { id: 103, n: "Nico Williams", s: "N. Williams", pos: "LW", r: 87, pac: 95, sho: 79, pas: 78, dri: 89, def: 34, phy: 68, sm: 4, wf: 3, club: "Athletic Club", nat: "🇪🇸", cat: "FWD", eaId: 258503 },
  { id: 104, n: "Rafael Leão", s: "Leão", pos: "LW", r: 87, pac: 94, sho: 81, pas: 75, dri: 89, def: 34, phy: 74, sm: 4, wf: 3, club: "AC Milan", nat: "🇵🇹", cat: "FWD", eaId: 241721 },
  { id: 105, n: "Michael Olise", s: "Olise", pos: "LW", r: 86, pac: 85, sho: 81, pas: 79, dri: 87, def: 42, phy: 67, sm: 4, wf: 3, club: "Bayern Munich", nat: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", cat: "FWD", eaId: 252471 },
  { id: 106, n: "Cody Gakpo", s: "Gakpo", pos: "LW", r: 85, pac: 87, sho: 82, pas: 75, dri: 83, def: 44, phy: 75, sm: 3, wf: 3, club: "Liverpool", nat: "🇳🇱", cat: "FWD", eaId: 237690 },
  { id: 107, n: "Jamie Gittens", s: "Gittens", pos: "LW", r: 85, pac: 93, sho: 76, pas: 72, dri: 86, def: 35, phy: 64, sm: 4, wf: 3, club: "B. Dortmund", nat: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", cat: "FWD", eaId: 264398 },
  { id: 108, n: "Marcus Rashford", s: "Rashford", pos: "LW", r: 84, pac: 92, sho: 80, pas: 73, dri: 84, def: 43, phy: 74, sm: 4, wf: 3, club: "Marseille", nat: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", cat: "FWD", eaId: 231677 },
  { id: 109, n: "Alejandro Garnacho", s: "Garnacho", pos: "LW", r: 84, pac: 88, sho: 76, pas: 71, dri: 84, def: 38, phy: 66, sm: 4, wf: 3, club: "Man United", nat: "🇦🇷", cat: "FWD", eaId: 258964 },
  { id: 110, n: "Moussa Diaby", s: "Diaby", pos: "LW", r: 84, pac: 94, sho: 78, pas: 74, dri: 86, def: 34, phy: 70, sm: 4, wf: 3, club: "Aston Villa", nat: "🇫🇷", cat: "FWD", eaId: 237200 },
  { id: 111, n: "Bukayo Saka", s: "Saka", pos: "RW", r: 88, pac: 87, sho: 82, pas: 82, dri: 87, def: 60, phy: 72, sm: 4, wf: 4, club: "Arsenal", nat: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", cat: "FWD", eaId: 246669 },
  { id: 112, n: "Rodrygo", s: "Rodrygo", pos: "RW", r: 87, pac: 88, sho: 82, pas: 80, dri: 88, def: 45, phy: 67, sm: 4, wf: 4, club: "Real Madrid", nat: "🇧🇷", cat: "FWD", eaId: 243812 },
  { id: 113, n: "Kingsley Coman", s: "Coman", pos: "RW", r: 85, pac: 92, sho: 78, pas: 76, dri: 87, def: 37, phy: 70, sm: 4, wf: 4, club: "Bayern Munich", nat: "🇫🇷", cat: "FWD", eaId: 212560 },
  { id: 114, n: "Jarrod Bowen", s: "Bowen", pos: "RW", r: 84, pac: 86, sho: 79, pas: 74, dri: 82, def: 44, phy: 72, sm: 3, wf: 3, club: "West Ham", nat: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", cat: "FWD", eaId: 233535 },
  { id: 115, n: "Mohamed Kudus", s: "Kudus", pos: "RW", r: 84, pac: 87, sho: 78, pas: 72, dri: 85, def: 42, phy: 72, sm: 4, wf: 3, club: "West Ham", nat: "🇬🇭", cat: "FWD", eaId: 252058 },
  { id: 116, n: "Karim Adeyemi", s: "Adeyemi", pos: "RW", r: 84, pac: 96, sho: 76, pas: 69, dri: 82, def: 34, phy: 68, sm: 4, wf: 3, club: "B. Dortmund", nat: "🇩🇪", cat: "FWD", eaId: 253093 },
  { id: 117, n: "Donyell Malen", s: "Malen", pos: "RW", r: 84, pac: 92, sho: 78, pas: 72, dri: 83, def: 35, phy: 68, sm: 4, wf: 3, club: "Aston Villa", nat: "🇳🇱", cat: "FWD", eaId: 230543 },
  { id: 118, n: "Ferran Torres", s: "F. Torres", pos: "RW", r: 83, pac: 87, sho: 79, pas: 74, dri: 82, def: 42, phy: 68, sm: 3, wf: 3, club: "FC Barcelona", nat: "🇪🇸", cat: "FWD", eaId: 243286 },
  { id: 119, n: "Robert Lewandowski", s: "Lewandowski", pos: "ST", r: 88, pac: 72, sho: 89, pas: 79, dri: 80, def: 44, phy: 79, sm: 3, wf: 4, club: "FC Barcelona", nat: "🇵🇱", cat: "FWD", eaId: 188545 },
  { id: 120, n: "Alexander Isak", s: "A. Isak", pos: "ST", r: 88, pac: 87, sho: 89, pas: 72, dri: 84, def: 44, phy: 75, sm: 3, wf: 3, club: "Liverpool", nat: "🇸🇪", cat: "FWD", eaId: 232424 },
  { id: 121, n: "Lautaro Martínez", s: "Lautaro", pos: "ST", r: 88, pac: 79, sho: 88, pas: 72, dri: 85, def: 44, phy: 84, sm: 3, wf: 4, club: "Inter Milan", nat: "🇦🇷", cat: "FWD", eaId: 233199 },
  { id: 122, n: "Viktor Gyökeres", s: "Gyökeres", pos: "ST", r: 87, pac: 82, sho: 87, pas: 68, dri: 79, def: 44, phy: 91, sm: 3, wf: 3, club: "Arsenal", nat: "🇸🇪", cat: "FWD", eaId: 235640 },
  { id: 123, n: "Julián Álvarez", s: "J. Álvarez", pos: "ST", r: 87, pac: 82, sho: 86, pas: 74, dri: 85, def: 50, phy: 76, sm: 4, wf: 3, club: "Atlético", nat: "🇦🇷", cat: "FWD", eaId: 248071 },
  { id: 124, n: "Ollie Watkins", s: "Watkins", pos: "ST", r: 87, pac: 91, sho: 86, pas: 70, dri: 81, def: 45, phy: 78, sm: 3, wf: 3, club: "Aston Villa", nat: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", cat: "FWD", eaId: 231928 },
  { id: 125, n: "Dušan Vlahović", s: "Vlahović", pos: "ST", r: 87, pac: 77, sho: 90, pas: 61, dri: 75, def: 39, phy: 84, sm: 3, wf: 4, club: "Juventus", nat: "🇷🇸", cat: "FWD", eaId: 243942 },
  { id: 126, n: "Darwin Núñez", s: "Núñez", pos: "ST", r: 86, pac: 95, sho: 84, pas: 64, dri: 82, def: 42, phy: 84, sm: 3, wf: 3, club: "Liverpool", nat: "🇺🇾", cat: "FWD", eaId: 240413 },
  { id: 127, n: "Lois Openda", s: "Openda", pos: "ST", r: 86, pac: 93, sho: 83, pas: 65, dri: 81, def: 39, phy: 75, sm: 3, wf: 3, club: "RB Leipzig", nat: "🇧🇪", cat: "FWD", eaId: 248090 },
  { id: 128, n: "Serhou Guirassy", s: "Guirassy", pos: "ST", r: 86, pac: 84, sho: 88, pas: 59, dri: 75, def: 39, phy: 83, sm: 3, wf: 4, club: "B. Dortmund", nat: "🇬🇳", cat: "FWD", eaId: 232396 },
  { id: 129, n: "Marcus Thuram", s: "Thuram", pos: "ST", r: 85, pac: 89, sho: 82, pas: 68, dri: 79, def: 43, phy: 84, sm: 3, wf: 4, club: "Inter Milan", nat: "🇫🇷", cat: "FWD", eaId: 237438 },
  { id: 130, n: "Gonçalo Ramos", s: "G. Ramos", pos: "ST", r: 85, pac: 76, sho: 84, pas: 66, dri: 76, def: 38, phy: 77, sm: 3, wf: 4, club: "Paris SG", nat: "🇵🇹", cat: "FWD", eaId: 251592 },
  { id: 131, n: "Artem Dovbyk", s: "Dovbyk", pos: "ST", r: 85, pac: 74, sho: 87, pas: 62, dri: 72, def: 38, phy: 82, sm: 2, wf: 3, club: "Roma", nat: "🇺🇦", cat: "FWD", eaId: 236078 },
  { id: 132, n: "Randal Kolo Muani", s: "Kolo Muani", pos: "ST", r: 85, pac: 91, sho: 80, pas: 72, dri: 79, def: 40, phy: 74, sm: 3, wf: 3, club: "Juventus", nat: "🇫🇷", cat: "FWD", eaId: 240127 },
  { id: 133, n: "Matheus Cunha", s: "Cunha", pos: "ST", r: 85, pac: 84, sho: 80, pas: 72, dri: 83, def: 44, phy: 72, sm: 4, wf: 3, club: "Wolves", nat: "🇧🇷", cat: "FWD", eaId: 237436 },
  { id: 134, n: "Nicolas Jackson", s: "Jackson", pos: "ST", r: 84, pac: 89, sho: 80, pas: 63, dri: 79, def: 39, phy: 75, sm: 3, wf: 3, club: "Chelsea", nat: "🇸🇳", cat: "FWD", eaId: 252487 },
  { id: 135, n: "Rasmus Højlund", s: "Højlund", pos: "ST", r: 84, pac: 89, sho: 82, pas: 62, dri: 78, def: 40, phy: 78, sm: 3, wf: 3, club: "Man United", nat: "🇩🇰", cat: "FWD", eaId: 253088 },
  { id: 136, n: "Benjamin Šeško", s: "Šeško", pos: "ST", r: 84, pac: 85, sho: 82, pas: 59, dri: 75, def: 36, phy: 81, sm: 3, wf: 3, club: "RB Leipzig", nat: "🇸🇮", cat: "FWD", eaId: 253095 },
  { id: 137, n: "Marcus Thuram (B)", s: "Thuram B", pos: "ST", r: 85, pac: 89, sho: 82, pas: 68, dri: 79, def: 43, phy: 84, sm: 3, wf: 4, club: "Inter Milan", nat: "🇫🇷", cat: "FWD", eaId: 237438 },
  { id: 138, n: "Jhon Durán", s: "J. Durán", pos: "ST", r: 83, pac: 82, sho: 82, pas: 58, dri: 74, def: 36, phy: 80, sm: 3, wf: 3, club: "Aston Villa", nat: "🇨🇴", cat: "FWD", eaId: 261484 },
  { id: 139, n: "Ivan Toney", s: "Toney", pos: "ST", r: 83, pac: 75, sho: 83, pas: 68, dri: 74, def: 40, phy: 82, sm: 2, wf: 3, club: "Al-Ahli", nat: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", cat: "FWD", eaId: 221180 },
  { id: 140, n: "Evan Ferguson", s: "Ferguson", pos: "ST", r: 83, pac: 74, sho: 83, pas: 62, dri: 74, def: 36, phy: 78, sm: 2, wf: 3, club: "Brighton", nat: "🇮🇪", cat: "FWD", eaId: 262007 },
  { id: 141, n: "Diogo Dalot", s: "D. Dalot", pos: "RB", r: 83, pac: 83, sho: 58, pas: 74, dri: 76, def: 80, phy: 74, sm: 3, wf: 3, club: "Man United", nat: "🇵🇹", cat: "DEF", eaId: 239034 },
  { id: 142, n: "Malo Gusto", s: "M. Gusto", pos: "RB", r: 83, pac: 87, sho: 56, pas: 72, dri: 76, def: 79, phy: 72, sm: 2, wf: 3, club: "Chelsea", nat: "🇫🇷", cat: "DEF", eaId: 257513 },
  { id: 143, n: "Ferdi Kadioglu", s: "Kadioglu", pos: "LB", r: 84, pac: 83, sho: 57, pas: 72, dri: 78, def: 78, phy: 70, sm: 3, wf: 3, club: "Fenerbahce", nat: "🇹🇷", cat: "DEF", eaId: 237574 },
  { id: 144, n: "Stefan de Vrij", s: "De Vrij", pos: "CB", r: 83, pac: 68, sho: 47, pas: 68, dri: 58, def: 84, phy: 80, sm: 2, wf: 3, club: "Inter Milan", nat: "🇳🇱", cat: "DEF", eaId: 200120 },
  { id: 145, n: "Evan Ndicka", s: "Ndicka", pos: "CB", r: 84, pac: 80, sho: 44, pas: 66, dri: 58, def: 84, phy: 84, sm: 2, wf: 3, club: "Roma", nat: "🇫🇷", cat: "DEF", eaId: 243079 },
  { id: 146, n: "Kalidou Koulibaly", s: "Koulibaly", pos: "CB", r: 84, pac: 80, sho: 52, pas: 66, dri: 62, def: 87, phy: 88, sm: 2, wf: 3, club: "Al-Hilal", nat: "🇸🇳", cat: "DEF", eaId: 201024 },
  { id: 147, n: "Edmond Tapsoba", s: "Tapsoba", pos: "CB", r: 83, pac: 79, sho: 44, pas: 62, dri: 57, def: 83, phy: 84, sm: 2, wf: 3, club: "Leverkusen", nat: "🇧🇫", cat: "DEF", eaId: 243633 },
  { id: 148, n: "Milan Škriniar", s: "Škriniar", pos: "CB", r: 84, pac: 73, sho: 46, pas: 65, dri: 58, def: 85, phy: 84, sm: 2, wf: 3, club: "Paris SG", nat: "🇸🇰", cat: "DEF", eaId: 223848 },
  { id: 149, n: "Exequiel Palacios", s: "Palacios", pos: "CDM", r: 84, pac: 72, sho: 70, pas: 82, dri: 80, def: 81, phy: 78, sm: 3, wf: 3, club: "Leverkusen", nat: "🇦🇷", cat: "MID", eaId: 237450 },
  { id: 150, n: "Youssouf Fofana", s: "Fofana", pos: "CDM", r: 83, pac: 78, sho: 64, pas: 76, dri: 74, def: 82, phy: 80, sm: 3, wf: 3, club: "AC Milan", nat: "🇫🇷", cat: "MID", eaId: 237504 },
  { id: 151, n: "Davide Frattesi", s: "Frattesi", pos: "CM", r: 84, pac: 79, sho: 75, pas: 78, dri: 80, def: 73, phy: 80, sm: 3, wf: 3, club: "Inter Milan", nat: "🇮🇹", cat: "MID", eaId: 241590 },
  { id: 152, n: "Orkun Kökcü", s: "Kökcü", pos: "CAM", r: 83, pac: 72, sho: 74, pas: 82, dri: 82, def: 52, phy: 68, sm: 3, wf: 3, club: "Benfica", nat: "🇹🇷", cat: "MID", eaId: 243517 },
  { id: 153, n: "Harvey Elliott", s: "H. Elliott", pos: "RM", r: 83, pac: 82, sho: 74, pas: 80, dri: 84, def: 52, phy: 65, sm: 3, wf: 3, club: "Liverpool", nat: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", cat: "MID", eaId: 247101 },
  { id: 154, n: "Takefusa Kubo", s: "Kubo", pos: "RM", r: 84, pac: 83, sho: 75, pas: 76, dri: 87, def: 42, phy: 62, sm: 4, wf: 3, club: "Real Sociedad", nat: "🇯🇵", cat: "MID", eaId: 245386 },
  { id: 155, n: "Noni Madueke", s: "Madueke", pos: "RM", r: 84, pac: 90, sho: 78, pas: 72, dri: 85, def: 37, phy: 69, sm: 4, wf: 3, club: "Chelsea", nat: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", cat: "MID", eaId: 252427 },
  { id: 156, n: "Jacob Ramsey", s: "J. Ramsey", pos: "CM", r: 83, pac: 79, sho: 72, pas: 74, dri: 79, def: 66, phy: 76, sm: 3, wf: 3, club: "Aston Villa", nat: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", cat: "MID", eaId: 247105 },
  { id: 157, n: "Youri Tielemans", s: "Tielemans", pos: "CM", r: 84, pac: 72, sho: 76, pas: 84, dri: 80, def: 70, phy: 74, sm: 3, wf: 4, club: "Aston Villa", nat: "🇧🇪", cat: "MID", eaId: 222690 },
  { id: 158, n: "Matteo Guendouzi", s: "Guendouzi", pos: "CM", r: 83, pac: 78, sho: 65, pas: 82, dri: 79, def: 75, phy: 79, sm: 3, wf: 3, club: "Lazio", nat: "🇫🇷", cat: "MID", eaId: 239095 },
  { id: 159, n: "Ilkay Gündoğan", s: "Gündoğan", pos: "CAM", r: 84, pac: 64, sho: 78, pas: 87, dri: 82, def: 67, phy: 69, sm: 3, wf: 4, club: "FC Barcelona", nat: "🇩🇪", cat: "MID", eaId: 186942 },
  { id: 160, n: "James Maddison", s: "Maddison", pos: "CAM", r: 84, pac: 74, sho: 80, pas: 84, dri: 83, def: 46, phy: 67, sm: 3, wf: 3, club: "Tottenham", nat: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", cat: "MID", eaId: 224998 },
  { id: 161, n: "Serge Gnabry", s: "Gnabry", pos: "LW", r: 83, pac: 87, sho: 78, pas: 74, dri: 82, def: 38, phy: 68, sm: 4, wf: 3, club: "Bayern Munich", nat: "🇩🇪", cat: "FWD", eaId: 222737 },
  { id: 162, n: "Leon Bailey", s: "Bailey", pos: "LW", r: 83, pac: 92, sho: 78, pas: 73, dri: 86, def: 36, phy: 69, sm: 4, wf: 3, club: "Aston Villa", nat: "🇯🇲", cat: "FWD", eaId: 228012 },
  { id: 163, n: "Mattia Zaccagni", s: "Zaccagni", pos: "LW", r: 83, pac: 84, sho: 76, pas: 74, dri: 83, def: 40, phy: 68, sm: 3, wf: 3, club: "Lazio", nat: "🇮🇹", cat: "FWD", eaId: 226932 },
  { id: 164, n: "Ansu Fati", s: "Ansu Fati", pos: "LW", r: 83, pac: 87, sho: 78, pas: 72, dri: 83, def: 37, phy: 64, sm: 4, wf: 3, club: "FC Barcelona", nat: "🇪🇸", cat: "FWD", eaId: 249232 },
  { id: 165, n: "Samuel Chukwueze", s: "Chukwueze", pos: "RW", r: 83, pac: 90, sho: 76, pas: 68, dri: 83, def: 37, phy: 67, sm: 4, wf: 3, club: "AC Milan", nat: "🇳🇬", cat: "FWD", eaId: 246115 },
  { id: 166, n: "Richarlison", s: "Richarlison", pos: "ST", r: 83, pac: 86, sho: 80, pas: 65, dri: 78, def: 44, phy: 78, sm: 3, wf: 3, club: "Tottenham", nat: "🇧🇷", cat: "FWD", eaId: 218061 },
  { id: 167, n: "Dominic Solanke", s: "Solanke", pos: "ST", r: 83, pac: 78, sho: 80, pas: 68, dri: 74, def: 42, phy: 76, sm: 2, wf: 3, club: "Tottenham", nat: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", cat: "FWD", eaId: 218552 },
  { id: 168, n: "Giacomo Raspadori", s: "Raspadori", pos: "ST", r: 83, pac: 78, sho: 82, pas: 74, dri: 80, def: 47, phy: 68, sm: 3, wf: 4, club: "Napoli", nat: "🇮🇹", cat: "FWD", eaId: 248061 },
  { id: 169, n: "Joao Pedro", s: "João Pedro", pos: "ST", r: 83, pac: 76, sho: 79, pas: 68, dri: 77, def: 40, phy: 75, sm: 3, wf: 3, club: "Brighton", nat: "🇧🇷", cat: "FWD", eaId: 243563 },
  { id: 170, n: "Sofyan Amrabat", s: "Amrabat", pos: "CDM", r: 83, pac: 74, sho: 62, pas: 78, dri: 73, def: 82, phy: 80, sm: 2, wf: 3, club: "Man United", nat: "🇲🇦", cat: "MID", eaId: 216547 },
  { id: 171, n: "Weston McKennie", s: "McKennie", pos: "CM", r: 83, pac: 79, sho: 72, pas: 75, dri: 76, def: 73, phy: 80, sm: 3, wf: 3, club: "Juventus", nat: "🇺🇸", cat: "MID", eaId: 235950 },
  { id: 172, n: "Tomas Soucek", s: "Soucek", pos: "CM", r: 83, pac: 69, sho: 72, pas: 74, dri: 68, def: 75, phy: 84, sm: 2, wf: 3, club: "West Ham", nat: "🇨🇿", cat: "MID", eaId: 218722 },
  { id: 173, n: "Leandro Paredes", s: "Paredes", pos: "CDM", r: 83, pac: 64, sho: 68, pas: 85, dri: 76, def: 70, phy: 72, sm: 3, wf: 3, club: "Roma", nat: "🇦🇷", cat: "MID", eaId: 213159 },
  { id: 174, n: "Emerson Royal", s: "E. Royal", pos: "RB", r: 82, pac: 83, sho: 56, pas: 70, dri: 73, def: 79, phy: 76, sm: 2, wf: 3, club: "AC Milan", nat: "🇧🇷", cat: "DEF", eaId: 242831 },
  { id: 175, n: "Lucas Hernandez", s: "L. Hernandez", pos: "LB", r: 83, pac: 76, sho: 49, pas: 66, dri: 66, def: 84, phy: 81, sm: 2, wf: 3, club: "Paris SG", nat: "🇫🇷", cat: "DEF", eaId: 234192 },
  { id: 176, n: "Caglar Söyüncü", s: "Söyüncü", pos: "CB", r: 83, pac: 72, sho: 42, pas: 62, dri: 55, def: 83, phy: 82, sm: 2, wf: 3, club: "Atlético", nat: "🇹🇷", cat: "DEF", eaId: 228680 },
  { id: 177, n: "Maxence Lacroix", s: "Lacroix", pos: "CB", r: 82, pac: 78, sho: 42, pas: 60, dri: 55, def: 82, phy: 82, sm: 2, wf: 3, club: "Chelsea", nat: "🇫🇷", cat: "DEF", eaId: 247127 },
  { id: 178, n: "Danilo", s: "Danilo", pos: "CB", r: 84, pac: 74, sho: 46, pas: 70, dri: 62, def: 84, phy: 80, sm: 2, wf: 3, club: "Juventus", nat: "🇧🇷", cat: "DEF", eaId: 190483 },
  { id: 179, n: "Konstantinos Mavropanos", s: "Mavropanos", pos: "CB", r: 82, pac: 75, sho: 42, pas: 60, dri: 52, def: 82, phy: 84, sm: 2, wf: 3, club: "West Ham", nat: "🇬🇷", cat: "DEF", eaId: 241125 },
  { id: 180, n: "Lewis Dunk", s: "L. Dunk", pos: "CB", r: 82, pac: 69, sho: 43, pas: 64, dri: 52, def: 83, phy: 82, sm: 2, wf: 3, club: "Brighton", nat: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", cat: "DEF", eaId: 207579 },
  { id: 181, n: "Andreas Pereira", s: "A. Pereira", pos: "CAM", r: 82, pac: 74, sho: 74, pas: 80, dri: 79, def: 52, phy: 68, sm: 3, wf: 3, club: "Fulham", nat: "🇧🇷", cat: "MID", eaId: 226449 },
  { id: 182, n: "Said Benrahma", s: "Benrahma", pos: "LM", r: 82, pac: 82, sho: 74, pas: 74, dri: 85, def: 37, phy: 64, sm: 4, wf: 3, club: "Lyon", nat: "🇩🇿", cat: "MID", eaId: 232095 },
  { id: 183, n: "Timo Werner", s: "T. Werner", pos: "LW", r: 82, pac: 91, sho: 78, pas: 72, dri: 79, def: 38, phy: 68, sm: 3, wf: 3, club: "Tottenham", nat: "🇩🇪", cat: "FWD", eaId: 227055 },
  { id: 184, n: "Yannick Carrasco", s: "Carrasco", pos: "LW", r: 83, pac: 87, sho: 76, pas: 74, dri: 84, def: 42, phy: 67, sm: 4, wf: 3, club: "Al-Qadsiah", nat: "🇧🇪", cat: "FWD", eaId: 207927 },
  { id: 185, n: "Tammy Abraham", s: "T. Abraham", pos: "ST", r: 82, pac: 82, sho: 80, pas: 60, dri: 74, def: 38, phy: 78, sm: 3, wf: 3, club: "Roma", nat: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", cat: "FWD", eaId: 222089 },
  { id: 186, n: "Alexandre Lacazette", s: "Lacazette", pos: "ST", r: 83, pac: 74, sho: 83, pas: 75, dri: 78, def: 44, phy: 74, sm: 3, wf: 4, club: "Lyon", nat: "🇫🇷", cat: "FWD", eaId: 195864 },
  { id: 187, n: "Ilkay Gündoğan (CM)", s: "Gündoğan CM", pos: "CM", r: 84, pac: 64, sho: 78, pas: 87, dri: 82, def: 67, phy: 69, sm: 3, wf: 4, club: "FC Barcelona", nat: "🇩🇪", cat: "MID", eaId: 186942 },
  { id: 188, n: "Dani Olmo (CM)", s: "D. Olmo CM", pos: "CM", r: 87, pac: 83, sho: 79, pas: 84, dri: 87, def: 53, phy: 71, sm: 3, wf: 3, club: "FC Barcelona", nat: "🇪🇸", cat: "MID", eaId: 226603 },
  { id: 189, n: "Emiliano Buendía", s: "Buendía", pos: "CAM", r: 82, pac: 73, sho: 72, pas: 79, dri: 82, def: 44, phy: 64, sm: 3, wf: 3, club: "Aston Villa", nat: "🇦🇷", cat: "MID", eaId: 235641 },
  { id: 190, n: "Adrien Rabiot", s: "Rabiot", pos: "CM", r: 83, pac: 74, sho: 70, pas: 80, dri: 76, def: 72, phy: 80, sm: 3, wf: 3, club: "Marseille", nat: "🇫🇷", cat: "MID", eaId: 205547 },
  { id: 191, n: "Levi Colwill", s: "Colwill", pos: "CB", r: 84, pac: 73, sho: 43, pas: 63, dri: 57, def: 83, phy: 81, sm: 2, wf: 3, club: "Chelsea", nat: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", cat: "DEF", eaId: 256624 },
  { id: 192, n: "John Stones", s: "J. Stones", pos: "CB", r: 84, pac: 75, sho: 52, pas: 75, dri: 68, def: 85, phy: 80, sm: 2, wf: 3, club: "Man City", nat: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", cat: "DEF", eaId: 203574 },
  { id: 193, n: "Karim Adeyemi (LW)", s: "Adeyemi LW", pos: "LW", r: 84, pac: 96, sho: 76, pas: 69, dri: 82, def: 34, phy: 68, sm: 4, wf: 3, club: "B. Dortmund", nat: "🇩🇪", cat: "FWD", eaId: 253093 },
  { id: 194, n: "Jhon Durán (B)", s: "Durán B", pos: "ST", r: 83, pac: 82, sho: 82, pas: 58, dri: 74, def: 36, phy: 80, sm: 3, wf: 3, club: "Aston Villa", nat: "🇨🇴", cat: "FWD", eaId: 261484 },
  { id: 195, n: "Vitinha (CDM)", s: "Vitinha CDM", pos: "CDM", r: 88, pac: 74, sho: 72, pas: 87, dri: 86, def: 61, phy: 68, sm: 3, wf: 3, club: "Paris SG", nat: "🇵🇹", cat: "MID", eaId: 241930 },
  { id: 196, n: "Victor Osimhen", s: "Osimhen", pos: "ST", r: 87, pac: 94, sho: 88, pas: 63, dri: 82, def: 41, phy: 86, sm: 3, wf: 4, club: "Galatasaray", nat: "🇳🇬", cat: "FWD", eaId: 236660 },
  { id: 197, n: "K. Kvaratskhelia (LW)", s: "Kvara LW", pos: "LW", r: 88, pac: 91, sho: 84, pas: 81, dri: 92, def: 39, phy: 73, sm: 5, wf: 3, club: "Paris SG", nat: "🇬🇪", cat: "FWD", eaId: 249147 },
  { id: 198, n: "Phil Foden (LW)", s: "Foden LW", pos: "LW", r: 88, pac: 84, sho: 84, pas: 85, dri: 89, def: 56, phy: 71, sm: 4, wf: 3, club: "Man City", nat: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", cat: "FWD", eaId: 238789 },
  { id: 199, n: "Marquinhos (CDM)", s: "Marquinhos M", pos: "CDM", r: 88, pac: 75, sho: 52, pas: 74, dri: 64, def: 88, phy: 84, sm: 2, wf: 3, club: "Paris SG", nat: "🇧🇷", cat: "MID", eaId: 210044 },
  { id: 200, n: "Richarlison (LW)", s: "Richarlison L", pos: "LW", r: 83, pac: 86, sho: 80, pas: 65, dri: 78, def: 44, phy: 78, sm: 3, wf: 3, club: "Tottenham", nat: "🇧🇷", cat: "FWD", eaId: 218061 },
];

/* ═══════ CONSTANTS ═════════════════════════════════════════════════ */
const PC = { ST: "#f87171", CF: "#f87171", LW: "#fb923c", RW: "#fb923c", LM: "#fb923c", RM: "#fb923c", CAM: "#fbbf24", CM: "#34d399", CDM: "#60a5fa", LB: "#a78bfa", RB: "#a78bfa", CB: "#818cf8", GK: "#f59e0b" };
const CAT_META = {
  M: { label: "MARQUEE", icon: "⭐", color: "#f59e0b", bg: "rgba(245,158,11,.1)" },
  FWD: { label: "FORWARDS", icon: "⚡", color: "#f87171", bg: "rgba(248,113,113,.08)" },
  MID: { label: "MIDFIELDERS", icon: "⚙️", color: "#34d399", bg: "rgba(52,211,153,.08)" },
  DEF: { label: "DEFENDERS", icon: "🛡️", color: "#818cf8", bg: "rgba(129,140,248,.08)" },
  GK: { label: "GOALKEEPERS", icon: "🧤", color: "#22d3ee", bg: "rgba(34,211,238,.08)" },
};
const FORMATIONS = {
  "4-3-3": [{ p: "GK", r: 0 }, { p: "LB", r: 1 }, { p: "CB", r: 1 }, { p: "CB", r: 1 }, { p: "RB", r: 1 }, { p: "CDM", r: 2 }, { p: "CM", r: 2 }, { p: "CM", r: 2 }, { p: "LW", r: 3 }, { p: "ST", r: 3 }, { p: "RW", r: 3 }],
  "4-4-2": [{ p: "GK", r: 0 }, { p: "LB", r: 1 }, { p: "CB", r: 1 }, { p: "CB", r: 1 }, { p: "RB", r: 1 }, { p: "LM", r: 2 }, { p: "CM", r: 2 }, { p: "CM", r: 2 }, { p: "RM", r: 2 }, { p: "ST", r: 3 }, { p: "ST", r: 3 }],
  "4-2-3-1": [{ p: "GK", r: 0 }, { p: "LB", r: 1 }, { p: "CB", r: 1 }, { p: "CB", r: 1 }, { p: "RB", r: 1 }, { p: "CDM", r: 2 }, { p: "CDM", r: 2 }, { p: "LW", r: 3 }, { p: "CAM", r: 3 }, { p: "RW", r: 3 }, { p: "ST", r: 4 }],
  "3-4-3": [{ p: "GK", r: 0 }, { p: "CB", r: 1 }, { p: "CB", r: 1 }, { p: "CB", r: 1 }, { p: "LM", r: 2 }, { p: "CM", r: 2 }, { p: "CM", r: 2 }, { p: "RM", r: 2 }, { p: "LW", r: 3 }, { p: "ST", r: 3 }, { p: "RW", r: 3 }],
  "3-5-2": [{ p: "GK", r: 0 }, { p: "CB", r: 1 }, { p: "CB", r: 1 }, { p: "CB", r: 1 }, { p: "LM", r: 2 }, { p: "CDM", r: 2 }, { p: "CM", r: 2 }, { p: "CM", r: 2 }, { p: "RM", r: 2 }, { p: "ST", r: 3 }, { p: "ST", r: 3 }],
  "5-3-2": [{ p: "GK", r: 0 }, { p: "LB", r: 1 }, { p: "CB", r: 1 }, { p: "CB", r: 1 }, { p: "CB", r: 1 }, { p: "RB", r: 1 }, { p: "CM", r: 2 }, { p: "CM", r: 2 }, { p: "CM", r: 2 }, { p: "ST", r: 3 }, { p: "ST", r: 3 }],
};
const TEAM_COLORS = [["#3b82f6", "#1d4ed8"], ["#8b5cf6", "#6d28d9"], ["#10b981", "#047857"], ["#ef4444", "#b91c1c"], ["#f59e0b", "#b45309"], ["#06b6d4", "#0e7490"], ["#ec4899", "#be185d"], ["#22c55e", "#15803d"]];
const F = "'Barlow Condensed',system-ui,sans-serif";
const REAUCTION_SELECT_SECS = 30;

function cardGrade(r, cat) {
  if (cat === "M") return { a: "#f59e0b", bg: "linear-gradient(155deg,#3d1a00,#120800)", lbl: "MARQUEE", lc: "#000" };
  if (r >= 91) return { a: "#e879f9", bg: "linear-gradient(155deg,#2e0764,#0a0018)", lbl: "ICON", lc: "#fff" };
  if (r >= 89) return { a: "#60a5fa", bg: "linear-gradient(155deg,#172454,#040c20)", lbl: "ELITE", lc: "#fff" };
  if (r >= 87) return { a: "#4ade80", bg: "linear-gradient(155deg,#0e3d1e,#030f07)", lbl: "RARE", lc: "#000" };
  if (r >= 84) return { a: "#fbbf24", bg: "linear-gradient(155deg,#3d2000,#0d0600)", lbl: "GOLD", lc: "#000" };
  return { a: "#a3a3a3", bg: "linear-gradient(155deg,#1a1917,#070707)", lbl: "SILVER", lc: "#000" };
}

function Avatar({ player, size = 80 }) {
  const g = cardGrade(player.r, player.cat);
  const pc = PC[player.pos] || "#9ca3af";
  const init = player.n.split(" ").filter(Boolean).map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const [imgErr, setImgErr] = useState(false);
  const imgUrl = player.eaId && !imgErr ? `https://cdn.sofifa.net/players/${Math.floor(player.eaId / 1000)}/${String(player.eaId % 1000).padStart(3, "0")}/25_120.png` : null;
  const rd = size > 60 ? 14 : size > 36 ? 10 : 8;
  if (imgUrl) {
    return (
      <div style={{ width: size, height: size, borderRadius: rd, overflow: "hidden", background: g.bg, border: `1px solid ${g.a}44`, position: "relative", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 30%,${g.a}22,transparent 70%)`, pointerEvents: "none", zIndex: 1 }} />
        <img src={imgUrl} alt={player.n} onError={() => setImgErr(true)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }} loading="lazy" />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent,rgba(0,0,0,.85))", padding: size > 60 ? "4px 0 2px" : "2px 0 1px", textAlign: "center", zIndex: 2 }}>
          <div style={{ fontFamily: "'Arial Black',sans-serif", fontWeight: 900, fontSize: size > 60 ? 16 : size > 36 ? 10 : 8, color: g.a, lineHeight: 1 }}>{player.r}</div>
          {size > 36 && <div style={{ fontFamily: "Arial,sans-serif", fontWeight: 700, fontSize: size > 60 ? 7 : 5, color: pc, letterSpacing: 1 }}>{player.pos}</div>}
        </div>
      </div>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" style={{ display: "block", flexShrink: 0 }}>
      <defs><radialGradient id={"rg" + player.id} cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor={g.a} stopOpacity="0.3" /><stop offset="100%" stopColor="#050810" stopOpacity="0.9" /></radialGradient></defs>
      <rect width="80" height="80" rx="14" fill={"url(#rg" + player.id + ")"} />
      <rect width="80" height="80" rx="14" fill="none" stroke={g.a} strokeWidth="1.5" strokeOpacity="0.55" />
      <circle cx="40" cy="28" r="17" fill={g.a} fillOpacity="0.12" />
      <text x="40" y="34" textAnchor="middle" fontFamily="'Arial Black',sans-serif" fontWeight="900" fontSize="18" fill={g.a}>{init}</text>
      <rect x="0" y="53" width="80" height="27" rx="0" fill="#000" fillOpacity="0.5" />
      <text x="40" y="68" textAnchor="middle" fontFamily="'Arial Black',sans-serif" fontWeight="900" fontSize="24" fill={g.a}>{player.r}</text>
      <text x="40" y="77" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="8" fill={pc} letterSpacing="2">{player.pos}</text>
    </svg>
  );
}

function analyzeSquad(sq) {
  const gks = sq.filter(p => p.pos === "GK").length;
  const defs = sq.filter(p => ["CB", "LB", "RB"].includes(p.pos)).length;
  const mids = sq.filter(p => ["CDM", "CM", "CAM", "LM", "RM"].includes(p.pos)).length;
  const fwds = sq.filter(p => ["ST", "CF", "LW", "RW"].includes(p.pos)).length;
  const total = sq.length;
  const avgR = total ? Math.round(sq.reduce((s, p) => s + p.r, 0) / total) : 0;
  const str = Math.min(99, Math.round((avgR - 70) * 3.5 + (total / 20) * 15 + (gks ? 6 : 0) + (defs >= 4 ? 10 : defs * 2.5) + (mids >= 3 ? 10 : mids * 3.3) + (fwds >= 2 ? 10 : fwds * 5)));
  return { gks, defs, mids, fwds, total, avgR, str };
}

/* ═══════ REDUCER ═══════════════════════════════════════════════════ */
// phases: lobby | config | setup | role | auction | 
//         ra1_pick | ra1_auction | ra2_pick | ra2_auction | results
const INIT = {
  phase: "lobby",
  room: null,
  cfg: { pts: 100, num: 60, timer: 20, needAuctioneer: true },
  setup: [],
  teams: [],
  queue: [],
  current: null,      // {uid,player,bid,bidderIdx,timerEnd,status}
  skipVotes: [],
  history: [],
  banner: null,
  formation: "4-3-3",
  formSlots: {},
  sqView: 0,
  // Reauction state
  unsoldPool: [],     // players unsold after main auction
  ra1Unsold: [],      // players still unsold after round 1 (input for round 2)
  selVotes: {},       // {playerId: Set of teamIdx} — who voted to reauction this player
  raPhaseLabel: "",   // "ROUND 1 — UNSOLD REAUCTION" | "ROUND 2 — SMALL SQUADS"
};

function mkQueue(cfg) {
  const sh = a => [...a].sort(() => Math.random() - 0.5);
  // ORDER: Marquee → Forwards → Midfielders → Defenders → Goalkeepers
  const marquee = sh(PLAYERS.filter(p => p.cat === "M"));
  const fwd = sh(PLAYERS.filter(p => p.cat === "FWD"));
  const mid = sh(PLAYERS.filter(p => p.cat === "MID"));
  const def = sh(PLAYERS.filter(p => p.cat === "DEF"));
  const gk = sh(PLAYERS.filter(p => p.cat === "GK"));
  const seen = new Set();
  return [...marquee, ...fwd, ...mid, ...def, ...gk]
    .filter(p => { if (seen.has(p.id)) return false; seen.add(p.id); return true; })
    .slice(0, Math.min(cfg.num, 200));
}

function reducer(s, a) {
  switch (a.type) {
    case "SYNC_STATE": return a.state;
    case "JOIN_ROOM": {
      const { uid, name, team } = a;
      if (s.phase === "lobby" || s.phase === "config" || s.phase === "setup") {
        const existing = s.setup.find(t => t.uid === uid);
        if (existing) return { ...s, setup: s.setup.map(t => t.uid === uid ? { ...t, name, team, online: true } : t) };
        return { ...s, setup: [...s.setup, { uid, name, team, online: true }] };
      }
      return { ...s, teams: s.teams.map(t => t.uid === uid ? { ...t, online: true } : t) };
    }
    case "CLIENT_DISCONNECT": {
      if (s.phase === "lobby" || s.phase === "config" || s.phase === "setup") {
        return { ...s, setup: s.setup.map(t => t.uid === a.uid ? { ...t, online: false } : t) };
      }
      return { ...s, teams: s.teams.map(t => t.uid === a.uid ? { ...t, online: false } : t) };
    }
    case "PATCH": return { ...s, ...a.patch };
    case "SET_CFG": return { ...s, cfg: { ...s.cfg, ...a.patch } };
    case "SET_SETUP": return { ...s, setup: a.setup };
    case "SET_BANNER": return { ...s, banner: a.banner };
    case "SET_SQ": return { ...s, sqView: a.idx };
    case "SET_FORM": return { ...s, formation: a.f, formSlots: { ...s.formSlots, [s.sqView]: {} } };
    case "ASSIGN_SLOT": { const t = s.formSlots[s.sqView] || {}; return { ...s, formSlots: { ...s.formSlots, [s.sqView]: { ...t, [a.slot]: a.uid } } }; }
    case "CLEAR_SLOT": { const t = { ...(s.formSlots[s.sqView] || {}) }; delete t[a.slot]; return { ...s, formSlots: { ...s.formSlots, [s.sqView]: t } }; }
    case "RESET": return { ...INIT };

    case "START_AUCTION": {
      const q = mkQueue(a.cfg);
      const [first, ...rest] = q;
      const teams = a.setup.map(t => ({ uid: t.uid, online: t.online, name: t.name || "Player", team: t.team || "Team", budget: a.cfg.pts, squad: [] }));
      return {
        ...s, teams, queue: rest, history: [], skipVotes: [], formSlots: {}, unsoldPool: [], ra1Unsold: [], selVotes: {},
        phase: "auction",
        current: { uid: Date.now(), player: first, bid: 1, bidderIdx: null, timerEnd: Date.now() + a.cfg.timer * 1000, status: "active" }
      };
    }

    case "PLACE_BID": {
      const cur = s.current;
      if (!cur || cur.status !== "active") return s;
      const { teamIdx, amount } = a;
      const team = s.teams[teamIdx];
      if (!team || amount > team.budget) return s;
      if (amount <= (cur.bid || 0) && cur.bidderIdx !== null) return s;
      if (team.squad.length >= 20) return s;
      return { ...s, skipVotes: [], current: { ...cur, bid: amount, bidderIdx: teamIdx, timerEnd: Date.now() + s.cfg.timer * 1000 } };
    }

    case "SELL": {
      const cur = s.current;
      if (!cur || cur.status !== "active") return s;
      const { bidderIdx, bid, player } = cur;
      const teams = bidderIdx != null ? s.teams.map((t, i) => {
        if (i !== bidderIdx) return t;
        return { ...t, budget: t.budget - bid, squad: [...t.squad, { ...player, price: bid, uid: `${player.id}-${Date.now()}-${Math.random()}` }] };
      }) : s.teams;
      const unsoldPool = bidderIdx == null ? [...s.unsoldPool, player] : s.unsoldPool;
      return {
        ...s, teams, unsoldPool, skipVotes: [],
        current: { ...cur, status: "sold" },
        history: [{ player, bidderIdx, price: bid, ts: Date.now() }, ...s.history].slice(0, 120)
      };
    }

    case "SKIP": {
      const cur = s.current;
      if (!cur || cur.status !== "active") return s;
      const unsoldPool = [...s.unsoldPool, cur.player];
      return {
        ...s, unsoldPool, current: { ...cur, status: "skipped" }, skipVotes: [],
        history: [{ player: cur.player, bidderIdx: null, price: 0, skipped: true, ts: Date.now() }, ...s.history].slice(0, 120)
      };
    }

    case "VOTE_SKIP": {
      const cur = s.current;
      if (!cur || cur.status !== "active") return s;
      const already = s.skipVotes.includes(a.teamIdx);
      const votes = already ? s.skipVotes.filter(v => v !== a.teamIdx) : [...s.skipVotes, a.teamIdx];
      if (votes.length >= s.teams.length) {
        const unsoldPool = [...s.unsoldPool, cur.player];
        return {
          ...s, unsoldPool, current: { ...cur, status: "skipped" }, skipVotes: [],
          history: [{ player: cur.player, bidderIdx: null, price: 0, skipped: true, ts: Date.now() }, ...s.history].slice(0, 120)
        };
      }
      return { ...s, skipVotes: votes };
    }

    case "NEXT_PLAYER": {
      if (!s.queue.length) {
        // Main auction done — go to reauction round 1 selection
        if (s.phase === "auction" && s.unsoldPool.length > 0) {
          return { ...s, phase: "ra1_pick", selVotes: {} };
        }
        // End of reauction round 1
        if (s.phase === "ra1_auction") {
          // Collect still-unsold from this round
          const ra1Unsold = [...s.ra1Unsold];
          if (s.current && s.current.status !== "active") {
            if (s.current.bidderIdx == null) ra1Unsold.push(s.current.player);
          }
          // Check if any team has <15 players
          const needsRound2 = s.teams.some(t => t.squad.length < 15) && ra1Unsold.length > 0;
          if (needsRound2) return { ...s, ra1Unsold, phase: "ra2_pick", selVotes: {}, current: null };
          return { ...s, ra1Unsold, phase: "results", current: null };
        }
        // End of reauction round 2
        if (s.phase === "ra2_auction") return { ...s, phase: "results", current: null };
        return { ...s, phase: "results" };
      }
      const [next, ...rest] = s.queue;
      const prevCat = s.current?.player?.cat;
      const showBanner = prevCat && next.cat !== prevCat && prevCat !== "M" && next.cat !== "M";
      if (showBanner) return { ...s, queue: rest, banner: next.cat, current: null, _nextPlayer: next };
      return {
        ...s, queue: rest, banner: null,
        current: { uid: Date.now(), player: next, bid: 1, bidderIdx: null, timerEnd: Date.now() + s.cfg.timer * 1000, status: "active" }
      };
    }

    case "DISMISS_BANNER": {
      const next = s._nextPlayer;
      if (!next) return { ...s, banner: null };
      return {
        ...s, banner: null, _nextPlayer: undefined,
        current: { uid: Date.now(), player: next, bid: 1, bidderIdx: null, timerEnd: Date.now() + s.cfg.timer * 1000, status: "active" }
      };
    }

    // Reauction selection: toggle a player for reauction (any player can vote)
    case "TOGGLE_SEL_VOTE": {
      const { teamIdx, playerId } = a;
      const prev = (s.selVotes[playerId] || []);
      const hasVoted = prev.includes(teamIdx);
      const next = hasVoted ? prev.filter(v => v !== teamIdx) : [...prev, teamIdx];
      return { ...s, selVotes: { ...s.selVotes, [playerId]: next } };
    }

    // After 30s: build reauction queue from selected players (≥1 vote = included)
    // ANY player voted by any team goes to reauction
    case "CONFIRM_RA1_SELECTION": {
      const reaucQueue = s.unsoldPool.filter(p => (s.selVotes[p.id] || []).length > 0);
      const ra1Unsold = s.unsoldPool.filter(p => !(s.selVotes[p.id] || []).length);
      if (!reaucQueue.length) return { ...s, phase: "results", selVotes: {} };
      const [first, ...rest] = reaucQueue;
      return {
        ...s, phase: "ra1_auction", ra1Unsold, queue: rest, selVotes: {},
        raPhaseLabel: "REAUCTION — ROUND 1",
        current: { uid: Date.now(), player: first, bid: 1, bidderIdx: null, timerEnd: Date.now() + s.cfg.timer * 1000, status: "active" }
      };
    }

    case "CONFIRM_RA2_SELECTION": {
      const reaucQueue = s.ra1Unsold.filter(p => (s.selVotes[p.id] || []).length > 0);
      if (!reaucQueue.length) return { ...s, phase: "results", selVotes: {} };
      // Round 2: only teams with <15 players can bid
      const [first, ...rest] = reaucQueue;
      return {
        ...s, phase: "ra2_auction", queue: rest, selVotes: {},
        raPhaseLabel: "REAUCTION — ROUND 2 (SMALL SQUADS)",
        current: { uid: Date.now(), player: first, bid: 1, bidderIdx: null, timerEnd: Date.now() + s.cfg.timer * 1000, status: "active" }
      };
    }

    // Round 2 bid — restricted to teams with <15 players
    case "PLACE_BID_R2": {
      const cur = s.current;
      if (!cur || cur.status !== "active") return s;
      const { teamIdx, amount } = a;
      const team = s.teams[teamIdx];
      if (!team || amount > team.budget) return s;
      if (amount <= (cur.bid || 0) && cur.bidderIdx !== null) return s;
      if (team.squad.length >= 20) return s;
      if (team.squad.length >= 15) return s; // round 2 restriction
      return { ...s, skipVotes: [], current: { ...cur, bid: amount, bidderIdx: teamIdx, timerEnd: Date.now() + s.cfg.timer * 1000 } };
    }

    default: return s;
  }
}

/* ═══════ MAIN APP ═══════════════════════════════════════════════════ */
export default function App() {
  const { state: s, dispatch, peerStatus, initHost, joinRoom, session, dispatchLocal } = useMultiplayer(reducer, INIT);
  const [custom, setCustom] = useState("");
  const [err, setErr] = useState("");
  const [secs, setSecs] = useState(20);
  const [selSecs, setSelSecs] = useState(REAUCTION_SELECT_SECS);
  const [tab, setTab] = useState("bid");
  const [dashSub, setDashSub] = useState("overview");
  const [dragUid, setDragUid] = useState(null);
  const [rAction, setRAction] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [myName, setMyName] = useState("");
  const [myTeamN, setMyTeamN] = useState("");
  const [role, setRole] = useState(null);
  const [hasAutoAssigned, setHasAutoAssigned] = useState(false);

  const intervalRef = useRef(null);
  const selIntervalRef = useRef(null);
  const prevStatusRef = useRef(null);

  const { phase, cfg, setup, teams, current, queue, history, skipVotes, banner, formation, formSlots, sqView, room, unsoldPool, ra1Unsold, selVotes, raPhaseLabel } = s;
  const isAuctioneer = role === "auctioneer";
  const bidderIdx = role && role !== "auctioneer" ? role.bidder : null;
  const noAuc = !cfg.needAuctioneer;
  const activeTi = bidderIdx ?? 0;
  const activeTeam = teams[noAuc ? activeTi : bidderIdx ?? 0];
  const isR2 = phase === "ra2_auction" || phase === "ra2_pick";
  const canBidR2 = isR2 && activeTeam && activeTeam.squad.length < 15;
  const isHost = session.isHost === true;

  // Auto-assign role based on UID if in auction
  useEffect(() => {
    if (phase !== "lobby" && phase !== "config" && phase !== "setup" && !role && !hasAutoAssigned) {
      const myTeamIdx = teams.findIndex(t => t.uid === session.uid);
      if (myTeamIdx !== -1) {
        setRole({ bidder: myTeamIdx });
      }
      setHasAutoAssigned(true);
    }
  }, [phase, role, teams, session.uid, hasAutoAssigned]);

  /* ── Wall-clock timer ── */
  useEffect(() => {
    clearInterval(intervalRef.current);
    if (!current || current.status !== "active") { setSecs(0); return; }
    const tick = () => {
      const rem = Math.max(0, Math.ceil((current.timerEnd - Date.now()) / 1000));
      setSecs(rem);
      if (rem <= 0) { clearInterval(intervalRef.current); dispatch({ type: "SELL" }); }
    };
    tick(); intervalRef.current = setInterval(tick, 250);
    return () => clearInterval(intervalRef.current);
  }, [current?.uid, current?.timerEnd, current?.status]);

  /* ── Selection phase countdown ── */
  useEffect(() => {
    clearInterval(selIntervalRef.current);
    if (phase !== "ra1_pick" && phase !== "ra2_pick") { setSelSecs(REAUCTION_SELECT_SECS); return; }
    setSelSecs(REAUCTION_SELECT_SECS);
    const end = Date.now() + REAUCTION_SELECT_SECS * 1000;
    selIntervalRef.current = setInterval(() => {
      const rem = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      setSelSecs(rem);
      if (rem <= 0) {
        clearInterval(selIntervalRef.current);
        dispatch({ type: phase === "ra1_pick" ? "CONFIRM_RA1_SELECTION" : "CONFIRM_RA2_SELECTION" });
      }
    }, 250);
    return () => clearInterval(selIntervalRef.current);
  }, [phase]);

  /* ── Auto-advance after sold/skipped ── */
  useEffect(() => {
    if (!current) return;
    if (current.status === "active") { prevStatusRef.current = "active"; return; }
    if (prevStatusRef.current !== "active") return;
    prevStatusRef.current = current.status;
    if (!isAuctioneer) {
      const delay = current.status === "sold" ? 2200 : 1200;
      const t = setTimeout(() => dispatch({ type: "NEXT_PLAYER" }), delay);
      return () => clearTimeout(t);
    }
  }, [current?.status]);

  /* ── Banner ── */
  useEffect(() => {
    if (!banner) return;
    const t = setTimeout(() => dispatch({ type: "DISMISS_BANNER" }), 2600);
    return () => clearTimeout(t);
  }, [banner]);

  function flash(m) { setErr(m); setTimeout(() => setErr(""), 2500); }

  function placeBid(amount, r2 = false) {
    if (!current || current.status !== "active") return;
    const ti = noAuc ? activeTi : bidderIdx;
    const t = teams[ti];
    if (!t || amount > t.budget) { flash(`Only ${t?.budget || 0}pt left!`); return; }
    if (amount <= (current.bid || 0) && current.bidderIdx !== null) { flash(`Must beat ${current.bid}pt`); return; }
    if (t.squad.length >= 20) { flash("Squad full!"); return; }
    if (r2 && t.squad.length >= 15) { flash("Only squads under 15 can bid in Round 2!"); return; }
    dispatch({ type: r2 ? "PLACE_BID_R2" : "PLACE_BID", teamIdx: ti, amount });
  }
  function bidInc(i, r2) { placeBid((current?.bid || 0) + i, r2); }
  function bidAll(r2) { placeBid(activeTeam?.budget || 0, r2); }
  function bidCustom(r2) { const v = parseInt(custom); if (!v || v < 1) { flash("Enter a valid amount"); return; } placeBid(v, r2); setCustom(""); }

  const p = current?.player, g = p ? cardGrade(p.r, p.cat) : null;
  const catM = p ? (CAT_META[p.cat] || CAT_META.FWD) : null;
  const tc = current ? Math.max(0, (current.timerEnd - Date.now()) / (cfg.timer * 1000)) : 0;
  const timerCol = secs <= 3 ? "#ef4444" : secs <= 7 ? "#f97316" : "#22c55e";
  const isSold = current?.status === "sold" || current?.status === "skipped";
  const R = 38, C = 2 * Math.PI * R;
  const allRemaining = p ? [p, ...queue] : queue;
  const curSlots = formSlots[sqView] || {};
  const isReauction = phase === "ra1_auction" || phase === "ra2_auction";
  const isPickPhase = phase === "ra1_pick" || phase === "ra2_pick";
  const pickPool = phase === "ra1_pick" ? unsoldPool : ra1Unsold;

  /* ════════════════════════════════════════════════════════
     LOBBY
  ════════════════════════════════════════════════════════ */
  if (phase === "lobby") return (
    <div style={PG}><style>{FONTS + ANIM}</style>
      {peerStatus === "connecting" && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(5,8,16,0.9)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
          <div style={{ width: 40, height: 40, border: "4px solid rgba(245,158,11,.2)", borderTopColor: "#f59e0b", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
          <div style={{ fontFamily: F, color: "#f59e0b", letterSpacing: 3, fontWeight: 800 }}>CONNECTING TO HOST...</div>
        </div>
      )}
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 100% 65% at 50% -5%,#091828,transparent),radial-gradient(ellipse 70% 50% at 95% 110%,#1a0a00,transparent)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", inset: 0, opacity: .02, backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 0H0v60' fill='none' stroke='%23fff' stroke-width='.3'/%3E%3C/svg%3E")`, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "40px 20px", gap: 0 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontFamily: F, fontSize: 11, letterSpacing: 10, color: "#3b82f6", marginBottom: 8 }}>EA SPORTS™ FC 26</div>
          <div style={{ fontFamily: F, fontWeight: 800, fontSize: "clamp(72px,22vw,130px)", lineHeight: .82, letterSpacing: -6, marginBottom: 16 }}>
            <span style={{ color: "#fff" }}>AUC</span><span style={{ color: "#f59e0b" }}>TION</span>
          </div>
          <div style={{ fontFamily: F, fontSize: "clamp(11px,3vw,15px)", letterSpacing: 6, color: "rgba(255,255,255,.25)" }}>200 PLAYERS · OFFICIAL FC 26 RATINGS · 3 AUCTION ROUNDS</div>
        </div>
        {!rAction ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 340 }}>
            {session.roomId && (
              <button onClick={() => {
                if (session.isHost) {
                  supabase.from('rooms').select('state').eq('id', session.roomId).single().then(({ data }) => {
                    if (data && data.state) {
                      dispatchLocal({ type: "SYNC_STATE", state: data.state });
                      initHost(session.roomId);
                    }
                  });
                } else {
                  joinRoom(session.roomId, session.name, session.team);
                }
              }} style={{ ...BTN("linear-gradient(135deg,#10b981,#047857)"), padding: "18px 0", fontSize: 16, letterSpacing: 4, color: "#fff", fontWeight: 800 }}>↺ REJOIN ROOM {session.roomId}</button>
            )}
            <button onClick={() => { clearSession(); setRAction("create"); }} style={{ ...BTN("linear-gradient(135deg,#f59e0b,#d97706)"), padding: "18px 0", fontSize: 16, letterSpacing: 4, color: "#000", fontWeight: 800 }}>＋ CREATE ROOM</button>
            <button onClick={() => { clearSession(); setRAction("join"); }} style={{ ...BTN("rgba(255,255,255,.06)"), padding: "18px 0", fontSize: 16, letterSpacing: 4, border: "1px solid rgba(255,255,255,.12)" }}>⟶ JOIN ROOM</button>
            <div style={{ textAlign: "center", fontSize: 11, color: "#374151", marginTop: 10, fontFamily: F, letterSpacing: 1, lineHeight: 1.8 }}>Marquee → Forwards → Midfielders → Defenders → Keepers<br />Then 2 reauction rounds for unsold players</div>
            
            {adminUser && adminRooms.length > 0 && (
              <div style={{ marginTop: 40, width: "100%" }}>
                <div style={{ color: "#9ca3af", fontSize: 12, letterSpacing: 2, marginBottom: 10, textAlign: "center" }}>YOUR AUCTIONS</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {adminRooms.map(r => (
                    <button key={r.id} onClick={() => {
                       dispatchLocal({ type: "SYNC_STATE", state: r.state });
                       initHost(r.id);
                    }} style={{ ...BTN("rgba(255,255,255,.05)"), display: "flex", justifyContent: "space-between", padding: "12px 16px", border: "1px solid rgba(255,255,255,.1)" }}>
                      <span>{r.state?.room?.name || `Room ${r.id}`}</span>
                      <span style={{ color: "#3b82f6" }}>{r.id}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : rAction === "admin_login" ? (
          <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontFamily: F, fontWeight: 800, fontSize: 22, color: "#fff", letterSpacing: 2 }}>ADMIN LOGIN</div>
            <input value={myName} onChange={e => setMyName(e.target.value)} placeholder="Email" type="email" style={{ ...INP, fontFamily: F, fontSize: 14 }} />
            <input value={myTeamN} onChange={e => setMyTeamN(e.target.value)} placeholder="Password" type="password" style={{ ...INP, fontFamily: F, fontSize: 14 }} />
            <button onClick={async () => {
              if (!myName.trim() || !myTeamN.trim()) { flash("Enter email and password"); return; }
              const { error } = await supabase.auth.signInWithPassword({ email: myName, password: myTeamN });
              if (error) setErr(error.message);
              else { setErr(""); setRAction(null); }
            }} style={{ ...BTN("linear-gradient(135deg,#f59e0b,#d97706)"), padding: "16px", fontSize: 15, letterSpacing: 3, color: "#000", fontWeight: 800 }}>LOGIN →</button>
            {err && <div style={{ color: "#f87171", fontSize: 12, textAlign: "center" }}>{err}</div>}
            <button onClick={() => setRAction(null)} style={BACK}>← Back</button>
          </div>
        ) : rAction === "create" ? (
          <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontFamily: F, fontWeight: 800, fontSize: 22, color: "#fff", letterSpacing: 2 }}>CREATE ROOM</div>
            <div style={{ fontSize: 12, color: "#6b7280", padding: "10px 14px", background: "rgba(255,255,255,.03)", borderRadius: 12, border: "1px solid rgba(255,255,255,.06)", lineHeight: 1.8 }}>You'll get a <b style={{ color: "#f59e0b" }}>6-letter code</b>. Share it — friends join from their own device.</div>
            <input value={roomName} onChange={e => setRoomName(e.target.value)} placeholder="Room name (e.g. Friday Night Draft)" style={{ ...INP, fontFamily: F, fontSize: 14 }} />
            <input value={myName} onChange={e => setMyName(e.target.value)} placeholder="Your name" style={{ ...INP, fontFamily: F, fontSize: 14 }} />
            <input value={myTeamN} onChange={e => setMyTeamN(e.target.value)} placeholder="Your team name" style={{ ...INP, fontFamily: F, fontSize: 14 }} />
            <button onClick={() => {
              if (!roomName.trim() || !myName.trim() || !myTeamN.trim()) { flash("Fill all fields"); return; }
              const code = Math.random().toString(36).substring(2, 8).toUpperCase();
              dispatch({ type: "PATCH", patch: { room: { id: code, name: roomName } } });
              dispatch({ type: "SET_SETUP", setup: [{ uid: session.uid, name: myName, team: myTeamN, online: true }] });
              dispatch({ type: "PATCH", patch: { phase: "config" } });
              initHost(code);
            }} style={{ ...BTN("linear-gradient(135deg,#f59e0b,#d97706)"), padding: "16px", fontSize: 15, letterSpacing: 3, color: "#000", fontWeight: 800 }}>CREATE →</button>
            {err && <div style={{ color: "#f87171", fontSize: 12, textAlign: "center" }}>{err}</div>}
            <button onClick={() => setRAction(null)} style={BACK}>← Back</button>
          </div>
        ) : (
          <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontFamily: F, fontWeight: 800, fontSize: 22, color: "#fff", letterSpacing: 2 }}>JOIN ROOM</div>
            <input value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase().slice(0, 6))} placeholder="ROOM CODE" style={{ ...INP, fontFamily: "'Courier New',monospace", fontSize: 26, textAlign: "center", letterSpacing: 8, padding: "14px" }} />
            <input value={myName} onChange={e => setMyName(e.target.value)} placeholder="Your name" style={{ ...INP, fontFamily: F, fontSize: 14 }} />
            <input value={myTeamN} onChange={e => setMyTeamN(e.target.value)} placeholder="Your team name" style={{ ...INP, fontFamily: F, fontSize: 14 }} />
            <button onClick={() => {
              if (!joinCode || joinCode.length < 4) { flash("Enter the room code"); return; }
              if (!myName.trim() || !myTeamN.trim()) { flash("Enter name and team"); return; }
              // Wait for joinRoom to succeed; the SYNC_STATE will drop us into the right phase naturally
              joinRoom(joinCode, myName, myTeamN);
            }} style={{ ...BTN("linear-gradient(135deg,#3b82f6,#1d4ed8)"), padding: "16px", fontSize: 15, letterSpacing: 3 }}>JOIN →</button>
            {err && <div style={{ color: "#f87171", fontSize: 12, textAlign: "center" }}>{err}</div>}
            <button onClick={() => setRAction(null)} style={BACK}>← Back</button>
          </div>
        )}
      </div>
    </div>
  );

  /* ════════════════════════════════════════════════════════
     CONFIG & SETUP (CLIENT WAITING LOBBY)
  ════════════════════════════════════════════════════════ */
  if (!isHost && (phase === "config" || phase === "setup")) return (
    <div style={PG}><style>{FONTS + ANIM}</style>
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "40px 16px", display: "flex", flexDirection: "column", gap: 18, textAlign: "center" }}>
        <div style={{ width: 40, height: 40, border: "4px solid rgba(245,158,11,.2)", borderTopColor: "#f59e0b", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 10px" }}></div>
        <div style={{ fontFamily: F, fontWeight: 800, fontSize: 24, letterSpacing: 2, color: "#fff" }}>WAITING FOR HOST</div>
        <div style={{ fontSize: 13, color: "#6b7280" }}>The host is configuring the auction and setting up teams...</div>
        
        <div style={{ marginTop: 30, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 16, padding: "16px" }}>
          <div style={{ fontFamily: F, fontSize: 11, color: "#9ca3af", letterSpacing: 3, marginBottom: 12 }}>PLAYERS IN LOBBY ({setup.length})</div>
          {setup.map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px", borderBottom: i === setup.length - 1 ? "none" : "1px solid rgba(255,255,255,.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: 99, background: t.online ? "#10b981" : "#4b5563", boxShadow: t.online ? "0 0 8px #10b981" : "none" }}></div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontFamily: F, fontWeight: 700, fontSize: 15, color: "#fff" }}>{t.team}</div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>{t.name} {t.uid === session.uid ? "(You)" : ""}</div>
                </div>
              </div>
              <div style={{ fontSize: 10, color: t.online ? "#10b981" : "#4b5563", fontFamily: F, letterSpacing: 1 }}>{t.online ? "ONLINE" : "OFFLINE"}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ════════════════════════════════════════════════════════
     CONFIG (HOST)
  ════════════════════════════════════════════════════════ */
  if (phase === "config") return (
    <div style={PG}><style>{FONTS + ANIM}</style>
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "28px 16px 60px", display: "flex", flexDirection: "column", gap: 18 }}>
        {room && (
          <div style={{ padding: "12px 16px", background: "rgba(245,158,11,.07)", border: "1px solid rgba(245,158,11,.22)", borderRadius: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><div style={{ fontSize: 9, color: "#f59e0b", fontFamily: F, letterSpacing: 3 }}>SHARE CODE WITH FRIENDS</div><div style={{ fontFamily: "'Courier New',monospace", fontSize: 30, fontWeight: 900, color: "#fff", letterSpacing: 9, marginTop: 4 }}>{room.id}</div></div>
            <button onClick={() => navigator.clipboard?.writeText(room.id)} style={{ padding: "8px 14px", borderRadius: 10, background: "rgba(245,158,11,.12)", border: "1px solid rgba(245,158,11,.28)", color: "#f59e0b", fontFamily: F, fontSize: 12, cursor: "pointer", letterSpacing: 1 }}>COPY</button>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => dispatch({ type: "PATCH", patch: { phase: "lobby" } })} style={BACK}>← Back</button>
          <div style={{ fontFamily: F, fontWeight: 800, fontSize: 24, letterSpacing: 2, color: "#fff" }}>AUCTION CONFIG</div>
        </div>
        <CBlock title="💰 STARTING POINTS PER TEAM">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 8 }}>
            {[100, 150, 200, 250].map(v => <CBtn key={v} active={cfg.pts === v} onClick={() => dispatch({ type: "SET_CFG", patch: { pts: v } })}>{v}</CBtn>)}
          </div>
          <input value={cfg.pts} onChange={e => dispatch({ type: "SET_CFG", patch: { pts: Math.max(50, +e.target.value || 100) } })} type="number" placeholder="Custom…" style={{ ...INP, fontFamily: F, fontSize: 16, textAlign: "center" }} />
        </CBlock>
        <CBlock title="📋 PLAYERS TO AUCTION">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 8 }}>
            {[30, 60, 100, 200].map(v => <CBtn key={v} active={cfg.num === v} col="#3b82f6" onClick={() => dispatch({ type: "SET_CFG", patch: { num: v } })}>{v}</CBtn>)}
          </div>
          <input value={cfg.num} onChange={e => dispatch({ type: "SET_CFG", patch: { num: Math.min(200, Math.max(10, +e.target.value || 60)) } })} type="number" placeholder="Custom (max 200)…" style={{ ...INP, fontFamily: F, fontSize: 16, textAlign: "center" }} />
        </CBlock>
        <CBlock title="⏱️ BID TIMER — auto-sells at 0">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 8 }}>
            {[10, 15, 20, 30].map(v => <CBtn key={v} active={cfg.timer === v} col="#10b981" onClick={() => dispatch({ type: "SET_CFG", patch: { timer: v } })}>{v}s</CBtn>)}
          </div>
          <div style={{ fontSize: 11, color: "#6b7280", padding: "8px 12px", background: "rgba(16,185,129,.05)", borderRadius: 10, border: "1px solid rgba(16,185,129,.15)" }}>⏰ Timer hits 0 → <b style={{ color: "#4ade80" }}>highest bidder wins automatically</b></div>
        </CBlock>
        <CBlock title="🎙️ AUCTIONEER">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <button onClick={() => dispatch({ type: "SET_CFG", patch: { needAuctioneer: true } })} style={{ padding: "14px", borderRadius: 14, background: cfg.needAuctioneer ? "linear-gradient(135deg,#f59e0b,#d97706)" : "rgba(255,255,255,.05)", border: `1px solid ${cfg.needAuctioneer ? "#f59e0b44" : "rgba(255,255,255,.1)"}`, color: cfg.needAuctioneer ? "#000" : "#6b7280", fontFamily: F, fontWeight: 700, fontSize: 13, cursor: "pointer", textAlign: "center", letterSpacing: 1 }}>🎙️ YES<br /><span style={{ fontSize: 10, fontWeight: 400 }}>One person controls</span></button>
            <button onClick={() => dispatch({ type: "SET_CFG", patch: { needAuctioneer: false } })} style={{ padding: "14px", borderRadius: 14, background: !cfg.needAuctioneer ? "linear-gradient(135deg,#3b82f6,#1d4ed8)" : "rgba(255,255,255,.05)", border: `1px solid ${!cfg.needAuctioneer ? "#3b82f644" : "rgba(255,255,255,.1)"}`, color: !cfg.needAuctioneer ? "#fff" : "#6b7280", fontFamily: F, fontWeight: 700, fontSize: 13, cursor: "pointer", textAlign: "center", letterSpacing: 1 }}>🤖 AUTO<br /><span style={{ fontSize: 10, fontWeight: 400 }}>Timer handles it</span></button>
          </div>
        </CBlock>
        <div style={{ fontSize: 12, color: "#6b7280", padding: "10px 14px", background: "rgba(59,130,246,.05)", borderRadius: 12, border: "1px solid rgba(59,130,246,.15)", lineHeight: 1.8 }}>
          📋 <b style={{ color: "#60a5fa" }}>Auction order:</b> Marquee → Forwards → Midfielders → Defenders → Goalkeepers<br />
          🔄 After main auction: <b style={{ color: "#f59e0b" }}>30s selection window</b> to vote unsold players for Round 1 reauction<br />
          🔄 Round 2 reauction for teams with <b style={{ color: "#ef4444" }}>under 15 players</b>
        </div>
        <div style={{ display: "flex", justifyContent: "space-around", padding: "12px 16px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14 }}>
          {[[`${cfg.pts}pt`, "PER TEAM"], [`${cfg.num}`, "PLAYERS"], [`${cfg.timer}s`, "TIMER"], [cfg.needAuctioneer ? "YES" : "AUTO", "AUCTIONEER"]].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}><div style={{ fontFamily: F, fontWeight: 800, fontSize: 18, color: "#fff" }}>{v}</div><div style={{ fontSize: 9, color: "#6b7280", letterSpacing: 2, marginTop: 2 }}>{l}</div></div>
          ))}
        </div>
        <button onClick={() => dispatch({ type: "PATCH", patch: { phase: "setup" } })} style={{ ...BTN("linear-gradient(135deg,#f59e0b,#d97706)"), padding: "15px", fontSize: 15, letterSpacing: 3, color: "#000", fontWeight: 800 }}>SET UP TEAMS →</button>
      </div>
    </div>
  );

  /* ════════════════════════════════════════════════════════
     SETUP
  ════════════════════════════════════════════════════════ */
  if (phase === "setup") return (
    <div style={PG}><style>{FONTS + ANIM}</style>
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "24px 16px 60px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 8 }}>
          <button onClick={() => dispatch({ type: "PATCH", patch: { phase: "config" } })} style={BACK}>← Back</button>
          <div style={{ fontFamily: F, fontWeight: 800, fontSize: 24, letterSpacing: 2, color: "#fff" }}>TEAMS</div>
          <div style={{ marginLeft: "auto", fontFamily: F, fontSize: 13, color: "#f59e0b" }}>{cfg.pts}pt · {cfg.num}p</div>
        </div>
        {setup.map((t, i) => (
          <div key={i} style={{ display: "flex", gap: 7, alignItems: "center", padding: "10px 12px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 13 }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg,${TEAM_COLORS[i % 8][0]},${TEAM_COLORS[i % 8][1]})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontSize: 13, fontWeight: 800, color: "#fff", flexShrink: 0 }}>{i + 1}</div>
              <div style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, borderRadius: 99, background: t.online ? "#10b981" : "#4b5563", border: "2px solid #050810" }}></div>
            </div>
            <input value={t.name} onChange={e => dispatch({ type: "SET_SETUP", setup: setup.map((x, j) => j === i ? { ...x, name: e.target.value } : x) })} placeholder="Player name" style={INP} />
            <input value={t.team} onChange={e => dispatch({ type: "SET_SETUP", setup: setup.map((x, j) => j === i ? { ...x, team: e.target.value } : x) })} placeholder="Team name" style={INP} />
            {setup.length > 1 && <button onClick={() => dispatch({ type: "SET_SETUP", setup: setup.filter((_, j) => j !== i) })} style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: 20, flexShrink: 0, lineHeight: 1, padding: "0 4px" }}>×</button>}
          </div>
        ))}
        {setup.length < 8 && <button onClick={() => dispatch({ type: "SET_SETUP", setup: [...setup, { name: `Player ${setup.length + 1}`, team: `Team ${setup.length + 1}` }] })} style={{ padding: "10px", borderRadius: 12, background: "transparent", border: "1px dashed rgba(255,255,255,.12)", color: "#6b7280", fontSize: 13, cursor: "pointer", fontFamily: F, letterSpacing: 1 }}>+ ADD TEAM ({setup.length}/8)</button>}
        <button onClick={() => dispatch({ type: "START_AUCTION", setup, cfg })} style={{ ...BTN("linear-gradient(135deg,#10b981,#047857)"), padding: "16px", fontSize: 15, letterSpacing: 3, marginTop: 4 }}>⚽ KICK OFF AUCTION</button>
      </div>
    </div>
  );



  /* ════════════════════════════════════════════════════════
     BANNER
  ════════════════════════════════════════════════════════ */
  if (banner) {
    const m = CAT_META[banner] || CAT_META.FWD;
    return (
      <div style={{ ...PG, alignItems: "center", justifyContent: "center", background: `radial-gradient(ellipse at center,${m.color}20,#050810 65%)` }}>
        <style>{FONTS + ANIM}</style>
        <div style={{ textAlign: "center", animation: "bannerIn .5s cubic-bezier(0.34,1.56,0.64,1)" }}>
          <div style={{ fontSize: 80, filter: `drop-shadow(0 0 40px ${m.color}99)`, marginBottom: 16 }}>{m.icon}</div>
          <div style={{ fontFamily: F, fontWeight: 800, fontSize: "clamp(36px,12vw,72px)", color: m.color, letterSpacing: 5 }}>{m.label}</div>
          <div style={{ fontFamily: F, fontSize: 13, color: "rgba(255,255,255,.3)", marginTop: 10, letterSpacing: 6 }}>SET BEGINS</div>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════
     REAUCTION SELECTION PHASE
  ════════════════════════════════════════════════════════ */
  if (isPickPhase) {
    const selTimerPct = selSecs / REAUCTION_SELECT_SECS;
    const selCol = selSecs <= 5 ? "#ef4444" : selSecs <= 12 ? "#f97316" : "#22c55e";
    const label = phase === "ra1_pick" ? "ROUND 1 REAUCTION — VOTE PLAYERS" : "ROUND 2 REAUCTION — SMALL SQUADS ONLY";
    const sub = phase === "ra1_pick"
      ? `${pickPool.length} unsold players — vote which ones to re-auction. Any player with at least 1 vote goes back up.`
      : `${pickPool.length} still unsold. Only teams with under 15 players may bid in this round.`;
    return (
      <div style={PG}><style>{FONTS + ANIM}</style>
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 16px 80px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Header + timer */}
          <div style={{ padding: "16px 18px", background: "rgba(245,158,11,.08)", border: "1px solid rgba(245,158,11,.25)", borderRadius: 18, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <svg width={R * 2 + 14} height={R * 2 + 14} style={{ transform: "rotate(-90deg)" }}>
                <circle cx={R + 7} cy={R + 7} r={R} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="5" />
                <circle cx={R + 7} cy={R + 7} r={R} fill="none" stroke={selCol} strokeWidth="5" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - selTimerPct)} style={{ transition: "stroke-dashoffset .25s linear,stroke .4s" }} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: F, fontWeight: 800, fontSize: 22, color: selCol, lineHeight: 1 }}>{selSecs}</span>
              </div>
            </div>
            <div>
              <div style={{ fontFamily: F, fontWeight: 800, fontSize: 18, color: "#f59e0b", letterSpacing: 1 }}>🔄 {label}</div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4, lineHeight: 1.6 }}>{sub}</div>
            </div>
          </div>

          {/* Team squad sizes */}
          {phase === "ra2_pick" && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {teams.map((t, i) => (
                <div key={i} style={{ padding: "6px 12px", borderRadius: 99, background: t.squad.length < 15 ? "rgba(239,68,68,.12)" : "rgba(34,197,94,.08)", border: `1px solid ${t.squad.length < 15 ? "rgba(239,68,68,.35)" : "rgba(34,197,94,.25)"}`, fontFamily: F, fontSize: 11, color: t.squad.length < 15 ? "#f87171" : "#4ade80", letterSpacing: 1 }}>
                  {t.team}: {t.squad.length}/15 {t.squad.length < 15 ? "✓ CAN BID" : ""}
                </div>
              ))}
            </div>
          )}

          {/* Player pool to vote on */}
          <div style={{ fontFamily: F, fontSize: 10, letterSpacing: 3, color: "#6b7280", marginBottom: 4 }}>
            {pickPool.length} UNSOLD PLAYERS — TAP TO VOTE FOR REAUCTION
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {pickPool.map(pl => {
              const g2 = cardGrade(pl.r, pl.cat);
              const votes = selVotes[pl.id] || [];
              const myVoted = votes.includes(activeTi) || votes.includes(bidderIdx);
              const voteCount = votes.length;
              const m = CAT_META[pl.cat] || CAT_META.FWD;
              return (
                <button key={pl.id} onClick={() => dispatch({ type: "TOGGLE_SEL_VOTE", teamIdx: noAuc ? activeTi : (bidderIdx ?? activeTi), playerId: pl.id })}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: myVoted ? "rgba(34,197,94,.08)" : "rgba(255,255,255,.03)", border: `1px solid ${myVoted ? "rgba(34,197,94,.35)" : "rgba(255,255,255,.07)"}`, borderRadius: 14, cursor: "pointer", textAlign: "left", width: "100%", transition: "all .15s" }}>
                  <Avatar player={pl} size={50} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, color: "#fff", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{pl.n}</div>
                    <div style={{ fontSize: 10, color: "#6b7280", marginTop: 2 }}>{pl.club} · {pl.nat} · <span style={{ color: g2.a }}>OVR {pl.r}</span> · <span style={{ color: m.color }}>{m.icon} {m.label}</span></div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontFamily: F, fontWeight: 800, fontSize: 18, color: voteCount > 0 ? "#f59e0b" : "#374151" }}>{voteCount}</div>
                    <div style={{ fontSize: 9, color: "#4b5563", letterSpacing: 1 }}>{voteCount === 1 ? "VOTE" : "VOTES"}</div>
                    {myVoted && <div style={{ fontSize: 9, color: "#4ade80", marginTop: 2 }}>✓ YOUR VOTE</div>}
                  </div>
                </button>
              );
            })}
            {!pickPool.length && <div style={{ textAlign: "center", color: "#374151", fontSize: 14, padding: "40px 0", fontFamily: F, letterSpacing: 2 }}>NO UNSOLD PLAYERS</div>}
          </div>

          {/* Manual confirm */}
          <button onClick={() => dispatch({ type: phase === "ra1_pick" ? "CONFIRM_RA1_SELECTION" : "CONFIRM_RA2_SELECTION" })}
            style={{ ...BTN("linear-gradient(135deg,#10b981,#047857)"), padding: "15px", fontSize: 15, letterSpacing: 3, marginTop: 8 }}>
            START REAUCTION ({(pickPool.filter(p => (selVotes[p.id] || []).length > 0)).length} selected)
          </button>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════
     RESULTS — squads sorted by club
  ════════════════════════════════════════════════════════ */
  if (phase === "results") return (
    <div style={PG}><style>{FONTS + ANIM}</style>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px 60px", display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ textAlign: "center", paddingBottom: 12 }}>
          <div style={{ fontSize: 60, filter: "drop-shadow(0 0 30px #f59e0b)" }}>🏆</div>
          <div style={{ fontFamily: F, fontWeight: 800, fontSize: 40, color: "#f59e0b", letterSpacing: 3 }}>DRAFT COMPLETE</div>
          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 6 }}>{history.filter(h => h.bidderIdx != null).length} sold · {history.filter(h => h.bidderIdx == null).length} unsold · {history.reduce((s, h) => s + h.price, 0)}pt spent</div>
        </div>
        {[...teams].sort((a, b) => b.squad.reduce((s, p) => s + p.r, 0) - a.squad.reduce((s, p) => s + p.r, 0)).map((t, i) => {
          const an = analyzeSquad(t.squad);
          // Sort squad by club name so same-club players are grouped together
          const squadByClub = [...t.squad].sort((a, b) => a.club.localeCompare(b.club) || b.r - a.r);
          // Group by club for visual transfer view
          const clubs = {};
          squadByClub.forEach(pl => { if (!clubs[pl.club]) clubs[pl.club] = []; clubs[pl.club].push(pl); });
          return (
            <div key={i} style={{ background: "rgba(255,255,255,.03)", border: `1px solid ${i === 0 ? "rgba(245,158,11,.3)" : "rgba(255,255,255,.07)"}`, borderRadius: 20, overflow: "hidden", animation: `slideUp ${.1 + i * .08}s ease` }}>
              <div style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", background: i === 0 ? "rgba(245,158,11,.05)" : "transparent" }}>
                <div>
                  {i === 0 && <div style={{ fontFamily: F, fontSize: 9, color: "#f59e0b", letterSpacing: 3, marginBottom: 3 }}>🏆 WINNER</div>}
                  <div style={{ fontFamily: F, fontWeight: 800, fontSize: 18, color: "#fff" }}>{t.team}</div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>{t.name} · avg {an.avgR} · OVR <span style={{ color: an.str > 70 ? "#22c55e" : an.str > 50 ? "#f59e0b" : "#ef4444" }}>{an.str}</span></div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: F, fontWeight: 800, fontSize: 24, color: "#f59e0b" }}>{t.budget}<span style={{ fontSize: 12, color: "#6b7280", fontWeight: 400 }}>pt</span></div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>{t.squad.length} players</div>
                </div>
              </div>
              {/* Club-grouped squad — great for transfer discussions */}
              <div style={{ padding: "10px 14px 14px" }}>
                <div style={{ fontSize: 9, color: "#4b5563", fontFamily: F, letterSpacing: 2, marginBottom: 8 }}>SQUAD BY CLUB</div>
                {Object.entries(clubs).sort(([a], [b]) => a.localeCompare(b)).map(([club, pls]) => (
                  <div key={club} style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 10, color: "#6b7280", fontFamily: F, letterSpacing: 1, marginBottom: 4, paddingLeft: 4 }}>📍 {club} ({pls.length})</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {pls.map((pl, pi) => {
                        const g2 = cardGrade(pl.r, pl.cat);
                        return (
                          <div key={pi} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 10, background: `${PC[pl.pos] || "#6b7280"}12`, border: `1px solid ${PC[pl.pos] || "#6b7280"}28`, fontSize: 11 }}>
                            <Avatar player={pl} size={28} />
                            <div>
                              <div style={{ color: g2.a, fontFamily: F, fontSize: 9, lineHeight: 1 }}>{pl.pos} OVR {pl.r}</div>
                              <div style={{ color: "#e5e7eb", fontSize: 11, fontWeight: 600 }}>{pl.s}</div>
                              <div style={{ color: "#f59e0b", fontFamily: F, fontSize: 9 }}>{pl.price}pt</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {!t.squad.length && <span style={{ color: "#374151", fontSize: 12 }}>No players bought</span>}
              </div>
            </div>
          );
        })}
        <button onClick={() => dispatch({ type: "RESET" })} style={{ ...BTN("linear-gradient(135deg,#3b82f6,#7c3aed)"), padding: "14px", fontSize: 14, letterSpacing: 3 }}>NEW AUCTION</button>
      </div>
    </div>
  );

  /* ════════════════════════════════════════════════════════
     AUCTION ROOM (main + reauction rounds)
  ════════════════════════════════════════════════════════ */
  if (!role) return (
    <div style={{ ...PG, alignItems: "center", justifyContent: "center" }}><style>{FONTS + ANIM}</style>
      <div style={{ maxWidth: 460, width: "100%", padding: "28px 20px", display: "flex", flexDirection: "column", gap: 16, animation: "cardIn .4s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 4 }}>
          <div style={{ fontFamily: F, fontWeight: 800, fontSize: 28, color: "#fff", letterSpacing: 2 }}>WHO ARE YOU?</div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>Each person picks their role on their device</div>
        </div>
        {cfg.needAuctioneer && <button onClick={() => { setRole("auctioneer"); setTab("bid"); }} style={{ background: "rgba(245,158,11,.06)", border: "2px solid rgba(245,158,11,.35)", borderRadius: 20, padding: "18px 20px", cursor: "pointer", textAlign: "left", width: "100%", display: "block" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,#f59e0b,#d97706)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🎙️</div>
            <div><div style={{ fontFamily: F, fontWeight: 800, fontSize: 20, color: "#f59e0b", letterSpacing: 1 }}>AUCTIONEER</div><div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2, lineHeight: 1.6 }}>Controls auction. <b style={{ color: "#fff" }}>Does not bid.</b> Timer auto-sells.</div></div>
          </div>
        </button>}
        <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 20, padding: "14px" }}>
          <div style={{ fontFamily: F, fontSize: 11, color: "#22d3ee", letterSpacing: 2, marginBottom: 10 }}>💰 BIDDER — SELECT YOUR TEAM</div>
          {teams.map((t, i) => (
            <button key={i} onClick={() => { setRole({ bidder: i }); setTab("bid"); }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 13px", borderRadius: 12, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", cursor: "pointer", width: "100%", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg,${TEAM_COLORS[i % 8][0]},${TEAM_COLORS[i % 8][1]})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontSize: 12, fontWeight: 800, color: "#fff" }}>{i + 1}</div>
                <div><div style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: "#fff" }}>{t.team}</div><div style={{ fontSize: 10, color: "#6b7280" }}>{t.name} {t.uid === session.uid ? "(You)" : ""}</div></div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {t.online && <div style={{ width: 8, height: 8, borderRadius: 99, background: "#10b981", boxShadow: "0 0 8px #10b981" }} />}
                <div style={{ fontFamily: F, fontSize: 16, color: "#f59e0b" }}>{t.budget}<span style={{ fontSize: 10, color: "#6b7280" }}>pt</span></div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ ...PG, height: "100dvh", overflow: "hidden" }}>
      <style>{FONTS + ANIM + `.bb:hover{filter:brightness(1.15);transform:translateY(-2px)}.bb:active{transform:scale(.96)}.ti:focus{outline:none;border-color:#3b82f6!important;box-shadow:0 0 0 3px rgba(59,130,246,.1)}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#2d3748;border-radius:99px}input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}`}</style>

      {/* TOP BAR */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px", borderBottom: "1px solid rgba(255,255,255,.06)", flexShrink: 0, gap: 8, flexWrap: "wrap", background: "rgba(5,7,14,.97)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontFamily: F, fontWeight: 800, fontSize: 18, letterSpacing: 1 }}><span style={{ color: "#fff" }}>FC</span><span style={{ color: "#f59e0b" }}>26</span></div>
          {isReauction && <div style={{ padding: "3px 10px", borderRadius: 99, background: "rgba(59,130,246,.12)", border: "1px solid rgba(59,130,246,.3)", fontFamily: F, fontSize: 10, color: "#60a5fa", letterSpacing: 2 }}>🔄 {raPhaseLabel}</div>}
          {!isReauction && catM && <div style={{ padding: "3px 10px", borderRadius: 99, background: catM.bg, border: `1px solid ${catM.color}33`, fontFamily: F, fontSize: 10, color: catM.color, letterSpacing: 2 }}>{catM.icon} {catM.label}</div>}
          {role && <div style={{ padding: "3px 10px", borderRadius: 99, background: isAuctioneer ? "rgba(245,158,11,.1)" : "rgba(34,211,238,.08)", border: `1px solid ${isAuctioneer ? "rgba(245,158,11,.25)" : "rgba(34,211,238,.18)"}`, fontFamily: F, fontSize: 10, color: isAuctioneer ? "#f59e0b" : "#22d3ee", letterSpacing: 1 }}>{isAuctioneer ? "🎙️ AUCTIONEER" : `💰 ${teams[bidderIdx]?.team}`}</div>}
          {isR2 && activeTeam && <div style={{ padding: "3px 10px", borderRadius: 99, background: canBidR2 ? "rgba(34,197,94,.1)" : "rgba(239,68,68,.1)", border: `1px solid ${canBidR2 ? "rgba(34,197,94,.3)" : "rgba(239,68,68,.3)"}`, fontFamily: F, fontSize: 10, color: canBidR2 ? "#4ade80" : "#f87171", letterSpacing: 1 }}>{canBidR2 ? "✓ ELIGIBLE" : "✗ NOT ELIGIBLE"}</div>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {noAuc && <select value={activeTi} onChange={e => dispatch({ type: "SET_ROLE", role: { bidder: +e.target.value } })} style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.14)", borderRadius: 10, color: "#fff", padding: "5px 10px", fontSize: 11, cursor: "pointer", fontFamily: F }}>
            {teams.map((t, i) => <option key={i} value={i} style={{ background: "#0f1117" }}>{t.team} — {t.budget}pt · {t.squad.length}p</option>)}
          </select>}
          {activeTeam && <div style={{ fontFamily: F, fontSize: 14, color: "#f59e0b" }}>{activeTeam.budget}<span style={{ fontSize: 10, color: "#6b7280" }}>pt</span></div>}
          <div style={{ fontSize: 10, color: "#374151", fontFamily: F }}>{queue.length + 1} left</div>
          <button onClick={() => setRole(null)} style={{ ...BACK, fontSize: 10, padding: "4px 10px" }}>SWITCH ROLE</button>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,.06)", flexShrink: 0, background: "rgba(5,7,14,.9)" }}>
        {[["bid", "⚡ BID"], ["list", "📋 LIST"], ["dash", "📊 DASH"], ["squads", "👥 SQUADS"]].map(([k, lb]) => (
          <button key={k} onClick={() => setTab(k)} style={{ flex: 1, padding: "10px 0", background: "none", border: "none", fontFamily: F, fontWeight: 600, fontSize: 11, letterSpacing: 2, color: tab === k ? "#f59e0b" : "#4b5563", borderBottom: tab === k ? "2px solid #f59e0b" : "2px solid transparent", cursor: "pointer", transition: "all .2s" }}>{lb}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: "hidden", display: "flex", minHeight: 0 }}>

        {/* BID TAB */}
        {tab === "bid" && (
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 100px" }}>
            <div style={{ maxWidth: 440, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
              {isR2 && !canBidR2 && (bidderIdx != null || noAuc) && !isAuctioneer && (
                <div style={{ padding: "14px 16px", background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.25)", borderRadius: 14, textAlign: "center" }}>
                  <div style={{ fontFamily: F, fontWeight: 700, fontSize: 16, color: "#f87171", letterSpacing: 1 }}>⛔ NOT ELIGIBLE FOR ROUND 2</div>
                  <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>Your squad has {activeTeam?.squad?.length} players (need under 15 to bid)</div>
                </div>
              )}
              {p && g && (<>
                {/* FC26 CARD */}
                <div key={p.id + (current?.uid || 0)} style={{ borderRadius: 24, overflow: "hidden", background: g.bg, border: `1px solid ${g.a}33`, boxShadow: `0 12px 60px ${g.a}12,0 0 0 1px rgba(255,255,255,.04)`, animation: "cardIn .45s cubic-bezier(0.34,1.2,0.64,1)", position: "relative" }}>
                  <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 70% -10%,${g.a}15,transparent 55%)`, pointerEvents: "none" }} />
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${g.a}66,transparent)` }} />
                  {isReauction && <div style={{ position: "absolute", top: 10, right: 10, padding: "4px 10px", borderRadius: 99, background: "rgba(59,130,246,.2)", border: "1px solid rgba(59,130,246,.4)", fontFamily: F, fontSize: 9, color: "#60a5fa", letterSpacing: 2 }}>🔄 REAUCTION</div>}
                  <div style={{ position: "relative", display: "flex", minHeight: 210 }}>
                    <div style={{ width: 70, flexShrink: 0, background: "rgba(0,0,0,.3)", borderRight: `1px solid ${g.a}18`, display: "flex", flexDirection: "column", alignItems: "center", padding: "18px 0 12px", gap: 4 }}>
                      <div style={{ fontFamily: F, fontWeight: 800, fontSize: 38, color: g.a, lineHeight: 1 }}>{p.r}</div>
                      <div style={{ fontFamily: F, fontSize: 12, color: g.a, letterSpacing: 2, marginBottom: 8 }}>{p.pos}</div>
                      {[["PAC", p.pac], ["SHO", p.sho], ["PAS", p.pas], ["DRI", p.dri], ["DEF", p.def], ["PHY", p.phy]].map(([k, v]) => (
                        <div key={k} style={{ textAlign: "center", width: "100%", padding: "2px 0" }}>
                          <div style={{ fontFamily: F, fontWeight: 700, fontSize: 15, color: v >= 85 ? "#4ade80" : v >= 70 ? "#fbbf24" : "#f87171", lineHeight: 1 }}>{v}</div>
                          <div style={{ fontSize: 7, color: "#4b5563", letterSpacing: .5 }}>{k}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "18px 14px 10px", background: "rgba(0,0,0,.18)" }}><Avatar player={p} size={110} /></div>
                      <div style={{ padding: "12px 16px 14px", background: "rgba(0,0,0,.32)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontFamily: F, fontWeight: 800, fontSize: 20, color: "#fff", lineHeight: 1.1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 155 }}>{p.n}</div>
                            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 3 }}>{p.club}</div>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, flexShrink: 0 }}>
                            <div style={{ padding: "2px 8px", borderRadius: 6, background: g.a, fontFamily: F, fontSize: 9, color: g.lc, letterSpacing: 2, fontWeight: 700 }}>{g.lbl}</div>
                            <div style={{ fontSize: 18 }}>{p.nat}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                          <div><div style={{ fontSize: 7, color: "#4b5563", letterSpacing: 1, marginBottom: 2 }}>SKILL</div><div style={{ display: "flex", gap: 2 }}>{[1, 2, 3, 4, 5].map(i => <span key={i} style={{ color: i <= p.sm ? g.a : "#1f2937", fontSize: 11 }}>★</span>)}</div></div>
                          <div><div style={{ fontSize: 7, color: "#4b5563", letterSpacing: 1, marginBottom: 2 }}>WEAK FOOT</div><div style={{ display: "flex", gap: 2 }}>{[1, 2, 3, 4, 5].map(i => <span key={i} style={{ color: i <= p.wf ? "#60a5fa" : "#1f2937", fontSize: 11 }}>★</span>)}</div></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TIMER + BID */}
                <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 20, padding: "18px 20px", display: "flex", gap: 18, alignItems: "center" }}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <svg width={R * 2 + 18} height={R * 2 + 18} style={{ transform: "rotate(-90deg)" }}>
                      <circle cx={R + 9} cy={R + 9} r={R} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="5" />
                      <circle cx={R + 9} cy={R + 9} r={R} fill="none" stroke={timerCol} strokeWidth="5" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - Math.min(1, Math.max(0, tc)))} style={{ transition: "stroke-dashoffset .25s linear,stroke .4s" }} />
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontFamily: F, fontWeight: 800, fontSize: isSold ? 18 : 28, color: isSold ? "#6b7280" : timerCol, lineHeight: 1 }}>{isSold ? (current.status === "sold" ? "✓" : "–") : secs}</span>
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 9, color: "#4b5563", letterSpacing: 3, fontFamily: F, marginBottom: 4 }}>{isSold ? (current.status === "sold" ? "SOLD!" : "SKIPPED") : "CURRENT BID"}</div>
                    <div style={{ fontFamily: F, fontWeight: 800, fontSize: 52, color: "#fff", lineHeight: 1 }}>{current?.bid ?? 1}<span style={{ fontSize: 15, color: "#4b5563", fontWeight: 400 }}> pt</span></div>
                    {current?.bidderIdx != null ? <div style={{ fontSize: 13, color: "#f59e0b", marginTop: 4 }}>🏆 {teams[current.bidderIdx]?.team}</div> : <div style={{ fontSize: 12, color: "#374151", marginTop: 4 }}>No bids yet</div>}
                  </div>
                </div>

                {/* SKIP VOTES */}
                {!isSold && (
                  <div style={{ background: "rgba(239,68,68,.05)", border: "1px solid rgba(239,68,68,.12)", borderRadius: 14, padding: "10px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ fontFamily: F, fontSize: 11, color: "#f87171", letterSpacing: 2 }}>SKIP VOTE ({skipVotes.length}/{teams.length})</div>
                      <div style={{ fontSize: 9, color: "#4b5563" }}>unanimous = skip</div>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {teams.map((t, i) => {
                        const voted = skipVotes.includes(i);
                        const canVote = bidderIdx === i || isAuctioneer || noAuc;
                        return (<button key={i} onClick={() => { if (canVote) dispatch({ type: "VOTE_SKIP", teamIdx: i }); }} disabled={!canVote} style={{ padding: "5px 12px", borderRadius: 99, background: voted ? "rgba(239,68,68,.18)" : "rgba(255,255,255,.04)", border: `1px solid ${voted ? "rgba(239,68,68,.45)" : "rgba(255,255,255,.09)"}`, color: voted ? "#f87171" : "#6b7280", fontFamily: F, fontSize: 11, cursor: canVote ? "pointer" : "default", letterSpacing: 1, transition: "all .15s" }}>{voted ? "✓ " : ""}{t.team}</button>);
                      })}
                    </div>
                  </div>
                )}

                {/* AUCTIONEER */}
                {isAuctioneer && !isSold && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ padding: "10px 14px", background: "rgba(245,158,11,.06)", border: "1px solid rgba(245,158,11,.18)", borderRadius: 12, fontSize: 11, color: "#fbbf24", textAlign: "center", fontFamily: F, letterSpacing: 1 }}>🎙️ Timer auto-sells — hammer early or skip</div>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10 }}>
                      <button className="bb" onClick={() => dispatch({ type: "SELL" })} style={{ padding: "19px", borderRadius: 16, background: "linear-gradient(135deg,#10b981,#047857)", border: "none", color: "#fff", fontFamily: F, fontWeight: 800, fontSize: 19, cursor: "pointer", letterSpacing: 2, boxShadow: "0 4px 24px rgba(16,185,129,.25)" }}>🔨 HAMMER DOWN</button>
                      <button className="bb" onClick={() => dispatch({ type: "SKIP" })} style={{ padding: "19px", borderRadius: 16, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)", color: "#6b7280", fontFamily: F, fontWeight: 700, fontSize: 14, cursor: "pointer", letterSpacing: 1 }}>⏭️ SKIP</button>
                    </div>
                    <div style={{ padding: "10px 14px", background: "rgba(255,255,255,.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,.06)" }}>
                      <div style={{ fontSize: 9, color: "#4b5563", fontFamily: F, letterSpacing: 2, marginBottom: 8 }}>LIVE BIDS</div>
                      {teams.map((t, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                            {current?.bidderIdx === i && <div style={{ width: 5, height: 5, borderRadius: 99, background: "#22c55e", boxShadow: "0 0 6px #22c55e", flexShrink: 0 }} />}
                            <span style={{ fontSize: 12, color: current?.bidderIdx === i ? "#fff" : "#4b5563", fontFamily: F }}>{t.team}</span>
                            {isR2 && t.squad.length < 15 && <span style={{ fontSize: 9, color: "#4ade80", fontFamily: F }}>✓</span>}
                          </div>
                          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            <span style={{ fontFamily: F, fontSize: 12, color: current?.bidderIdx === i ? "#f59e0b" : "#374151" }}>{t.budget}pt</span>
                            <span style={{ fontSize: 10, color: "#374151" }}>{t.squad.length}/20</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {isAuctioneer && isSold && <button className="bb" onClick={() => dispatch({ type: "NEXT_PLAYER" })} style={{ padding: "16px", borderRadius: 16, background: "linear-gradient(135deg,#3b82f6,#7c3aed)", border: "none", color: "#fff", fontFamily: F, fontWeight: 800, fontSize: 15, cursor: "pointer", letterSpacing: 3, boxShadow: "0 4px 20px rgba(59,130,246,.2)" }}>OPEN NEXT PLAYER →</button>}

                {/* BIDDER CONTROLS */}
                {(bidderIdx != null || noAuc) && !isSold && !isAuctioneer && (!isR2 || canBidR2) && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    {isR2 && <div style={{ padding: "8px 12px", background: "rgba(34,197,94,.06)", border: "1px solid rgba(34,197,94,.2)", borderRadius: 10, fontSize: 11, color: "#4ade80", fontFamily: F, letterSpacing: 1, textAlign: "center" }}>✓ ELIGIBLE — {activeTeam?.squad?.length}/14 players</div>}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
                      {[1, 2, 5, 10].map(inc => { const nxt = (current?.bid || 0) + inc, can = nxt <= (activeTeam?.budget || 0) && (activeTeam?.squad?.length || 0) < 20; return (<button key={inc} className="bb" onClick={() => bidInc(inc, isR2)} disabled={!can} style={{ padding: "15px 0", borderRadius: 14, background: can ? "linear-gradient(135deg,#3b82f6,#1d4ed8)" : "rgba(255,255,255,.04)", color: can ? "#fff" : "#2d3748", fontFamily: F, fontWeight: 700, fontSize: 17, border: "none", cursor: can ? "pointer" : "not-allowed", letterSpacing: 1 }}>+{inc}</button>); })}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                      {[20, 50].map(inc => { const nxt = (current?.bid || 0) + inc, can = nxt <= (activeTeam?.budget || 0) && (activeTeam?.squad?.length || 0) < 20; return (<button key={inc} className="bb" onClick={() => bidInc(inc, isR2)} disabled={!can} style={{ padding: "13px 0", borderRadius: 14, background: can ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "rgba(255,255,255,.04)", color: can ? "#fff" : "#2d3748", fontFamily: F, fontWeight: 700, fontSize: 14, border: "none", cursor: can ? "pointer" : "not-allowed" }}>+{inc}→{nxt}pt</button>); })}
                      {(() => { const b = activeTeam?.budget || 0, can = b > 0 && (activeTeam?.squad?.length || 0) < 20 && b > (current?.bid || 0); return (<button className="bb" onClick={() => bidAll(isR2)} disabled={!can} style={{ padding: "13px 0", borderRadius: 14, background: can ? "linear-gradient(135deg,#dc2626,#991b1b)" : "rgba(255,255,255,.04)", color: can ? "#fff" : "#2d3748", fontFamily: F, fontWeight: 700, fontSize: 11, border: "none", cursor: can ? "pointer" : "not-allowed", lineHeight: 1.4 }}>ALL IN<br /><span style={{ fontSize: 9 }}>{b}pt</span></button>); })()}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input className="ti" value={custom} onChange={e => setCustom(e.target.value.replace(/\D/, ""))} onKeyDown={e => { if (e.key === "Enter") bidCustom(isR2); }} placeholder="Custom amount…" type="number" min="1" style={{ ...INP, flex: 1, fontFamily: F, fontSize: 20, textAlign: "center", padding: "13px", letterSpacing: 1 }} />
                      <button className="bb" onClick={() => bidCustom(isR2)} style={{ padding: "13px 20px", borderRadius: 14, background: "linear-gradient(135deg,#f59e0b,#d97706)", border: "none", color: "#000", fontFamily: F, fontWeight: 800, fontSize: 14, cursor: "pointer", letterSpacing: 2, flexShrink: 0 }}>BID</button>
                    </div>
                    {err && <div style={{ textAlign: "center", color: "#f87171", fontSize: 12, padding: "9px", background: "rgba(239,68,68,.08)", borderRadius: 10, border: "1px solid rgba(239,68,68,.18)", animation: "fadeIn .2s", fontFamily: F, letterSpacing: 1 }}>{err}</div>}
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#4b5563", padding: "0 2px" }}>
                      <span>{activeTeam?.team}: <span style={{ color: "#fff", fontFamily: F, fontSize: 15 }}>{activeTeam?.budget}</span>pt</span>
                      <span style={{ color: (activeTeam?.squad?.length || 0) >= 20 ? "#ef4444" : "#22c55e" }}>{activeTeam?.squad?.length || 0}/20</span>
                    </div>
                  </div>
                )}
                {noAuc && isSold && <div style={{ textAlign: "center", padding: "20px", background: "rgba(255,255,255,.02)", borderRadius: 16, fontFamily: F, fontSize: 13, letterSpacing: 2, color: "#4b5563" }}>{current.status === "sold" ? "🏆 SOLD — NEXT IN 2s…" : "⏭️ SKIPPED…"}</div>}
              </>)}
            </div>
          </div>
        )}

        {/* LIST TAB */}
        {tab === "list" && (
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px 80px" }}>
            <div style={{ fontFamily: F, fontSize: 10, letterSpacing: 3, color: "#4b5563", marginBottom: 12 }}>{allRemaining.length} PLAYERS REMAINING</div>
            {["M", "FWD", "MID", "DEF", "GK"].map(cat => {
              const cps = allRemaining.filter(pl => pl.cat === cat);
              if (!cps.length) return null;
              const m = CAT_META[cat];
              return (
                <div key={cat} style={{ marginBottom: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, padding: "7px 14px", borderRadius: 10, background: m.bg, border: `1px solid ${m.color}25` }}>
                    <span style={{ fontSize: 15 }}>{m.icon}</span>
                    <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: m.color, letterSpacing: 2 }}>{m.label}</span>
                    {cat === "M" && <span style={{ fontSize: 9, color: m.color, opacity: .6 }}>RANDOM ORDER</span>}
                    <span style={{ fontSize: 10, color: "#374151", marginLeft: "auto", fontFamily: F }}>{cps.length} left</span>
                  </div>
                  {cps.map((pl, i) => {
                    const g2 = cardGrade(pl.r, pl.cat); const isLive = i === 0 && pl === p; return (
                      <div key={pl.id + i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: isLive ? "rgba(245,158,11,.06)" : "rgba(255,255,255,.02)", border: `1px solid ${isLive ? "rgba(245,158,11,.2)" : "rgba(255,255,255,.05)"}`, borderRadius: 13, marginBottom: 4 }}>
                        <Avatar player={pl} size={46} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                            {isLive && <div style={{ width: 6, height: 6, borderRadius: 99, background: "#f59e0b", boxShadow: "0 0 6px #f59e0b", animation: "pulseDot 1s infinite", flexShrink: 0 }} />}
                            <div style={{ fontSize: 14, color: "#fff", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{pl.n}</div>
                          </div>
                          <div style={{ fontSize: 10, color: "#4b5563" }}>{pl.club} · {pl.nat} · <span style={{ color: PC[pl.pos] || "#9ca3af", fontFamily: F }}>{pl.pos}</span> <span style={{ color: g2.a }}>OVR {pl.r}</span></div>
                        </div>
                        {isLive && <div style={{ fontFamily: F, fontSize: 9, color: "#f59e0b", letterSpacing: 2 }}>ON NOW</div>}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {/* DASHBOARD */}
        {tab === "dash" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ display: "flex", overflowX: "auto", padding: "8px 16px 0", gap: 5, flexShrink: 0, borderBottom: "1px solid rgba(255,255,255,.05)" }}>
              {[["overview", "🌐 Overview"], ["compare", "📊 Compare"], ["log", "📜 Log"]].map(([k, lb]) => (
                <button key={k} onClick={() => setDashSub(k)} style={{ padding: "7px 16px", borderRadius: "10px 10px 0 0", background: dashSub === k ? "rgba(245,158,11,.08)" : "transparent", border: dashSub === k ? "1px solid rgba(245,158,11,.2)" : "1px solid transparent", borderBottom: "none", fontFamily: F, fontSize: 11, color: dashSub === k ? "#f59e0b" : "#4b5563", cursor: "pointer", whiteSpace: "nowrap", letterSpacing: 1 }}>{lb}</button>
              ))}
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 80px" }}>
              {dashSub === "overview" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {teams.map((t, i) => {
                    const an = analyzeSquad(t.squad); const isMe = bidderIdx === i || (noAuc && activeTi === i); return (
                      <div key={i} style={{ background: `rgba(255,255,255,${isMe ? .05 : .02})`, border: `1px solid ${isMe ? "rgba(245,158,11,.25)" : "rgba(255,255,255,.06)"}`, borderRadius: 18, overflow: "hidden" }}>
                        <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,.04)", display: "flex", justifyContent: "space-between", alignItems: "center", background: isMe ? "rgba(245,158,11,.04)" : "transparent" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            {isMe && <span style={{ fontSize: 12 }}>👤</span>}
                            <span style={{ fontFamily: F, fontWeight: 800, fontSize: 16, color: "#fff" }}>{t.team}</span>
                            <div style={{ width: 6, height: 6, borderRadius: 99, background: t.online ? "#10b981" : "#4b5563", boxShadow: t.online ? "0 0 6px #10b981" : "none" }}></div>
                            <span style={{ fontSize: 10, color: "#4b5563", marginLeft: 2 }}>{t.name}</span>
                            {isR2 && t.squad.length < 15 && <span style={{ fontSize: 9, color: "#4ade80", marginLeft: 6, fontFamily: F }}>✓ R2</span>}
                          </div>
                          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                            {[{ v: an.str, l: "OVR", c: an.str > 70 ? "#22c55e" : an.str > 50 ? "#f59e0b" : "#ef4444" }, { v: t.budget, l: "PTS", c: "#f59e0b" }, { v: `${t.squad.length}/20`, l: "SQ", c: t.squad.length < 15 ? "#ef4444" : "#22c55e" }].map(x => (
                              <div key={x.l} style={{ textAlign: "center" }}><div style={{ fontFamily: F, fontWeight: 800, fontSize: 20, color: x.c, lineHeight: 1 }}>{x.v}</div><div style={{ fontSize: 7, color: "#4b5563", letterSpacing: 1, marginTop: 2 }}>{x.l}</div></div>
                            ))}
                          </div>
                        </div>
                        <div style={{ padding: "8px 14px 10px" }}>
                          <div style={{ display: "flex", gap: 5, marginBottom: 7 }}>
                            {[{ l: "GK", v: an.gks, n: 1, c: "#f59e0b" }, { l: "DEF", v: an.defs, n: 4, c: "#818cf8" }, { l: "MID", v: an.mids, n: 3, c: "#34d399" }, { l: "FWD", v: an.fwds, n: 3, c: "#f87171" }].map(r => (
                              <div key={r.l} style={{ flex: 1, textAlign: "center", padding: "5px 2px", borderRadius: 9, background: `${r.c}${r.v >= r.n ? "12" : "07"}`, border: `1px solid ${r.c}${r.v >= r.n ? "35" : "18"}` }}>
                                <div style={{ fontFamily: F, fontWeight: 800, fontSize: 15, color: r.v >= r.n ? r.c : "#374151" }}>{r.v}</div>
                                <div style={{ fontSize: 7, color: "#374151", letterSpacing: .3 }}>{r.l}/{r.n}</div>
                              </div>
                            ))}
                          </div>
                          <div style={{ height: 3, background: "rgba(255,255,255,.05)", borderRadius: 99, overflow: "hidden", marginBottom: 8 }}>
                            <div style={{ height: "100%", width: `${(t.budget / cfg.pts) * 100}%`, background: `linear-gradient(90deg,${t.budget / cfg.pts > 0.5 ? "#22c55e" : t.budget / cfg.pts > 0.2 ? "#f59e0b" : "#ef4444"},transparent)`, borderRadius: 99, transition: "width .5s" }} />
                          </div>
                          {t.squad.length > 0 && <div style={{ display: "flex", gap: 5, overflowX: "auto" }}>
                            {[...t.squad].sort((a, b) => b.r - a.r).slice(0, 8).map((pl, pi) => {
                              const g2 = cardGrade(pl.r, pl.cat); return (
                                <div key={pi} style={{ flexShrink: 0, width: 48, borderRadius: 10, overflow: "hidden", background: g2.bg, border: `1px solid ${g2.a}33`, padding: "5px 3px", textAlign: "center" }}>
                                  <Avatar player={pl} size={42} />
                                  <div style={{ fontFamily: F, fontWeight: 800, fontSize: 11, color: g2.a, lineHeight: 1, marginTop: 2 }}>{pl.r}</div>
                                  <div style={{ fontSize: 7, color: PC[pl.pos] || "#9ca3af" }}>{pl.pos}</div>
                                  <div style={{ fontFamily: F, fontSize: 8, color: "#f59e0b" }}>{pl.price}pt</div>
                                </div>
                              );
                            })}
                            {t.squad.length > 8 && <div style={{ flexShrink: 0, width: 48, borderRadius: 10, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#4b5563", fontFamily: F }}>+{t.squad.length - 8}</div>}
                          </div>}
                          {!t.squad.length && <div style={{ fontSize: 11, color: "#2d3748", textAlign: "center", padding: "6px 0", fontFamily: F }}>NO PLAYERS YET</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {dashSub === "compare" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[{ k: "budget", l: "Budget", max: cfg.pts, c: "#60a5fa", f: v => `${v}pt` }, { k: "str", l: "Strength", max: 99, c: "#f59e0b", f: v => v || 0 }, { k: "avgR", l: "Avg Rating", max: 91, c: "#a78bfa", f: v => v || "—" }, { k: "total", l: "Players", max: 20, c: "#34d399", f: v => `${v}/20` }, { k: "gks", l: "GKs", max: 3, c: "#f59e0b", f: v => v }, { k: "defs", l: "Defenders", max: 8, c: "#818cf8", f: v => v }, { k: "mids", l: "Midfielders", max: 10, c: "#34d399", f: v => v }, { k: "fwds", l: "Forwards", max: 8, c: "#f87171", f: v => v }].map(stat => {
                    const vals = teams.map(t => { if (stat.k === "budget") return { t, v: t.budget }; const an = analyzeSquad(t.squad); return { t, v: an[stat.k] || 0 }; });
                    return (
                      <div key={stat.k} style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 14, padding: "12px 14px" }}>
                        <div style={{ fontFamily: F, fontSize: 11, color: "#4b5563", letterSpacing: 2, marginBottom: 9 }}>{stat.l}</div>
                        {vals.map(({ t, v }, i) => {
                          const isMe = bidderIdx === i || (noAuc && activeTi === i); return (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6 }}>
                              <div style={{ width: 60, fontSize: 10, color: isMe ? "#f59e0b" : "#4b5563", fontFamily: F, textAlign: "right", flexShrink: 0 }}>{t.team.slice(0, 7)}</div>
                              <div style={{ flex: 1, height: 16, background: "rgba(255,255,255,.04)", borderRadius: 99, overflow: "hidden", position: "relative" }}>
                                <div style={{ position: "absolute", inset: 0, width: `${Math.min(100, (v / stat.max) * 100)}%`, background: `linear-gradient(90deg,${stat.c},${stat.c}99)`, borderRadius: 99, transition: "width .7s cubic-bezier(0.34,1.56,0.64,1)", boxShadow: isMe ? `0 0 10px ${stat.c}88` : "none" }} />
                              </div>
                              <div style={{ width: 32, fontFamily: F, fontSize: 11, color: isMe ? stat.c : "#374151", flexShrink: 0 }}>{stat.f(v)}</div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
              {dashSub === "log" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <div style={{ fontFamily: F, fontSize: 10, letterSpacing: 3, color: "#4b5563", marginBottom: 6 }}>{history.length} TRANSACTIONS</div>
                  {!history.length && <div style={{ textAlign: "center", color: "#2d3748", fontSize: 14, paddingTop: 60, fontFamily: F, letterSpacing: 2 }}>NO SALES YET</div>}
                  {history.map((h, i) => {
                    const g2 = cardGrade(h.player.r, h.player.cat); const m = CAT_META[h.player.cat] || CAT_META.FWD; return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "rgba(255,255,255,.02)", border: `1px solid ${h.bidderIdx != null ? "rgba(245,158,11,.08)" : "rgba(255,255,255,.04)"}`, borderRadius: 14 }}>
                        <Avatar player={h.player} size={44} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, color: "#fff", fontWeight: 700 }}>{h.player.n}</div>
                          <div style={{ fontSize: 10, color: "#4b5563", marginTop: 2 }}>{h.player.club} · <span style={{ color: g2.a }}>OVR {h.player.r}</span></div>
                          <div style={{ fontSize: 9, color: m.color, marginTop: 3, fontFamily: F, letterSpacing: 1 }}>{m.icon} {m.label}{h.skipped ? " · SKIPPED" : ""}</div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          {h.bidderIdx != null ? (<><div style={{ fontFamily: F, fontWeight: 800, fontSize: 19, color: "#f59e0b" }}>{h.price}<span style={{ fontSize: 10, color: "#4b5563" }}>pt</span></div><div style={{ fontSize: 11, color: "#6b7280" }}>{teams[h.bidderIdx]?.team}</div></>) : <div style={{ fontFamily: F, fontSize: 12, color: "#374151" }}>UNSOLD</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SQUADS */}
        {tab === "squads" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ display: "flex", overflowX: "auto", padding: "6px 12px 0", gap: 4, flexShrink: 0, borderBottom: "1px solid rgba(255,255,255,.05)" }}>
              {teams.map((t, i) => (
                <button key={i} onClick={() => dispatch({ type: "SET_SQ", idx: i })} style={{ padding: "8px 14px", background: sqView === i ? "rgba(245,158,11,.08)" : "none", border: sqView === i ? "1px solid rgba(245,158,11,.2)" : "1px solid transparent", borderRadius: "10px 10px 0 0", fontFamily: F, fontSize: 11, color: sqView === i ? "#f59e0b" : "#4b5563", cursor: "pointer", whiteSpace: "nowrap", letterSpacing: 1, flexShrink: 0 }}>
                  {(bidderIdx === i || (noAuc && activeTi === i)) ? "👤 " : ""}{t.team}
                  {isR2 && t.squad.length < 15 && <span style={{ color: "#4ade80", marginLeft: 4 }}>✓</span>}
                </button>
              ))}
            </div>
            {(() => {
              const t = teams[sqView] || teams[0]; if (!t) return null;
              const sq = t.squad; const an = analyzeSquad(sq);
              const fDef = FORMATIONS[formation] || FORMATIONS["4-3-3"];
              const rows = {}; fDef.forEach((slot, si) => { if (!rows[slot.r]) rows[slot.r] = []; rows[slot.r].push({ ...slot, si }); });
              const rowOrder = Object.keys(rows).sort((a, b) => +a - +b);
              const assignedUids = new Set(Object.values(curSlots));
              return (
                <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px 80px" }}>
                  <div style={{ display: "flex", gap: 7, marginBottom: 14 }}>
                    {[{ l: "OVR", v: an.str, c: an.str > 70 ? "#22c55e" : an.str > 50 ? "#f59e0b" : "#ef4444" }, { l: "AVG", v: an.avgR || "—", c: "#f59e0b" }, { l: "SQUAD", v: `${sq.length}/20`, c: sq.length < 15 ? "#ef4444" : "#22c55e" }, { l: "BUDGET", v: `${t.budget}pt`, c: "#a78bfa" }].map(({ l, v, c }) => (
                      <div key={l} style={{ flex: 1, textAlign: "center", padding: "8px 4px", background: "rgba(255,255,255,.03)", borderRadius: 12, border: "1px solid rgba(255,255,255,.06)" }}>
                        <div style={{ fontFamily: F, fontWeight: 800, fontSize: 17, color: c, lineHeight: 1 }}>{v}</div>
                        <div style={{ fontSize: 8, color: "#4b5563", letterSpacing: .5, marginTop: 3 }}>{l}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, color: "#4b5563", fontFamily: F, letterSpacing: 2, marginBottom: 7 }}>FORMATION</div>
                    <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
                      {Object.keys(FORMATIONS).map(f => (
                        <button key={f} onClick={() => dispatch({ type: "SET_FORM", f })} style={{ padding: "7px 16px", borderRadius: 99, background: formation === f ? "linear-gradient(135deg,#f59e0b,#d97706)" : "rgba(255,255,255,.04)", border: `1px solid ${formation === f ? "#f59e0b44" : "rgba(255,255,255,.09)"}`, color: formation === f ? "#000" : "#6b7280", fontFamily: F, fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", letterSpacing: 1 }}>{f}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: "linear-gradient(180deg,rgba(0,80,15,.2),rgba(0,55,10,.1),rgba(0,80,15,.2))", border: "1px solid rgba(0,180,40,.08)", borderRadius: 22, padding: "16px 10px", marginBottom: 14, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: "50%", left: "50%", width: 60, height: 60, borderRadius: 99, border: "1px solid rgba(255,255,255,.04)", transform: "translate(-50%,-50%)" }} />
                    <div style={{ position: "absolute", top: "50%", left: "8%", right: "8%", height: 1, background: "rgba(255,255,255,.04)", transform: "translateY(-50%)" }} />
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,.15)", textAlign: "center", fontFamily: F, letterSpacing: 4, marginBottom: 10 }}>{formation}</div>
                    {rowOrder.map(row => (
                      <div key={row} style={{ display: "flex", justifyContent: "space-around", marginBottom: 14, gap: 4 }}>
                        {rows[row].map(({ p: slotPos, si }) => {
                          const uid = curSlots[si]; const pl = uid ? sq.find(x => x.uid === uid) : null; const g2 = pl ? cardGrade(pl.r, pl.cat) : null;
                          return (
                            <div key={si} style={{ flex: 1, maxWidth: 72, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); const u = e.dataTransfer.getData("uid"); if (u) dispatch({ type: "ASSIGN_SLOT", slot: si, uid: u }); }}>
                              <div draggable={!!pl} onDragStart={e => { if (pl) { e.dataTransfer.setData("uid", pl.uid); setDragUid(pl.uid); } }} onDragEnd={() => setDragUid(null)} onClick={() => { if (pl) dispatch({ type: "CLEAR_SLOT", slot: si }); }} style={{ width: "100%", maxWidth: 60, aspectRatio: "2/3", borderRadius: 14, overflow: "hidden", background: pl ? g2.bg : "rgba(255,255,255,.03)", border: `1px solid ${pl ? g2.a + "44" : "rgba(255,255,255,.1)"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 4, position: "relative", margin: "0 auto", cursor: pl ? "grab" : "default", boxShadow: dragUid === pl?.uid ? `0 0 20px ${g2?.a}88` : "none" }}>
                                {pl ? (<><div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><Avatar player={pl} size={52} /></div><div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,.8)", textAlign: "center", padding: "3px 0" }}><div style={{ fontFamily: F, fontWeight: 800, fontSize: 12, color: g2.a, lineHeight: 1 }}>{pl.r}</div></div></>) : (<div style={{ textAlign: "center" }}><div style={{ fontSize: 10, color: "#2d3748", fontFamily: F }}>{slotPos}</div><div style={{ fontSize: 7, color: "#1f2937", marginTop: 2 }}>drop</div></div>)}
                              </div>
                              <div style={{ fontSize: 7, color: pl ? "#6b7280" : "#2d3748", textAlign: "center", maxWidth: 60, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{pl ? pl.s : slotPos}</div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  {/* Squad sorted by club for easy transfer talks */}
                  <div style={{ fontFamily: F, fontSize: 10, color: "#4b5563", letterSpacing: 2, marginBottom: 8 }}>SQUAD BY CLUB ({sq.length} · {sq.length - assignedUids.size} unplaced)</div>
                  {(() => {
                    const clubs = {};
                    [...sq].sort((a, b) => a.club.localeCompare(b.club)).forEach(pl => { if (!clubs[pl.club]) clubs[pl.club] = []; clubs[pl.club].push(pl); });
                    return Object.entries(clubs).map(([club, pls]) => (
                      <div key={club} style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 10, color: "#6b7280", fontFamily: F, letterSpacing: 1, marginBottom: 6, padding: "4px 8px", background: "rgba(255,255,255,.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,.06)" }}>📍 {club} — {pls.length} player{pls.length !== 1 ? "s" : ""}</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
                          {pls.map(pl => {
                            const placed = assignedUids.has(pl.uid); const g2 = cardGrade(pl.r, pl.cat); return (
                              <div key={pl.uid} draggable={!placed} onDragStart={e => { if (!placed) { e.dataTransfer.setData("uid", pl.uid); setDragUid(pl.uid); } }} onDragEnd={() => setDragUid(null)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 12, background: placed ? "rgba(16,185,129,.06)" : "rgba(255,255,255,.02)", border: `1px solid ${placed ? "rgba(16,185,129,.25)" : "rgba(255,255,255,.05)"}`, cursor: placed ? "default" : "grab", opacity: placed ? .7 : 1, boxShadow: dragUid === pl.uid ? `0 0 16px ${g2.a}55` : "none" }}>
                                <Avatar player={pl} size={36} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: 12, color: "#fff", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{pl.n}</div>
                                  <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
                                    <span style={{ padding: "1px 5px", borderRadius: 4, background: `${PC[pl.pos] || "#6b7280"}18`, color: PC[pl.pos] || "#9ca3af", fontSize: 8, fontFamily: F }}>{pl.pos}</span>
                                    <span style={{ fontSize: 8, color: g2.a, fontFamily: F }}>OVR {pl.r}</span>
                                    {placed && <span style={{ padding: "1px 5px", borderRadius: 4, background: "rgba(16,185,129,.18)", color: "#4ade80", fontSize: 8, fontFamily: F }}>✓</span>}
                                  </div>
                                </div>
                                <div style={{ fontFamily: F, fontSize: 14, color: "#f59e0b", flexShrink: 0 }}>{pl.price}<span style={{ fontSize: 9, color: "#4b5563" }}>pt</span></div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ));
                  })()}
                  {!sq.length && <div style={{ textAlign: "center", color: "#2d3748", fontSize: 14, padding: "30px 0", fontFamily: F, letterSpacing: 2 }}>NO PLAYERS YET</div>}
                </div>
              );
            })()}
          </div>
        )}

        <div style={{ position: "absolute", bottom: 20, right: 20, opacity: 0.5 }}>
          {adminUser ? (
             <div style={{color:"#fff", fontSize: 12}}>Admin <button onClick={() => supabase.auth.signOut()} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",marginLeft:10}}>Logout</button></div>
          ) : (
             <button onClick={() => setRAction("admin_login")} style={{background:"none",border:"none",color:"#fff",cursor:"pointer",fontSize: 12}}>Admin Login</button>
          )}
        </div>
      </div>
    </div>
  );
}

function CBlock({ title, children }) { return (<div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 16, padding: "14px 16px" }}><div style={{ fontFamily: F, fontSize: 10, color: "#4b5563", letterSpacing: 3, marginBottom: 10 }}>{title}</div>{children}</div>); }
function CBtn({ active, col = "#f59e0b", onClick, children }) { return (<button onClick={onClick} style={{ padding: "12px 0", borderRadius: 12, background: active ? `linear-gradient(135deg,${col},${col}cc)` : "rgba(255,255,255,.05)", border: `1px solid ${active ? col + "44" : "rgba(255,255,255,.08)"}`, color: active ? (col === "#f59e0b" ? "#000" : "#fff") : "#4b5563", fontFamily: F, fontWeight: 700, fontSize: 16, cursor: "pointer", transition: "all .18s", letterSpacing: 1 }}>{children}</button>); }
const PG = { minHeight: "100vh", background: "#050810", color: "#fff", fontFamily: F, display: "flex", flexDirection: "column" };
const INP = { background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 11, padding: "10px 14px", color: "#fff", fontSize: 13, width: "100%", boxSizing: "border-box", outline: "none" };
const BTN = bg => ({ background: bg, border: "none", borderRadius: 16, color: "#fff", fontFamily: F, fontWeight: 700, letterSpacing: 2, cursor: "pointer", transition: "all .2s", display: "block", width: "100%", textAlign: "center" });
const BACK = { background: "none", border: "1px solid rgba(255,255,255,.1)", borderRadius: 10, color: "#6b7280", padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: F, letterSpacing: 1 };
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800&display=swap');`;
const ANIM = `
@keyframes cardIn   {from{opacity:0;transform:translateY(20px) scale(.95)}to{opacity:1;transform:none}}
@keyframes bannerIn {from{opacity:0;transform:scale(.82)}to{opacity:1;transform:scale(1)}}
@keyframes slideUp  {from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes fadeIn   {from{opacity:0}to{opacity:1}}
@keyframes pulseDot {0%,100%{opacity:.4;transform:scale(.7)}50%{opacity:1;transform:scale(1.7)}}
`;
