/* ==========================================================
   DFU CAMPUS - SETTINGS YOU CAN EDIT
   Plain text settings. No programming needed to change these.
   ========================================================== */
window.DFU_CONFIG = {

  // Browser save key. Change "v2" to anything else to reset everyone's saved progress.
  storageKey: "dfu_campus_v2",

  // ---- THE CLOCK ----
  // The boss returns after this many seconds of play. The clock PAUSES while
  // a player reads feedback or dialogue, so reading is never punished.
  timeLimitSeconds: 90,

  // ---- SCORING (all numbers are playtest targets; change freely) ----
  scoring: {
    identify: 750,            // each bone identified correctly
    place: 500,               // each bone placed correctly
    handling: 1000,           // choosing the careful way to handle the real specimen
    carelessPenalty: -500,    // careless handling (score never drops below 0)
    inspect: 1000,            // optional final inspection
    finish: 2000,             // finishing the exhibit
    noCareless: 2000,         // bonus for zero careless-handling mistakes
    timeBonusMax: 1000,       // up to this much for finishing before the boss
    // Points when a player gets something right AFTER a wrong try:
    // 0 = no points (hint + retry), 0.5 = half points, 1 = full points.
    retryFraction: 0
  },

  // ---- CHARACTERS ----
  // Pictures are drawn in art.js. To use your own artwork instead, put image
  // files in /assets and list them here (moods: neutral, asleep, awake).
  characters: {
    worker:   { name: "Worker",   images: {} },
    boss:     { name: "The Boss", images: {} },
    narrator: { name: "",         images: {} }
  },

  // ---- RANKS (checked top to bottom, first match wins; based on score) ----
  ranks: [
    { min: 9000, title: "Department Head" },
    { min: 6500, title: "Site Foreman" },
    { min: 3500, title: "Skilled Apprentice" },
    { min: 0,    title: "Day-One Hire (office hours recommended)" }
  ],

  // ---- ACHIEVEMENTS FOR THE WHOLE GAME ----
  // "test" receives: score, accuracy (0-100), careless, elapsedMs, inspected
  achievements: [
    { id: "clocked_in",   title: "Clocked In",     desc: "Finished a monthly challenge.",
      test: function (r) { return true; } },
    { id: "careful_hands", title: "Careful Hands",  desc: "Finished with zero careless-handling mistakes.",
      test: function (r) { return r.careless === 0; } },
    { id: "sharp_eye",    title: "Sharp Eye",      desc: "Got every decision right on the first try.",
      test: function (r) { return r.accuracy === 100; } },
    { id: "curious",      title: "Curious Mind",   desc: "Used the optional final inspection.",
      test: function (r) { return r.inspected === true; } }
  ]
};
