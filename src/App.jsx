import { useReducer, useEffect, useRef, useState } from "react";
import { useMultiplayer, clearSession } from "./useMultiplayer";
import { supabase } from "./supabaseClient";

/* ═══════ PLAYER DATABASE — 200 players, official FC 26 2025-26 ratings ═══════ */
const PLAYERS = [
  {
    "id": 1,
    "n": "Kylian Mbappé",
    "s": "Mbappé",
    "pos": "ST",
    "r": 91,
    "pac": 97,
    "sho": 90,
    "pas": 80,
    "dri": 92,
    "def": 39,
    "phy": 76,
    "sm": 5,
    "wf": 4,
    "club": "Real Madrid",
    "nat": "France",
    "cat": "FWD",
    "eaId": 10001
  },
  {
    "id": 2,
    "n": "Erling Haaland",
    "s": "Haaland",
    "pos": "ST",
    "r": 91,
    "pac": 91,
    "sho": 94,
    "pas": 66,
    "dri": 80,
    "def": 45,
    "phy": 88,
    "sm": 3,
    "wf": 4,
    "club": "Manchester City",
    "nat": "Norway",
    "cat": "FWD",
    "eaId": 10002
  },
  {
    "id": 3,
    "n": "Thibaut Courtois",
    "s": "Courtois",
    "pos": "GK",
    "r": 90,
    "pac": 52,
    "sho": 22,
    "pas": 52,
    "dri": 50,
    "def": 20,
    "phy": 88,
    "sm": 1,
    "wf": 3,
    "club": "Real Madrid",
    "nat": "Belgium",
    "cat": "GK",
    "eaId": 10003
  },
  {
    "id": 4,
    "n": "Harry Kane",
    "s": "Kane",
    "pos": "ST",
    "r": 90,
    "pac": 70,
    "sho": 92,
    "pas": 83,
    "dri": 83,
    "def": 48,
    "phy": 82,
    "sm": 3,
    "wf": 4,
    "club": "Bayern München",
    "nat": "England",
    "cat": "FWD",
    "eaId": 10004
  },
  {
    "id": 5,
    "n": "Ousmane Dembélé",
    "s": "Dembélé",
    "pos": "ST",
    "r": 90,
    "pac": 93,
    "sho": 84,
    "pas": 79,
    "dri": 90,
    "def": 38,
    "phy": 68,
    "sm": 5,
    "wf": 3,
    "club": "Paris Saint-Germain",
    "nat": "France",
    "cat": "FWD",
    "eaId": 10005
  },
  {
    "id": 6,
    "n": "Pedri",
    "s": "Pedri",
    "pos": "CM",
    "r": 90,
    "pac": 75,
    "sho": 76,
    "pas": 88,
    "dri": 90,
    "def": 62,
    "phy": 63,
    "sm": 4,
    "wf": 4,
    "club": "FC Barcelona",
    "nat": "Spain",
    "cat": "MID",
    "eaId": 10006
  },
  {
    "id": 7,
    "n": "Vitinha",
    "s": "Vitinha",
    "pos": "CM",
    "r": 90,
    "pac": 86,
    "sho": 84,
    "pas": 95,
    "dri": 87,
    "def": 77,
    "phy": 88,
    "sm": 4,
    "wf": 3,
    "club": "Paris Saint-Germain",
    "nat": "Portugal",
    "cat": "MID",
    "eaId": 10007
  },
  {
    "id": 8,
    "n": "Mohamed Salah",
    "s": "Salah",
    "pos": "RM",
    "r": 89,
    "pac": 88,
    "sho": 89,
    "pas": 82,
    "dri": 90,
    "def": 45,
    "phy": 76,
    "sm": 4,
    "wf": 3,
    "club": "Liverpool",
    "nat": "Egypt",
    "cat": "MID",
    "eaId": 10008
  },
  {
    "id": 9,
    "n": "Joshua Kimmich",
    "s": "Kimmich",
    "pos": "CDM",
    "r": 89,
    "pac": 68,
    "sho": 73,
    "pas": 90,
    "dri": 83,
    "def": 82,
    "phy": 78,
    "sm": 3,
    "wf": 4,
    "club": "Bayern München",
    "nat": "Germany",
    "cat": "MID",
    "eaId": 10009
  },
  {
    "id": 10,
    "n": "Gianluigi Donnarumma",
    "s": "Donnarumma",
    "pos": "GK",
    "r": 89,
    "pac": 48,
    "sho": 20,
    "pas": 55,
    "dri": 48,
    "def": 20,
    "phy": 88,
    "sm": 1,
    "wf": 3,
    "club": "Manchester City",
    "nat": "Italy",
    "cat": "GK",
    "eaId": 10010
  },
  {
    "id": 11,
    "n": "Rodri",
    "s": "Rodri",
    "pos": "CDM",
    "r": 89,
    "pac": 63,
    "sho": 78,
    "pas": 89,
    "dri": 83,
    "def": 87,
    "phy": 82,
    "sm": 3,
    "wf": 4,
    "club": "Manchester City",
    "nat": "Spain",
    "cat": "MID",
    "eaId": 10011
  },
  {
    "id": 12,
    "n": "Gabriel",
    "s": "Gabriel",
    "pos": "CB",
    "r": 89,
    "pac": 80,
    "sho": 59,
    "pas": 71,
    "dri": 69,
    "def": 94,
    "phy": 89,
    "sm": 2,
    "wf": 3,
    "club": "Arsenal",
    "nat": "Brazil",
    "cat": "DEF",
    "eaId": 10012
  },
  {
    "id": 13,
    "n": "Raphinha",
    "s": "Raphinha",
    "pos": "LW",
    "r": 89,
    "pac": 93,
    "sho": 86,
    "pas": 83,
    "dri": 94,
    "def": 58,
    "phy": 76,
    "sm": 5,
    "wf": 3,
    "club": "FC Barcelona",
    "nat": "Brazil",
    "cat": "FWD",
    "eaId": 10013
  },
  {
    "id": 14,
    "n": "Achraf Hakimi",
    "s": "Hakimi",
    "pos": "RB",
    "r": 89,
    "pac": 90,
    "sho": 66,
    "pas": 87,
    "dri": 83,
    "def": 90,
    "phy": 84,
    "sm": 4,
    "wf": 4,
    "club": "Paris Saint-Germain",
    "nat": "Morocco",
    "cat": "DEF",
    "eaId": 10014
  },
  {
    "id": 15,
    "n": "Vini Jr.",
    "s": "Vini Jr.",
    "pos": "LW",
    "r": 89,
    "pac": 95,
    "sho": 83,
    "pas": 78,
    "dri": 91,
    "def": 32,
    "phy": 68,
    "sm": 5,
    "wf": 3,
    "club": "Real Madrid",
    "nat": "Brazil",
    "cat": "FWD",
    "eaId": 10015
  },
  {
    "id": 16,
    "n": "Federico Valverde",
    "s": "Valverde",
    "pos": "CM",
    "r": 89,
    "pac": 86,
    "sho": 82,
    "pas": 96,
    "dri": 86,
    "def": 77,
    "phy": 87,
    "sm": 2,
    "wf": 3,
    "club": "Real Madrid",
    "nat": "Uruguay",
    "cat": "MID",
    "eaId": 10016
  },
  {
    "id": 17,
    "n": "Michael Olise",
    "s": "Olise",
    "pos": "RM",
    "r": 89,
    "pac": 96,
    "sho": 84,
    "pas": 87,
    "dri": 89,
    "def": 65,
    "phy": 80,
    "sm": 5,
    "wf": 4,
    "club": "Bayern München",
    "nat": "France",
    "cat": "MID",
    "eaId": 10017
  },
  {
    "id": 18,
    "n": "Jude Bellingham",
    "s": "Bellingham",
    "pos": "CAM",
    "r": 89,
    "pac": 80,
    "sho": 85,
    "pas": 84,
    "dri": 87,
    "def": 71,
    "phy": 83,
    "sm": 4,
    "wf": 4,
    "club": "Real Madrid",
    "nat": "England",
    "cat": "MID",
    "eaId": 10018
  },
  {
    "id": 19,
    "n": "Lamine Yamal",
    "s": "Yamal",
    "pos": "RW",
    "r": 89,
    "pac": 88,
    "sho": 82,
    "pas": 84,
    "dri": 91,
    "def": 41,
    "phy": 63,
    "sm": 5,
    "wf": 4,
    "club": "FC Barcelona",
    "nat": "Spain",
    "cat": "FWD",
    "eaId": 10019
  },
  {
    "id": 20,
    "n": "Jan Oblak",
    "s": "Oblak",
    "pos": "GK",
    "r": 88,
    "pac": 50,
    "sho": 20,
    "pas": 50,
    "dri": 48,
    "def": 20,
    "phy": 85,
    "sm": 1,
    "wf": 3,
    "club": "Atlético de Madrid",
    "nat": "Slovenia",
    "cat": "GK",
    "eaId": 10020
  },
  {
    "id": 21,
    "n": "Virgil van Dijk",
    "s": "van Dijk",
    "pos": "CB",
    "r": 88,
    "pac": 78,
    "sho": 63,
    "pas": 76,
    "dri": 73,
    "def": 90,
    "phy": 86,
    "sm": 2,
    "wf": 4,
    "club": "Liverpool",
    "nat": "Netherlands",
    "cat": "DEF",
    "eaId": 10021
  },
  {
    "id": 22,
    "n": "Bruno Fernandes",
    "s": "B. Fernandes",
    "pos": "CAM",
    "r": 88,
    "pac": 72,
    "sho": 85,
    "pas": 88,
    "dri": 85,
    "def": 64,
    "phy": 76,
    "sm": 4,
    "wf": 4,
    "club": "Manchester United",
    "nat": "Portugal",
    "cat": "MID",
    "eaId": 10022
  },
  {
    "id": 23,
    "n": "Alisson",
    "s": "Alisson",
    "pos": "GK",
    "r": 88,
    "pac": 54,
    "sho": 20,
    "pas": 56,
    "dri": 50,
    "def": 20,
    "phy": 84,
    "sm": 1,
    "wf": 4,
    "club": "Liverpool",
    "nat": "Brazil",
    "cat": "GK",
    "eaId": 10023
  },
  {
    "id": 24,
    "n": "Nicolò Barella",
    "s": "Barella",
    "pos": "CM",
    "r": 88,
    "pac": 82,
    "sho": 81,
    "pas": 95,
    "dri": 91,
    "def": 80,
    "phy": 83,
    "sm": 4,
    "wf": 3,
    "club": "Inter",
    "nat": "Italy",
    "cat": "MID",
    "eaId": 10024
  },
  {
    "id": 25,
    "n": "Lautaro Martínez",
    "s": "L. Martínez",
    "pos": "ST",
    "r": 88,
    "pac": 88,
    "sho": 94,
    "pas": 78,
    "dri": 90,
    "def": 48,
    "phy": 88,
    "sm": 5,
    "wf": 4,
    "club": "Inter",
    "nat": "Argentina",
    "cat": "FWD",
    "eaId": 10025
  },
  {
    "id": 26,
    "n": "Declan Rice",
    "s": "Rice",
    "pos": "CDM",
    "r": 88,
    "pac": 82,
    "sho": 72,
    "pas": 88,
    "dri": 83,
    "def": 91,
    "phy": 91,
    "sm": 4,
    "wf": 3,
    "club": "Arsenal",
    "nat": "England",
    "cat": "MID",
    "eaId": 10026
  },
  {
    "id": 27,
    "n": "William Saliba",
    "s": "Saliba",
    "pos": "CB",
    "r": 88,
    "pac": 75,
    "sho": 61,
    "pas": 72,
    "dri": 66,
    "def": 92,
    "phy": 88,
    "sm": 2,
    "wf": 4,
    "club": "Arsenal",
    "nat": "France",
    "cat": "DEF",
    "eaId": 10027
  },
  {
    "id": 28,
    "n": "Khvicha Kvaratskhelia",
    "s": "Kvaratskhelia",
    "pos": "LW",
    "r": 88,
    "pac": 94,
    "sho": 86,
    "pas": 83,
    "dri": 94,
    "def": 58,
    "phy": 74,
    "sm": 4,
    "wf": 4,
    "club": "Paris Saint-Germain",
    "nat": "Georgia",
    "cat": "FWD",
    "eaId": 10028
  },
  {
    "id": 29,
    "n": "Nuno Mendes",
    "s": "Nuno Mendes",
    "pos": "LB",
    "r": 88,
    "pac": 89,
    "sho": 67,
    "pas": 81,
    "dri": 85,
    "def": 85,
    "phy": 82,
    "sm": 4,
    "wf": 4,
    "club": "Paris Saint-Germain",
    "nat": "Portugal",
    "cat": "DEF",
    "eaId": 10029
  },
  {
    "id": 30,
    "n": "Moisés Caicedo",
    "s": "Caicedo",
    "pos": "CDM",
    "r": 88,
    "pac": 79,
    "sho": 69,
    "pas": 89,
    "dri": 82,
    "def": 91,
    "phy": 91,
    "sm": 4,
    "wf": 3,
    "club": "Chelsea",
    "nat": "Ecuador",
    "cat": "MID",
    "eaId": 10030
  },
  {
    "id": 31,
    "n": "Willian Pacho",
    "s": "Pacho",
    "pos": "CB",
    "r": 88,
    "pac": 78,
    "sho": 61,
    "pas": 70,
    "dri": 65,
    "def": 90,
    "phy": 93,
    "sm": 2,
    "wf": 4,
    "club": "Paris Saint-Germain",
    "nat": "Ecuador",
    "cat": "DEF",
    "eaId": 10031
  },
  {
    "id": 32,
    "n": "João Neves",
    "s": "J. Neves",
    "pos": "CM",
    "r": 88,
    "pac": 79,
    "sho": 76,
    "pas": 90,
    "dri": 85,
    "def": 77,
    "phy": 83,
    "sm": 4,
    "wf": 3,
    "club": "Paris Saint-Germain",
    "nat": "Portugal",
    "cat": "MID",
    "eaId": 10032
  },
  {
    "id": 33,
    "n": "Kevin De Bruyne",
    "s": "De Bruyne",
    "pos": "CM",
    "r": 87,
    "pac": 68,
    "sho": 86,
    "pas": 93,
    "dri": 87,
    "def": 64,
    "phy": 76,
    "sm": 4,
    "wf": 5,
    "club": "Napoli",
    "nat": "Belgium",
    "cat": "MID",
    "eaId": 10033
  },
  {
    "id": 34,
    "n": "Marquinhos",
    "s": "Marquinhos",
    "pos": "CB",
    "r": 87,
    "pac": 78,
    "sho": 60,
    "pas": 68,
    "dri": 66,
    "def": 93,
    "phy": 89,
    "sm": 1,
    "wf": 4,
    "club": "Paris Saint-Germain",
    "nat": "Brazil",
    "cat": "DEF",
    "eaId": 10034
  },
  {
    "id": 35,
    "n": "Jonathan Tah",
    "s": "Tah",
    "pos": "CB",
    "r": 87,
    "pac": 76,
    "sho": 61,
    "pas": 72,
    "dri": 63,
    "def": 92,
    "phy": 90,
    "sm": 1,
    "wf": 4,
    "club": "Bayern München",
    "nat": "Germany",
    "cat": "DEF",
    "eaId": 10035
  },
  {
    "id": 36,
    "n": "Mike Maignan",
    "s": "Maignan",
    "pos": "GK",
    "r": 87,
    "pac": 47,
    "sho": 30,
    "pas": 45,
    "dri": 44,
    "def": 34,
    "phy": 84,
    "sm": 1,
    "wf": 2,
    "club": "AC Milan",
    "nat": "France",
    "cat": "GK",
    "eaId": 10036
  },
  {
    "id": 37,
    "n": "David Raya",
    "s": "Raya",
    "pos": "GK",
    "r": 87,
    "pac": 52,
    "sho": 28,
    "pas": 46,
    "dri": 42,
    "def": 34,
    "phy": 88,
    "sm": 1,
    "wf": 4,
    "club": "Arsenal",
    "nat": "Spain",
    "cat": "GK",
    "eaId": 10037
  },
  {
    "id": 38,
    "n": "Frenkie de Jong",
    "s": "de Jong",
    "pos": "CM",
    "r": 87,
    "pac": 80,
    "sho": 79,
    "pas": 91,
    "dri": 86,
    "def": 76,
    "phy": 87,
    "sm": 3,
    "wf": 3,
    "club": "FC Barcelona",
    "nat": "Netherlands",
    "cat": "MID",
    "eaId": 10038
  },
  {
    "id": 39,
    "n": "Alexander Isak",
    "s": "Isak",
    "pos": "ST",
    "r": 87,
    "pac": 92,
    "sho": 91,
    "pas": 77,
    "dri": 87,
    "def": 51,
    "phy": 86,
    "sm": 3,
    "wf": 3,
    "club": "Liverpool",
    "nat": "Sweden",
    "cat": "FWD",
    "eaId": 10039
  },
  {
    "id": 40,
    "n": "Alessandro Bastoni",
    "s": "Bastoni",
    "pos": "CB",
    "r": 87,
    "pac": 79,
    "sho": 59,
    "pas": 72,
    "dri": 66,
    "def": 90,
    "phy": 92,
    "sm": 1,
    "wf": 3,
    "club": "Inter",
    "nat": "Italy",
    "cat": "DEF",
    "eaId": 10040
  },
  {
    "id": 41,
    "n": "Rúben Dias",
    "s": "R. Dias",
    "pos": "CB",
    "r": 87,
    "pac": 78,
    "sho": 59,
    "pas": 72,
    "dri": 63,
    "def": 89,
    "phy": 92,
    "sm": 1,
    "wf": 3,
    "club": "Manchester City",
    "nat": "Portugal",
    "cat": "DEF",
    "eaId": 10041
  },
  {
    "id": 42,
    "n": "Luis Díaz",
    "s": "L. Díaz",
    "pos": "LM",
    "r": 87,
    "pac": 94,
    "sho": 79,
    "pas": 84,
    "dri": 87,
    "def": 62,
    "phy": 81,
    "sm": 5,
    "wf": 3,
    "club": "Bayern München",
    "nat": "Colombia",
    "cat": "MID",
    "eaId": 10042
  },
  {
    "id": 43,
    "n": "Bukayo Saka",
    "s": "Saka",
    "pos": "RW",
    "r": 87,
    "pac": 91,
    "sho": 84,
    "pas": 83,
    "dri": 91,
    "def": 53,
    "phy": 74,
    "sm": 5,
    "wf": 3,
    "club": "Arsenal",
    "nat": "England",
    "cat": "FWD",
    "eaId": 10043
  },
  {
    "id": 44,
    "n": "Florian Wirtz",
    "s": "Wirtz",
    "pos": "CAM",
    "r": 87,
    "pac": 83,
    "sho": 85,
    "pas": 96,
    "dri": 89,
    "def": 58,
    "phy": 75,
    "sm": 5,
    "wf": 3,
    "club": "Liverpool",
    "nat": "Germany",
    "cat": "MID",
    "eaId": 10044
  },
  {
    "id": 45,
    "n": "Jamal Musiala",
    "s": "Musiala",
    "pos": "CAM",
    "r": 87,
    "pac": 86,
    "sho": 85,
    "pas": 94,
    "dri": 91,
    "def": 60,
    "phy": 81,
    "sm": 4,
    "wf": 3,
    "club": "Bayern München",
    "nat": "Germany",
    "cat": "MID",
    "eaId": 10045
  },
  {
    "id": 46,
    "n": "Lionel Messi",
    "s": "Messi",
    "pos": "CAM",
    "r": 86,
    "pac": 78,
    "sho": 87,
    "pas": 90,
    "dri": 94,
    "def": 34,
    "phy": 62,
    "sm": 5,
    "wf": 4,
    "club": "Inter Miami",
    "nat": "Argentina",
    "cat": "MID",
    "eaId": 10046
  },
  {
    "id": 47,
    "n": "Yann Sommer",
    "s": "Sommer",
    "pos": "GK",
    "r": 86,
    "pac": 48,
    "sho": 28,
    "pas": 43,
    "dri": 37,
    "def": 31,
    "phy": 88,
    "sm": 1,
    "wf": 3,
    "club": "Inter",
    "nat": "Switzerland",
    "cat": "GK",
    "eaId": 10047
  },
  {
    "id": 48,
    "n": "Robert Lewandowski",
    "s": "Lewandowski",
    "pos": "ST",
    "r": 86,
    "pac": 90,
    "sho": 90,
    "pas": 74,
    "dri": 84,
    "def": 46,
    "phy": 81,
    "sm": 3,
    "wf": 4,
    "club": "FC Barcelona",
    "nat": "Poland",
    "cat": "FWD",
    "eaId": 10048
  },
  {
    "id": 49,
    "n": "Hakan Çalhanoğlu",
    "s": "Çalhanoğlu",
    "pos": "CDM",
    "r": 86,
    "pac": 78,
    "sho": 70,
    "pas": 84,
    "dri": 80,
    "def": 87,
    "phy": 88,
    "sm": 3,
    "wf": 3,
    "club": "Inter",
    "nat": "Türkiye",
    "cat": "MID",
    "eaId": 10049
  },
  {
    "id": 50,
    "n": "Martin Ødegaard",
    "s": "Ødegaard",
    "pos": "CM",
    "r": 86,
    "pac": 80,
    "sho": 78,
    "pas": 93,
    "dri": 88,
    "def": 72,
    "phy": 81,
    "sm": 4,
    "wf": 3,
    "club": "Arsenal",
    "nat": "Norway",
    "cat": "MID",
    "eaId": 10050
  },
  {
    "id": 51,
    "n": "Federico Dimarco",
    "s": "Dimarco",
    "pos": "LB",
    "r": 86,
    "pac": 86,
    "sho": 63,
    "pas": 79,
    "dri": 84,
    "def": 87,
    "phy": 81,
    "sm": 4,
    "wf": 4,
    "club": "Inter",
    "nat": "Italy",
    "cat": "DEF",
    "eaId": 10051
  },
  {
    "id": 52,
    "n": "Dayot Upamecano",
    "s": "Upamecano",
    "pos": "CB",
    "r": 86,
    "pac": 76,
    "sho": 60,
    "pas": 71,
    "dri": 62,
    "def": 90,
    "phy": 91,
    "sm": 1,
    "wf": 4,
    "club": "Bayern München",
    "nat": "France",
    "cat": "DEF",
    "eaId": 10052
  },
  {
    "id": 53,
    "n": "Victor Osimhen",
    "s": "Osimhen",
    "pos": "ST",
    "r": 86,
    "pac": 90,
    "sho": 88,
    "pas": 78,
    "dri": 85,
    "def": 50,
    "phy": 86,
    "sm": 4,
    "wf": 4,
    "club": "Galatasaray",
    "nat": "Nigeria",
    "cat": "FWD",
    "eaId": 10053
  },
  {
    "id": 54,
    "n": "Gregor Kobel",
    "s": "Kobel",
    "pos": "GK",
    "r": 86,
    "pac": 51,
    "sho": 29,
    "pas": 44,
    "dri": 40,
    "def": 32,
    "phy": 85,
    "sm": 1,
    "wf": 3,
    "club": "Borussia Dortmund",
    "nat": "Switzerland",
    "cat": "GK",
    "eaId": 10054
  },
  {
    "id": 55,
    "n": "Dominik Szoboszlai",
    "s": "Szoboszlai",
    "pos": "CAM",
    "r": 86,
    "pac": 84,
    "sho": 85,
    "pas": 92,
    "dri": 88,
    "def": 62,
    "phy": 76,
    "sm": 5,
    "wf": 3,
    "club": "Liverpool",
    "nat": "Hungary",
    "cat": "MID",
    "eaId": 10055
  },
  {
    "id": 56,
    "n": "Scott McTominay",
    "s": "McTominay",
    "pos": "CM",
    "r": 86,
    "pac": 78,
    "sho": 76,
    "pas": 87,
    "dri": 88,
    "def": 77,
    "phy": 86,
    "sm": 4,
    "wf": 3,
    "club": "Napoli",
    "nat": "Scotland",
    "cat": "MID",
    "eaId": 10056
  },
  {
    "id": 57,
    "n": "Bremer",
    "s": "Bremer",
    "pos": "CB",
    "r": 86,
    "pac": 76,
    "sho": 60,
    "pas": 72,
    "dri": 67,
    "def": 93,
    "phy": 92,
    "sm": 1,
    "wf": 3,
    "club": "Juventus",
    "nat": "Brazil",
    "cat": "DEF",
    "eaId": 10057
  },
  {
    "id": 58,
    "n": "Jules Koundé",
    "s": "Koundé",
    "pos": "RB",
    "r": 86,
    "pac": 85,
    "sho": 65,
    "pas": 84,
    "dri": 84,
    "def": 86,
    "phy": 78,
    "sm": 3,
    "wf": 3,
    "club": "FC Barcelona",
    "nat": "France",
    "cat": "DEF",
    "eaId": 10058
  },
  {
    "id": 59,
    "n": "Viktor Gyökeres",
    "s": "Gyökeres",
    "pos": "ST",
    "r": 86,
    "pac": 91,
    "sho": 92,
    "pas": 80,
    "dri": 82,
    "def": 48,
    "phy": 81,
    "sm": 3,
    "wf": 4,
    "club": "Arsenal",
    "nat": "Sweden",
    "cat": "FWD",
    "eaId": 10059
  },
  {
    "id": 60,
    "n": "Ryan Gravenberch",
    "s": "Gravenberch",
    "pos": "CDM",
    "r": 86,
    "pac": 75,
    "sho": 67,
    "pas": 82,
    "dri": 81,
    "def": 92,
    "phy": 87,
    "sm": 2,
    "wf": 3,
    "club": "Liverpool",
    "nat": "Netherlands",
    "cat": "MID",
    "eaId": 10060
  },
  {
    "id": 61,
    "n": "Julián Álvarez",
    "s": "J. Álvarez",
    "pos": "ST",
    "r": 86,
    "pac": 91,
    "sho": 88,
    "pas": 80,
    "dri": 88,
    "def": 47,
    "phy": 82,
    "sm": 3,
    "wf": 3,
    "club": "Atlético de Madrid",
    "nat": "Argentina",
    "cat": "FWD",
    "eaId": 10061
  },
  {
    "id": 62,
    "n": "Nico Schlotterbeck",
    "s": "Schlotterbeck",
    "pos": "CB",
    "r": 86,
    "pac": 78,
    "sho": 59,
    "pas": 69,
    "dri": 68,
    "def": 90,
    "phy": 91,
    "sm": 2,
    "wf": 3,
    "club": "Borussia Dortmund",
    "nat": "Germany",
    "cat": "DEF",
    "eaId": 10062
  },
  {
    "id": 63,
    "n": "Bruno Guimarães",
    "s": "Guimarães",
    "pos": "CM",
    "r": 86,
    "pac": 79,
    "sho": 78,
    "pas": 93,
    "dri": 84,
    "def": 78,
    "phy": 81,
    "sm": 4,
    "wf": 3,
    "club": "Newcastle United",
    "nat": "Brazil",
    "cat": "MID",
    "eaId": 10063
  },
  {
    "id": 64,
    "n": "Cole Palmer",
    "s": "Palmer",
    "pos": "CAM",
    "r": 86,
    "pac": 86,
    "sho": 83,
    "pas": 95,
    "dri": 93,
    "def": 57,
    "phy": 77,
    "sm": 4,
    "wf": 3,
    "club": "Chelsea",
    "nat": "England",
    "cat": "MID",
    "eaId": 10064
  },
  {
    "id": 65,
    "n": "Joan García",
    "s": "J. García",
    "pos": "GK",
    "r": 86,
    "pac": 45,
    "sho": 28,
    "pas": 45,
    "dri": 39,
    "def": 31,
    "phy": 86,
    "sm": 1,
    "wf": 4,
    "club": "FC Barcelona",
    "nat": "Spain",
    "cat": "GK",
    "eaId": 10065
  },
  {
    "id": 66,
    "n": "Désiré Doué",
    "s": "Doué",
    "pos": "RW",
    "r": 86,
    "pac": 95,
    "sho": 87,
    "pas": 81,
    "dri": 90,
    "def": 55,
    "phy": 76,
    "sm": 4,
    "wf": 3,
    "club": "Paris Saint-Germain",
    "nat": "France",
    "cat": "FWD",
    "eaId": 10066
  },
  {
    "id": 67,
    "n": "Cristiano Ronaldo",
    "s": "Ronaldo",
    "pos": "ST",
    "r": 85,
    "pac": 80,
    "sho": 92,
    "pas": 79,
    "dri": 85,
    "def": 33,
    "phy": 77,
    "sm": 5,
    "wf": 4,
    "club": "Al Nassr",
    "nat": "Portugal",
    "cat": "FWD",
    "eaId": 10067
  },
  {
    "id": 68,
    "n": "Karim Benzema",
    "s": "Benzema",
    "pos": "ST",
    "r": 85,
    "pac": 85,
    "sho": 88,
    "pas": 76,
    "dri": 81,
    "def": 49,
    "phy": 86,
    "sm": 5,
    "wf": 4,
    "club": "Al Hilal",
    "nat": "France",
    "cat": "FWD",
    "eaId": 10068
  },
  {
    "id": 69,
    "n": "Luka Modrić",
    "s": "Modrić",
    "pos": "CM",
    "r": 85,
    "pac": 70,
    "sho": 76,
    "pas": 90,
    "dri": 87,
    "def": 64,
    "phy": 63,
    "sm": 4,
    "wf": 4,
    "club": "AC Milan",
    "nat": "Croatia",
    "cat": "MID",
    "eaId": 10069
  },
  {
    "id": 70,
    "n": "Granit Xhaka",
    "s": "Xhaka",
    "pos": "CDM",
    "r": 85,
    "pac": 77,
    "sho": 70,
    "pas": 86,
    "dri": 79,
    "def": 89,
    "phy": 87,
    "sm": 4,
    "wf": 3,
    "club": "Sunderland",
    "nat": "Switzerland",
    "cat": "MID",
    "eaId": 10070
  },
  {
    "id": 71,
    "n": "Emiliano Martínez",
    "s": "E. Martínez",
    "pos": "GK",
    "r": 85,
    "pac": 46,
    "sho": 31,
    "pas": 43,
    "dri": 39,
    "def": 28,
    "phy": 85,
    "sm": 1,
    "wf": 3,
    "club": "Aston Villa",
    "nat": "Argentina",
    "cat": "GK",
    "eaId": 10071
  },
  {
    "id": 72,
    "n": "Jordan Pickford",
    "s": "Pickford",
    "pos": "GK",
    "r": 85,
    "pac": 50,
    "sho": 32,
    "pas": 42,
    "dri": 41,
    "def": 30,
    "phy": 84,
    "sm": 1,
    "wf": 2,
    "club": "Everton",
    "nat": "England",
    "cat": "GK",
    "eaId": 10072
  },
  {
    "id": 73,
    "n": "Adrien Rabiot",
    "s": "Rabiot",
    "pos": "CM",
    "r": 85,
    "pac": 77,
    "sho": 79,
    "pas": 89,
    "dri": 85,
    "def": 73,
    "phy": 84,
    "sm": 4,
    "wf": 3,
    "club": "AC Milan",
    "nat": "France",
    "cat": "MID",
    "eaId": 10073
  },
  {
    "id": 74,
    "n": "Grimaldo",
    "s": "Grimaldo",
    "pos": "LM",
    "r": 85,
    "pac": 86,
    "sho": 78,
    "pas": 85,
    "dri": 84,
    "def": 61,
    "phy": 79,
    "sm": 5,
    "wf": 4,
    "club": "Bayer 04 Leverkusen",
    "nat": "Spain",
    "cat": "MID",
    "eaId": 10074
  },
  {
    "id": 75,
    "n": "Paulo Dybala",
    "s": "Dybala",
    "pos": "CAM",
    "r": 85,
    "pac": 86,
    "sho": 81,
    "pas": 94,
    "dri": 90,
    "def": 57,
    "phy": 79,
    "sm": 5,
    "wf": 3,
    "club": "Roma",
    "nat": "Argentina",
    "cat": "MID",
    "eaId": 10075
  },
  {
    "id": 76,
    "n": "Serhou Guirassy",
    "s": "Guirassy",
    "pos": "ST",
    "r": 85,
    "pac": 87,
    "sho": 90,
    "pas": 73,
    "dri": 82,
    "def": 49,
    "phy": 83,
    "sm": 3,
    "wf": 3,
    "club": "Borussia Dortmund",
    "nat": "Guinea",
    "cat": "FWD",
    "eaId": 10076
  },
  {
    "id": 77,
    "n": "Youri Tielemans",
    "s": "Tielemans",
    "pos": "CM",
    "r": 85,
    "pac": 81,
    "sho": 74,
    "pas": 92,
    "dri": 87,
    "def": 72,
    "phy": 80,
    "sm": 4,
    "wf": 3,
    "club": "Aston Villa",
    "nat": "Belgium",
    "cat": "MID",
    "eaId": 10077
  },
  {
    "id": 78,
    "n": "Sergej Milinković-Savić",
    "s": "Milinković-Savić",
    "pos": "CM",
    "r": 85,
    "pac": 77,
    "sho": 78,
    "pas": 89,
    "dri": 85,
    "def": 75,
    "phy": 82,
    "sm": 3,
    "wf": 3,
    "club": "Al Hilal",
    "nat": "Serbia",
    "cat": "MID",
    "eaId": 10078
  },
  {
    "id": 79,
    "n": "Rúben Neves",
    "s": "Neves",
    "pos": "CDM",
    "r": 85,
    "pac": 79,
    "sho": 66,
    "pas": 81,
    "dri": 79,
    "def": 87,
    "phy": 90,
    "sm": 3,
    "wf": 3,
    "club": "Al Hilal",
    "nat": "Portugal",
    "cat": "MID",
    "eaId": 10079
  },
  {
    "id": 80,
    "n": "Marcos Llorente",
    "s": "Llorente",
    "pos": "RB",
    "r": 85,
    "pac": 89,
    "sho": 61,
    "pas": 81,
    "dri": 80,
    "def": 80,
    "phy": 77,
    "sm": 2,
    "wf": 2,
    "club": "Atlético de Madrid",
    "nat": "Spain",
    "cat": "DEF",
    "eaId": 10080
  },
  {
    "id": 81,
    "n": "Fabián Ruiz",
    "s": "F. Ruiz",
    "pos": "CM",
    "r": 85,
    "pac": 82,
    "sho": 75,
    "pas": 86,
    "dri": 84,
    "def": 75,
    "phy": 83,
    "sm": 3,
    "wf": 3,
    "club": "Paris Saint-Germain",
    "nat": "Spain",
    "cat": "MID",
    "eaId": 10081
  },
  {
    "id": 82,
    "n": "Christian Pulisic",
    "s": "Pulisic",
    "pos": "RW",
    "r": 85,
    "pac": 91,
    "sho": 85,
    "pas": 79,
    "dri": 87,
    "def": 53,
    "phy": 77,
    "sm": 4,
    "wf": 3,
    "club": "AC Milan",
    "nat": "United States",
    "cat": "FWD",
    "eaId": 10082
  },
  {
    "id": 83,
    "n": "Marcus Thuram",
    "s": "Thuram",
    "pos": "ST",
    "r": 85,
    "pac": 91,
    "sho": 87,
    "pas": 76,
    "dri": 84,
    "def": 49,
    "phy": 83,
    "sm": 3,
    "wf": 3,
    "club": "Inter",
    "nat": "France",
    "cat": "FWD",
    "eaId": 10083
  },
  {
    "id": 84,
    "n": "Trent Alexander-Arnold",
    "s": "Alexander-Arnold",
    "pos": "RB",
    "r": 85,
    "pac": 76,
    "sho": 68,
    "pas": 90,
    "dri": 82,
    "def": 71,
    "phy": 68,
    "sm": 3,
    "wf": 4,
    "club": "Real Madrid",
    "nat": "England",
    "cat": "DEF",
    "eaId": 10084
  },
  {
    "id": 85,
    "n": "Patrik Schick",
    "s": "Schick",
    "pos": "ST",
    "r": 85,
    "pac": 89,
    "sho": 90,
    "pas": 79,
    "dri": 81,
    "def": 47,
    "phy": 82,
    "sm": 3,
    "wf": 4,
    "club": "Bayer 04 Leverkusen",
    "nat": "Czechia",
    "cat": "FWD",
    "eaId": 10085
  },
  {
    "id": 86,
    "n": "Phil Foden",
    "s": "Foden",
    "pos": "CAM",
    "r": 85,
    "pac": 83,
    "sho": 83,
    "pas": 93,
    "dri": 88,
    "def": 58,
    "phy": 77,
    "sm": 5,
    "wf": 4,
    "club": "Manchester City",
    "nat": "England",
    "cat": "MID",
    "eaId": 10086
  },
  {
    "id": 87,
    "n": "Marc Cucurella",
    "s": "Cucurella",
    "pos": "LB",
    "r": 85,
    "pac": 90,
    "sho": 64,
    "pas": 84,
    "dri": 84,
    "def": 80,
    "phy": 78,
    "sm": 4,
    "wf": 4,
    "club": "Chelsea",
    "nat": "Spain",
    "cat": "DEF",
    "eaId": 10087
  },
  {
    "id": 88,
    "n": "Alexis Mac Allister",
    "s": "Mac Allister",
    "pos": "CM",
    "r": 85,
    "pac": 79,
    "sho": 75,
    "pas": 89,
    "dri": 88,
    "def": 72,
    "phy": 85,
    "sm": 2,
    "wf": 3,
    "club": "Liverpool",
    "nat": "Argentina",
    "cat": "MID",
    "eaId": 10088
  },
  {
    "id": 89,
    "n": "Tijjani Reijnders",
    "s": "Reijnders",
    "pos": "CM",
    "r": 85,
    "pac": 79,
    "sho": 75,
    "pas": 91,
    "dri": 83,
    "def": 71,
    "phy": 85,
    "sm": 2,
    "wf": 3,
    "club": "Manchester City",
    "nat": "Netherlands",
    "cat": "MID",
    "eaId": 10089
  },
  {
    "id": 90,
    "n": "Sandro Tonali",
    "s": "Tonali",
    "pos": "CDM",
    "r": 85,
    "pac": 79,
    "sho": 71,
    "pas": 87,
    "dri": 78,
    "def": 90,
    "phy": 85,
    "sm": 2,
    "wf": 3,
    "club": "Newcastle United",
    "nat": "Italy",
    "cat": "MID",
    "eaId": 10090
  },
  {
    "id": 91,
    "n": "Bryan Mbeumo",
    "s": "Mbeumo",
    "pos": "RW",
    "r": 85,
    "pac": 93,
    "sho": 84,
    "pas": 84,
    "dri": 90,
    "def": 53,
    "phy": 75,
    "sm": 5,
    "wf": 4,
    "club": "Manchester United",
    "nat": "Cameroon",
    "cat": "FWD",
    "eaId": 10091
  },
  {
    "id": 92,
    "n": "Enzo Fernández",
    "s": "E. Fernández",
    "pos": "CM",
    "r": 85,
    "pac": 80,
    "sho": 74,
    "pas": 90,
    "dri": 83,
    "def": 76,
    "phy": 81,
    "sm": 4,
    "wf": 3,
    "club": "Chelsea",
    "nat": "Argentina",
    "cat": "MID",
    "eaId": 10092
  },
  {
    "id": 93,
    "n": "Martín Zubimendi",
    "s": "Zubimendi",
    "pos": "CDM",
    "r": 85,
    "pac": 75,
    "sho": 71,
    "pas": 87,
    "dri": 74,
    "def": 92,
    "phy": 88,
    "sm": 4,
    "wf": 3,
    "club": "Arsenal",
    "nat": "Spain",
    "cat": "MID",
    "eaId": 10093
  },
  {
    "id": 94,
    "n": "Joško Gvardiol",
    "s": "Gvardiol",
    "pos": "CB",
    "r": 85,
    "pac": 72,
    "sho": 58,
    "pas": 67,
    "dri": 62,
    "def": 91,
    "phy": 87,
    "sm": 2,
    "wf": 2,
    "club": "Manchester City",
    "nat": "Croatia",
    "cat": "DEF",
    "eaId": 10094
  },
  {
    "id": 95,
    "n": "Marco Carnesecchi",
    "s": "Carnesecchi",
    "pos": "GK",
    "r": 85,
    "pac": 50,
    "sho": 26,
    "pas": 48,
    "dri": 39,
    "def": 26,
    "phy": 81,
    "sm": 1,
    "wf": 3,
    "club": "Atalanta",
    "nat": "Italy",
    "cat": "GK",
    "eaId": 10095
  },
  {
    "id": 96,
    "n": "Nico Williams",
    "s": "N. Williams",
    "pos": "LW",
    "r": 85,
    "pac": 89,
    "sho": 85,
    "pas": 84,
    "dri": 88,
    "def": 54,
    "phy": 75,
    "sm": 4,
    "wf": 3,
    "club": "Athletic Club de Bilbao",
    "nat": "Spain",
    "cat": "FWD",
    "eaId": 10096
  },
  {
    "id": 97,
    "n": "Hugo Ekitiké",
    "s": "Ekitiké",
    "pos": "ST",
    "r": 85,
    "pac": 86,
    "sho": 90,
    "pas": 79,
    "dri": 84,
    "def": 50,
    "phy": 82,
    "sm": 5,
    "wf": 4,
    "club": "Liverpool",
    "nat": "France",
    "cat": "FWD",
    "eaId": 10097
  },
  {
    "id": 98,
    "n": "Péter Gulácsi",
    "s": "Gulácsi",
    "pos": "GK",
    "r": 84,
    "pac": 46,
    "sho": 25,
    "pas": 43,
    "dri": 36,
    "def": 26,
    "phy": 80,
    "sm": 1,
    "wf": 3,
    "club": "RB Leipzig",
    "nat": "Hungary",
    "cat": "GK",
    "eaId": 10098
  },
  {
    "id": 99,
    "n": "Marc-André ter Stegen",
    "s": "ter Stegen",
    "pos": "GK",
    "r": 84,
    "pac": 43,
    "sho": 31,
    "pas": 44,
    "dri": 36,
    "def": 31,
    "phy": 85,
    "sm": 1,
    "wf": 2,
    "club": "Girona FC",
    "nat": "Germany",
    "cat": "GK",
    "eaId": 10099
  },
  {
    "id": 100,
    "n": "David De Gea",
    "s": "De Gea",
    "pos": "GK",
    "r": 84,
    "pac": 45,
    "sho": 27,
    "pas": 43,
    "dri": 37,
    "def": 25,
    "phy": 84,
    "sm": 1,
    "wf": 4,
    "club": "Fiorentina",
    "nat": "Spain",
    "cat": "GK",
    "eaId": 10100
  },
  {
    "id": 101,
    "n": "Oliver Baumann",
    "s": "Baumann",
    "pos": "GK",
    "r": 84,
    "pac": 48,
    "sho": 31,
    "pas": 45,
    "dri": 37,
    "def": 26,
    "phy": 83,
    "sm": 1,
    "wf": 4,
    "club": "TSG 1899 Hoffenheim",
    "nat": "Germany",
    "cat": "GK",
    "eaId": 10101
  },
  {
    "id": 102,
    "n": "Antoine Griezmann",
    "s": "Griezmann",
    "pos": "ST",
    "r": 84,
    "pac": 84,
    "sho": 87,
    "pas": 73,
    "dri": 83,
    "def": 47,
    "phy": 79,
    "sm": 4,
    "wf": 3,
    "club": "Atlético de Madrid",
    "nat": "France",
    "cat": "FWD",
    "eaId": 10102
  },
  {
    "id": 103,
    "n": "Isco",
    "s": "Isco",
    "pos": "CAM",
    "r": 84,
    "pac": 83,
    "sho": 86,
    "pas": 92,
    "dri": 88,
    "def": 60,
    "phy": 76,
    "sm": 5,
    "wf": 3,
    "club": "Real Betis Balompié",
    "nat": "Spain",
    "cat": "MID",
    "eaId": 10103
  },
  {
    "id": 104,
    "n": "Son Heung Min",
    "s": "Son",
    "pos": "ST",
    "r": 84,
    "pac": 86,
    "sho": 88,
    "pas": 77,
    "dri": 86,
    "def": 47,
    "phy": 83,
    "sm": 5,
    "wf": 3,
    "club": "Los Angeles FC",
    "nat": "Republic of Korea",
    "cat": "FWD",
    "eaId": 10104
  },
  {
    "id": 105,
    "n": "Riyad Mahrez",
    "s": "Mahrez",
    "pos": "RM",
    "r": 84,
    "pac": 87,
    "sho": 76,
    "pas": 82,
    "dri": 88,
    "def": 58,
    "phy": 74,
    "sm": 5,
    "wf": 3,
    "club": "Al Ahli",
    "nat": "Algeria",
    "cat": "MID",
    "eaId": 10105
  },
  {
    "id": 106,
    "n": "Iñigo Martínez",
    "s": "Iñigo Martínez",
    "pos": "CB",
    "r": 84,
    "pac": 70,
    "sho": 55,
    "pas": 66,
    "dri": 60,
    "def": 91,
    "phy": 90,
    "sm": 2,
    "wf": 3,
    "club": "Al Nassr",
    "nat": "Spain",
    "cat": "DEF",
    "eaId": 10106
  },
  {
    "id": 107,
    "n": "Dani Carvajal",
    "s": "Carvajal",
    "pos": "RB",
    "r": 84,
    "pac": 84,
    "sho": 62,
    "pas": 83,
    "dri": 77,
    "def": 83,
    "phy": 78,
    "sm": 2,
    "wf": 2,
    "club": "Real Madrid",
    "nat": "Spain",
    "cat": "DEF",
    "eaId": 10107
  },
  {
    "id": 108,
    "n": "Antonio Rüdiger",
    "s": "Rüdiger",
    "pos": "CB",
    "r": 84,
    "pac": 70,
    "sho": 56,
    "pas": 69,
    "dri": 64,
    "def": 91,
    "phy": 90,
    "sm": 1,
    "wf": 4,
    "club": "Real Madrid",
    "nat": "Germany",
    "cat": "DEF",
    "eaId": 10108
  },
  {
    "id": 109,
    "n": "João Cancelo",
    "s": "Cancelo",
    "pos": "RB",
    "r": 84,
    "pac": 85,
    "sho": 61,
    "pas": 77,
    "dri": 78,
    "def": 81,
    "phy": 77,
    "sm": 4,
    "wf": 4,
    "club": "FC Barcelona",
    "nat": "Portugal",
    "cat": "DEF",
    "eaId": 10109
  },
  {
    "id": 110,
    "n": "N'Golo Kanté",
    "s": "Kanté",
    "pos": "CDM",
    "r": 84,
    "pac": 72,
    "sho": 70,
    "pas": 84,
    "dri": 74,
    "def": 89,
    "phy": 90,
    "sm": 4,
    "wf": 3,
    "club": "Fenerbahçe",
    "nat": "France",
    "cat": "MID",
    "eaId": 10110
  },
  {
    "id": 111,
    "n": "Manuel Locatelli",
    "s": "Locatelli",
    "pos": "CDM",
    "r": 84,
    "pac": 75,
    "sho": 71,
    "pas": 82,
    "dri": 74,
    "def": 88,
    "phy": 86,
    "sm": 2,
    "wf": 3,
    "club": "Juventus",
    "nat": "Italy",
    "cat": "MID",
    "eaId": 10111
  },
  {
    "id": 112,
    "n": "Konrad Laimer",
    "s": "Laimer",
    "pos": "RB",
    "r": 84,
    "pac": 87,
    "sho": 65,
    "pas": 79,
    "dri": 82,
    "def": 81,
    "phy": 79,
    "sm": 4,
    "wf": 4,
    "club": "Bayern München",
    "nat": "Austria",
    "cat": "DEF",
    "eaId": 10112
  },
  {
    "id": 113,
    "n": "Ezri Konsa",
    "s": "Konsa",
    "pos": "CB",
    "r": 84,
    "pac": 75,
    "sho": 59,
    "pas": 70,
    "dri": 63,
    "def": 89,
    "phy": 85,
    "sm": 2,
    "wf": 2,
    "club": "Aston Villa",
    "nat": "England",
    "cat": "DEF",
    "eaId": 10113
  },
  {
    "id": 114,
    "n": "Aleix García",
    "s": "Aleix García",
    "pos": "CM",
    "r": 84,
    "pac": 75,
    "sho": 78,
    "pas": 85,
    "dri": 83,
    "def": 70,
    "phy": 82,
    "sm": 4,
    "wf": 3,
    "club": "Bayer 04 Leverkusen",
    "nat": "Spain",
    "cat": "MID",
    "eaId": 10114
  },
  {
    "id": 115,
    "n": "Gianluca Mancini",
    "s": "Mancini",
    "pos": "CB",
    "r": 84,
    "pac": 74,
    "sho": 60,
    "pas": 68,
    "dri": 66,
    "def": 92,
    "phy": 86,
    "sm": 2,
    "wf": 4,
    "club": "Roma",
    "nat": "Italy",
    "cat": "DEF",
    "eaId": 10115
  },
  {
    "id": 116,
    "n": "Unai Simón",
    "s": "Unai Simón",
    "pos": "GK",
    "r": 84,
    "pac": 46,
    "sho": 28,
    "pas": 43,
    "dri": 37,
    "def": 26,
    "phy": 81,
    "sm": 1,
    "wf": 3,
    "club": "Athletic Club de Bilbao",
    "nat": "Spain",
    "cat": "GK",
    "eaId": 10116
  },
  {
    "id": 117,
    "n": "Mile Svilar",
    "s": "Svilar",
    "pos": "GK",
    "r": 84,
    "pac": 49,
    "sho": 28,
    "pas": 46,
    "dri": 39,
    "def": 30,
    "phy": 82,
    "sm": 1,
    "wf": 4,
    "club": "Roma",
    "nat": "Serbia",
    "cat": "GK",
    "eaId": 10117
  },
  {
    "id": 118,
    "n": "Theo Hernández",
    "s": "T. Hernández",
    "pos": "LB",
    "r": 84,
    "pac": 83,
    "sho": 61,
    "pas": 82,
    "dri": 81,
    "def": 85,
    "phy": 75,
    "sm": 2,
    "wf": 2,
    "club": "Al Hilal",
    "nat": "France",
    "cat": "DEF",
    "eaId": 10118
  },
  {
    "id": 119,
    "n": "Denzel Dumfries",
    "s": "Dumfries",
    "pos": "RB",
    "r": 84,
    "pac": 85,
    "sho": 65,
    "pas": 81,
    "dri": 83,
    "def": 81,
    "phy": 81,
    "sm": 4,
    "wf": 4,
    "club": "Inter",
    "nat": "Netherlands",
    "cat": "DEF",
    "eaId": 10119
  },
  {
    "id": 120,
    "n": "Diogo Costa",
    "s": "D. Costa",
    "pos": "GK",
    "r": 84,
    "pac": 47,
    "sho": 31,
    "pas": 44,
    "dri": 36,
    "def": 28,
    "phy": 81,
    "sm": 1,
    "wf": 2,
    "club": "FC Porto",
    "nat": "Portugal",
    "cat": "GK",
    "eaId": 10120
  },
  {
    "id": 121,
    "n": "Eberechi Eze",
    "s": "Eze",
    "pos": "CAM",
    "r": 84,
    "pac": 80,
    "sho": 84,
    "pas": 87,
    "dri": 87,
    "def": 58,
    "phy": 77,
    "sm": 4,
    "wf": 4,
    "club": "Arsenal",
    "nat": "England",
    "cat": "MID",
    "eaId": 10121
  },
  {
    "id": 122,
    "n": "Boubacar Kamara",
    "s": "Kamara",
    "pos": "CDM",
    "r": 84,
    "pac": 77,
    "sho": 68,
    "pas": 81,
    "dri": 75,
    "def": 87,
    "phy": 87,
    "sm": 2,
    "wf": 3,
    "club": "Aston Villa",
    "nat": "France",
    "cat": "MID",
    "eaId": 10122
  },
  {
    "id": 123,
    "n": "Ibrahima Konaté",
    "s": "Konaté",
    "pos": "CB",
    "r": 84,
    "pac": 76,
    "sho": 56,
    "pas": 65,
    "dri": 60,
    "def": 87,
    "phy": 84,
    "sm": 1,
    "wf": 4,
    "club": "Liverpool",
    "nat": "France",
    "cat": "DEF",
    "eaId": 10123
  },
  {
    "id": 124,
    "n": "Reece James",
    "s": "R. James",
    "pos": "RB",
    "r": 84,
    "pac": 84,
    "sho": 63,
    "pas": 78,
    "dri": 80,
    "def": 80,
    "phy": 76,
    "sm": 2,
    "wf": 2,
    "club": "Chelsea",
    "nat": "England",
    "cat": "DEF",
    "eaId": 10124
  },
  {
    "id": 125,
    "n": "Éder Militão",
    "s": "Militão",
    "pos": "CB",
    "r": 84,
    "pac": 73,
    "sho": 54,
    "pas": 69,
    "dri": 63,
    "def": 90,
    "phy": 90,
    "sm": 1,
    "wf": 4,
    "club": "Real Madrid",
    "nat": "Brazil",
    "cat": "DEF",
    "eaId": 10125
  },
  {
    "id": 126,
    "n": "Marc Guéhi",
    "s": "Guéhi",
    "pos": "CB",
    "r": 84,
    "pac": 75,
    "sho": 55,
    "pas": 71,
    "dri": 65,
    "def": 89,
    "phy": 85,
    "sm": 1,
    "wf": 3,
    "club": "Manchester City",
    "nat": "England",
    "cat": "DEF",
    "eaId": 10126
  },
  {
    "id": 127,
    "n": "Antoine Semenyo",
    "s": "Semenyo",
    "pos": "RW",
    "r": 84,
    "pac": 90,
    "sho": 85,
    "pas": 81,
    "dri": 88,
    "def": 53,
    "phy": 71,
    "sm": 5,
    "wf": 3,
    "club": "Manchester City",
    "nat": "Ghana",
    "cat": "FWD",
    "eaId": 10127
  },
  {
    "id": 128,
    "n": "Ferran Torres",
    "s": "F. Torres",
    "pos": "ST",
    "r": 84,
    "pac": 84,
    "sho": 88,
    "pas": 73,
    "dri": 84,
    "def": 44,
    "phy": 82,
    "sm": 3,
    "wf": 3,
    "club": "FC Barcelona",
    "nat": "Spain",
    "cat": "FWD",
    "eaId": 10128
  },
  {
    "id": 129,
    "n": "Aurélien Tchouaméni",
    "s": "Tchouaméni",
    "pos": "CDM",
    "r": 84,
    "pac": 75,
    "sho": 69,
    "pas": 84,
    "dri": 74,
    "def": 91,
    "phy": 86,
    "sm": 2,
    "wf": 3,
    "club": "Real Madrid",
    "nat": "France",
    "cat": "MID",
    "eaId": 10129
  },
  {
    "id": 130,
    "n": "Rafael Leão",
    "s": "Leão",
    "pos": "LW",
    "r": 84,
    "pac": 90,
    "sho": 83,
    "pas": 82,
    "dri": 87,
    "def": 52,
    "phy": 76,
    "sm": 5,
    "wf": 3,
    "club": "AC Milan",
    "nat": "Portugal",
    "cat": "FWD",
    "eaId": 10130
  },
  {
    "id": 131,
    "n": "Rodrygo",
    "s": "Rodrygo",
    "pos": "LW",
    "r": 84,
    "pac": 93,
    "sho": 85,
    "pas": 84,
    "dri": 87,
    "def": 53,
    "phy": 74,
    "sm": 5,
    "wf": 4,
    "club": "Real Madrid",
    "nat": "Brazil",
    "cat": "FWD",
    "eaId": 10131
  },
  {
    "id": 132,
    "n": "Dani Olmo",
    "s": "Olmo",
    "pos": "CAM",
    "r": 84,
    "pac": 81,
    "sho": 80,
    "pas": 89,
    "dri": 90,
    "def": 60,
    "phy": 77,
    "sm": 5,
    "wf": 3,
    "club": "FC Barcelona",
    "nat": "Spain",
    "cat": "MID",
    "eaId": 10132
  },
  {
    "id": 133,
    "n": "Felix Nmecha",
    "s": "Nmecha",
    "pos": "CM",
    "r": 84,
    "pac": 80,
    "sho": 75,
    "pas": 91,
    "dri": 82,
    "def": 76,
    "phy": 83,
    "sm": 4,
    "wf": 3,
    "club": "Borussia Dortmund",
    "nat": "Germany",
    "cat": "MID",
    "eaId": 10133
  },
  {
    "id": 134,
    "n": "Rayan Cherki",
    "s": "Cherki",
    "pos": "RW",
    "r": 84,
    "pac": 92,
    "sho": 79,
    "pas": 82,
    "dri": 91,
    "def": 50,
    "phy": 71,
    "sm": 4,
    "wf": 4,
    "club": "Manchester City",
    "nat": "France",
    "cat": "FWD",
    "eaId": 10134
  },
  {
    "id": 135,
    "n": "Jurriën Timber",
    "s": "Timber",
    "pos": "RB",
    "r": 84,
    "pac": 88,
    "sho": 63,
    "pas": 83,
    "dri": 78,
    "def": 85,
    "phy": 78,
    "sm": 3,
    "wf": 3,
    "club": "Arsenal",
    "nat": "Netherlands",
    "cat": "DEF",
    "eaId": 10135
  },
  {
    "id": 136,
    "n": "Morgan Rogers",
    "s": "Rogers",
    "pos": "CAM",
    "r": 84,
    "pac": 83,
    "sho": 81,
    "pas": 90,
    "dri": 87,
    "def": 56,
    "phy": 74,
    "sm": 4,
    "wf": 4,
    "club": "Aston Villa",
    "nat": "England",
    "cat": "MID",
    "eaId": 10136
  },
  {
    "id": 137,
    "n": "Bradley Barcola",
    "s": "Barcola",
    "pos": "LW",
    "r": 84,
    "pac": 91,
    "sho": 83,
    "pas": 81,
    "dri": 90,
    "def": 51,
    "phy": 71,
    "sm": 5,
    "wf": 4,
    "club": "Paris Saint-Germain",
    "nat": "France",
    "cat": "FWD",
    "eaId": 10137
  },
  {
    "id": 138,
    "n": "Wojciech Szczęsny",
    "s": "Szczęsny",
    "pos": "GK",
    "r": 83,
    "pac": 48,
    "sho": 29,
    "pas": 46,
    "dri": 36,
    "def": 25,
    "phy": 82,
    "sm": 1,
    "wf": 3,
    "club": "FC Barcelona",
    "nat": "Poland",
    "cat": "GK",
    "eaId": 10138
  },
  {
    "id": 139,
    "n": "Neymar Jr",
    "s": "Neymar Jr",
    "pos": "CAM",
    "r": 83,
    "pac": 79,
    "sho": 82,
    "pas": 85,
    "dri": 93,
    "def": 32,
    "phy": 59,
    "sm": 5,
    "wf": 5,
    "club": "Free Agent",
    "nat": "Brazil",
    "cat": "MID",
    "eaId": 10139
  },
  {
    "id": 140,
    "n": "Romelu Lukaku",
    "s": "Lukaku",
    "pos": "ST",
    "r": 83,
    "pac": 87,
    "sho": 90,
    "pas": 76,
    "dri": 79,
    "def": 47,
    "phy": 78,
    "sm": 4,
    "wf": 3,
    "club": "Napoli",
    "nat": "Belgium",
    "cat": "FWD",
    "eaId": 10140
  },
  {
    "id": 141,
    "n": "Henrikh Mkhitaryan",
    "s": "Mkhitaryan",
    "pos": "CM",
    "r": 83,
    "pac": 75,
    "sho": 77,
    "pas": 84,
    "dri": 84,
    "def": 73,
    "phy": 78,
    "sm": 3,
    "wf": 3,
    "club": "Inter",
    "nat": "Armenia",
    "cat": "MID",
    "eaId": 10141
  },
  {
    "id": 142,
    "n": "Stefan de Vrij",
    "s": "de Vrij",
    "pos": "CB",
    "r": 83,
    "pac": 71,
    "sho": 54,
    "pas": 69,
    "dri": 64,
    "def": 91,
    "phy": 89,
    "sm": 2,
    "wf": 4,
    "club": "Inter",
    "nat": "Netherlands",
    "cat": "DEF",
    "eaId": 10142
  },
  {
    "id": 143,
    "n": "Francesco Acerbi",
    "s": "Acerbi",
    "pos": "CB",
    "r": 83,
    "pac": 70,
    "sho": 57,
    "pas": 69,
    "dri": 61,
    "def": 86,
    "phy": 87,
    "sm": 1,
    "wf": 4,
    "club": "Inter",
    "nat": "Italy",
    "cat": "DEF",
    "eaId": 10143
  },
  {
    "id": 144,
    "n": "Willi Orban",
    "s": "Orban",
    "pos": "CB",
    "r": 83,
    "pac": 75,
    "sho": 58,
    "pas": 70,
    "dri": 60,
    "def": 90,
    "phy": 84,
    "sm": 1,
    "wf": 2,
    "club": "RB Leipzig",
    "nat": "Hungary",
    "cat": "DEF",
    "eaId": 10144
  },
  {
    "id": 145,
    "n": "Serge Gnabry",
    "s": "Gnabry",
    "pos": "CAM",
    "r": 83,
    "pac": 82,
    "sho": 84,
    "pas": 90,
    "dri": 87,
    "def": 58,
    "phy": 72,
    "sm": 5,
    "wf": 3,
    "club": "Bayern München",
    "nat": "Germany",
    "cat": "MID",
    "eaId": 10145
  },
  {
    "id": 146,
    "n": "Leandro Trossard",
    "s": "Trossard",
    "pos": "LW",
    "r": 83,
    "pac": 91,
    "sho": 79,
    "pas": 81,
    "dri": 90,
    "def": 52,
    "phy": 71,
    "sm": 4,
    "wf": 3,
    "club": "Arsenal",
    "nat": "Belgium",
    "cat": "FWD",
    "eaId": 10146
  },
  {
    "id": 147,
    "n": "Matthias Ginter",
    "s": "Ginter",
    "pos": "CB",
    "r": 83,
    "pac": 71,
    "sho": 54,
    "pas": 70,
    "dri": 59,
    "def": 87,
    "phy": 89,
    "sm": 2,
    "wf": 2,
    "club": "SC Freiburg",
    "nat": "Germany",
    "cat": "DEF",
    "eaId": 10147
  },
  {
    "id": 148,
    "n": "Sadio Mané",
    "s": "Mané",
    "pos": "LM",
    "r": 83,
    "pac": 87,
    "sho": 78,
    "pas": 82,
    "dri": 85,
    "def": 54,
    "phy": 78,
    "sm": 3,
    "wf": 4,
    "club": "Al Nassr",
    "nat": "Senegal",
    "cat": "MID",
    "eaId": 10148
  },
  {
    "id": 149,
    "n": "Ederson",
    "s": "Ederson",
    "pos": "GK",
    "r": 83,
    "pac": 47,
    "sho": 26,
    "pas": 46,
    "dri": 40,
    "def": 27,
    "phy": 80,
    "sm": 1,
    "wf": 3,
    "club": "Fenerbahçe",
    "nat": "Brazil",
    "cat": "GK",
    "eaId": 10149
  },
  {
    "id": 150,
    "n": "Rodrigo De Paul",
    "s": "De Paul",
    "pos": "CM",
    "r": 83,
    "pac": 77,
    "sho": 72,
    "pas": 87,
    "dri": 83,
    "def": 74,
    "phy": 79,
    "sm": 4,
    "wf": 3,
    "club": "Inter Miami",
    "nat": "Argentina",
    "cat": "MID",
    "eaId": 10150
  },
  {
    "id": 151,
    "n": "Stanislav Lobotka",
    "s": "Lobotka",
    "pos": "CM",
    "r": 83,
    "pac": 75,
    "sho": 77,
    "pas": 86,
    "dri": 83,
    "def": 70,
    "phy": 79,
    "sm": 2,
    "wf": 3,
    "club": "Napoli",
    "nat": "Slovakia",
    "cat": "MID",
    "eaId": 10151
  },
  {
    "id": 152,
    "n": "José María Giménez",
    "s": "Giménez",
    "pos": "CB",
    "r": 83,
    "pac": 75,
    "sho": 55,
    "pas": 68,
    "dri": 61,
    "def": 88,
    "phy": 89,
    "sm": 1,
    "wf": 4,
    "club": "Atlético de Madrid",
    "nat": "Uruguay",
    "cat": "DEF",
    "eaId": 10152
  },
  {
    "id": 153,
    "n": "Alexander Sørloth",
    "s": "Sørloth",
    "pos": "ST",
    "r": 83,
    "pac": 84,
    "sho": 89,
    "pas": 76,
    "dri": 79,
    "def": 44,
    "phy": 80,
    "sm": 3,
    "wf": 3,
    "club": "Atlético de Madrid",
    "nat": "Norway",
    "cat": "FWD",
    "eaId": 10153
  },
  {
    "id": 154,
    "n": "Giovanni Di Lorenzo",
    "s": "Di Lorenzo",
    "pos": "RB",
    "r": 83,
    "pac": 84,
    "sho": 60,
    "pas": 82,
    "dri": 82,
    "def": 84,
    "phy": 77,
    "sm": 3,
    "wf": 3,
    "club": "Napoli",
    "nat": "Italy",
    "cat": "DEF",
    "eaId": 10154
  },
  {
    "id": 155,
    "n": "Bernardo Silva",
    "s": "B. Silva",
    "pos": "CM",
    "r": 83,
    "pac": 78,
    "sho": 72,
    "pas": 90,
    "dri": 80,
    "def": 75,
    "phy": 83,
    "sm": 2,
    "wf": 3,
    "club": "Manchester City",
    "nat": "Portugal",
    "cat": "MID",
    "eaId": 10155
  },
  {
    "id": 156,
    "n": "Mattia Zaccagni",
    "s": "Zaccagni",
    "pos": "LW",
    "r": 83,
    "pac": 92,
    "sho": 80,
    "pas": 80,
    "dri": 85,
    "def": 54,
    "phy": 70,
    "sm": 5,
    "wf": 4,
    "club": "Lazio",
    "nat": "Italy",
    "cat": "FWD",
    "eaId": 10156
  },
  {
    "id": 157,
    "n": "James Maddison",
    "s": "Maddison",
    "pos": "CM",
    "r": 83,
    "pac": 75,
    "sho": 71,
    "pas": 88,
    "dri": 85,
    "def": 71,
    "phy": 79,
    "sm": 2,
    "wf": 3,
    "club": "Tottenham Hotspur",
    "nat": "England",
    "cat": "MID",
    "eaId": 10157
  },
  {
    "id": 158,
    "n": "Jarrod Bowen",
    "s": "Bowen",
    "pos": "RM",
    "r": 83,
    "pac": 89,
    "sho": 74,
    "pas": 81,
    "dri": 85,
    "def": 55,
    "phy": 72,
    "sm": 3,
    "wf": 3,
    "club": "West Ham United",
    "nat": "England",
    "cat": "MID",
    "eaId": 10158
  },
  {
    "id": 159,
    "n": "Ivan Provedel",
    "s": "Provedel",
    "pos": "GK",
    "r": 83,
    "pac": 45,
    "sho": 28,
    "pas": 46,
    "dri": 39,
    "def": 25,
    "phy": 81,
    "sm": 1,
    "wf": 2,
    "club": "Lazio",
    "nat": "Italy",
    "cat": "GK",
    "eaId": 10159
  },
  {
    "id": 160,
    "n": "Mikel Merino",
    "s": "Merino",
    "pos": "CM",
    "r": 83,
    "pac": 78,
    "sho": 71,
    "pas": 84,
    "dri": 84,
    "def": 72,
    "phy": 80,
    "sm": 4,
    "wf": 3,
    "club": "Arsenal",
    "nat": "Spain",
    "cat": "MID",
    "eaId": 10160
  },
  {
    "id": 161,
    "n": "Giorgian De Arrascaeta",
    "s": "De Arrascaeta",
    "pos": "CAM",
    "r": 83,
    "pac": 80,
    "sho": 84,
    "pas": 92,
    "dri": 90,
    "def": 58,
    "phy": 72,
    "sm": 5,
    "wf": 4,
    "club": "Free Agent",
    "nat": "Uruguay",
    "cat": "MID",
    "eaId": 10161
  },
  {
    "id": 162,
    "n": "André-Franck Zambo Anguissa",
    "s": "Anguissa",
    "pos": "CM",
    "r": 83,
    "pac": 78,
    "sho": 74,
    "pas": 84,
    "dri": 85,
    "def": 69,
    "phy": 78,
    "sm": 4,
    "wf": 3,
    "club": "Napoli",
    "nat": "Cameroon",
    "cat": "MID",
    "eaId": 10162
  },
  {
    "id": 163,
    "n": "Maximilian Mittelstädt",
    "s": "Mittelstädt",
    "pos": "LB",
    "r": 83,
    "pac": 88,
    "sho": 63,
    "pas": 77,
    "dri": 78,
    "def": 82,
    "phy": 75,
    "sm": 2,
    "wf": 2,
    "club": "VfB Stuttgart",
    "nat": "Germany",
    "cat": "DEF",
    "eaId": 10163
  },
  {
    "id": 164,
    "n": "Vangelis Pavlidis",
    "s": "Pavlidis",
    "pos": "ST",
    "r": 83,
    "pac": 86,
    "sho": 90,
    "pas": 74,
    "dri": 84,
    "def": 48,
    "phy": 80,
    "sm": 3,
    "wf": 4,
    "club": "Benfica",
    "nat": "Greece",
    "cat": "FWD",
    "eaId": 10164
  },
  {
    "id": 165,
    "n": "Manuel Akanji",
    "s": "Akanji",
    "pos": "CB",
    "r": 83,
    "pac": 72,
    "sho": 59,
    "pas": 66,
    "dri": 64,
    "def": 87,
    "phy": 83,
    "sm": 2,
    "wf": 4,
    "club": "Inter",
    "nat": "Switzerland",
    "cat": "DEF",
    "eaId": 10165
  },
  {
    "id": 166,
    "n": "Waldemar Anton",
    "s": "Anton",
    "pos": "CB",
    "r": 83,
    "pac": 72,
    "sho": 54,
    "pas": 64,
    "dri": 62,
    "def": 88,
    "phy": 89,
    "sm": 2,
    "wf": 3,
    "club": "Borussia Dortmund",
    "nat": "Germany",
    "cat": "DEF",
    "eaId": 10166
  },
  {
    "id": 167,
    "n": "Mikel Oyarzabal",
    "s": "Oyarzabal",
    "pos": "ST",
    "r": 83,
    "pac": 88,
    "sho": 84,
    "pas": 75,
    "dri": 83,
    "def": 42,
    "phy": 84,
    "sm": 5,
    "wf": 3,
    "club": "Real Sociedad",
    "nat": "Spain",
    "cat": "FWD",
    "eaId": 10167
  },
  {
    "id": 168,
    "n": "Ronaldo Cabrais",
    "s": "Cabrais",
    "pos": "CAM",
    "r": 83,
    "pac": 81,
    "sho": 82,
    "pas": 92,
    "dri": 86,
    "def": 60,
    "phy": 71,
    "sm": 4,
    "wf": 3,
    "club": "Botafogo",
    "nat": "Brazil",
    "cat": "MID",
    "eaId": 10168
  },
  {
    "id": 169,
    "n": "Ademola Lookman",
    "s": "Lookman",
    "pos": "ST",
    "r": 83,
    "pac": 84,
    "sho": 88,
    "pas": 71,
    "dri": 83,
    "def": 46,
    "phy": 79,
    "sm": 5,
    "wf": 4,
    "club": "Atlético de Madrid",
    "nat": "Nigeria",
    "cat": "FWD",
    "eaId": 10169
  },
  {
    "id": 170,
    "n": "Exequiel Palacios",
    "s": "Palacios",
    "pos": "CM",
    "r": 83,
    "pac": 75,
    "sho": 74,
    "pas": 84,
    "dri": 81,
    "def": 75,
    "phy": 80,
    "sm": 4,
    "wf": 3,
    "club": "Bayer 04 Leverkusen",
    "nat": "Argentina",
    "cat": "MID",
    "eaId": 10170
  },
  {
    "id": 171,
    "n": "Riccardo Orsolini",
    "s": "Orsolini",
    "pos": "RM",
    "r": 83,
    "pac": 84,
    "sho": 80,
    "pas": 81,
    "dri": 87,
    "def": 56,
    "phy": 75,
    "sm": 3,
    "wf": 4,
    "club": "Bologna",
    "nat": "Italy",
    "cat": "MID",
    "eaId": 10171
  },
  {
    "id": 172,
    "n": "Alphonso Davies",
    "s": "Davies",
    "pos": "LB",
    "r": 83,
    "pac": 83,
    "sho": 63,
    "pas": 78,
    "dri": 79,
    "def": 81,
    "phy": 78,
    "sm": 3,
    "wf": 3,
    "club": "Bayern München",
    "nat": "Canada",
    "cat": "DEF",
    "eaId": 10172
  },
  {
    "id": 173,
    "n": "Moise Kean",
    "s": "Kean",
    "pos": "ST",
    "r": 83,
    "pac": 83,
    "sho": 87,
    "pas": 74,
    "dri": 81,
    "def": 47,
    "phy": 81,
    "sm": 4,
    "wf": 4,
    "club": "Fiorentina",
    "nat": "Italy",
    "cat": "FWD",
    "eaId": 10173
  },
  {
    "id": 174,
    "n": "David Raum",
    "s": "Raum",
    "pos": "LB",
    "r": 83,
    "pac": 87,
    "sho": 63,
    "pas": 82,
    "dri": 77,
    "def": 82,
    "phy": 80,
    "sm": 2,
    "wf": 2,
    "club": "RB Leipzig",
    "nat": "Germany",
    "cat": "DEF",
    "eaId": 10174
  },
  {
    "id": 175,
    "n": "Matheus Cunha",
    "s": "Cunha",
    "pos": "CAM",
    "r": 83,
    "pac": 83,
    "sho": 80,
    "pas": 90,
    "dri": 87,
    "def": 55,
    "phy": 75,
    "sm": 5,
    "wf": 3,
    "club": "Manchester United",
    "nat": "Brazil",
    "cat": "MID",
    "eaId": 10175
  },
  {
    "id": 176,
    "n": "Moussa Diaby",
    "s": "Diaby",
    "pos": "RM",
    "r": 83,
    "pac": 85,
    "sho": 74,
    "pas": 82,
    "dri": 87,
    "def": 55,
    "phy": 72,
    "sm": 5,
    "wf": 4,
    "club": "Al Ittihad",
    "nat": "France",
    "cat": "MID",
    "eaId": 10176
  },
  {
    "id": 177,
    "n": "Cody Gakpo",
    "s": "Gakpo",
    "pos": "LM",
    "r": 83,
    "pac": 85,
    "sho": 79,
    "pas": 85,
    "dri": 82,
    "def": 56,
    "phy": 74,
    "sm": 5,
    "wf": 4,
    "club": "Liverpool",
    "nat": "Netherlands",
    "cat": "MID",
    "eaId": 10177
  },
  {
    "id": 178,
    "n": "Amir Rrahmani",
    "s": "Rrahmani",
    "pos": "CB",
    "r": 83,
    "pac": 69,
    "sho": 58,
    "pas": 67,
    "dri": 62,
    "def": 90,
    "phy": 84,
    "sm": 1,
    "wf": 3,
    "club": "Napoli",
    "nat": "Kosovo",
    "cat": "DEF",
    "eaId": 10178
  },
  {
    "id": 179,
    "n": "Morten Hjulmand",
    "s": "Hjulmand",
    "pos": "CDM",
    "r": 83,
    "pac": 76,
    "sho": 67,
    "pas": 82,
    "dri": 74,
    "def": 87,
    "phy": 88,
    "sm": 2,
    "wf": 3,
    "club": "Sporting CP",
    "nat": "Denmark",
    "cat": "MID",
    "eaId": 10179
  },
  {
    "id": 180,
    "n": "Trincão",
    "s": "Trincão",
    "pos": "CAM",
    "r": 83,
    "pac": 79,
    "sho": 83,
    "pas": 90,
    "dri": 89,
    "def": 58,
    "phy": 74,
    "sm": 5,
    "wf": 3,
    "club": "Sporting CP",
    "nat": "Portugal",
    "cat": "MID",
    "eaId": 10180
  },
  {
    "id": 181,
    "n": "Eric García",
    "s": "E. García",
    "pos": "CB",
    "r": 83,
    "pac": 71,
    "sho": 56,
    "pas": 67,
    "dri": 59,
    "def": 85,
    "phy": 88,
    "sm": 1,
    "wf": 4,
    "club": "FC Barcelona",
    "nat": "Spain",
    "cat": "DEF",
    "eaId": 10181
  },
  {
    "id": 182,
    "n": "Mason Greenwood",
    "s": "Greenwood",
    "pos": "RM",
    "r": 83,
    "pac": 85,
    "sho": 80,
    "pas": 82,
    "dri": 87,
    "def": 59,
    "phy": 73,
    "sm": 4,
    "wf": 4,
    "club": "Olympique de Marseille",
    "nat": "England",
    "cat": "MID",
    "eaId": 10182
  },
  {
    "id": 183,
    "n": "Jérémy Doku",
    "s": "Doku",
    "pos": "LW",
    "r": 83,
    "pac": 92,
    "sho": 80,
    "pas": 81,
    "dri": 89,
    "def": 49,
    "phy": 69,
    "sm": 5,
    "wf": 3,
    "club": "Manchester City",
    "nat": "Belgium",
    "cat": "FWD",
    "eaId": 10183
  },
  {
    "id": 184,
    "n": "Dávid Hancko",
    "s": "Hancko",
    "pos": "LB",
    "r": 83,
    "pac": 88,
    "sho": 65,
    "pas": 80,
    "dri": 82,
    "def": 82,
    "phy": 80,
    "sm": 3,
    "wf": 3,
    "club": "Atlético de Madrid",
    "nat": "Slovakia",
    "cat": "DEF",
    "eaId": 10184
  },
  {
    "id": 185,
    "n": "Dejan Kulusevski",
    "s": "Kulusevski",
    "pos": "CM",
    "r": 83,
    "pac": 79,
    "sho": 77,
    "pas": 87,
    "dri": 85,
    "def": 71,
    "phy": 78,
    "sm": 3,
    "wf": 3,
    "club": "Tottenham Hotspur",
    "nat": "Sweden",
    "cat": "MID",
    "eaId": 10185
  },
  {
    "id": 186,
    "n": "Angelo Stiller",
    "s": "Stiller",
    "pos": "CDM",
    "r": 83,
    "pac": 76,
    "sho": 70,
    "pas": 85,
    "dri": 78,
    "def": 89,
    "phy": 89,
    "sm": 3,
    "wf": 3,
    "club": "VfB Stuttgart",
    "nat": "Germany",
    "cat": "MID",
    "eaId": 10186
  },
  {
    "id": 187,
    "n": "Piero Hincapié",
    "s": "Hincapié",
    "pos": "LB",
    "r": 83,
    "pac": 82,
    "sho": 60,
    "pas": 81,
    "dri": 81,
    "def": 80,
    "phy": 79,
    "sm": 2,
    "wf": 2,
    "club": "Arsenal",
    "nat": "Ecuador",
    "cat": "DEF",
    "eaId": 10187
  },
  {
    "id": 188,
    "n": "Omar Marmoush",
    "s": "Marmoush",
    "pos": "LW",
    "r": 83,
    "pac": 86,
    "sho": 81,
    "pas": 78,
    "dri": 89,
    "def": 50,
    "phy": 71,
    "sm": 4,
    "wf": 3,
    "club": "Manchester City",
    "nat": "Egypt",
    "cat": "FWD",
    "eaId": 10188
  },
  {
    "id": 189,
    "n": "Giorgi Mamardashvili",
    "s": "Mamardashvili",
    "pos": "GK",
    "r": 83,
    "pac": 42,
    "sho": 28,
    "pas": 46,
    "dri": 37,
    "def": 24,
    "phy": 83,
    "sm": 1,
    "wf": 3,
    "club": "Liverpool",
    "nat": "Georgia",
    "cat": "GK",
    "eaId": 10189
  },
  {
    "id": 190,
    "n": "Alejandro Balde",
    "s": "Balde",
    "pos": "LB",
    "r": 83,
    "pac": 88,
    "sho": 59,
    "pas": 77,
    "dri": 82,
    "def": 82,
    "phy": 75,
    "sm": 4,
    "wf": 4,
    "club": "FC Barcelona",
    "nat": "Spain",
    "cat": "DEF",
    "eaId": 10190
  },
  {
    "id": 191,
    "n": "Gavi",
    "s": "Gavi",
    "pos": "CM",
    "r": 83,
    "pac": 79,
    "sho": 72,
    "pas": 87,
    "dri": 83,
    "def": 75,
    "phy": 77,
    "sm": 2,
    "wf": 3,
    "club": "FC Barcelona",
    "nat": "Spain",
    "cat": "MID",
    "eaId": 10191
  },
  {
    "id": 192,
    "n": "Arda Güler",
    "s": "Güler",
    "pos": "RM",
    "r": 83,
    "pac": 84,
    "sho": 74,
    "pas": 82,
    "dri": 88,
    "def": 53,
    "phy": 75,
    "sm": 3,
    "wf": 3,
    "club": "Real Madrid",
    "nat": "Türkiye",
    "cat": "MID",
    "eaId": 10192
  },
  {
    "id": 193,
    "n": "Warren Zaïre-Emery",
    "s": "Zaïre-Emery",
    "pos": "CM",
    "r": 83,
    "pac": 74,
    "sho": 74,
    "pas": 90,
    "dri": 85,
    "def": 75,
    "phy": 83,
    "sm": 3,
    "wf": 3,
    "club": "Paris Saint-Germain",
    "nat": "France",
    "cat": "MID",
    "eaId": 10193
  },
  {
    "id": 194,
    "n": "Pablo Barrios",
    "s": "Barrios",
    "pos": "CM",
    "r": 83,
    "pac": 80,
    "sho": 77,
    "pas": 89,
    "dri": 85,
    "def": 73,
    "phy": 77,
    "sm": 4,
    "wf": 3,
    "club": "Atlético de Madrid",
    "nat": "Spain",
    "cat": "MID",
    "eaId": 10194
  },
  {
    "id": 195,
    "n": "Fermín López",
    "s": "Fermín",
    "pos": "CAM",
    "r": 83,
    "pac": 78,
    "sho": 80,
    "pas": 92,
    "dri": 88,
    "def": 56,
    "phy": 75,
    "sm": 4,
    "wf": 3,
    "club": "FC Barcelona",
    "nat": "Spain",
    "cat": "MID",
    "eaId": 10195
  },
  {
    "id": 196,
    "n": "Pau Cubarsí",
    "s": "Cubarsí",
    "pos": "CB",
    "r": 83,
    "pac": 70,
    "sho": 54,
    "pas": 67,
    "dri": 63,
    "def": 91,
    "phy": 83,
    "sm": 1,
    "wf": 3,
    "club": "FC Barcelona",
    "nat": "Spain",
    "cat": "DEF",
    "eaId": 10196
  },
  {
    "id": 197,
    "n": "Thiago Silva",
    "s": "Thiago Silva",
    "pos": "CB",
    "r": 82,
    "pac": 71,
    "sho": 53,
    "pas": 64,
    "dri": 62,
    "def": 86,
    "phy": 85,
    "sm": 2,
    "wf": 4,
    "club": "FC Porto",
    "nat": "Brazil",
    "cat": "DEF",
    "eaId": 10197
  },
  {
    "id": 198,
    "n": "Manuel Neuer",
    "s": "Neuer",
    "pos": "GK",
    "r": 82,
    "pac": 48,
    "sho": 25,
    "pas": 58,
    "dri": 52,
    "def": 22,
    "phy": 80,
    "sm": 1,
    "wf": 3,
    "club": "Bayern München",
    "nat": "Germany",
    "cat": "GK",
    "eaId": 10198
  },
  {
    "id": 199,
    "n": "Ángel Di María",
    "s": "Di María",
    "pos": "RW",
    "r": 82,
    "pac": 86,
    "sho": 83,
    "pas": 76,
    "dri": 87,
    "def": 50,
    "phy": 74,
    "sm": 5,
    "wf": 4,
    "club": "Rosario Central",
    "nat": "Argentina",
    "cat": "FWD",
    "eaId": 10199
  },
  {
    "id": 200,
    "n": "Ante Budimir",
    "s": "Budimir",
    "pos": "ST",
    "r": 82,
    "pac": 85,
    "sho": 87,
    "pas": 73,
    "dri": 79,
    "def": 46,
    "phy": 81,
    "sm": 3,
    "wf": 4,
    "club": "CA Osasuna",
    "nat": "Croatia",
    "cat": "FWD",
    "eaId": 10200
  },
  {
    "id": 201,
    "n": "Iago Aspas",
    "s": "Aspas",
    "pos": "RW",
    "r": 82,
    "pac": 86,
    "sho": 83,
    "pas": 80,
    "dri": 90,
    "def": 51,
    "phy": 70,
    "sm": 5,
    "wf": 3,
    "club": "RC Celta de Vigo",
    "nat": "Spain",
    "cat": "FWD",
    "eaId": 10201
  },
  {
    "id": 202,
    "n": "Koen Casteels",
    "s": "Casteels",
    "pos": "GK",
    "r": 82,
    "pac": 47,
    "sho": 29,
    "pas": 39,
    "dri": 38,
    "def": 25,
    "phy": 78,
    "sm": 1,
    "wf": 4,
    "club": "Al Qadsiah",
    "nat": "Belgium",
    "cat": "GK",
    "eaId": 10202
  },
  {
    "id": 203,
    "n": "Casemiro",
    "s": "Casemiro",
    "pos": "CDM",
    "r": 82,
    "pac": 72,
    "sho": 63,
    "pas": 78,
    "dri": 73,
    "def": 84,
    "phy": 82,
    "sm": 3,
    "wf": 3,
    "club": "Manchester United",
    "nat": "Brazil",
    "cat": "MID",
    "eaId": 10203
  },
  {
    "id": 204,
    "n": "Kalidou Koulibaly",
    "s": "Koulibaly",
    "pos": "CB",
    "r": 82,
    "pac": 74,
    "sho": 52,
    "pas": 66,
    "dri": 58,
    "def": 87,
    "phy": 83,
    "sm": 2,
    "wf": 4,
    "club": "Al Hilal",
    "nat": "Senegal",
    "cat": "DEF",
    "eaId": 10204
  },
  {
    "id": 205,
    "n": "Remo Freuler",
    "s": "Freuler",
    "pos": "CDM",
    "r": 82,
    "pac": 72,
    "sho": 66,
    "pas": 84,
    "dri": 77,
    "def": 89,
    "phy": 88,
    "sm": 3,
    "wf": 3,
    "club": "Bologna",
    "nat": "Switzerland",
    "cat": "MID",
    "eaId": 10205
  },
  {
    "id": 206,
    "n": "John Stones",
    "s": "Stones",
    "pos": "CB",
    "r": 82,
    "pac": 74,
    "sho": 54,
    "pas": 63,
    "dri": 62,
    "def": 84,
    "phy": 88,
    "sm": 1,
    "wf": 3,
    "club": "Manchester City",
    "nat": "England",
    "cat": "DEF",
    "eaId": 10206
  },
  {
    "id": 207,
    "n": "Konstantinos Fortounis",
    "s": "Fortounis",
    "pos": "CAM",
    "r": 82,
    "pac": 81,
    "sho": 79,
    "pas": 88,
    "dri": 88,
    "def": 56,
    "phy": 71,
    "sm": 4,
    "wf": 3,
    "club": "Al Khaleej",
    "nat": "Greece",
    "cat": "MID",
    "eaId": 10207
  },
  {
    "id": 208,
    "n": "Jack Grealish",
    "s": "Grealish",
    "pos": "LM",
    "r": 82,
    "pac": 88,
    "sho": 78,
    "pas": 78,
    "dri": 86,
    "def": 52,
    "phy": 71,
    "sm": 3,
    "wf": 3,
    "club": "Everton",
    "nat": "England",
    "cat": "MID",
    "eaId": 10208
  },
  {
    "id": 209,
    "n": "Mateo Kovačić",
    "s": "Kovačić",
    "pos": "CM",
    "r": 82,
    "pac": 78,
    "sho": 75,
    "pas": 86,
    "dri": 80,
    "def": 68,
    "phy": 78,
    "sm": 4,
    "wf": 3,
    "club": "Manchester City",
    "nat": "Croatia",
    "cat": "MID",
    "eaId": 10209
  },
  {
    "id": 210,
    "n": "Emre Can",
    "s": "Emre Can",
    "pos": "CB",
    "r": 82,
    "pac": 72,
    "sho": 55,
    "pas": 65,
    "dri": 62,
    "def": 88,
    "phy": 82,
    "sm": 1,
    "wf": 3,
    "club": "Borussia Dortmund",
    "nat": "Germany",
    "cat": "DEF",
    "eaId": 10210
  },
  {
    "id": 211,
    "n": "Nathan Aké",
    "s": "Aké",
    "pos": "CB",
    "r": 82,
    "pac": 68,
    "sho": 58,
    "pas": 66,
    "dri": 62,
    "def": 84,
    "phy": 83,
    "sm": 2,
    "wf": 4,
    "club": "Manchester City",
    "nat": "Netherlands",
    "cat": "DEF",
    "eaId": 10211
  },
  {
    "id": 212,
    "n": "Fabinho",
    "s": "Fabinho",
    "pos": "CDM",
    "r": 82,
    "pac": 75,
    "sho": 69,
    "pas": 81,
    "dri": 74,
    "def": 88,
    "phy": 83,
    "sm": 2,
    "wf": 3,
    "club": "Al Ittihad",
    "nat": "Brazil",
    "cat": "MID",
    "eaId": 10212
  },
  {
    "id": 213,
    "n": "Yassine Bounou",
    "s": "Bounou",
    "pos": "GK",
    "r": 82,
    "pac": 41,
    "sho": 24,
    "pas": 39,
    "dri": 35,
    "def": 24,
    "phy": 78,
    "sm": 1,
    "wf": 2,
    "club": "Al Hilal",
    "nat": "Morocco",
    "cat": "GK",
    "eaId": 10213
  },
  {
    "id": 214,
    "n": "Fabian Schär",
    "s": "Schär",
    "pos": "CB",
    "r": 82,
    "pac": 69,
    "sho": 52,
    "pas": 65,
    "dri": 62,
    "def": 85,
    "phy": 88,
    "sm": 2,
    "wf": 3,
    "club": "Newcastle United",
    "nat": "Switzerland",
    "cat": "DEF",
    "eaId": 10214
  },
  {
    "id": 215,
    "n": "Alessio Romagnoli",
    "s": "Romagnoli",
    "pos": "CB",
    "r": 82,
    "pac": 73,
    "sho": 58,
    "pas": 64,
    "dri": 64,
    "def": 84,
    "phy": 82,
    "sm": 2,
    "wf": 4,
    "club": "Lazio",
    "nat": "Italy",
    "cat": "DEF",
    "eaId": 10215
  },
  {
    "id": 216,
    "n": "Salem Al Dawsari",
    "s": "Al Dawsari",
    "pos": "LM",
    "r": 82,
    "pac": 86,
    "sho": 75,
    "pas": 81,
    "dri": 85,
    "def": 58,
    "phy": 76,
    "sm": 3,
    "wf": 3,
    "club": "Al Hilal",
    "nat": "Saudi Arabia",
    "cat": "MID",
    "eaId": 10216
  },
  {
    "id": 217,
    "n": "Wladimiro Falcone",
    "s": "Falcone",
    "pos": "GK",
    "r": 82,
    "pac": 47,
    "sho": 25,
    "pas": 45,
    "dri": 33,
    "def": 27,
    "phy": 78,
    "sm": 1,
    "wf": 2,
    "club": "Lecce",
    "nat": "Italy",
    "cat": "GK",
    "eaId": 10217
  },
  {
    "id": 218,
    "n": "Domenico Berardi",
    "s": "Berardi",
    "pos": "RW",
    "r": 82,
    "pac": 89,
    "sho": 80,
    "pas": 79,
    "dri": 86,
    "def": 53,
    "phy": 72,
    "sm": 5,
    "wf": 3,
    "club": "Sassuolo",
    "nat": "Italy",
    "cat": "FWD",
    "eaId": 10218
  },
  {
    "id": 219,
    "n": "Julian Brandt",
    "s": "Brandt",
    "pos": "CAM",
    "r": 82,
    "pac": 79,
    "sho": 83,
    "pas": 85,
    "dri": 87,
    "def": 59,
    "phy": 73,
    "sm": 4,
    "wf": 3,
    "club": "Borussia Dortmund",
    "nat": "Germany",
    "cat": "MID",
    "eaId": 10219
  },
  {
    "id": 220,
    "n": "Aymeric Laporte",
    "s": "Laporte",
    "pos": "CB",
    "r": 82,
    "pac": 69,
    "sho": 53,
    "pas": 68,
    "dri": 63,
    "def": 86,
    "phy": 88,
    "sm": 2,
    "wf": 4,
    "club": "Athletic Club de Bilbao",
    "nat": "Spain",
    "cat": "DEF",
    "eaId": 10220
  },
  {
    "id": 221,
    "n": "Ivan Toney",
    "s": "Toney",
    "pos": "ST",
    "r": 82,
    "pac": 86,
    "sho": 89,
    "pas": 71,
    "dri": 79,
    "def": 46,
    "phy": 82,
    "sm": 5,
    "wf": 3,
    "club": "Al Ahli",
    "nat": "England",
    "cat": "FWD",
    "eaId": 10221
  },
  {
    "id": 222,
    "n": "Kingsley Coman",
    "s": "Coman",
    "pos": "RM",
    "r": 82,
    "pac": 84,
    "sho": 77,
    "pas": 83,
    "dri": 81,
    "def": 58,
    "phy": 75,
    "sm": 5,
    "wf": 4,
    "club": "Al Nassr",
    "nat": "France",
    "cat": "MID",
    "eaId": 10222
  },
  {
    "id": 223,
    "n": "Rafa",
    "s": "Rafa",
    "pos": "CAM",
    "r": 82,
    "pac": 82,
    "sho": 84,
    "pas": 87,
    "dri": 89,
    "def": 59,
    "phy": 73,
    "sm": 5,
    "wf": 4,
    "club": "Benfica",
    "nat": "Portugal",
    "cat": "MID",
    "eaId": 10223
  },
  {
    "id": 224,
    "n": "Corentin Tolisso",
    "s": "Tolisso",
    "pos": "CM",
    "r": 82,
    "pac": 74,
    "sho": 73,
    "pas": 85,
    "dri": 85,
    "def": 70,
    "phy": 80,
    "sm": 4,
    "wf": 3,
    "club": "Olympique Lyonnais",
    "nat": "France",
    "cat": "MID",
    "eaId": 10224
  },
  {
    "id": 225,
    "n": "Ollie Watkins",
    "s": "Watkins",
    "pos": "ST",
    "r": 82,
    "pac": 87,
    "sho": 89,
    "pas": 70,
    "dri": 83,
    "def": 41,
    "phy": 80,
    "sm": 3,
    "wf": 3,
    "club": "Aston Villa",
    "nat": "England",
    "cat": "FWD",
    "eaId": 10225
  },
  {
    "id": 226,
    "n": "Malcom",
    "s": "Malcom",
    "pos": "RW",
    "r": 82,
    "pac": 87,
    "sho": 78,
    "pas": 77,
    "dri": 90,
    "def": 47,
    "phy": 74,
    "sm": 4,
    "wf": 3,
    "club": "Al Hilal",
    "nat": "Brazil",
    "cat": "FWD",
    "eaId": 10226
  },
  {
    "id": 227,
    "n": "Lucas Torreira",
    "s": "Torreira",
    "pos": "CDM",
    "r": 82,
    "pac": 70,
    "sho": 64,
    "pas": 81,
    "dri": 73,
    "def": 86,
    "phy": 85,
    "sm": 2,
    "wf": 3,
    "club": "Galatasaray",
    "nat": "Uruguay",
    "cat": "MID",
    "eaId": 10227
  },
  {
    "id": 228,
    "n": "Alex Meret",
    "s": "Meret",
    "pos": "GK",
    "r": 82,
    "pac": 44,
    "sho": 26,
    "pas": 41,
    "dri": 34,
    "def": 26,
    "phy": 80,
    "sm": 1,
    "wf": 2,
    "club": "Napoli",
    "nat": "Italy",
    "cat": "GK",
    "eaId": 10228
  },
  {
    "id": 229,
    "n": "Álex Remiro",
    "s": "Remiro",
    "pos": "GK",
    "r": 82,
    "pac": 44,
    "sho": 27,
    "pas": 45,
    "dri": 34,
    "def": 23,
    "phy": 80,
    "sm": 1,
    "wf": 2,
    "club": "Real Sociedad",
    "nat": "Spain",
    "cat": "GK",
    "eaId": 10229
  },
  {
    "id": 230,
    "n": "Palhinha",
    "s": "Palhinha",
    "pos": "CDM",
    "r": 82,
    "pac": 72,
    "sho": 64,
    "pas": 81,
    "dri": 73,
    "def": 86,
    "phy": 84,
    "sm": 3,
    "wf": 3,
    "club": "Tottenham Hotspur",
    "nat": "Portugal",
    "cat": "MID",
    "eaId": 10230
  },
  {
    "id": 231,
    "n": "Lucas Mantela",
    "s": "Mantela",
    "pos": "GK",
    "r": 82,
    "pac": 47,
    "sho": 27,
    "pas": 40,
    "dri": 38,
    "def": 29,
    "phy": 79,
    "sm": 1,
    "wf": 2,
    "club": "Palmeiras",
    "nat": "Brazil",
    "cat": "GK",
    "eaId": 10231
  },
  {
    "id": 232,
    "n": "Josué Chiamulera",
    "s": "Chiamulera",
    "pos": "CB",
    "r": 82,
    "pac": 72,
    "sho": 53,
    "pas": 67,
    "dri": 59,
    "def": 88,
    "phy": 87,
    "sm": 1,
    "wf": 2,
    "club": "Santos",
    "nat": "Brazil",
    "cat": "DEF",
    "eaId": 10232
  },
  {
    "id": 233,
    "n": "Marcus Rashford",
    "s": "Rashford",
    "pos": "LW",
    "r": 82,
    "pac": 88,
    "sho": 79,
    "pas": 79,
    "dri": 87,
    "def": 52,
    "phy": 70,
    "sm": 4,
    "wf": 3,
    "club": "FC Barcelona",
    "nat": "England",
    "cat": "FWD",
    "eaId": 10233
  },
  {
    "id": 234,
    "n": "Benjamin White",
    "s": "B. White",
    "pos": "RB",
    "r": 82,
    "pac": 86,
    "sho": 62,
    "pas": 79,
    "dri": 76,
    "def": 81,
    "phy": 76,
    "sm": 4,
    "wf": 4,
    "club": "Arsenal",
    "nat": "England",
    "cat": "DEF",
    "eaId": 10234
  },
  {
    "id": 235,
    "n": "Cristian Romero",
    "s": "Romero",
    "pos": "CB",
    "r": 82,
    "pac": 68,
    "sho": 55,
    "pas": 67,
    "dri": 61,
    "def": 89,
    "phy": 88,
    "sm": 2,
    "wf": 3,
    "club": "Tottenham Hotspur",
    "nat": "Argentina",
    "cat": "DEF",
    "eaId": 10235
  },
  {
    "id": 236,
    "n": "Dean Henderson",
    "s": "Henderson",
    "pos": "GK",
    "r": 82,
    "pac": 44,
    "sho": 27,
    "pas": 43,
    "dri": 36,
    "def": 23,
    "phy": 78,
    "sm": 1,
    "wf": 3,
    "club": "Crystal Palace",
    "nat": "England",
    "cat": "GK",
    "eaId": 10236
  },
  {
    "id": 237,
    "n": "Matthijs de Ligt",
    "s": "de Ligt",
    "pos": "CB",
    "r": 82,
    "pac": 70,
    "sho": 55,
    "pas": 69,
    "dri": 62,
    "def": 89,
    "phy": 84,
    "sm": 1,
    "wf": 2,
    "club": "Manchester United",
    "nat": "Netherlands",
    "cat": "DEF",
    "eaId": 10237
  },
  {
    "id": 238,
    "n": "Kai Havertz",
    "s": "Havertz",
    "pos": "ST",
    "r": 82,
    "pac": 82,
    "sho": 85,
    "pas": 72,
    "dri": 83,
    "def": 42,
    "phy": 81,
    "sm": 4,
    "wf": 4,
    "club": "Arsenal",
    "nat": "Germany",
    "cat": "FWD",
    "eaId": 10238
  },
  {
    "id": 239,
    "n": "Jean-Philippe Mateta",
    "s": "Mateta",
    "pos": "ST",
    "r": 82,
    "pac": 86,
    "sho": 89,
    "pas": 74,
    "dri": 80,
    "def": 47,
    "phy": 83,
    "sm": 5,
    "wf": 3,
    "club": "Crystal Palace",
    "nat": "France",
    "cat": "FWD",
    "eaId": 10239
  },
  {
    "id": 240,
    "n": "Mattéo Guendouzi",
    "s": "Guendouzi",
    "pos": "CM",
    "r": 82,
    "pac": 76,
    "sho": 70,
    "pas": 84,
    "dri": 82,
    "def": 70,
    "phy": 82,
    "sm": 2,
    "wf": 3,
    "club": "Fenerbahçe",
    "nat": "France",
    "cat": "MID",
    "eaId": 10240
  },
  {
    "id": 241,
    "n": "Kim Min Jae",
    "s": "Kim Min Jae",
    "pos": "CB",
    "r": 82,
    "pac": 68,
    "sho": 56,
    "pas": 64,
    "dri": 59,
    "def": 84,
    "phy": 82,
    "sm": 1,
    "wf": 4,
    "club": "Bayern München",
    "nat": "Republic of Korea",
    "cat": "DEF",
    "eaId": 10241
  },
  {
    "id": 242,
    "n": "Daniel Muñoz",
    "s": "Muñoz",
    "pos": "RB",
    "r": 82,
    "pac": 83,
    "sho": 62,
    "pas": 76,
    "dri": 77,
    "def": 83,
    "phy": 74,
    "sm": 3,
    "wf": 3,
    "club": "Crystal Palace",
    "nat": "Colombia",
    "cat": "DEF",
    "eaId": 10242
  },
  {
    "id": 243,
    "n": "Pedro Neto",
    "s": "P. Neto",
    "pos": "RM",
    "r": 82,
    "pac": 83,
    "sho": 74,
    "pas": 79,
    "dri": 86,
    "def": 57,
    "phy": 77,
    "sm": 5,
    "wf": 3,
    "club": "Chelsea",
    "nat": "Portugal",
    "cat": "MID",
    "eaId": 10243
  },
  {
    "id": 244,
    "n": "Matvey Safonov",
    "s": "Safonov",
    "pos": "GK",
    "r": 82,
    "pac": 45,
    "sho": 29,
    "pas": 42,
    "dri": 33,
    "def": 26,
    "phy": 83,
    "sm": 1,
    "wf": 4,
    "club": "Paris Saint-Germain",
    "nat": "Russia",
    "cat": "GK",
    "eaId": 10244
  },
  {
    "id": 245,
    "n": "Pedro Gonçalves",
    "s": "Pote",
    "pos": "LM",
    "r": 82,
    "pac": 88,
    "sho": 74,
    "pas": 84,
    "dri": 81,
    "def": 55,
    "phy": 74,
    "sm": 3,
    "wf": 4,
    "club": "Sporting CP",
    "nat": "Portugal",
    "cat": "MID",
    "eaId": 10245
  },
  {
    "id": 246,
    "n": "Mateo Retegui",
    "s": "Retegui",
    "pos": "ST",
    "r": 82,
    "pac": 88,
    "sho": 84,
    "pas": 71,
    "dri": 78,
    "def": 46,
    "phy": 77,
    "sm": 3,
    "wf": 3,
    "club": "Al Qadsiah",
    "nat": "Italy",
    "cat": "FWD",
    "eaId": 10246
  },
  {
    "id": 247,
    "n": "Anthony Gordon",
    "s": "Gordon",
    "pos": "LW",
    "r": 82,
    "pac": 85,
    "sho": 77,
    "pas": 78,
    "dri": 90,
    "def": 47,
    "phy": 68,
    "sm": 5,
    "wf": 4,
    "club": "Newcastle United",
    "nat": "England",
    "cat": "FWD",
    "eaId": 10247
  },
  {
    "id": 248,
    "n": "Alessandro Buongiorno",
    "s": "Buongiorno",
    "pos": "CB",
    "r": 82,
    "pac": 71,
    "sho": 54,
    "pas": 64,
    "dri": 62,
    "def": 88,
    "phy": 84,
    "sm": 2,
    "wf": 3,
    "club": "Napoli",
    "nat": "Italy",
    "cat": "DEF",
    "eaId": 10248
  },
  {
    "id": 249,
    "n": "Orkun Kökçü",
    "s": "Kökçü",
    "pos": "CM",
    "r": 82,
    "pac": 73,
    "sho": 73,
    "pas": 87,
    "dri": 79,
    "def": 73,
    "phy": 76,
    "sm": 3,
    "wf": 3,
    "club": "Beşiktaş",
    "nat": "Türkiye",
    "cat": "MID",
    "eaId": 10249
  },
  {
    "id": 250,
    "n": "Pedro Porro",
    "s": "Porro",
    "pos": "RB",
    "r": 82,
    "pac": 83,
    "sho": 64,
    "pas": 75,
    "dri": 77,
    "def": 83,
    "phy": 78,
    "sm": 4,
    "wf": 4,
    "club": "Tottenham Hotspur",
    "nat": "Spain",
    "cat": "DEF",
    "eaId": 10250
  }
];

/* ═══════ CONSTANTS ═════════════════════════════════════════════════ */
const PC = { ST: "#f87171", CF: "#f87171", LW: "#fb923c", RW: "#fb923c", LM: "#fb923c", RM: "#fb923c", CAM: "#fbbf24", CM: "#34d399", CDM: "#60a5fa", LB: "#a78bfa", RB: "#a78bfa", CB: "#818cf8", GK: "#f59e0b" };
const CAT_META = {
  M1: { label: "MARQUEE 1", icon: "💎", color: "#fbbf24", bg: "rgba(251,191,36,.1)" },
  M2: { label: "MARQUEE 2", icon: "⭐", color: "#f59e0b", bg: "rgba(245,158,11,.1)" },
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
  if (cat === "M" || r >= 84) return { a: "#fbbf24", bg: "linear-gradient(155deg,#eab308,#854d0e)", lbl: "GOLD", lc: "#000" };
  if (r >= 75) return { a: "#cbd5e1", bg: "linear-gradient(155deg,#94a3b8,#475569)", lbl: "SILVER", lc: "#000" };
  return { a: "#d97706", bg: "linear-gradient(155deg,#b45309,#78350f)", lbl: "BRONZE", lc: "#fff" };
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
  cfg: { pts: 100, pool: null, timer: 20, needAuctioneer: false },
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
  const poolIds = cfg.pool || PLAYERS.map(p => p.id);
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
}

function reducer(s, a) {
  switch (a.type) {
    case "SYNC_STATE": return a.state;
    case "JOIN_ROOM": {
      const { uid, name, team } = a;
      if (s.phase === "lobby" || s.phase === "config" || s.phase === "setup") {
        const existing = s.setup.find(t => t.uid === uid || (t.team.trim().toLowerCase() === team.trim().toLowerCase()));
        if (existing) return { ...s, setup: s.setup.map(t => t.team === existing.team ? { ...t, uid, name, team, online: true } : t) };
        return { ...s, setup: [...s.setup, { uid, name, team, online: true }] };
      }
      const existingTeam = s.teams.find(t => t.uid === uid || (t.team.trim().toLowerCase() === team.trim().toLowerCase()));
      if (existingTeam) {
        return { ...s, teams: s.teams.map(t => t.team === existingTeam.team ? { ...t, uid, online: true } : t) };
      }
      return s;
    }
    case "CLIENT_DISCONNECT": {
      if (s.phase === "lobby" || s.phase === "config" || s.phase === "setup") {
        return { ...s, setup: s.setup.map(t => t.uid === a.uid ? { ...t, online: false } : t) };
      }
      return { ...s, teams: s.teams.map(t => t.uid === a.uid ? { ...t, online: false } : t) };
    }
    case "PATCH": return { ...s, ...a.patch };
    case "SET_CFG": return { ...s, cfg: { ...s.cfg, ...a.patch } };
    
    case "TOGGLE_POOL_PLAYER":
      return { ...s, setupPool: s.setupPool ? (s.setupPool.includes(a.id) ? s.setupPool.filter(id => id !== a.id) : [...s.setupPool, a.id]) : PLAYERS.filter(p => p.id !== a.id).map(p => p.id) };
    case "TOGGLE_ALL_POOL":
      return { ...s, setupPool: s.setupPool && s.setupPool.length === 0 ? null : [] };

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
          return { ...s, phase: "results", current: null };
        }
        return { ...s, phase: "results" };
      }
      const [next, ...rest] = s.queue;
      const prevCat = s.current?.player?.cat;
      const showBanner = prevCat && next.cat !== prevCat;
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
  
  const [adminUser, setAdminUser] = useState(null);
  const [adminRooms, setAdminRooms] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: sbSession } }) => {
      setAdminUser(sbSession?.user ?? null);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, sbSession) => {
      setAdminUser(sbSession?.user ?? null);
    });
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (adminUser) {
      supabase.from('rooms').select('id, state, updated_at').eq('admin_id', adminUser.id).order('updated_at', { ascending: false }).then(({ data }) => setAdminRooms(data || []));
    }
  }, [adminUser]);

  const intervalRef = useRef(null);
  const selIntervalRef = useRef(null);
  const prevStatusRef = useRef(null);

  const { phase, cfg, setup, teams, current, queue, history, skipVotes, banner, formation, formSlots, sqView, room, unsoldPool, ra1Unsold, selVotes, raPhaseLabel, setupPool } = s;
  const isAuctioneer = role === "auctioneer";
  const bidderIdx = role && role !== "auctioneer" ? role.bidder : null;
  const noAuc = !cfg.needAuctioneer;
  const activeTi = bidderIdx ?? 0;
  const activeTeam = teams[noAuc ? activeTi : bidderIdx ?? 0];

  const isHost = session.isHost === true;

  // Auto-assign role based on UID if in auction
  useEffect(() => {
    if (phase !== "lobby" && phase !== "config" && phase !== "setup" && !role) {
      if (cfg.needAuctioneer && session.isHost) {
        setRole("auctioneer");
      } else {
        const myTeamIdx = teams.findIndex(t => t.uid === session.uid);
        if (myTeamIdx !== -1) {
          setRole({ bidder: myTeamIdx });
        }
      }
    }
  }, [phase, role, teams, session.uid, session.isHost, cfg.needAuctioneer]);

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
  }, [phase]);

  /* ── Auto-advance after sold/skipped ── */
  useEffect(() => {
    if (!current) return;
    if (current.status === "active") { prevStatusRef.current = "active"; return; }
    if (prevStatusRef.current !== "active") return;
    prevStatusRef.current = current.status;
    
    // Only the Host triggers auto-advance to prevent multiple dispatch issues
    if (isHost && (noAuc || current.status === "skipped")) {
      const delay = current.status === "sold" ? 2200 : 1200;
      const t = setTimeout(() => dispatch({ type: "NEXT_PLAYER" }), delay);
      return () => clearTimeout(t);
    }
  }, [current?.status, isHost, noAuc]);

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
  const isReauction = phase === "ra1_auction";
  const isR2 = isReauction;
  const canBidR2 = activeTeam && activeTeam.squad.length < 15;
  const isPickPhase = phase === "ra1_pick";
  const pickPool = unsoldPool;

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
                  initHost(session.roomId);
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
                       initHost(r.id);
                    }} style={{ ...BTN("rgba(255,255,255,.05)"), display: "flex", justifyContent: "space-between", padding: "12px 16px", border: "1px solid rgba(255,255,255,.1)" }}>
                      <span>{r.state?.room?.name || `Room ${r.id}`}</span>
                      <span style={{ color: "#3b82f6" }}>{r.id}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div style={{ marginTop: 40, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
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
            </div>
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
     CONFIG (CLIENT WAITING)
  ════════════════════════════════════════════════════════ */
  if (!isHost && phase === "config") return (
    <div style={PG}><style>{FONTS + ANIM}</style>
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "40px 16px", display: "flex", flexDirection: "column", gap: 18, textAlign: "center" }}>
        <div style={{ width: 40, height: 40, border: "4px solid rgba(245,158,11,.2)", borderTopColor: "#f59e0b", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 10px" }}></div>
        <div style={{ fontFamily: F, fontWeight: 800, fontSize: 24, letterSpacing: 2, color: "#fff" }}>WAITING FOR HOST</div>
        <div style={{ fontSize: 13, color: "#6b7280" }}>The host is configuring the auction rules...</div>
        
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
          <button onClick={() => {
            if (!cfg.pool) dispatch({ type: "SET_CFG", patch: { pool: PLAYERS.map(p=>p.id) } });
            dispatch({ type: "PATCH", patch: { phase: "pool_select" } });
          }} style={{ ...BTN("linear-gradient(135deg,#3b82f6,#1d4ed8)"), padding: "14px", fontSize: 13, letterSpacing: 2, width: "100%" }}>
            ⚙️ CONFIGURE PLAYER POOL ({cfg.pool ? cfg.pool.length : PLAYERS.length} PLAYERS)
          </button>
        </CBlock>
        <CBlock title="⏱️ BID TIMER — auto-sells at 0">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 8 }}>
            {[10, 15, 20, 30].map(v => <CBtn key={v} active={cfg.timer === v} col="#10b981" onClick={() => dispatch({ type: "SET_CFG", patch: { timer: v } })}>{v}s</CBtn>)}
          </div>
          <div style={{ fontSize: 11, color: "#6b7280", padding: "8px 12px", background: "rgba(16,185,129,.05)", borderRadius: 10, border: "1px solid rgba(16,185,129,.15)" }}>⏰ Timer hits 0 → <b style={{ color: "#4ade80" }}>highest bidder wins automatically</b></div>
        </CBlock>
        <div style={{ fontSize: 12, color: "#6b7280", padding: "10px 14px", background: "rgba(59,130,246,.05)", borderRadius: 12, border: "1px solid rgba(59,130,246,.15)", lineHeight: 1.8 }}>
          📋 <b style={{ color: "#60a5fa" }}>Auction order:</b> Marquee → Forwards → Midfielders → Defenders → Goalkeepers<br />
          🔄 After main auction: <b style={{ color: "#f59e0b" }}>30s selection window</b> to vote unsold players for Reauction<br />
        </div>
        <div style={{ display: "flex", justifyContent: "space-around", padding: "12px 16px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14 }}>
          {[[`${cfg.pts}pt`, "PER TEAM"], [`${cfg.pool ? cfg.pool.length : PLAYERS.length}`, "PLAYERS"], [`${cfg.timer}s`, "TIMER"], ["AUTO", "AUCTIONEER"]].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}><div style={{ fontFamily: F, fontWeight: 800, fontSize: 18, color: "#fff" }}>{v}</div><div style={{ fontSize: 9, color: "#6b7280", letterSpacing: 2, marginTop: 2 }}>{l}</div></div>
          ))}
        </div>
        <button onClick={() => dispatch({ type: "PATCH", patch: { phase: "setup" } })} style={{ ...BTN("linear-gradient(135deg,#f59e0b,#d97706)"), padding: "15px", fontSize: 15, letterSpacing: 3, color: "#000", fontWeight: 800 }}>OPEN WAITING LOBBY →</button>
      </div>
    </div>
  );

  /* ════════════════════════════════════════════════════════
     POOL SELECT (HOST)
  ════════════════════════════════════════════════════════ */
  if (phase === "pool_select") {
    const clubs = [...new Set(PLAYERS.map(p => p.club))].sort();
    return (
      <div style={PG}><style>{FONTS + ANIM}</style>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "28px 16px 120px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, background: "#050810", padding: "10px 0", zIndex: 10 }}>
            <button onClick={() => dispatch({ type: "PATCH", patch: { phase: "config" } })} style={BACK}>← Back</button>
            <div style={{ fontFamily: F, fontWeight: 800, fontSize: 24, letterSpacing: 2, color: "#fff" }}>MANUAL PLAYER SELECTION</div>
            <div style={{ marginLeft: "auto", fontSize: 16, fontWeight: "bold", color: "#3b82f6" }}>TOTAL: {cfg.pool ? cfg.pool.length : PLAYERS.length}</div>
          </div>
          {clubs.map(c => {
            const cPlayers = PLAYERS.filter(p => p.club === c);
            const cSelected = cPlayers.filter(p => (cfg.pool || PLAYERS.map(x=>x.id)).includes(p.id));
            const isAll = cSelected.length === cPlayers.length;
            const toggleAll = () => {
              const curPool = cfg.pool || PLAYERS.map(p=>p.id);
              if (isAll) {
                dispatch({ type: "SET_CFG", patch: { pool: curPool.filter(id => !cPlayers.find(p=>p.id === id)) } });
              } else {
                const addIds = cPlayers.filter(p => !curPool.includes(p.id)).map(p=>p.id);
                dispatch({ type: "SET_CFG", patch: { pool: [...curPool, ...addIds] } });
              }
            };
            return (
              <div key={c} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 12 }}>
                  <div style={{ fontSize: 18, fontWeight: "bold", color: "#fff", letterSpacing: 1 }}>{c} <span style={{ fontSize: 12, color: "#6b7280" }}>({cSelected.length}/{cPlayers.length})</span></div>
                  <button onClick={toggleAll} style={{ background: isAll ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)", color: isAll ? "#ef4444" : "#10b981", border: "none", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: "bold" }}>
                    {isAll ? "DESELECT ALL" : "SELECT ALL"}
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
                  {cPlayers.map(p => {
                    const sel = (cfg.pool || PLAYERS.map(x=>x.id)).includes(p.id);
                    return (
                      <div key={p.id} onClick={() => {
                        const curPool = cfg.pool || PLAYERS.map(x=>x.id);
                        dispatch({ type: "SET_CFG", patch: { pool: sel ? curPool.filter(id => id !== p.id) : [...curPool, p.id] } });
                      }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px", background: sel ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.02)", border: `1px solid ${sel ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.05)"}`, borderRadius: 8, cursor: "pointer" }}>
                        <div style={{ width: 14, height: 14, borderRadius: 3, border: "1px solid #6b7280", background: sel ? "#3b82f6" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                           {sel && <div style={{ width: 8, height: 8, background: "#fff", borderRadius: 1 }} />}
                        </div>
                        <div style={{ fontSize: 12, color: sel ? "#fff" : "#9ca3af", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.n}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════
     LOBBY WAIT / SETUP
  ════════════════════════════════════════════════════════ */
  if (phase === "setup") return (
    <div style={PG}><style>{FONTS + ANIM}</style>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 16px 80px", display: "flex", flexDirection: "column", gap: 24 }}>
        
        {/* ROOM CODE DISPLAY */}
        <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 20, padding: 28, textAlign: "center", position: "relative", overflow: "hidden" }}>
           <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 0%, rgba(245,158,11,0.12), transparent 70%)" }} />
           <div style={{ position: "relative", zIndex: 1 }}>
             <div style={{ fontFamily: F, color: "#f59e0b", letterSpacing: 6, fontSize: 11, marginBottom: 8, fontWeight: 700 }}>SHARE CODE WITH FRIENDS</div>
             <div style={{ fontFamily: "'Courier New',monospace", fontSize: 52, fontWeight: 900, letterSpacing: 14, color: "#fff", marginBottom: 16 }}>{room?.id || session.roomId}</div>
             <button onClick={() => {
                navigator.clipboard?.writeText(room?.id || session.roomId);
                flash("Room Code Copied!");
             }} style={{ background: "rgba(245,158,11,.15)", border: "1px solid rgba(245,158,11,.3)", color: "#f59e0b", padding: "8px 24px", borderRadius: 99, fontFamily: F, fontSize: 13, cursor: "pointer", letterSpacing: 2, fontWeight: 700 }}>COPY CODE</button>
           </div>
        </div>

        {/* RULES */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[[`${cfg.pts}pt`, "BUDGET"], [`${cfg.num}`, "PLAYERS"], [`${cfg.timer}s`, "TIMER"]].map(([v, l]) => (
            <div key={l} style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.05)", borderRadius: 14, padding: "12px 4px", textAlign: "center" }}>
               <div style={{ fontFamily: F, fontSize: 18, fontWeight: 800, color: "#fff" }}>{v}</div>
               <div style={{ fontSize: 9, color: "#6b7280", letterSpacing: 2, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* JOINED TEAMS */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
             <div style={{ fontFamily: F, fontSize: 16, fontWeight: 800, letterSpacing: 2, color: "#fff" }}>JOINED TEAMS ({setup.length}/8)</div>
             {session.isHost && setup.length < 8 && <button onClick={() => dispatch({ type: "SET_SETUP", setup: [...setup, { name: `Player ${setup.length + 1}`, team: `Team ${setup.length + 1}`, online: true }] })} style={{ background: "none", border: "1px solid rgba(255,255,255,.1)", color: "#9ca3af", borderRadius: 8, padding: "6px 10px", fontSize: 11, cursor: "pointer", fontFamily: F, letterSpacing: 1 }}>+ Add Offline</button>}
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {setup.length === 0 && <div style={{ textAlign: "center", padding: 30, color: "#6b7280", fontSize: 13, border: "1px dashed rgba(255,255,255,.1)", borderRadius: 16 }}>Waiting for players to join...</div>}
            {setup.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", padding: "14px 18px", borderRadius: 18 }}>
                 <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg,${TEAM_COLORS[i%8][0]},${TEAM_COLORS[i%8][1]})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontWeight: 800, fontSize: 16, color: "#fff" }}>{i + 1}</div>
                 <div style={{ flex: 1 }}>
                   {session.isHost ? (
                      <input value={t.team} onChange={e => dispatch({ type: "SET_SETUP", setup: setup.map((x, j) => j === i ? { ...x, team: e.target.value } : x) })} style={{ ...INP, background: "transparent", border: "none", padding: 0, fontSize: 16, fontWeight: 700, fontFamily: F }} />
                   ) : (
                      <div style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: "#fff" }}>{t.team}</div>
                   )}
                   {session.isHost ? (
                      <input value={t.name} onChange={e => dispatch({ type: "SET_SETUP", setup: setup.map((x, j) => j === i ? { ...x, name: e.target.value } : x) })} style={{ ...INP, background: "transparent", border: "none", padding: 0, fontSize: 12, color: "#9ca3af", marginTop: 2, fontFamily: F }} />
                   ) : (
                      <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2, fontFamily: F }}>{t.name} {t.uid === session.uid ? "(You)" : ""}</div>
                   )}
                 </div>
                 <div style={{ fontSize: 10, color: t.online ? "#10b981" : "#4b5563", fontFamily: F, letterSpacing: 2, fontWeight: 700 }}>{t.online ? "ONLINE" : "OFFLINE"}</div>
                 {session.isHost && setup.length > 1 && <button onClick={() => dispatch({ type: "SET_SETUP", setup: setup.filter((_, j) => j !== i) })} style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: 24, padding: "0 4px" }}>×</button>}
              </div>
            ))}
          </div>
        </div>

        
        {/* TIER PREVIEW */}
        <div style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.05)", borderRadius: 16, padding: 20 }}>
          <div style={{ fontFamily: F, fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 20, textAlign: "center", letterSpacing: 3 }}>AUCTION TIERS PREVIEW ({cfg.pool ? cfg.pool.length : PLAYERS.length} PLAYERS)</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
            {(() => {
              const q = mkQueue(cfg);
              const counts = { M1: 0, M2: 0, FWD: 0, MID: 0, DEF: 0, GK: 0 };
              q.forEach(p => counts[p.cat] = (counts[p.cat] || 0) + 1);
              return ['M1', 'M2', 'FWD', 'MID', 'DEF', 'GK'].map(k => {
                const m = CAT_META[k];
                if (!m || !counts[k]) return null;
                return (
                  <div key={k} style={{ background: "rgba(255,255,255,.02)", border: `1px solid ${m.color}33`, padding: "16px", borderRadius: 16, flex: "1 1 120px", textAlign: "center", boxShadow: `inset 0 0 20px ${m.color}11` }}>
                    <div style={{ fontSize: 32, marginBottom: 12, filter: `drop-shadow(0 0 12px ${m.color}99)` }}>{m.icon}</div>
                    <div style={{ fontFamily: F, fontSize: 11, color: m.color, letterSpacing: 2, fontWeight: 800 }}>{m.label}</div>
                    <div style={{ fontFamily: F, fontSize: 28, color: "#fff", fontWeight: 900, marginTop: 4 }}>{counts[k]}</div>
                  </div>
                );
              });
            })()}
          </div>
        </div>

{/* START BUTTON */}
        {session.isHost ? (
          <button onClick={() => dispatch({ type: "START_AUCTION", setup, cfg })} style={{ ...BTN("linear-gradient(135deg,#10b981,#047857)"), padding: "20px", fontSize: 17, letterSpacing: 4, marginTop: 12 }}>⚽ START AUCTION</button>
        ) : (
          <div style={{ textAlign: "center", color: "#f59e0b", fontFamily: F, letterSpacing: 2, padding: "20px", background: "rgba(245,158,11,.05)", borderRadius: 16, border: "1px solid rgba(245,158,11,.15)", marginTop: 12 }}>WAITING FOR HOST TO START...</div>
        )}
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
          <button onClick={() => dispatch({ type: "CONFIRM_RA1_SELECTION" })}
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
     AUCTION ROOM (main + reauction rounds + results dashboard)
  ════════════════════════════════════════════════════════ */
  if (phase === "auction" || isReauction || phase === "results") {
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
          {phase === "results" && <div style={{ padding: "3px 10px", borderRadius: 99, background: "rgba(245,158,11,.12)", border: "1px solid rgba(245,158,11,.3)", fontFamily: F, fontSize: 10, color: "#f59e0b", letterSpacing: 2 }}>🏆 DRAFT COMPLETE</div>}
          {isReauction && <div style={{ padding: "3px 10px", borderRadius: 99, background: "rgba(59,130,246,.12)", border: "1px solid rgba(59,130,246,.3)", fontFamily: F, fontSize: 10, color: "#60a5fa", letterSpacing: 2 }}>🔄 {raPhaseLabel}</div>}
          {!isReauction && phase !== "results" && catM && <div style={{ padding: "3px 10px", borderRadius: 99, background: catM.bg, border: `1px solid ${catM.color}33`, fontFamily: F, fontSize: 10, color: catM.color, letterSpacing: 2 }}>{catM.icon} {catM.label}</div>}
          {role && <div style={{ padding: "3px 10px", borderRadius: 99, background: isAuctioneer ? "rgba(245,158,11,.1)" : "rgba(34,211,238,.08)", border: `1px solid ${isAuctioneer ? "rgba(245,158,11,.25)" : "rgba(34,211,238,.18)"}`, fontFamily: F, fontSize: 10, color: isAuctioneer ? "#f59e0b" : "#22d3ee", letterSpacing: 1 }}>{isAuctioneer ? "🎙️ AUCTIONEER" : `💰 ${teams[bidderIdx]?.team}`}</div>}
          {isR2 && activeTeam && <div style={{ padding: "3px 10px", borderRadius: 99, background: canBidR2 ? "rgba(34,197,94,.1)" : "rgba(239,68,68,.1)", border: `1px solid ${canBidR2 ? "rgba(34,197,94,.3)" : "rgba(239,68,68,.3)"}`, fontFamily: F, fontSize: 10, color: canBidR2 ? "#4ade80" : "#f87171", letterSpacing: 1 }}>{canBidR2 ? "✓ ELIGIBLE" : "✗ NOT ELIGIBLE"}</div>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {noAuc && <select value={activeTi} onChange={e => dispatch({ type: "SET_ROLE", role: { bidder: +e.target.value } })} style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.14)", borderRadius: 10, color: "#fff", padding: "5px 10px", fontSize: 11, cursor: "pointer", fontFamily: F }}>
            {teams.map((t, i) => <option key={i} value={i} style={{ background: "#0f1117" }}>{t.team} — {t.budget}pt · {t.squad.length}p</option>)}
          </select>}
          {activeTeam && <div style={{ fontFamily: F, fontSize: 14, color: "#f59e0b" }}>{activeTeam.budget}<span style={{ fontSize: 10, color: "#6b7280" }}>pt</span></div>}
          {phase !== "results" && <div style={{ fontSize: 10, color: "#374151", fontFamily: F }}>{queue.length + 1} left</div>}
          <button onClick={() => setRole(null)} style={{ ...BACK, fontSize: 10, padding: "4px 10px" }}>SWITCH ROLE</button>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,.06)", flexShrink: 0, background: "rgba(5,7,14,.9)" }}>
        {(phase === "results" ? [["dash", "📊 DASH"], ["squads", "👥 SQUADS"], ["list", "📋 LIST"]] : [["bid", "⚡ BID"], ["list", "📋 LIST"], ["dash", "📊 DASH"], ["squads", "👥 SQUADS"]]).map(([k, lb]) => (
          <button key={k} onClick={() => setTab(k)} style={{ flex: 1, padding: "10px 0", background: "none", border: "none", fontFamily: F, fontWeight: 600, fontSize: 11, letterSpacing: 2, color: tab === k ? "#f59e0b" : "#4b5563", borderBottom: tab === k ? "2px solid #f59e0b" : "2px solid transparent", cursor: "pointer", transition: "all .2s" }}>{lb}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: "hidden", display: "flex", minHeight: 0 }}>

        {/* BID TAB */}
        {tab === "bid" && phase !== "results" && (
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
                          <div style={{ fontFamily: "Impact, sans-serif", fontSize: 32, color: col, fontStyle: "italic", lineHeight: 1.1, margin: "4px 0", textShadow: `0 0 15px ${col}44` }}>{val}</div>
                          <div style={{ width: "60%", height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 99, marginTop: 4, overflow: "hidden" }}>
                            <div style={{ width: `${val}%`, height: "100%", background: col, boxShadow: `0 0 8px ${col}`, borderRadius: 99 }} />
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
                  <div style={{ background: "rgba(239,68,68,.05)", border: "1px solid rgba(239,68,68,.12)", borderRadius: 18, padding: "16px", marginTop: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div style={{ fontFamily: F, fontSize: 12, color: "#f87171", letterSpacing: 3, fontWeight: 700 }}>SKIP VOTES ({skipVotes.length}/{teams.length})</div>
                      <div style={{ fontSize: 10, color: "#4b5563", letterSpacing: 1 }}>unanimous = skip</div>
                    </div>
                    
                    {/* Big Skip Button for Bidder */}
                    {(() => {
                      const myTeamIdx = bidderIdx ?? (noAuc ? activeTi : null);
                      if (myTeamIdx == null && !isAuctioneer) return null;
                      
                      const voted = myTeamIdx != null && skipVotes.includes(myTeamIdx);
                      const canVote = myTeamIdx != null && !voted;
                      
                      return (
                        <button 
                          className="bb" 
                          onClick={() => { if (canVote) dispatch({ type: "VOTE_SKIP", teamIdx: myTeamIdx }); }} 
                          disabled={!canVote} 
                          style={{ 
                            width: "100%", padding: "18px 0", borderRadius: 14, 
                            background: voted ? "rgba(239,68,68,.2)" : "linear-gradient(135deg,#ef4444,#b91c1c)", 
                            border: voted ? "1px solid rgba(239,68,68,.4)" : "none", 
                            color: voted ? "#fca5a5" : "#fff", fontFamily: F, fontWeight: 900, fontSize: 18, 
                            cursor: canVote ? "pointer" : (voted ? "default" : "not-allowed"), letterSpacing: 4, boxShadow: voted ? "none" : "0 6px 20px rgba(239,68,68,.3)", transition: "all .2s" 
                          }}
                        >
                          {voted ? "✓ VOTED TO SKIP" : "⏭️ VOTE TO SKIP"}
                        </button>
                      );
                    })()}
                    
                    {/* Small badges for who voted */}
                    {skipVotes.length > 0 && (
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
                        {skipVotes.map(idx => (
                           <span key={idx} style={{ padding: "4px 10px", borderRadius: 8, background: "rgba(239,68,68,.15)", border: "1px solid rgba(239,68,68,.3)", color: "#f87171", fontSize: 10, fontFamily: F, letterSpacing: 1 }}>{teams[idx]?.team}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* AUCTIONEER */}
                {isAuctioneer && !isSold && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ padding: "10px 14px", background: "rgba(245,158,11,.06)", border: "1px solid rgba(245,158,11,.18)", borderRadius: 12, fontSize: 11, color: "#fbbf24", textAlign: "center", fontFamily: F, letterSpacing: 1 }}>🎙️ Timer auto-sells — hammer early or skip</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
                      <button className="bb" onClick={() => dispatch({ type: "SELL" })} style={{ padding: "19px", borderRadius: 16, background: "linear-gradient(135deg,#10b981,#047857)", border: "none", color: "#fff", fontFamily: F, fontWeight: 800, fontSize: 19, cursor: "pointer", letterSpacing: 2, boxShadow: "0 4px 24px rgba(16,185,129,.25)" }}>🔨 HAMMER DOWN</button>
                      
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
                  {phase === "results" && isAuctioneer && (
                    <button onClick={() => dispatch({ type: "RESET" })} style={{ ...BTN("linear-gradient(135deg,#ef4444,#b91c1c)"), padding: "14px", fontSize: 14, letterSpacing: 3, marginTop: 10, width: "100%" }}>RESET AND START NEW DRAFT</button>
                  )}
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
  // Fallback
  return null;
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
