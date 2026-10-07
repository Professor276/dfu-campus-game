# DFU Campus: Month 1, "The Triceratops Emergency"

A small browser game. No build step, no installs, no servers, no ongoing costs.

## Try it
Double-click `index.html`. It opens in your browser. (The Google font needs internet; everything else works offline.)

## What each file does
| File | What it is | Do you edit it? |
|---|---|---|
| `index.html` | The page and its 4 screens | Rarely |
| `style.css` | Colors and fonts (top of the file) and layout | For design changes |
| `config.js` | Clock length, **scoring numbers**, ranks, global achievements | Yes |
| `art.js` | All the placeholder drawings (worker, boss, bones, scene) | When you add real art |
| `engine.js` | The game logic that runs every month | Almost never |
| `months/month01.js` | Month 1 dialogue, bones, hints, lessons | Yes, this is the content |
| `assets/` | Your own pictures (optional) | Add files here |

## Common changes
- **Change a score value:** `config.js`, the `scoring` block.
- **Change the 90-second timer:** `config.js`, `timeLimitSeconds`. The clock pauses while a player reads feedback, so reading is never punished.
- **Retries:** `retryFraction` in `config.js`. `0` means a bone identified or placed correctly only after a wrong try earns no points (your spec). Set `0.5` for half points.
- **Change any dialogue, hint, or lesson:** `months/month01.js`. Text is in quotes next to labels like `text:` and `hint:`.
- **Move a drop spot:** `exhibit.targets` in `month01.js` (x, y, w, h are percentages of the picture).

## Accuracy rule for Stage C
The real-specimen lesson must not teach players to spot real fossils by color or cracks. The in-game cue is the crate label ("ORIGINAL FOSSIL MATERIAL") and staff instructions. Keep that in mind when you edit the text.

## Adding your real art
All pictures are placeholder drawings made in `art.js`, so the game needs no image files. To use real art:
- **Characters:** save pictures in `assets/`, then in `config.js` fill in the `images` list for `worker` and `boss` (moods: `asleep`, `awake`, `neutral`).
- **Bones, skeleton frame, entrance scene:** these are still drawn in `art.js`. Send me the final art and I will wire it in.

## Adding Month 2
1. Copy `months/month01.js` to `months/month02.js`.
2. Change `id: 1` to `id: 2` and edit the content.
3. In `index.html`, add `<script src="months/month02.js"></script>` under the Month 1 line.

The newest month becomes the one shown on the entrance page. A stage can be one of four types: `identify`, `place`, `handle`, `inspect`. Reorder or reuse them to build new months.

## Putting it on the DFU site
- **Link:** upload the whole folder to any free static host (GitHub Pages, Netlify) and link to it from the store.
- **Embed:** if your store lets you add custom HTML, use
  `<iframe src="YOUR-GAME-URL" style="width:100%;height:760px;border:0"></iframe>`

## Saved progress
Best score, settings, and achievements are saved in the player's own browser (`localStorage`). Nothing is sent anywhere.

## NOT built yet (needs your decision, see the chat)
The monthly **leaderboard, email reward claim, and unique discount codes** are not in this version. They need a server, because anything stored in the browser can be edited by the player.
