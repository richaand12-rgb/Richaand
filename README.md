# 🔫 Weapon Clicker

A colorful, addictive mobile clicker game combined with a battle/shooter system.
Tap monsters, fire your weapon, earn coins, unlock crazy weapons, buy upgrades,
defeat bosses and prestige for permanent bonuses!

## ▶️ How to play

Open `index.html` in any modern browser (works great on mobile).
No build step, no dependencies — it's plain HTML, CSS and JavaScript.

- **Tap anywhere** on the intro screen to start
- **Tap the battlefield** — your weapon fires a shot at the monster
- Buy the **Auto Fire** upgrade and your weapon shoots by itself
- Defeat monsters to earn 🪙 coins — every 10th monster is a **👑 BOSS**
- **⚙️ Settings** top right, **🏅 Achievements** right below it
- Buy new **weapons** in the Arsenal (pistol → shotgun → rifle → laser → rocket → minigun → plasma → sword blaster → mythical weapon)
- Buy **upgrades**: damage, attack speed, crits, auto fire, coin multiplier, boss rewards, offline earnings and more (Buy 1 / Buy 10 / Buy Max)
- Claim your **daily reward** and keep your login streak going
- Unlock **achievements** for bonus coins and 💎
- From stage 20: **🌟 Prestige** — reset your run for permanent 💎 bonuses (+10% damage, +10% coins, +5% fire rate per 💎)

## ✨ Features

- 6 worlds with changing backgrounds (Green Plains → Cosmic Void)
- 12 monster types + 6 rotating bosses with hit/death animations
- 9 weapons with unique SVG looks and projectile effects (bullets, pellets, lasers, rockets, plasma, slashes)
- Damage popups, critical hits, muzzle flashes, coin bursts and screen shake
- 10 upgrade types with exponential pricing
- 15 achievements, daily rewards with streaks, offline earnings
- Full prestige/rebirth system
- Generated chiptune music & sound effects (WebAudio, no audio files)
- Vibration support on mobile
- Automatic local save (localStorage)

## 📁 Project structure

```
index.html      – all screens (intro, battle, shops, settings)
css/style.css   – colorful arcade styling, animations, responsive layout
js/data.js      – weapons, monsters, bosses, worlds, upgrades, achievements
js/audio.js     – generated sound effects & music (WebAudio)
js/game.js      – game state, formulas, save system, prestige, dailies
js/effects.js   – damage popups, projectiles, particles, screen shake
js/ui.js        – HUD, panels, modals, toasts
js/main.js      – init, event handlers, game loop
```
