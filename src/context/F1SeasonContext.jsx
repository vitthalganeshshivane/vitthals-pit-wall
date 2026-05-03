/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const SeasonContext = createContext(null);

const JOLPICA_BASE = 'https://api.jolpi.ca/ergast/f1';
const OPENF1_BASE = 'https://api.openf1.org/v1';
const seasonLoadCache = new Map();
const driverDossierCache = new Map();
const driverDossierLoadCache = new Map();
const DRIVER_DOSSIER_CACHE_VERSION = 'v3';
const circuitDossierCache = new Map();
const circuitDossierLoadCache = new Map();
const CIRCUIT_DOSSIER_CACHE_VERSION = 'v2';

const TEAM_COLOR_BY_NAME = {
  'Mercedes-AMG': '--mercedes',
  Mercedes: '--mercedes',
  'Mercedes-AMG Petronas': '--mercedes',
  'Mercedes-AMG Petronas F1 Team': '--mercedes',
  Ferrari: '--ferrari',
  'Scuderia Ferrari': '--ferrari',
  'Ferrari F1 Team': '--ferrari',
  McLaren: '--mclaren',
  'McLaren F1 Team': '--mclaren',
  'Red Bull Racing': '--redbull',
  'Red Bull': '--redbull',
  Williams: '--williams',
  'Williams Racing': '--williams',
  Haas: '--haas',
  'Haas F1': '--haas',
  'Haas F1 Team': '--haas',
  Alpine: '--alpine',
  'Alpine F1 Team': '--alpine',
  Audi: '--audi',
  'Audi F1 Team': '--audi',
  'Racing Bulls': '--racingbulls',
  'RB F1 Team': '--racingbulls',
  RB: '--racingbulls',
  'Aston Martin': '--aston',
  'Aston Martin Aramco Mercedes': '--aston',
  Cadillac: '--cadillac',
  'Cadillac F1 Team': '--cadillac',
  Sauber: '--cadillac',
  'Kick Sauber': '--cadillac',
};

const CONSTRUCTOR_ENGINE_BY_NAME = {
  'Mercedes-AMG': 'Mercedes PU · DEU',
  Mercedes: 'Mercedes PU · DEU',
  'Mercedes-AMG Petronas': 'Mercedes PU · DEU',
  'Mercedes-AMG Petronas F1 Team': 'Mercedes PU · DEU',
  'Scuderia Ferrari': 'Ferrari PU · ITA',
  Ferrari: 'Ferrari PU · ITA',
  'Ferrari F1 Team': 'Ferrari PU · ITA',
  McLaren: 'Mercedes PU · GBR',
  'McLaren F1 Team': 'Mercedes PU · GBR',
  'Haas F1': 'Ferrari PU · USA',
  Haas: 'Ferrari PU · USA',
  'Haas F1 Team': 'Ferrari PU · USA',
  'Red Bull Racing': 'Red Bull Ford · AUT',
  'Red Bull': 'Red Bull Ford · AUT',
  Alpine: 'Mercedes PU · FRA',
  'Alpine F1 Team': 'Mercedes PU · FRA',
  Audi: 'Audi PU · DEU',
  'Audi F1 Team': 'Audi PU · DEU',
  Williams: 'Mercedes PU · GBR',
  'Williams Racing': 'Mercedes PU · GBR',
  'Racing Bulls': 'Red Bull Ford · ITA',
  'RB F1 Team': 'Red Bull Ford · ITA',
  RB: 'Red Bull Ford · ITA',
  'Aston Martin': 'Honda PU · GBR',
  'Aston Martin Aramco Mercedes': 'Honda PU · GBR',
  Cadillac: 'Ferrari PU · USA · NEW',
  'Cadillac F1 Team': 'Ferrari PU · USA · NEW',
  Sauber: 'Ferrari PU · CHE',
  'Kick Sauber': 'Ferrari PU · CHE',
};

const COUNTRY_FLAG_BY_NAME = {
  Australia: '🇦🇺',
  China: '🇨🇳',
  Japan: '🇯🇵',
  Bahrain: '🇧🇭',
  SaudiArabia: '🇸🇦',
  Saudi: '🇸🇦',
  UnitedStates: '🇺🇸',
  UnitedKingdom: '🇬🇧',
  UnitedStatesOfAmerica: '🇺🇸',
  UnitedArabEmirates: '🇦🇪',
  Canada: '🇨🇦',
  Monaco: '🇲🇨',
  Spain: '🇪🇸',
  Austria: '🇦🇹',
  UK: '🇬🇧',
  Belgium: '🇧🇪',
  Hungary: '🇭🇺',
  Netherlands: '🇳🇱',
  Italy: '🇮🇹',
  Azerbaijan: '🇦🇿',
  Singapore: '🇸🇬',
  Mexico: '🇲🇽',
  Brazil: '🇧🇷',
  Qatar: '🇶🇦',
  UAE: '🇦🇪',
  France: '🇫🇷',
  Germany: '🇩🇪',
  USA: '🇺🇸',
};

const FALLBACK_PODIUM = [
  {
    badge: 'P1',
    driver: 'Kimi Antonelli',
    team: 'Mercedes · #12',
    time: '1:28:14.802',
  },
  {
    badge: 'P2',
    driver: 'George Russell',
    team: 'Mercedes · #63',
    time: '+3.441',
  },
  {
    badge: 'P3',
    driver: 'Charles Leclerc',
    team: 'Ferrari · #16',
    time: '+9.127',
  },
];

const FALLBACK_NEWS = [
  {
    type: 'lead',
    kicker: 'The Story',
    num: '01',
    headline: "Antonelli's rookie surge rewrites Mercedes' championship math",
    body: "Three rounds in, the 19-year-old Italian has back-to-back wins and sits atop the drivers' table. Wolff has already shifted team orders mid-weekend. Russell now races his own teammate for the title.",
  },
  {
    type: 'neutral',
    kicker: 'Engine Wars',
    num: '02',
    headline: "Red Bull's new PU is down 15hp to Mercedes, paddock sources say",
    body: "Despite the full Ford works programme, Red Bull's 2026 power unit appears weakest on the grid. Verstappen's P5 in Japan came from chassis, not pace.",
  },
  {
    type: 'neutral',
    kicker: 'Debut',
    num: '03',
    headline: 'Cadillac goal is simple: finish races, learn fast, build for 2029',
    body: "GM's eleventh team runs Ferrari PUs until its in-house unit is ready. Herta confirmed for four FP1 outings this year.",
  },
  {
    type: 'neutral',
    kicker: 'Calendar',
    num: '04',
    headline: 'FIA confirms Bahrain and Saudi cancellations, no replacements',
    body: 'Iran war fallout leaves the season at 23 rounds, Australia to Abu Dhabi. Feeder series affected too.',
  },
];

const FALLBACK_TICKER = [
  { sym: 'WDC', val: 'ANTONELLI', pts: '72 pts' },
  { sym: 'WCC', val: 'MERCEDES', pts: '135 pts' },
  { sym: 'NEXT', val: 'MIAMI GP', pts: 'MAY 3' },
  { sym: 'WINNER', val: 'ANTONELLI', pts: 'JAPAN' },
  { sym: 'FL', val: 'RUSSELL', pts: '1:28.411' },
  { sym: 'FAST PIT', val: 'MCLAREN', pts: '1.94s' },
  { sym: 'VER', val: '−60', pts: 'P9' },
  { sym: 'ROOKIE', val: 'LINDBLAD', pts: '4 pts' },
];

const FALLBACK_DRIVERS = [
  {
    pos: '01',
    name: 'K. Antonelli',
    code: 'ANT',
    team: 'Mercedes · ITA',
    pts: '72',
    teamColor: '--mercedes',
    leader: true,
    gapText: null,
  },
  {
    pos: '02',
    name: 'G. Russell',
    code: 'RUS',
    team: 'Mercedes · GBR',
    gapText: '−9',
    pts: '63',
    teamColor: '--mercedes',
    leader: false,
  },
  {
    pos: '03',
    name: 'C. Leclerc',
    code: 'LEC',
    team: 'Ferrari · MON',
    gapText: '−23',
    pts: '49',
    teamColor: '--ferrari',
    leader: false,
  },
  {
    pos: '04',
    name: 'L. Hamilton',
    code: 'HAM',
    team: 'Ferrari · GBR',
    gapText: '−31',
    pts: '41',
    teamColor: '--ferrari',
    leader: false,
  },
  {
    pos: '05',
    name: 'L. Norris',
    code: 'NOR',
    team: 'McLaren · GBR',
    gapText: '−47',
    pts: '25',
    teamColor: '--mclaren',
    leader: false,
  },
  {
    pos: '06',
    name: 'O. Piastri',
    code: 'PIA',
    team: 'McLaren · AUS',
    gapText: '−51',
    pts: '21',
    teamColor: '--mclaren',
    leader: false,
  },
  {
    pos: '07',
    name: 'O. Bearman',
    code: 'BEA',
    team: 'Haas · GBR',
    gapText: '−55',
    pts: '17',
    teamColor: '--haas',
    leader: false,
  },
  {
    pos: '08',
    name: 'P. Gasly',
    code: 'GAS',
    team: 'Alpine · FRA',
    gapText: '−57',
    pts: '15',
    teamColor: '--alpine',
    leader: false,
  },
  {
    pos: '09',
    name: 'M. Verstappen',
    code: 'VER',
    team: 'Red Bull · NED',
    gapText: '−60',
    pts: '12',
    teamColor: '--redbull',
    leader: false,
  },
  {
    pos: '10',
    name: 'L. Lawson',
    code: 'LAW',
    team: 'Racing Bulls · NZL',
    gapText: '−62',
    pts: '10',
    teamColor: '--racingbulls',
    leader: false,
  },
];

const FALLBACK_CONSTRUCTORS = [
  {
    pos: '01',
    name: 'Mercedes-AMG',
    engine: 'Mercedes PU · DEU',
    pts: '135',
    width: '100%',
    teamColor: '--mercedes',
  },
  {
    pos: '02',
    name: 'Scuderia Ferrari',
    engine: 'Ferrari PU · ITA',
    pts: '90',
    width: '66%',
    teamColor: '--ferrari',
  },
  {
    pos: '03',
    name: 'McLaren',
    engine: 'Mercedes PU · GBR',
    pts: '46',
    width: '34%',
    teamColor: '--mclaren',
  },
  {
    pos: '04',
    name: 'Haas F1',
    engine: 'Ferrari PU · USA',
    pts: '18',
    width: '13%',
    teamColor: '--haas',
  },
  {
    pos: '05',
    name: 'Red Bull Racing',
    engine: 'Red Bull Ford · AUT',
    pts: '16',
    width: '12%',
    teamColor: '--redbull',
  },
  {
    pos: '06',
    name: 'Alpine',
    engine: 'Mercedes PU · FRA',
    pts: '16',
    width: '12%',
    teamColor: '--alpine',
  },
  {
    pos: '07',
    name: 'Racing Bulls',
    engine: 'Red Bull Ford · ITA',
    pts: '14',
    width: '10%',
    teamColor: '--racingbulls',
  },
  {
    pos: '08',
    name: 'Audi',
    engine: 'Audi PU · DEU',
    pts: '2',
    width: '2%',
    teamColor: '--audi',
  },
  {
    pos: '09',
    name: 'Williams',
    engine: 'Mercedes PU · GBR',
    pts: '2',
    width: '2%',
    teamColor: '--williams',
  },
  {
    pos: '10',
    name: 'Aston Martin',
    engine: 'Honda PU · GBR',
    pts: '0',
    width: '0%',
    teamColor: '--aston',
  },
  {
    pos: '11',
    name: 'Cadillac',
    engine: 'Ferrari PU · USA · NEW',
    pts: '0',
    width: '0%',
    teamColor: '--cadillac',
  },
];

const FALLBACK_RACES = [
  { round: '01', flag: '🇦🇺', country: 'Australia', flagName: 'Albert Park', date: 'Mar 06–08', winner: 'G. Russell', done: true, next: false },
  { round: '02', flag: '🇨🇳', country: 'China', flagName: 'Shanghai', date: 'Mar 13–15', winner: 'K. Antonelli', done: true, next: false },
  { round: '03', flag: '🇯🇵', country: 'Japan', flagName: 'Suzuka', date: 'Mar 27–29', winner: 'K. Antonelli', done: true, next: false },
  { round: '04', flag: '🇺🇸', country: 'USA', flagName: 'Miami', date: 'May 01–03', winner: '', done: false, next: true },
  { round: '05', flag: '🇨🇦', country: 'Canada', flagName: 'Montreal', date: 'May 22–24', winner: '', done: false, next: false },
  { round: '06', flag: '🇲🇨', country: 'Monaco', flagName: 'Monte Carlo', date: 'Jun 05–07', winner: '', done: false, next: false },
  { round: '07', flag: '🇪🇸', country: 'Spain', flagName: 'Barcelona', date: 'Jun 12–14', winner: '', done: false, next: false },
  { round: '08', flag: '🇦🇹', country: 'Austria', flagName: 'Red Bull Ring', date: 'Jun 26–28', winner: '', done: false, next: false },
  { round: '09', flag: '🇬🇧', country: 'UK', flagName: 'Silverstone', date: 'Jul 03–05', winner: '', done: false, next: false },
  { round: '10', flag: '🇧🇪', country: 'Belgium', flagName: 'Spa', date: 'Jul 24–26', winner: '', done: false, next: false },
  { round: '11', flag: '🇭🇺', country: 'Hungary', flagName: 'Hungaroring', date: 'Jul 31–Aug 2', winner: '', done: false, next: false },
  { round: '12', flag: '🇳🇱', country: 'Netherlands', flagName: 'Zandvoort', date: 'Aug 21–23', winner: '', done: false, next: false },
  { round: '13', flag: '🇮🇹', country: 'Italy', flagName: 'Monza', date: 'Sep 04–06', winner: '', done: false, next: false },
  { round: '14', flag: '🇪🇸', country: 'Spain', flagName: 'Madrid', date: 'Sep 11–13', winner: '', done: false, next: false },
  { round: '15', flag: '🇦🇿', country: 'Azerbaijan', flagName: 'Baku', date: 'Sep 26 · Sat', winner: '', done: false, next: false },
  { round: '16', flag: '🇸🇬', country: 'Singapore', flagName: 'Marina Bay', date: 'Oct 09–11', winner: '', done: false, next: false },
  { round: '17', flag: '🇺🇸', country: 'USA', flagName: 'Austin', date: 'Oct 23–25', winner: '', done: false, next: false },
  { round: '18', flag: '🇲🇽', country: 'Mexico', flagName: 'Mexico City', date: 'Oct 30–Nov 1', winner: '', done: false, next: false },
  { round: '19', flag: '🇧🇷', country: 'Brazil', flagName: 'São Paulo', date: 'Nov 06–08', winner: '', done: false, next: false },
  { round: '20', flag: '🇺🇸', country: 'USA', flagName: 'Las Vegas', date: 'Nov 19–21', winner: '', done: false, next: false },
  { round: '21', flag: '🇶🇦', country: 'Qatar', flagName: 'Lusail', date: 'Nov 27–29', winner: '', done: false, next: false },
  { round: '22', flag: '🇦🇪', country: 'UAE', flagName: 'Yas Marina', date: 'Dec 04–06', winner: '', done: false, next: false },
];

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function safeNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function padRound(value) {
  return String(value).padStart(2, '0');
}

function capitalizeName(driver) {
  const given = driver?.givenName || driver?.firstName || '';
  const family = driver?.familyName || driver?.lastName || '';
  const initial = given ? `${given[0]}. ` : '';
  return `${initial}${family || given}`.trim();
}

function formatGap(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const num = safeNumber(value);
  return `−${num}`;
}

function getTeamColorVar(teamName) {
  return TEAM_COLOR_BY_NAME[teamName] || '--cadillac';
}

function getConstructorEngine(teamName) {
  return CONSTRUCTOR_ENGINE_BY_NAME[teamName] || 'F1 Works Entry';
}

function simplifyCircuitName(name) {
  if (!name) {
    return '';
  }
  return name
    .replace(/ Grand Prix Circuit$/i, '')
    .replace(/ International Circuit$/i, '')
    .replace(/ Circuit$/i, '')
    .replace(/ Speedway$/i, '')
    .replace(/ Autodrome$/i, '')
    .trim();
}

function shortenRaceTitle(name) {
  if (!name) return '';
  return name.replace(/ Grand Prix$/i, ' GP');
}

function getCountryFlag(countryName) {
  if (!countryName) {
    return '🏁';
  }
  const normalized = countryName.replace(/\s+/g, '');
  return COUNTRY_FLAG_BY_NAME[countryName] || COUNTRY_FLAG_BY_NAME[normalized] || '🏁';
}

function parseRaceStart(race) {
  if (!race) return null;
  const date = race.date || '';
  const time = race.time || '00:00:00Z';
  const iso = time.includes('T') ? `${date}${time}` : `${date}T${time}`;
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? null : parsed.getTime();
}

function formatWeekendLabel(race) {
  const start = parseRaceStart(race);
  if (!start) {
    return race?.date || '';
  }
  const startDate = new Date(start);
  const finishDate = new Date(start + 2 * 24 * 60 * 60 * 1000);
  const startMonth = MONTH_SHORT[startDate.getUTCMonth()];
  const finishMonth = MONTH_SHORT[finishDate.getUTCMonth()];
  const startDay = String(startDate.getUTCDate()).padStart(2, '0');
  const finishDay = String(finishDate.getUTCDate()).padStart(2, '0');
  if (startMonth === finishMonth) {
    return `${startMonth} ${startDay}–${finishDay}`;
  }
  return `${startMonth} ${startDay}–${finishMonth} ${finishDay}`;
}

function buildFallbackDriverRows() {
  return FALLBACK_DRIVERS.map((row) => ({ ...row }));
}

function buildFallbackConstructorRows() {
  return FALLBACK_CONSTRUCTORS.map((row) => ({ ...row }));
}

function buildFallbackRaces() {
  return FALLBACK_RACES.map((row) => ({ ...row }));
}

function buildFallbackTicker() {
  return FALLBACK_TICKER.map((row) => ({ ...row }));
}

function buildFallbackPodium() {
  return FALLBACK_PODIUM.map((row) => ({ ...row, fallback: true }));
}

function buildFallbackNews() {
  return FALLBACK_NEWS.map((row) => ({ ...row, fallback: true }));
}

async function fetchJson(url, signal) {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

function extractSeasonStandings(standingsJson) {
  return standingsJson?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings || [];
}

function extractConstructorStandings(standingsJson) {
  return standingsJson?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings || [];
}

function extractSeasonRaces(racesJson) {
  return racesJson?.MRData?.RaceTable?.Races || [];
}

function extractSeasonResults(resultsJson) {
  return resultsJson?.MRData?.RaceTable?.Races || [];
}

function mapDriverRows(driverStandings) {
  if (!driverStandings.length) {
    return buildFallbackDriverRows();
  }
  const leaderPoints = safeNumber(driverStandings[0]?.points);
  return driverStandings.slice(0, 10).map((entry) => {
    const driver = entry.Driver || {};
    const constructor = entry.Constructors?.[0] || {};
    const points = safeNumber(entry.points);
    return {
      pos: padRound(entry.position || driverStandings.indexOf(entry) + 1),
      name: capitalizeName(driver),
      fullName: `${driver.givenName || ''} ${driver.familyName || ''}`.trim() || capitalizeName(driver),
      givenName: driver.givenName || '',
      familyName: driver.familyName || '',
      code: driver.code || driver.driverId?.slice(0, 3).toUpperCase() || '---',
      driverId: driver.driverId || '',
      number: driver.permanentNumber || driver.permanent_number || driver.driverNumber || driver.number || '',
      wikiTitle: `${driver.givenName || ''}_${driver.familyName || ''}`.replace(/^_+|_+$/g, ''),
      team: `${constructor.name || 'TBD'} · ${driver.nationality || ''}`.replace(/ · $/, ''),
      nationality: driver.nationality || 'DATA UNAVAILABLE',
      gapText: entry.position === '1' || entry.position === 1 ? null : formatGap(leaderPoints - points),
      pts: String(points),
      leader: entry.position === '1' || entry.position === 1,
      teamColor: getTeamColorVar(constructor.name),
    };
  });
}

function mapConstructorRows(constructorStandings) {
  if (!constructorStandings.length) {
    return buildFallbackConstructorRows();
  }
  const leaderPoints = safeNumber(constructorStandings[0]?.points);
  return constructorStandings.map((entry, index) => {
    const constructor = entry.Constructor || {};
    const points = safeNumber(entry.points);
    const width = leaderPoints > 0 ? `${Math.max(0, (points / leaderPoints) * 100)}%` : '0%';
    return {
      pos: padRound(entry.position || index + 1),
      name: constructor.name || 'TBD',
      engine: getConstructorEngine(constructor.name),
      pts: String(points),
      width,
      teamColor: getTeamColorVar(constructor.name),
    };
  });
}

function mapRaces(racesJson, resultsByRound) {
  const races = extractSeasonRaces(racesJson);
  if (!races.length) {
    return buildFallbackRaces();
  }

  const sorted = [...races].sort((a, b) => safeNumber(a.round) - safeNumber(b.round));
  const now = Date.now();

  return sorted.map((race) => {
    const startTime = parseRaceStart(race);
    const roundKey = String(race.round);
    const raceResults = resultsByRound.get(roundKey) || [];
    const winner = raceResults[0]?.Driver ? capitalizeName(raceResults[0].Driver) : '';
    const isDone = startTime !== null ? startTime < now : false;
    const isNext = startTime !== null ? startTime > now : false;
    return {
      round: padRound(race.round),
      circuitId: race.Circuit?.circuitId || '',
      flag: getCountryFlag(race.Circuit?.Location?.country || race.country),
      country: race.Circuit?.Location?.country || race.country || '',
      flagName: simplifyCircuitName(race.Circuit?.circuitName || race.raceName || ''),
      date: formatWeekendLabel(race),
      winner,
      done: isDone,
      next: isNext,
      raceName: race.raceName || '',
      circuitName: race.Circuit?.circuitName || '',
      locality: race.Circuit?.Location?.locality || '',
      startTime,
    };
  });
}

function buildResultsByRound(resultsJson) {
  const races = extractSeasonResults(resultsJson);
  const map = new Map();
  races.forEach((race) => {
    map.set(String(race.round), race.Results || []);
  });
  return map;
}

function extractQualifyingResults(qualifyingJson) {
  return qualifyingJson?.MRData?.RaceTable?.Races?.[0]?.QualifyingResults || [];
}

function extractSprintResults(sprintJson) {
  return sprintJson?.MRData?.RaceTable?.Races?.[0]?.SprintResults || [];
}

function mapSessionLapTime(value) {
  if (value === null || value === undefined || value === '') {
    return 'TBD';
  }
  if (typeof value === 'string') {
    return value;
  }
  return String(value);
}

function mapDriverDisplay(result) {
  const driver = result?.Driver || {};
  return capitalizeName(driver) || driver.code || 'TBD';
}

function mapConstructorDisplay(result) {
  const constructor = result?.Constructor || {};
  return constructor.name || 'TBD';
}

function mapQualifyingRows(qualifyingResults) {
  if (!qualifyingResults.length) {
    return [];
  }

  return qualifyingResults.map((result) => ({
    position: padRound(result.position || qualifyingResults.indexOf(result) + 1),
    driver: mapDriverDisplay(result),
    team: mapConstructorDisplay(result),
    q1: mapSessionLapTime(result.Q1),
    q2: mapSessionLapTime(result.Q2),
    q3: mapSessionLapTime(result.Q3),
    grid: result.position || '—',
  }));
}

function mapSprintRows(sprintResults) {
  if (!sprintResults.length) {
    return [];
  }

  return sprintResults.map((result) => ({
    position: padRound(result.position || sprintResults.indexOf(result) + 1),
    driver: mapDriverDisplay(result),
    team: mapConstructorDisplay(result),
    time: mapSessionLapTime(result.Time?.time || result.Time?.Time || result.Time || result.status),
    laps: result.laps || result.Laps || '—',
    gap:
      result.position === 1
        ? mapSessionLapTime(result.Time?.time || result.Time || result.duration)
        : result.Time?.time || result.gapToLeader || result.gap_to_leader || result.Time || 'TBD',
  }));
}

function mapRaceSessionRows(raceResults) {
  if (!raceResults.length) {
    return [];
  }

  return raceResults.map((result) => ({
    position: padRound(result.position || raceResults.indexOf(result) + 1),
    driver: mapDriverDisplay(result),
    team: mapConstructorDisplay(result),
    time: mapSessionLapTime(result.Time?.time || result.Time?.Time || result.Time || result.status),
    gap:
      result.position === 1
        ? mapSessionLapTime(result.Time?.time || result.Time || result.duration)
        : result.Time?.time || result.gapToLeader || result.gap_to_leader || 'TBD',
    laps: result.laps || result.Laps || '—',
  }));
}

function findWeekendSessionsForRace(race, sessions) {
  if (!race?.startTime || !Array.isArray(sessions) || !sessions.length) {
    return { qualifying: null, sprint: null, race: null };
  }

  const raceSessions = sessions.filter((session) => session?.session_type === 'Race' && session?.meeting_key);
  const matchingCountry = raceSessions.filter((session) => session?.country_name === race.country);
  const candidates = matchingCountry.length ? matchingCountry : raceSessions;

  const raceSession = [...candidates].sort((a, b) => {
    const aTime = Math.abs(new Date(a.date_start || 0).getTime() - race.startTime);
    const bTime = Math.abs(new Date(b.date_start || 0).getTime() - race.startTime);
    return aTime - bTime;
  })[0];

  if (!raceSession?.meeting_key) {
    return { qualifying: null, sprint: null, race: null };
  }

  const weekendSessions = sessions.filter((session) => String(session.meeting_key) === String(raceSession.meeting_key));
  return {
    qualifying:
      weekendSessions.find(
        (session) => session.session_type === 'Qualifying' || /qualifying/i.test(session.session_name || ''),
      ) || null,
    sprint:
      weekendSessions.find((session) => session.session_type === 'Sprint' || /sprint/i.test(session.session_name || '')) ||
      null,
    race: weekendSessions.find((session) => session.session_type === 'Race') || raceSession,
  };
}

function buildWeekendSessionSummary({ qualifyingJson, sprintJson, raceResults, openF1Sessions, race }) {
  const qualifyingResults = extractQualifyingResults(qualifyingJson);
  const sprintResults = extractSprintResults(sprintJson);
  const weekendSessions = findWeekendSessionsForRace(race, openF1Sessions);
  return {
    round: race?.round || '00',
    race,
    sessions: {
      qualifying: weekendSessions.qualifying,
      sprint: weekendSessions.sprint,
      race: weekendSessions.race,
    },
    qualifying: mapQualifyingRows(qualifyingResults),
    sprint: mapSprintRows(sprintResults),
    raceRows: mapRaceSessionRows(raceResults || []),
    hasSprint: sprintResults.length > 0,
  };
}

function buildTickerItems({ driverRows, constructorRows, races, selectedYear }) {
  const topDriver = driverRows[0];
  const secondDriver = driverRows[1];
  const thirdDriver = driverRows[2];
  const topConstructor = constructorRows[0];
  const nextRace = races.find((race) => race.next) || null;
  const latestCompletedRace = [...races].reverse().find((race) => race.done) || null;
  const completedRounds = races.filter((race) => race.done).length;
  const totalRounds = races.length;
  const leadingGap = secondDriver && topDriver ? formatGap(safeNumber(topDriver.pts) - safeNumber(secondDriver.pts)) : '−0';

  if (!topDriver || !topConstructor || !races.length) {
    return buildFallbackTicker();
  }

  return [
    { sym: 'WDC', val: topDriver.code || '---', pts: `${topDriver.pts} pts` },
    { sym: 'WCC', val: topConstructor.name?.toUpperCase() || '---', pts: `${topConstructor.pts} pts` },
    {
      sym: 'NEXT',
      val: nextRace
        ? shortenRaceTitle(nextRace.raceName || nextRace.flagName || 'NEXT').toUpperCase()
        : 'SEASON END',
      pts: nextRace?.date || latestCompletedRace?.date || 'TBD',
    },
    { sym: 'GAP', val: secondDriver?.code || '---', pts: leadingGap || '−0' },
    { sym: 'P2', val: secondDriver?.code || '---', pts: `${secondDriver?.pts || '0'} pts` },
    { sym: 'P3', val: thirdDriver?.code || '---', pts: `${thirdDriver?.pts || '0'} pts` },
    { sym: 'ROUND', val: `${completedRounds}/${totalRounds}`, pts: `R${(nextRace || latestCompletedRace || {}).round || '—'}` },
    { sym: 'SEASON', val: String(selectedYear), pts: String(totalRounds) },
  ];
}

function buildPodiumFromResults(latestResult) {
  if (!latestResult?.Results?.length) {
    return buildFallbackPodium();
  }

  const podium = latestResult.Results.slice(0, 3).map((result, index) => {
    const driver = result.Driver || {};
    const constructor = result.Constructor || {};
    const gap =
      index === 0
        ? result.Time?.time || result.duration || '—'
        : result.Time?.time || (result.gapToLeader ? `+${result.gapToLeader}` : `+${result.gap_to_leader ?? '0.000'}`);
    return {
      badge: `P${index + 1}`,
      driver: capitalizeName(driver),
      team: `${constructor.name || 'TBD'} · #${driver.permanentNumber || driver.driverNumber || driver.number || '—'}`,
      time: typeof gap === 'string' ? gap : `+${gap}`,
    };
  });

  while (podium.length < 3) {
    podium.push({
      badge: `P${podium.length + 1}`,
      driver: 'TBD',
      team: 'TBD',
      time: 'TBD',
    });
  }

  return podium;
}

function buildNewsFromResults({ latestResult, latestSession, podium }) {
  if (!latestSession && !latestResult?.Results?.length) {
    return buildFallbackNews();
  }

  const winner = podium[0];
  const runnerUp = podium[1];
  const third = podium[2];
  const title = latestSession?.country_name || latestResult?.raceName || 'Latest';
  return [
    {
      type: 'lead',
      kicker: 'OpenF1',
      num: '01',
      headline: `${winner.driver} wins the ${title} race snapshot`,
      body: `${winner.driver} headlines the latest race data. ${runnerUp.driver} follows in P2 and ${third.driver} completes the podium.`,
    },
    {
      type: 'neutral',
      kicker: 'Gap Report',
      num: '02',
      headline: `${runnerUp.driver} and ${third.driver} keep the pressure on`,
      body: `${runnerUp.time || 'TBD'} separates P2 from the leader, while ${third.time || 'TBD'} marks the third-place margin.`,
    },
    {
      type: 'neutral',
      kicker: 'Session',
      num: '03',
      headline: `${latestSession?.country_name || 'Season'} · ${latestSession?.session_name || 'Race'} data`,
      body: `Fetched from OpenF1 using session_key ${latestSession?.session_key || 'latest'} and refreshed for the selected season.`,
    },
    {
      type: 'neutral',
      kicker: 'Intel',
      num: '04',
      headline: `${winner.team || 'Top team'} and ${runnerUp.team || 'runner-up team'} set the pace`,
      body: 'The Intel column now reflects the latest OpenF1 session instead of static placeholder copy whenever the season is 2023 or newer.',
    },
  ];
}

function buildSeasonSummary({
  selectedYear,
  driverRows,
  constructorRows,
  races,
  resultsByRound,
  latestResult,
  openF1,
}) {
  const nextRace = races.find((race) => race.next) || null;
  const latestCompletedRace = [...races].reverse().find((race) => race.done) || null;
  const podium = buildPodiumFromResults(latestResult);
  const newsItems = openF1?.newsItems || buildNewsFromResults({
    latestResult,
    latestSession: null,
    podium,
  });
  const tickerItems = buildTickerItems({ driverRows, constructorRows, races, selectedYear });
  const completedRounds = races.filter((race) => race.done).length;
  const totalRounds = races.length;
  const driverLookup = new Map(
    driverRows
      .filter((driver) => driver.number !== '')
      .map((driver) => [String(driver.number), driver]),
  );

  return {
    year: selectedYear,
    driverRows,
    constructorRows,
    races,
    resultsByRound,
    driverLookup,
    nextRace,
    latestCompletedRace,
    podium,
    newsItems,
    tickerItems,
    completedRounds,
    totalRounds,
    seasonComplete: !nextRace && races.length > 0,
    openF1IntelAvailable: Boolean(openF1?.podium?.length),
  };
}

function extractDriverCareerStandings(standingsJson) {
  return standingsJson?.MRData?.StandingsTable?.StandingsLists || [];
}

function buildWikiTitle(driver) {
  return [driver?.givenName, driver?.familyName].filter(Boolean).join('_');
}

function buildCircuitWikiTitle(circuit) {
  const title = circuit?.wikiTitle || circuit?.circuitName || circuit?.name || '';
  return String(title).replace(/\s+/g, '_').trim();
}

function getRaceWinnerName(race) {
  const winner = race?.Results?.find((result) => String(result.position || result.positionText || '') === '1');
  return winner?.Driver ? capitalizeName(winner.Driver) : 'DATA UNAVAILABLE';
}

function getRaceStartValue(race) {
  const parsed = parseRaceStart(race);
  if (Number.isFinite(parsed)) {
    return parsed;
  }

  const year = safeNumber(race?.season, 0);
  const round = safeNumber(race?.round, 0);
  return year * 100 + round;
}

async function fetchAllSeasons(signal) {
  const seasonsJson = await fetchJson(`${JOLPICA_BASE}/seasons.json?limit=100`, signal);
  return seasonsJson?.MRData?.SeasonTable?.Seasons || [];
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await mapper(items[index], index);
    }
  }

  const workers = Array.from({ length: Math.max(1, limit) }, () => worker());
  await Promise.all(workers);
  return results;
}

async function fetchWikipediaIntro(title, signal) {
  if (!title) {
    return '';
  }

  const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(title)}&format=json&origin=*`;
  const data = await fetchJson(url, signal);
  const pages = data?.query?.pages || {};
  const page = Object.values(pages)[0] || {};
  if (typeof page.extract !== 'string') {
    return '';
  }

  return page.extract
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean)[0] || '';
}

function getDriverDossierCacheKey(driverId) {
  return `${DRIVER_DOSSIER_CACHE_VERSION}:${driverId}`;
}

function getCircuitDossierCacheKey(circuitId) {
  return `${CIRCUIT_DOSSIER_CACHE_VERSION}:${circuitId}`;
}

async function fetchWithRetry(url, signal, retries = 1) {
  try {
    return await fetchJson(url, signal);
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
    return fetchWithRetry(url, signal, retries - 1);
  }
}

function isSeasonCompleteFromCalendar(racesJson, year, now = Date.now()) {
  const races = extractSeasonRaces(racesJson);
  if (!races.length) {
    return Number(year) < new Date(now).getUTCFullYear();
  }

  const raceStarts = races
    .map((race) => parseRaceStart(race))
    .filter((value) => Number.isFinite(value));

  if (!raceStarts.length) {
    return Number(year) < new Date(now).getUTCFullYear();
  }

  return Math.max(...raceStarts) < now;
}

async function fetchDriverWinsHistory(driverId, signal) {
  const pageSize = 100;
  let offset = 0;
  let total = Infinity;
  const races = [];

  while (races.length < total) {
    const url = `${JOLPICA_BASE}/drivers/${driverId}/results/1.json?limit=${pageSize}&offset=${offset}`;
    const data = await fetchJson(url, signal).catch(() => null);
    const pageRaces = data?.MRData?.RaceTable?.Races || [];
    total = safeNumber(data?.MRData?.total, pageRaces.length);
    races.push(...pageRaces);

    if (!pageRaces.length) {
      break;
    }

    offset += pageSize;
  }

  return {
    total,
    races,
  };
}

async function fetchCircuitHistory(circuitId, signal) {
  const pageSize = 100;
  let offset = 0;
  let total = Infinity;
  const races = [];

  while (races.length < total) {
    const page = await fetchJson(
      `${JOLPICA_BASE}/circuits/${circuitId}/results.json?limit=${pageSize}&offset=${offset}`,
      signal,
    ).catch(() => null);
    const pageRaces = page?.MRData?.RaceTable?.Races || [];
    total = safeNumber(page?.MRData?.total, pageRaces.length);
    races.push(...pageRaces);

    if (!pageRaces.length) {
      break;
    }

    offset += pageSize;
  }

  const orderedRaces = [...races].sort((a, b) => getRaceStartValue(a) - getRaceStartValue(b));
  const firstRace = orderedRaces[0] || null;
  const latestRace = orderedRaces[orderedRaces.length - 1] || null;

  return {
    total: orderedRaces.length,
    firstRace,
    latestRace,
  };
}

async function loadCircuitDossier(circuit, signal) {
  if (!circuit?.circuitId) {
    return null;
  }

  const cacheKey = getCircuitDossierCacheKey(circuit.circuitId);
  if (circuitDossierCache.has(cacheKey)) {
    return circuitDossierCache.get(cacheKey);
  }
  if (circuitDossierLoadCache.has(cacheKey)) {
    return circuitDossierLoadCache.get(cacheKey);
  }

  const promise = (async () => {
    const [meta, history, bio] = await Promise.all([
      fetchJson(`${JOLPICA_BASE}/circuits/${circuit.circuitId}.json`, signal).catch(() => null),
      fetchCircuitHistory(circuit.circuitId, signal).catch(() => null),
      fetchWikipediaIntro(buildCircuitWikiTitle(circuit), signal).catch(() => ''),
    ]);

    const circuitMeta = meta?.MRData?.CircuitTable?.Circuits?.[0] || {};
    const circuitName = circuitMeta.circuitName || circuit.circuitName || 'DATA UNAVAILABLE';
    const locality = circuitMeta.Location?.locality || circuit.locality || 'DATA UNAVAILABLE';
    const country = circuitMeta.Location?.country || circuit.country || 'DATA UNAVAILABLE';
    const firstRace = history?.firstRace || null;
    const latestRace = history?.latestRace || null;

    return {
      circuitId: circuit.circuitId,
      circuitName,
      locality,
      country,
      totalGrandsPrix: Number.isFinite(history?.total) ? history.total : 0,
      firstAppearance: firstRace?.season ? `${firstRace.raceName || 'Grand Prix'} · ${firstRace.season}` : 'DATA UNAVAILABLE',
      latestAppearance: latestRace?.season ? `${latestRace.raceName || 'Grand Prix'} · ${latestRace.season}` : 'DATA UNAVAILABLE',
      lastWinner: getRaceWinnerName(latestRace),
      firstWinner: getRaceWinnerName(firstRace),
      bio: bio || 'DATA UNAVAILABLE',
    };
  })();

  circuitDossierLoadCache.set(cacheKey, promise);

  try {
    const dossier = await promise;
    circuitDossierCache.set(cacheKey, dossier);
    return dossier;
  } finally {
    circuitDossierLoadCache.delete(cacheKey);
  }
}

async function loadDriverDossier(driver, signal) {
  if (!driver?.driverId) {
    return null;
  }

  const cacheKey = getDriverDossierCacheKey(driver.driverId);
  if (driverDossierCache.has(cacheKey)) {
    return driverDossierCache.get(cacheKey);
  }
  if (driverDossierLoadCache.has(cacheKey)) {
    return driverDossierLoadCache.get(cacheKey);
  }

  const promise = (async () => {
    const [winsHistory, bio, seasons] = await Promise.all([
      fetchDriverWinsHistory(driver.driverId, signal).catch(() => null),
      fetchWikipediaIntro(buildWikiTitle(driver), signal).catch(() => ''),
      fetchAllSeasons(signal).catch(() => []),
    ]);

    const winRaces = winsHistory?.races || [];
    const totalWins = safeNumber(winsHistory?.total, winRaces.length);
    const winningSeasons = [...new Set(
      winRaces
        .map((race) => Number(race.season))
        .filter((year) => Number.isFinite(year)),
    )];

    const fallbackSeasons = seasons
      .map((season) => Number(season.season))
      .filter((year) => Number.isFinite(year))
      .sort((a, b) => a - b);

    const seasonYears = winningSeasons.length ? winningSeasons : fallbackSeasons;

    const summaries = await mapWithConcurrency(seasonYears, 4, async (year) => {
      const [standingsJson, racesJson] = await Promise.all([
        fetchWithRetry(`${JOLPICA_BASE}/${year}/driverstandings.json`, signal, 2).catch(() => null),
        fetchJson(`${JOLPICA_BASE}/${year}.json`, signal).catch(() => null),
      ]);
      const standingsLists = extractDriverCareerStandings(standingsJson);
      const seasonRow = standingsLists
        .flatMap((list) => list?.DriverStandings || [])
        .find((row) => row?.Driver?.driverId === driver.driverId);

      if (!seasonRow) {
        return null;
      }

      return {
        wins: safeNumber(seasonRow.wins),
        championship:
          String(seasonRow.position || seasonRow.positionText || '') === '1' &&
          isSeasonCompleteFromCalendar(racesJson, year),
      };
    });

    const championships = summaries.filter(Boolean).reduce((total, item) => total + (item.championship ? 1 : 0), 0);

    return {
      driverId: driver.driverId,
      fullName: driver.fullName || driver.name || buildWikiTitle(driver).replace(/_/g, ' '),
      displayName: driver.name || driver.fullName || buildWikiTitle(driver).replace(/_/g, ' '),
      code: driver.code || '---',
      team: driver.team || 'DATA UNAVAILABLE',
      nationality: driver.nationality || 'DATA UNAVAILABLE',
      championships: Number.isFinite(championships) ? championships : 0,
      wins: Number.isFinite(totalWins) ? totalWins : 0,
      bio: bio || 'DATA UNAVAILABLE',
    };
  })();

  driverDossierLoadCache.set(cacheKey, promise);

  try {
    const dossier = await promise;
    driverDossierCache.set(cacheKey, dossier);
    return dossier;
  } finally {
    driverDossierLoadCache.delete(cacheKey);
  }
}

async function fetchOpenF1Intel(selectedYear, signal, sessions = null, driverLookup = new Map()) {
  if (selectedYear < 2023) {
    return null;
  }

  const sessionList = Array.isArray(sessions)
    ? sessions
    : await fetchJson(`${OPENF1_BASE}/sessions?year=${selectedYear}`, signal);
  if (!sessionList.length) {
    return null;
  }

  const publishedRaceSessions = sessionList
    .filter((session) => {
      const type = String(session?.session_type || session?.session_name || '').toLowerCase();
      return type === 'race';
    })
    .filter((session) => {
      const endTime = new Date(session?.date_end || session?.date_start || 0).getTime();
      return Number.isFinite(endTime) && endTime > 0 && Date.now() - endTime > 30 * 60 * 1000;
    });

  if (!publishedRaceSessions.length) {
    return null;
  }

  const sortedSessions = [...publishedRaceSessions].sort((a, b) => {
    const aTime = new Date(a.date_end || a.date_start || 0).getTime();
    const bTime = new Date(b.date_end || b.date_start || 0).getTime();
    return bTime - aTime;
  });

  let latestSession = null;
  let resultList = [];

  for (const session of sortedSessions) {
    if (!session?.session_key) {
      continue;
    }

    const results = await fetchJson(
      `${OPENF1_BASE}/session_result?session_key=${session.session_key}&position<=3`,
      signal,
    ).catch(() => null);

    if (!results || !Array.isArray(results) || !results.length) {
      continue;
    }

    latestSession = session;
    resultList = results;
    break;
  }

  if (!latestSession) {
    return null;
  }

  const podium = resultList.slice(0, 3).map((result, index) => {
    const driver = driverLookup.get(String(result.driver_number)) || {};
    const name = driver.name || driver.code || `#${result.driver_number}`;
    const team = driver.team || 'TBD';
    return {
      badge: `P${result.position || index + 1}`,
      driver: name,
      team,
      time:
        result.position === 1
          ? `${Number(result.duration).toFixed(3)}s`
          : `+${Number(result.gap_to_leader || 0).toFixed(3)}`,
    };
  });

  while (podium.length < 3) {
    podium.push({
      badge: `P${podium.length + 1}`,
      driver: 'TBD',
      team: 'TBD',
      time: 'TBD',
    });
  }

  return {
    latestSession,
    podium,
    newsItems: buildNewsFromResults({
      latestResult: resultList[0] || null,
      latestSession,
      podium,
    }),
  };
}

export function F1SeasonProvider({ children }) {
  const selectedYear = new Date().getFullYear();
  const [seasonYear, setSeasonYear] = useState(selectedYear);
  const [openF1Sessions, setOpenF1Sessions] = useState([]);
  const [weekendDetailsByRound, setWeekendDetailsByRound] = useState({});
  const [raceDrawer, setRaceDrawer] = useState({
    open: false,
    round: null,
    status: 'idle',
    error: null,
  });
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedDriverDossier, setSelectedDriverDossier] = useState({
    status: 'idle',
    data: null,
    error: null,
  });
  const [selectedCircuit, setSelectedCircuit] = useState(null);
  const [selectedCircuitDossier, setSelectedCircuitDossier] = useState({
    status: 'idle',
    data: null,
    error: null,
  });
  const [seasonData, setSeasonData] = useState(() =>
    buildSeasonSummary({
      selectedYear: selectedYear,
      driverRows: buildFallbackDriverRows(),
      constructorRows: buildFallbackConstructorRows(),
      races: buildFallbackRaces(),
      resultsByRound: new Map(),
      latestResult: null,
      openF1: null,
    }),
  );
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;

    async function loadSeason() {
      setStatus('loading');
      setRaceDrawer({
        open: false,
        round: null,
        status: 'idle',
        error: null,
      });
      setSelectedDriver(null);
      setSelectedDriverDossier({
        status: 'idle',
        data: null,
        error: null,
      });
      setSelectedCircuit(null);
      setSelectedCircuitDossier({
        status: 'idle',
        data: null,
        error: null,
      });
      setWeekendDetailsByRound({});
      setOpenF1Sessions([]);

      try {
        const loadPromise =
          seasonLoadCache.get(seasonYear) ||
          (async () => {
            const [driversJson, constructorsJson, racesJson, resultsJson] = await Promise.all([
              fetchJson(`${JOLPICA_BASE}/${seasonYear}/driverStandings.json`),
              fetchJson(`${JOLPICA_BASE}/${seasonYear}/constructorStandings.json`),
              fetchJson(`${JOLPICA_BASE}/${seasonYear}.json`),
              fetchJson(`${JOLPICA_BASE}/${seasonYear}/results.json`),
            ]);

            const driverRows = mapDriverRows(extractSeasonStandings(driversJson));
            const constructorRows = mapConstructorRows(extractConstructorStandings(constructorsJson));
            const resultsMap = buildResultsByRound(resultsJson);
            const races = mapRaces(racesJson, resultsMap);
            const latestCompletedRace = [...races]
              .reverse()
              .find((race) => resultsMap.has(String(race.round))) || null;
            const latestResult = latestCompletedRace
              ? { ...latestCompletedRace, Results: resultsMap.get(String(latestCompletedRace.round)) || [] }
              : null;
            const driverLookup = new Map(
              driverRows
                .filter((driver) => driver.number !== '')
                .map((driver) => [String(driver.number), driver]),
            );
            const seasonOpenF1Sessions =
              seasonYear >= 2023 ? await fetchJson(`${OPENF1_BASE}/sessions?year=${seasonYear}`).catch(() => []) : [];
            const openF1 = await fetchOpenF1Intel(
              seasonYear,
              undefined,
              seasonOpenF1Sessions,
              driverLookup,
            ).catch(() => null);

            const summary = buildSeasonSummary({
              selectedYear: seasonYear,
              driverRows,
              constructorRows,
              races,
              resultsByRound: resultsMap,
              latestResult,
              openF1,
            });

            return { summary, seasonOpenF1Sessions };
          })().catch((loadError) => {
            seasonLoadCache.delete(seasonYear);
            throw loadError;
          });

        seasonLoadCache.set(seasonYear, loadPromise);
        const { summary, seasonOpenF1Sessions } = await loadPromise;

        if (!alive) {
          return;
        }

        setSeasonData(summary);
        setOpenF1Sessions(Array.isArray(seasonOpenF1Sessions) ? seasonOpenF1Sessions : []);
        setError(null);
        setStatus('ready');
      } catch (loadError) {
        if (!alive) {
          return;
        }
        setError(loadError);
        setStatus('error');
      }
    }

    loadSeason();

    return () => {
      alive = false;
    };
  }, [seasonYear]);

  useEffect(() => {
    let alive = true;

    async function loadSelectedDriver() {
      if (!selectedDriver?.driverId) {
        setSelectedDriverDossier({
          status: 'idle',
          data: null,
          error: null,
        });
        return;
      }

      const cacheKey = selectedDriver.driverId;
      const cached = driverDossierCache.get(cacheKey);
      if (cached) {
        setSelectedDriverDossier({
          status: 'ready',
          data: cached,
          error: null,
        });
        return;
      }

      setSelectedDriverDossier({
        status: 'loading',
        data: null,
        error: null,
      });

      try {
        const dossier = await loadDriverDossier(selectedDriver).catch(() => null);
        if (!alive) {
          return;
        }
        if (!dossier) {
          setSelectedDriverDossier({
            status: 'error',
            data: null,
            error: new Error('DATA UNAVAILABLE'),
          });
          return;
        }
        setSelectedDriverDossier({
          status: 'ready',
          data: dossier,
          error: null,
        });
      } catch (error) {
        if (!alive) {
          return;
        }
        setSelectedDriverDossier({
          status: 'error',
          data: null,
          error,
        });
      }
    }

    loadSelectedDriver();

    return () => {
      alive = false;
    };
  }, [selectedDriver]);

  useEffect(() => {
    let alive = true;

    async function loadSelectedCircuit() {
      if (!selectedCircuit?.circuitId) {
        setSelectedCircuitDossier({
          status: 'idle',
          data: null,
          error: null,
        });
        return;
      }

      const cacheKey = getCircuitDossierCacheKey(selectedCircuit.circuitId);
      const cached = circuitDossierCache.get(cacheKey);
      if (cached) {
        setSelectedCircuitDossier({
          status: 'ready',
          data: cached,
          error: null,
        });
        return;
      }

      setSelectedCircuitDossier({
        status: 'loading',
        data: null,
        error: null,
      });

      try {
        const dossier = await loadCircuitDossier(selectedCircuit).catch(() => null);
        if (!alive) {
          return;
        }
        if (!dossier) {
          setSelectedCircuitDossier({
            status: 'error',
            data: null,
            error: new Error('DATA UNAVAILABLE'),
          });
          return;
        }
        setSelectedCircuitDossier({
          status: 'ready',
          data: dossier,
          error: null,
        });
      } catch (error) {
        if (!alive) {
          return;
        }
        setSelectedCircuitDossier({
          status: 'error',
          data: null,
          error,
        });
      }
    }

    loadSelectedCircuit();

    return () => {
      alive = false;
    };
  }, [selectedCircuit]);

  function closeRaceDetails() {
    setRaceDrawer((current) => ({
      ...current,
      open: false,
    }));
  }

  async function openRaceDetails(race) {
    if (!race?.done) {
      return;
    }

    const roundKey = String(race.round);
    const cached = weekendDetailsByRound[roundKey];
    setRaceDrawer({
      open: true,
      round: roundKey,
      status: cached ? 'ready' : 'loading',
      error: null,
    });

    if (cached) {
      return;
    }

    try {
      const [qualifyingJson, sprintJson] = await Promise.all([
        fetchJson(`${JOLPICA_BASE}/${seasonYear}/${Number(roundKey)}/qualifying.json`).catch(() => null),
        fetchJson(`${JOLPICA_BASE}/${seasonYear}/${Number(roundKey)}/sprint.json`).catch(() => null),
      ]);
      const raceResults = seasonData.resultsByRound?.get(roundKey) || [];
      const weekendSummary = buildWeekendSessionSummary({
        qualifyingJson,
        sprintJson,
        raceResults,
        openF1Sessions,
        race,
      });

      setWeekendDetailsByRound((current) => ({
        ...current,
        [roundKey]: weekendSummary,
      }));
      setRaceDrawer((current) =>
        current.round === roundKey
          ? {
              ...current,
              status: 'ready',
            }
          : current,
      );
    } catch (drawerError) {
      setRaceDrawer((current) =>
        current.round === roundKey
          ? {
              ...current,
              status: 'error',
              error: drawerError,
            }
          : current,
      );
    }
  }

  function selectDriver(driver) {
    if (!driver?.driverId) {
      return;
    }

    setSelectedCircuit(null);
    setSelectedCircuitDossier({
      status: 'idle',
      data: null,
      error: null,
    });
    setSelectedDriver((current) =>
      current?.driverId === driver.driverId ? null : driver,
    );
  }

  function selectCircuit(circuit) {
    if (!circuit?.circuitId) {
      return;
    }

    setSelectedDriver(null);
    setSelectedDriverDossier({
      status: 'idle',
      data: null,
      error: null,
    });
    setSelectedCircuit((current) =>
      current?.circuitId === circuit.circuitId ? null : circuit,
    );
  }

  function closeDriverDossier() {
    setSelectedDriver(null);
    setSelectedDriverDossier({
      status: 'idle',
      data: null,
      error: null,
    });
  }

  function closeCircuitDossier() {
    setSelectedCircuit(null);
    setSelectedCircuitDossier({
      status: 'idle',
      data: null,
      error: null,
    });
  }

  const availableYears = useMemo(() => {
    const current = new Date().getFullYear();
    const start = Math.max(2021, current - 5);
    const years = [];
    for (let year = current; year >= start; year -= 1) {
      years.push(year);
    }
    return years;
  }, []);

  const value = {
    selectedYear: seasonYear,
    setSelectedYear: setSeasonYear,
    availableYears,
    seasonData,
    loading: status === 'loading',
    error,
    raceDrawer,
    openRaceDetails,
    closeRaceDetails,
    weekendDetailsByRound,
    selectedDriver,
    selectedDriverDossier,
    selectDriver,
    closeDriverDossier,
    selectedCircuit,
    selectedCircuitDossier,
    selectCircuit,
    closeCircuitDossier,
  };

  return <SeasonContext.Provider value={value}>{children}</SeasonContext.Provider>;
}

export function useF1Season() {
  const context = useContext(SeasonContext);
  if (!context) {
    throw new Error('useF1Season must be used within an F1SeasonProvider');
  }
  return context;
}
