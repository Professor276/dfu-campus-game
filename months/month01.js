/* ==========================================================
   MONTH 1: THE TRICERATOPS EMERGENCY
   Campus section: Campus Entrance / first exhibit installation.

   The science text below uses only the facts from your design
   document. Add your own sourced content as you get it.

   HOW THIS FILE IS ORGANIZED
   1. entrance     - the hidden "Enter the Campus" scene
   2. pieces       - the bones (name + which drawing to use)
   3. exhibit      - the spots on the skeleton
   4. intro        - dialogue before the game
   5. stages       - the game itself, in order (A, B, C, D)
   6. ending       - dialogue after the game
   7. achievements - badges for this month

   TO MAKE MONTH 2: copy this file to month02.js, change "id: 1" to
   "id: 2", edit the content, then add one <script> line for it in
   index.html. The newest month becomes the one on the entrance page.
   ========================================================== */
DFU.registerMonth({
  id: 1,
  title: "The Triceratops Emergency",
  campusSection: "Campus Entrance: first exhibit",
  teaser: "Next campus section: a covered crate and a blueprint. Come back next month.",

  /* ---------- 1. ENTRANCE ---------- */
  entrance: {
    sign: "DFU CAMPUS — UNDER CONSTRUCTION",
    cue: "Click the worker to see what’s taking so long."
  },

  /* ---------- 2. PIECES ----------
     art: which drawing from art.js to show (skull, rib, femur, specimen). */
  pieces: {
    skull:    { name: "Skull",              art: "skull" },
    rib:      { name: "Rib",                art: "rib" },
    femur:    { name: "Femur",              art: "femur" },
    specimen: { name: "Specimen, Crate 7",  art: "specimen" }
  },

  /* ---------- 3. EXHIBIT ----------
     The spots on the skeleton. x, y, w, h are percentages of the picture
     (0 to 100) measured from the top-left corner. The "cradle" is the padded
     support where the fragile specimen ends up; it is not a puzzle spot. */
  exhibit: {
    targets: [
      { id: "head",   label: "Front of skeleton",     x: 6,  y: 26, w: 26, h: 36 },
      { id: "trunk",  label: "Trunk / rib cage",      x: 36, y: 24, w: 25, h: 38 },
      { id: "hind",   label: "Hind limb, toward hip", x: 63, y: 44, w: 16, h: 38 },
      { id: "cradle", label: "Padded support",        x: 82, y: 62, w: 16, h: 24 }
    ]
  },

  /* ---------- 4. INTRO DIALOGUE ----------
     Each box has an id; "start" runs first.
       speaker: worker, boss, or narrator
       mood:    asleep or awake (worker)
       text, caption (sound description), alert (big banner), sound
       next:    the box to show after "Continue"
       choices: buttons, each with its own "next"
     A box with no next and no choices ends the conversation. */
  intro: {
    start: {
      speaker: "worker", mood: "awake", sound: "alarm",
      caption: "[A phone alarm rings. The worker jolts awake.]",
      text: "Huh? What time is it?",
      next: "alert"
    },
    alert: {
      speaker: "worker", mood: "awake",
      alert: "BOSS RETURNS IN 90 SECONDS",
      text: "Oh, no. We were supposed to finish this exhibit yesterday!",
      next: "objective"
    },
    objective: {
      speaker: "worker", mood: "awake",
      text: "Finish the Triceratops exhibit. Place the pieces carefully, identify the specimens, and don’t damage anything.",
      button: "Start the shift"
    }
  },

  /* ---------- 5. STAGES ---------- */
  stages: [

    /* STAGE A: identify the pieces.
       Each round shows a clue and the player taps the matching piece. */
    {
      type: "identify", label: "Stage A: Identify",
      choices: ["skull", "rib", "femur"],
      rounds: [
        {
          answer: "skull",
          clue: "Find the skull. Look for the large head with a bony frill and three prominent facial horns.",
          explain: "Triceratops had a large skull, a bony frill, and three prominent facial horns.",
          hint: "Not that one. The skull is the large head piece with a bony frill and three facial horns."
        },
        {
          answer: "rib",
          clue: "Find a rib. Look for the curved bone.",
          explain: "Ribs are curved bones that help form the chest cage.",
          hint: "Not that one. Ribs are curved."
        },
        {
          answer: "femur",
          clue: "Find the femur. It is the large upper leg bone.",
          explain: "The femur is the upper leg bone.",
          hint: "Not that one. The femur is a large upper leg bone, so look for a long, thick bone."
        }
      ]
    },

    /* STAGE B: place the bones.
       target: the exhibit spot (id from "exhibit") where it belongs.
       correct: shown after a correct placement. hint: shown after a wrong one. */
    {
      type: "place", label: "Stage B: Place",
      prompt: "Tap a bone, then tap where it goes. You can also drag it.",
      pieces: [
        {
          piece: "rib", target: "trunk",
          correct: "Ribs help protect organs and form the chest cage.",
          hint: "Not there. Ribs go along the trunk, in the rib cage area."
        },
        {
          piece: "femur", target: "hind",
          correct: "The femur is the upper leg bone.",
          hint: "Not there. The femur is an upper leg bone. Try the hind limb, connecting toward the hip."
        },
        {
          piece: "skull", target: "head",
          correct: "That big skull is hard to miss. Triceratops had a large, heavy head.",
          hint: "Not there. The skull goes at the front of the skeleton."
        }
      ]
    },

    /* STAGE C: the real specimen warning.
       The player taps the specimen, the worker warns them, then they choose.
       NOTE: this lesson must NOT teach players to spot real fossils by color
       or cracks. The cue is the label and staff instructions. */
    {
      type: "handle", label: "Stage C: Handling",
      piece: "specimen", cradle: "cradle",
      setup: "One last crate. The boss is coming. Tap the specimen to pick it up.",
      placard: "CRATE 7: ORIGINAL FOSSIL MATERIAL. SUPPORT WITH BOTH HANDS.",
      warning: {
        start: {
          speaker: "worker", mood: "awake",
          text: "YO! Careful with that one! Can’t you tell it’s real?",
          next: "explain"
        },
        explain: {
          speaker: "worker", mood: "awake",
          text: "Some exhibits use casts or replicas, and some include actual fossil material. You have to handle real specimens carefully.",
          button: "Okay, okay"
        }
      },
      question: "How do you handle the specimen?",
      choices: [
        {
          text: "Support it with both hands and use the padded support.",
          feedback: "Good call. Real specimens can be fragile, so they get slow, supported handling. One more thing: color, cracks, and surface texture alone do not reliably show whether something is a real fossil. Fossils, casts, and replicas can all look different. Check the label and follow the instructions of museum staff."
        },
        {
          careless: true,
          text: "Drop it into place. The boss is coming!",
          feedback: "Careless handling! You lose 500 points. Real specimens can be fragile, so slow down, use the padded support, and follow the label and staff instructions. How an object looks, such as its color or cracks, does not reliably tell you whether it is real."
        },
        {
          careless: true,
          text: "Carry it across the room quickly with one hand.",
          feedback: "Careless handling! You lose 500 points. Real specimens can be fragile, so use both hands and the padded support, and follow the label and staff instructions."
        }
      ]
    },

    /* STAGE D: final inspection (optional). */
    {
      type: "inspect", label: "Stage D: Final inspection",
      prompt: "The exhibit is assembled. You can take a quick look at the specimen, or finish up before the boss walks in.",
      fact: "Triceratops had a large skull, a bony frill, and three prominent facial horns. And remember: some exhibits use casts or replicas, and some include real fossil material, so the label tells you what you are looking at."
    }
  ],

  /* ---------- 6. ENDING DIALOGUE ----------
     {score}, {accuracy} and {time} are filled in automatically. */
  ending: {
    start: {
      speaker: "narrator", scene: "exhibit-lit", sound: "win",
      text: "The exhibit lights turn on. Footsteps echo down the hall. The worker grabs a broom and tries to look busy.",
      next: "boss1"
    },
    boss1: {
      speaker: "boss", scene: "exhibit-lit",
      text: "You finished it? And you didn’t break anything?",
      next: "worker1"
    },
    worker1: {
      speaker: "worker", mood: "awake", scene: "exhibit-lit",
      text: "Mostly.",
      next: "boss2"
    },
    boss2: {
      speaker: "boss", scene: "exhibit-lit",
      text: "Well, whoever did the actual work deserves the credit.",
      button: "See results"
    }
  },

  /* Shown on the results screen as campus progress. */
  progress: ["Before: crates and caution tape", "During: bones installed", "After: exhibit complete, lights on"],

  /* ---------- 7. ACHIEVEMENTS FOR THIS MONTH ---------- */
  achievements: [
    {
      id: "m1_exhibit",
      title: "Exhibit Installer",
      desc: "Finished the Month 1 Triceratops exhibit.",
      test: function (r) { return true; }
    }
  ]
});
