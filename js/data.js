// ============================================================================
// DERBY 2026 — SEED DATA
// Parsed from: derby_2026_megasheet.pdf (schedule) + Derby_2026 Google Sheet (scoring)
//
// Notes on data reconciliation (see README "Data notes" for full list):
//  - "Ser" (sheet) / "Acapella" (PDF) treated as the same event: Serenade/Acapella.
//  - "Snelrook" (sheet) / "Vinnig rook" (PDF) treated as the same event (Afrikaans
//    for the same activity — "fast smoke"), canonical name "Snelrook".
//  - Weight classes come from the sheet: Heavy = 25 pts, Medium = 17.5 pts, Light = 10 pts.
//  - Opening Ceremony is informational only — 0 points, can't be "won".
//  - Typos fixed: Rocket Leahue -> Rocket League, Hokcey -> Hockey,
//    Wimbdldedon -> Wimbledon, Coetzenberg/Coetzenburg standardized to "Coetzenberg".
//  - Total prize pool across all scored events = 522.5, matching the sheet's
//    "Lead By (To Win)" column reaching 0 on the final event (Rugby 1st).
// ============================================================================

const TEAMS = {
  eendrag: { id: "eendrag", name: "Eendrag", color: "#C8443C" },
  helshoogte: { id: "helshoogte", name: "Helshoogte", color: "#D9A441" }
};

const WEIGHT_CLASSES = {
  heavy: { label: "Heavy", points: 25 },
  medium: { label: "Medium", points: 17.5 },
  light: { label: "Light", points: 10 }
};

// status: "upcoming" | "live" | "completed"
// winner: null | "eendrag" | "helshoogte" | "split"
const SEED_EVENTS = [
  // ---------------- SUNDAY 9 AUG — Opening ceremony ----------------
  { id: "sun-golf", day: "Sunday", date: "2026-08-09", time: "12:15", name: "Golf", venue: "Stellenbosch Golf Club", grouping: "Golf day", weightClass: "medium", status: "completed", winner: "helshoogte", pointsEendrag: 0, pointsHelshoogte: 17.5 },
  { id: "sun-opening", day: "Sunday", date: "2026-08-09", time: "20:00", name: "Opening Ceremony and Speeches", venue: "Piet Eloff Dining Hall", grouping: "Opening ceremony", weightClass: null, status: "completed", winner: null, pointsEendrag: 0, pointsHelshoogte: 0 },
  { id: "sun-wine", day: "Sunday", date: "2026-08-09", time: "20:30", name: "Wine Tasting", venue: "Piet Eloff Dining Hall", grouping: "Opening ceremony", weightClass: "light", status: "completed", winner: "split", pointsEendrag: 5, pointsHelshoogte: 5 },
  { id: "sun-acapella", day: "Sunday", date: "2026-08-09", time: "20:50", name: "Acapella (Serenade)", venue: "Piet Eloff Dining Hall", grouping: "Opening ceremony", weightClass: "light", status: "completed", winner: "eendrag", pointsEendrag: 10, pointsHelshoogte: 0 },
  { id: "sun-speedeat", day: "Sunday", date: "2026-08-09", time: "21:15", name: "Speed Eating", venue: "Piet Eloff Dining Hall", grouping: "Opening ceremony", weightClass: "medium", status: "completed", winner: "eendrag", pointsEendrag: 17.5, pointsHelshoogte: 0 },

  // ---------------- MONDAY 10 AUG — Games ----------------
  { id: "mon-chess", day: "Monday", date: "2026-08-10", time: "12:00", name: "Chess", venue: "Piet Eloff Dining Hall", grouping: "Games", weightClass: "medium", status: "completed", winner: "eendrag", pointsEendrag: 17.5, pointsHelshoogte: 0 },
  { id: "mon-touchies", day: "Monday", date: "2026-08-10", time: "17:00", name: "Touchies", venue: "Piet Eloff Dining Hall", grouping: "Games", weightClass: "medium", status: "upcoming", winner: null, pointsEendrag: 0, pointsHelshoogte: 0 },
  { id: "mon-tabletennis", day: "Monday", date: "2026-08-10", time: "18:00", name: "Table Tennis", venue: "Piet Eloff Dining Hall", grouping: "Games", weightClass: "medium", status: "upcoming", winner: null, pointsEendrag: 0, pointsHelshoogte: 0 },
  { id: "mon-padel", day: "Monday", date: "2026-08-10", time: "19:00", name: "Padel", venue: "Cape Crusade Padel", grouping: "Games", weightClass: "medium", status: "upcoming", winner: null, pointsEendrag: 0, pointsHelshoogte: 0 },

  // ---------------- TUESDAY 11 AUG — Pub night ----------------
  { id: "tue-30sec", day: "Tuesday", date: "2026-08-11", time: "17:00", name: "30 Seconds", venue: "Piet Eloff Dining Hall", grouping: "Pub night", weightClass: "light", status: "upcoming", winner: null, pointsEendrag: 0, pointsHelshoogte: 0 },
  { id: "tue-fifa", day: "Tuesday", date: "2026-08-11", time: "17:00", name: "FIFA", venue: "Piet Eloff Dining Hall", grouping: "Pub night", weightClass: "light", status: "upcoming", winner: null, pointsEendrag: 0, pointsHelshoogte: 0 },
  { id: "tue-clashroyale", day: "Tuesday", date: "2026-08-11", time: "17:00", name: "Clash Royale", venue: "Piet Eloff Dining Hall", grouping: "Pub night", weightClass: "light", status: "upcoming", winner: null, pointsEendrag: 0, pointsHelshoogte: 0 },
  { id: "tue-rocketleague", day: "Tuesday", date: "2026-08-11", time: "17:00", name: "Rocket League", venue: "Piet Eloff Dining Hall", grouping: "Pub night", weightClass: "light", status: "upcoming", winner: null, pointsEendrag: 0, pointsHelshoogte: 0 },
  { id: "tue-dominoes", day: "Tuesday", date: "2026-08-11", time: "19:00", name: "Dominoes", venue: "Piet Eloff Dining Hall", grouping: "Pub night", weightClass: "medium", status: "upcoming", winner: null, pointsEendrag: 0, pointsHelshoogte: 0 },
  { id: "tue-beerpong", day: "Tuesday", date: "2026-08-11", time: "20:00", name: "Beer Pong", venue: "Eagles Pub", grouping: "Pub night", weightClass: "medium", status: "upcoming", winner: null, pointsEendrag: 0, pointsHelshoogte: 0 },
  { id: "tue-snelrook", day: "Tuesday", date: "2026-08-11", time: "20:30", name: "Snelrook", venue: "Eendrag Bun", grouping: "Pub night", weightClass: "medium", status: "upcoming", winner: null, pointsEendrag: 0, pointsHelshoogte: 0 },
  { id: "tue-downdowns", day: "Tuesday", date: "2026-08-11", time: "21:00", name: "Down Downs", venue: "Eagles Pub", grouping: "Pub night", weightClass: "medium", status: "upcoming", winner: null, pointsEendrag: 0, pointsHelshoogte: 0 },

  // ---------------- WEDNESDAY 12 AUG — Hockey night ----------------
  { id: "wed-squash", day: "Wednesday", date: "2026-08-12", time: "14:00", name: "Squash", venue: "Old Mutual Squash Courts", grouping: "Hockey night", weightClass: "medium", status: "upcoming", winner: null, pointsEendrag: 0, pointsHelshoogte: 0 },
  { id: "wed-tennis", day: "Wednesday", date: "2026-08-12", time: "14:00", name: "Tennis", venue: "Wimbledon Tennis Courts", grouping: "Hockey night", weightClass: "medium", status: "upcoming", winner: null, pointsEendrag: 0, pointsHelshoogte: 0 },
  { id: "wed-netball", day: "Wednesday", date: "2026-08-12", time: "16:00", name: "Netball", venue: "Coetzenberg", grouping: "Hockey night", weightClass: "medium", status: "upcoming", winner: null, pointsEendrag: 0, pointsHelshoogte: 0 },
  { id: "wed-basketball", day: "Wednesday", date: "2026-08-12", time: "17:00", name: "Basketball", venue: "Coetzenberg", grouping: "Hockey night", weightClass: "medium", status: "upcoming", winner: null, pointsEendrag: 0, pointsHelshoogte: 0 },
  { id: "wed-hockey2", day: "Wednesday", date: "2026-08-12", time: "19:00", name: "Hockey 2nd", venue: "Maties Astro", grouping: "Hockey night", weightClass: "medium", status: "upcoming", winner: null, pointsEendrag: 0, pointsHelshoogte: 0 },
  { id: "wed-hockey1", day: "Wednesday", date: "2026-08-12", time: "20:00", name: "Hockey 1st", venue: "Maties Astro", grouping: "Hockey night", weightClass: "heavy", status: "upcoming", winner: null, pointsEendrag: 0, pointsHelshoogte: 0 },

  // ---------------- THURSDAY 13 AUG — Footy night ----------------
  { id: "thu-tug", day: "Thursday", date: "2026-08-13", time: "11:00", name: "Tug of War", venue: "Eendrag Bun", grouping: "Footy night", weightClass: "medium", status: "upcoming", winner: null, pointsEendrag: 0, pointsHelshoogte: 0 },
  { id: "thu-quaddies", day: "Thursday", date: "2026-08-13", time: "12:00", name: "Quaddies", venue: "Eendrag Quad", grouping: "Footy night", weightClass: "medium", status: "upcoming", winner: null, pointsEendrag: 0, pointsHelshoogte: 0 },
  { id: "thu-pool", day: "Thursday", date: "2026-08-13", time: "17:00", name: "Pool", venue: "Van der Stel Sports Bar", grouping: "Footy night", weightClass: "light", status: "upcoming", winner: null, pointsEendrag: 0, pointsHelshoogte: 0 },
  { id: "thu-darts", day: "Thursday", date: "2026-08-13", time: "17:00", name: "Darts", venue: "Van der Stel Sports Bar", grouping: "Footy night", weightClass: "light", status: "upcoming", winner: null, pointsEendrag: 0, pointsHelshoogte: 0 },
  { id: "thu-frisbee", day: "Thursday", date: "2026-08-13", time: "17:30", name: "Ultimate Frisbee", venue: "Eendrag Bun", grouping: "Footy night", weightClass: "medium", status: "upcoming", winner: null, pointsEendrag: 0, pointsHelshoogte: 0 },
  { id: "thu-debating", day: "Thursday", date: "2026-08-13", time: "18:30", name: "Debating", venue: "Piet Eloff Dining Hall", grouping: "Footy night", weightClass: "medium", status: "upcoming", winner: null, pointsEendrag: 0, pointsHelshoogte: 0 },
  { id: "thu-football2", day: "Thursday", date: "2026-08-13", time: "19:00", name: "Football 2nd", venue: "Lentelus", grouping: "Footy night", weightClass: "medium", status: "upcoming", winner: null, pointsEendrag: 0, pointsHelshoogte: 0 },
  { id: "thu-football1", day: "Thursday", date: "2026-08-13", time: "20:00", name: "Football 1st", venue: "Lentelus", grouping: "Footy night", weightClass: "heavy", status: "upcoming", winner: null, pointsEendrag: 0, pointsHelshoogte: 0 },

  // ---------------- FRIDAY 14 AUG — Rugby night ----------------
  { id: "fri-rugby2", day: "Friday", date: "2026-08-14", time: "17:00", name: "Rugby 2nd", venue: "Coetzenberg", grouping: "Rugby night", weightClass: "medium", status: "upcoming", winner: null, pointsEendrag: 0, pointsHelshoogte: 0 },
  { id: "fri-rugby1", day: "Friday", date: "2026-08-14", time: "18:30", name: "Rugby 1st", venue: "Coetzenberg B-field", grouping: "Rugby night", weightClass: "heavy", status: "upcoming", winner: null, pointsEendrag: 0, pointsHelshoogte: 0 }
];

const DAY_ORDER = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Total points available across the whole derby (used for the leaderboard progress bar)
const TOTAL_POOL = SEED_EVENTS.reduce((sum, e) => {
  if (!e.weightClass) return sum;
  return sum + WEIGHT_CLASSES[e.weightClass].points;
}, 0);

if (typeof module !== "undefined") {
  module.exports = { TEAMS, WEIGHT_CLASSES, SEED_EVENTS, DAY_ORDER, TOTAL_POOL };
}
