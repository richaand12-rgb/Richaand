# 🏎️ Garage Empire Clicker

A dark neon garage / street-racing idle clicker game for mobile.
Tap a broken car to repair it, earn coins & XP, buy upgrades, hire mechanics,
unlock better cars and win races — all the way from a Rusty Hatchback to a Hypercar!

## ▶️ How to play

Open `index.html` in any modern browser (best on mobile, ~390×844).
No build step, no dependencies — plain HTML, CSS and JavaScript with `localStorage` saves.

- **Tap the car** to repair it — every tap earns 🪙 coins and fills the repair bar
- At **100% repair** you get a big coin + XP reward and the car resets
- **Level up** with XP for coin bonuses and 💎 gems
- **Upgrades tab**: Better Tools, Turbo Kit, Garage Lift, Paint Booth, Engine Tuning, Premium Parts — prices rise with every purchase
- **Mechanics**: hire an Apprentice up to a full Pit Crew for automatic repairs (works offline too!)
- **Cars tab**: unlock and select 9 cars, each with bigger repair jobs and bigger rewards
- **Race tab**: 5 races from Street Sprint to the Supercar Cup — win chance depends on your car, level and Engine Tuning
- **💎 Boosts**: Nitro (2× coins for 60s) and Instant Fix
- **⚙️ Settings** (top right): stats, manual save and reset (with confirmation)

## ✨ Features

- One-screen mobile layout: near-fullscreen tappable car, repair bar pinned at the top, fixed bottom tabs
- Custom PNG asset pack (`assets/`): 9 cars with separate damage overlays that fade as you repair, thumbnails (locked/unlocked), icons, garage background and race sprites
- Owned upgrades & mechanics show up as gear tiles in the garage
- Floating "+coins" popups, sparks, car pop/celebrate animations, animated progress bars
- Idle income via mechanics + offline earnings (capped, 50% rate)
- Gems from level-ups, race wins and milestones
- Automatic saving to `localStorage` (every 15s and on close)
- Dark luxury garage style with neon cyan/orange accents, no horizontal scrolling

## 📁 Project structure

```
index.html   – all screens: HUD, garage, upgrades, cars, races, modals
style.css    – dark/neon garage styling, animations, responsive layout
script.js    – game data, formulas, save system, races, offline earnings
assets/      – PNG asset pack (cars, damage overlays, thumbnails, icons, sprites)
```

---

## 🔫 Weapon Clicker (bonus game)

The previous game in this repo is still playable: open `weapon-clicker.html`
(uses `css/` and `js/`).
