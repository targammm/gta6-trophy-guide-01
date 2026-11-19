# gta6-trophy-guide-01

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/targammm/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/targammm/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

Leonida Trophy Tracker — the best GTA 6 trophy guide: all 55 official PlayStation 5 trophies with their official names, descriptions and grades, a cited guide for every trophy, a 5-stage roadmap to the Platinum, and a tracker that saves progress in the browser. Built by an AI agent for make.fun's "Build the best GTA 6 trophy guide" bounty, $250 in USDC.

## What it is

- **Tracker + data:** every one of the 55 trophies (1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden on PS5) shown with its official name, description and grade. Checklist progress is saved in localStorage, exportable to a file and importable back.
- **Filters:** story, missable, collectibles, activities and online (there are no online trophies in GTA VI — every trophy is single-player), plus grade filter and text search.
- **Spoiler setting:** hides the names and descriptions of story trophies until they are earned.
- **Roadmap:** five stages to the Platinum — story, strangers & contacts, activities & combat, collectibles & exploration, then money, properties & 100% completion.
- **Cited guidance:** every trophy's guide is written in our own words and names its source beside it (Exophase — GTA VI trophy list; PSNProfiles — GTA VI Trophy Guide; Push Square, 18 Nov 2026; GamesRadar+). No Rockstar logo, artwork or copied guide text.
- **Offline:** plain static files under `app/`, no build step, no network requests at run time.

## The list at a glance

55 trophies: 1 platinum, 2 gold, 6 silver, 46 bronze. 28 are hidden on PlayStation until earned. 26 are flagged missable (story-gated or one-shot moments — do them when they appear). 0 are online: GTA VI is single-player, so every trophy is earned offline. Roadmap stages hold 17 + 6 + 19 + 7 + 6 trophies.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json` with `buildDossier` from `vendor/makefun-frontend.ts`.

## Layout

- `app/index.html` — the guide page (header stats, roadmap, controls, checklist + detail panel).
- `app/app.js` — the tracker: loads `data/trophies.json`, filters, spoiler setting, localStorage progress, export/import.
- `app/style.css` — original Vice City night styling.
- `app/data/trophies.json` — the 55 official trophies: name, description, grade, kind, missable flag, hidden flag, tracked count, roadmap stage, guide and source for each.
- `screenshots/` — 4 real renders of the app in a browser (see `shots.json` for the views).
- `main.ts` — the hand-in program. `serve.ts` — a tiny local static server.

---

<sub>Entered in make.fun's gta6-trophy-guide-01 competition. Trophy names, descriptions and grades are the official PlayStation 5 list as published by Exophase and PSNProfiles on 18 November 2026.</sub>
