---
name: verify
description: Verify Weapon Clicker end-to-end by driving the game UI in headless Chromium with Playwright.
---

# Verifying Weapon Clicker

The game is plain HTML/CSS/JS — no build step. Verify changes by driving the
real UI in a browser, not by unit-calling functions.

## Launch

```bash
# Serve the repo root (file:// also works, but http avoids surprises)
python3 -m http.server 8765 &

# Playwright: install playwright-core (small, no browser download) and use
# the pre-installed Chromium:
npm install playwright-core
# executablePath: /opt/pw-browsers/chromium-1194/chrome-linux/chrome
# (glob /opt/pw-browsers/chromium-*/chrome-linux/chrome if the version bumped)
```

Use a mobile viewport: `{ width: 390, height: 844, isMobile: true, hasTouch: true }`.

## Flows worth driving

1. Intro: `#introScreen` visible → tap it → `#gameScreen` visible.
2. **A daily-reward modal opens on first start** — dismiss it via
   `#modalButtons .btn` before tapping the battlefield, or taps time out.
3. Tap `#battleArea` repeatedly → a projectile flies, then (after ~130-330ms
   flight time) `currentMonsterHP` drops and coins/kills rise. There is no
   FIRE button; taps fire the weapon.
4. Panels: nav `[data-panel]` buttons (weapons/upgrades/rewards, tap again to
   close), `#settingsFab` / `#achievementsFab` floating buttons, `.panel-close`
   ✕ buttons. Upgrade cards each have Buy 1/10/Max buttons:
   `[data-action="buyUpgrade"][data-id][data-amt="1|10|max"]`.
6. Boss: `state.killsThisStage = 9; monsterAlive = false; spawnMonster()` in
   `page.evaluate` → `currentMonster.isBoss` true, killing it bumps `state.stage`.
7. Persistence: `save()` → reload → re-enter via intro tap → state restored.

## Gotchas

- Collect `pageerror` and console `error` events; the game should produce none.
- `state`, `UI`, `FX`, `save()`, `spawnMonster()`, `dealDamage()` are globals —
  handy for fast-forwarding currency/stage, but exercise buys through the UI.
- Achievements can grant coins the moment prestige resets them; coins right
  after prestige equal the just-unlocked achievement rewards, not always 0.
