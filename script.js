/* ═══════════════════════════════════════════════════════════
   GARAGE EMPIRE CLICKER — game logic
   Plain JavaScript, no libraries. Saves to localStorage.
   ═══════════════════════════════════════════════════════════ */
'use strict';

/* ══════════════════ GAME DATA ══════════════════ */

const CARS = [
  { name: 'Rusty Hatchback', shape: 'hatch',  color: '#a4643c', color2: '#7a4527', glow: '#ff8c42', req: 50,     unlock: 0,        tapCoins: 1,   reward: 25,     xp: 10,   spoiler: 0 },
  { name: 'Old Sedan',       shape: 'sedan',  color: '#8d99ab', color2: '#5f6b7d', glow: '#9ecbff', req: 150,    unlock: 1000,     tapCoins: 2,   reward: 90,     xp: 25,   spoiler: 0 },
  { name: 'Broken Van',      shape: 'van',    color: '#5f7f94', color2: '#40586b', glow: '#6fd3ff', req: 400,    unlock: 5000,     tapCoins: 4,   reward: 280,    xp: 60,   spoiler: 0 },
  { name: 'Street Racer',    shape: 'sport',  color: '#22d3ee', color2: '#0e7f96', glow: '#22d3ee', req: 1000,   unlock: 25000,    tapCoins: 8,   reward: 900,    xp: 150,  spoiler: 1 },
  { name: 'Muscle Car',      shape: 'muscle', color: '#ff5c2e', color2: '#b53411', glow: '#ff5c2e', req: 2500,   unlock: 100000,   tapCoins: 15,  reward: 2800,   xp: 350,  spoiler: 0 },
  { name: 'Sports Car',      shape: 'sport',  color: '#ff2e63', color2: '#b30f3e', glow: '#ff2e63', req: 6000,   unlock: 400000,   tapCoins: 30,  reward: 9000,   xp: 800,  spoiler: 1 },
  { name: 'Luxury SUV',      shape: 'suv',    color: '#dfe6f0', color2: '#9aa6b8', glow: '#ffffff', req: 15000,  unlock: 1500000,  tapCoins: 60,  reward: 30000,  xp: 1800, spoiler: 0 },
  { name: 'Supercar',        shape: 'super',  color: '#ffc93d', color2: '#c28f0e', glow: '#ffc93d', req: 40000,  unlock: 6000000,  tapCoins: 120, reward: 100000, xp: 4000, spoiler: 2 },
  { name: 'Hypercar',        shape: 'super',  color: '#a26bff', color2: '#6a34cf', glow: '#a26bff', req: 100000, unlock: 25000000, tapCoins: 250, reward: 350000, xp: 9000, spoiler: 2 },
];

const UPGRADES = [
  { id: 'tools',   name: 'Better Tools',  icon: '🔧', desc: '+1 repair power per tap',    base: 50,   mult: 1.60 },
  { id: 'turbo',   name: 'Turbo Kit',     icon: '🌀', desc: '+30% coins per full repair', base: 200,  mult: 1.70 },
  { id: 'lift',    name: 'Garage Lift',   icon: '🏗️', desc: '+3 repair power per tap',    base: 500,  mult: 1.65 },
  { id: 'paint',   name: 'Paint Booth',   icon: '🎨', desc: '+25% coins per tap',         base: 350,  mult: 1.70 },
  { id: 'engine',  name: 'Engine Tuning', icon: '⚙️', desc: '+15 race power',             base: 400,  mult: 1.70 },
  { id: 'premium', name: 'Premium Parts', icon: '💠', desc: '+20% to ALL income',         base: 1000, mult: 1.85 },
];

const MECHANICS = [
  { id: 'apprentice', name: 'Apprentice Mechanic', icon: '🧑‍🔧', rps: 2,   base: 400,    mult: 1.5 },
  { id: 'pro',        name: 'Pro Mechanic',        icon: '👩‍🔧', rps: 10,  base: 3500,   mult: 1.5 },
  { id: 'master',     name: 'Master Mechanic',     icon: '🛠️',  rps: 50,  base: 30000,  mult: 1.5 },
  { id: 'pitcrew',    name: 'Pit Crew',            icon: '🏎️',  rps: 300, base: 250000, mult: 1.5 },
];

const RACES = [
  { name: 'Street Sprint', icon: '🛣️', diff: 30,   fee: 100,   coins: 400,    xp: 40,   gemChance: 0.15, gems: 1 },
  { name: 'Night Drag',    icon: '🌃', diff: 90,   fee: 500,   coins: 2000,   xp: 120,  gemChance: 0.20, gems: 1 },
  { name: 'City Circuit',  icon: '🏙️', diff: 220,  fee: 2500,  coins: 10000,  xp: 400,  gemChance: 0.25, gems: 2 },
  { name: 'Neon Highway',  icon: '🌌', diff: 550,  fee: 12000, coins: 50000,  xp: 1200, gemChance: 0.35, gems: 3 },
  { name: 'Supercar Cup',  icon: '🏆', diff: 1400, fee: 60000, coins: 280000, xp: 4000, gemChance: 0.50, gems: 5 },
];

const NITRO_COST = 5, NITRO_MS = 60000;
const FIX_COST = 3;
const SAVE_KEY = 'garageEmpireSave_v1';
const OFFLINE_CAP_SEC = 8 * 3600;
const OFFLINE_RATE = 0.5;

/* ══════════════════ CAR ARTWORK (inline SVG) ══════════════════ */

const SHAPES = {
  hatch: {
    body: 'M45 108 L48 82 Q50 72 68 70 L96 64 Q112 44 142 42 L182 42 Q202 44 212 58 L220 70 Q258 74 266 86 L268 108 Q268 114 260 114 L53 114 Q45 114 45 108 Z',
    win:  'M104 66 Q116 50 144 47 L178 47 Q196 49 206 62 L210 68 L104 68 Z',
  },
  sedan: {
    body: 'M30 108 L33 84 Q35 74 54 72 L88 66 Q104 44 138 42 L188 42 Q214 46 228 64 L266 70 Q288 74 292 88 L293 108 Q293 114 285 114 L38 114 Q30 114 30 108 Z',
    win:  'M100 67 Q112 50 140 47 L184 47 Q204 50 216 63 L219 67 Z',
  },
  van: {
    body: 'M34 108 L36 56 Q37 46 50 45 L214 45 Q228 45 236 54 L260 78 Q284 82 288 93 L289 108 Q289 114 281 114 L42 114 Q34 114 34 108 Z',
    win:  'M232 56 L252 76 L218 76 L218 56 Z M150 56 L206 56 L206 76 L150 76 Z M82 56 L138 56 L138 76 L82 76 Z',
  },
  muscle: {
    body: 'M28 108 L30 88 Q31 78 48 76 L76 70 Q94 50 124 48 L168 48 Q192 50 206 62 L218 74 L272 78 Q291 81 294 93 L295 108 Q295 114 287 114 L36 114 Q28 114 28 108 Z',
    win:  'M86 72 Q98 54 126 52 L164 52 Q184 54 196 66 L202 72 Z',
  },
  sport: {
    body: 'M26 108 L30 90 Q32 82 52 80 L96 70 Q122 52 154 51 L192 54 Q222 59 242 74 L278 82 Q293 85 295 96 L296 108 Q296 113 288 113 L34 113 Q26 113 26 108 Z',
    win:  'M106 72 Q126 56 156 55 L188 58 Q212 62 228 73 L232 76 L106 76 Z',
  },
  suv: {
    body: 'M32 108 L34 68 Q35 56 52 54 L92 50 Q106 36 136 34 L198 36 Q220 38 232 52 L244 60 Q280 64 285 80 L286 108 Q286 114 278 114 L40 114 Q32 114 32 108 Z',
    win:  'M100 58 Q110 42 138 40 L196 42 Q214 44 226 56 L229 60 L100 60 Z',
  },
  super: {
    body: 'M24 110 L28 94 Q30 87 50 85 L86 76 Q112 58 148 56 L186 59 Q216 64 240 79 L278 87 Q293 90 295 100 L296 110 Q296 114 288 114 L32 114 Q24 114 24 110 Z',
    win:  'M100 80 Q120 62 150 60 L182 63 Q206 67 224 78 L228 81 L100 81 Z',
  },
};

function spoilerSVG(level, color) {
  if (level === 1) {
    return `<path d="M30 76 L62 71 L62 63 L28 66 Z" fill="${color}"/><rect x="36" y="74" width="5" height="12" rx="2" fill="${color}"/>`;
  }
  if (level === 2) {
    return `<path d="M18 62 L68 55 L68 47 L16 52 Z" fill="${color}"/><rect x="28" y="60" width="5" height="26" rx="2" fill="${color}"/><rect x="54" y="56" width="5" height="28" rx="2" fill="${color}"/>`;
  }
  return '';
}

function wheelSVG(cx, r, glow) {
  return `
    <circle cx="${cx}" cy="112" r="${r}" fill="#0b0e15" stroke="#2a3242" stroke-width="3"/>
    <circle cx="${cx}" cy="112" r="${Math.round(r * 0.52)}" fill="#161d2b" stroke="${glow}" stroke-width="2" opacity="0.9"/>
    <path d="M${cx} ${112 - r * 0.5} V${112 + r * 0.5} M${cx - r * 0.5} 112 H${cx + r * 0.5}" stroke="#39445c" stroke-width="3" stroke-linecap="round"/>
    <circle cx="${cx}" cy="112" r="3.5" fill="#4a5674"/>`;
}

const DAMAGE_SVG = `
  <g class="damage-layer">
    <ellipse cx="122" cy="80" rx="16" ry="9" fill="#33230f" opacity="0.75"/>
    <ellipse cx="205" cy="90" rx="12" ry="7" fill="#3d2a12" opacity="0.7"/>
    <ellipse cx="72"  cy="95" rx="10" ry="6" fill="#2e1f0e" opacity="0.75"/>
    <ellipse cx="252" cy="98" rx="9"  ry="5" fill="#3d2a12" opacity="0.65"/>
    <path d="M142 60 L158 74 L150 77 L164 90" stroke="#1b1208" stroke-width="2.5" fill="none" opacity="0.8"/>
    <path d="M92 84 L106 88 M226 80 L242 86" stroke="#241808" stroke-width="3" fill="none" opacity="0.7"/>
  </g>`;

function carSVG(car, prefix, withDamage) {
  const sh = SHAPES[car.shape];
  const big = car.shape === 'van' || car.shape === 'suv';
  const wr = big ? 26 : 23;
  const gid = prefix + 'Grad';
  return `
  <svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stop-color="${car.color}"/>
        <stop offset="55%" stop-color="${car.color}"/>
        <stop offset="100%" stop-color="${car.color2}"/>
      </linearGradient>
      <linearGradient id="${gid}W" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#bfe9ff" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#1d3a52" stop-opacity="0.95"/>
      </linearGradient>
    </defs>
    <ellipse cx="160" cy="126" rx="128" ry="10" fill="#000" opacity="0.45"/>
    <ellipse cx="160" cy="124" rx="118" ry="7" fill="${car.glow}" opacity="0.28"/>
    ${spoilerSVG(car.spoiler, car.color2)}
    <path d="${sh.body}" fill="url(#${gid})" stroke="#0a0d14" stroke-width="2.5"/>
    <path d="${sh.win}" fill="url(#${gid}W)" stroke="#0a0d14" stroke-width="1.5"/>
    <rect x="150" y="88" width="26" height="4" rx="2" fill="#0a0d14" opacity="0.55"/>
    <circle cx="284" cy="90" r="5.5" fill="#fff6cf" stroke="#0a0d14" stroke-width="1.5"/>
    <circle cx="284" cy="90" r="9" fill="#fff6cf" opacity="0.25"/>
    <circle cx="36" cy="92" r="4.5" fill="#ff4d4d" stroke="#0a0d14" stroke-width="1.5"/>
    ${wheelSVG(86, wr, car.glow)}
    ${wheelSVG(234, wr, car.glow)}
    ${withDamage ? DAMAGE_SVG : ''}
  </svg>`;
}

/* ══════════════════ STATE ══════════════════ */

function defaultState() {
  return {
    coins: 0,
    gems: 0,
    level: 1,
    xp: 0,
    currentCar: 0,
    unlocked: CARS.map((c, i) => i === 0),
    progress: CARS.map(() => 0),
    upgrades: Object.fromEntries(UPGRADES.map(u => [u.id, 0])),
    mechanics: Object.fromEntries(MECHANICS.map(m => [m.id, 0])),
    boostUntil: 0,
    carsFixed: 0,
    taps: 0,
    racesWon: 0,
    racesLost: 0,
    totalCoins: 0,
    lastSeen: Date.now(),
  };
}

let S = defaultState();
let resetting = false;

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    const def = defaultState();
    S = Object.assign(def, data);
    S.upgrades = Object.assign(Object.fromEntries(UPGRADES.map(u => [u.id, 0])), data.upgrades || {});
    S.mechanics = Object.assign(Object.fromEntries(MECHANICS.map(m => [m.id, 0])), data.mechanics || {});
    while (S.unlocked.length < CARS.length) S.unlocked.push(false);
    while (S.progress.length < CARS.length) S.progress.push(0);
  } catch (e) {
    S = defaultState();
  }
}

function saveGame() {
  if (resetting) return;
  S.lastSeen = Date.now();
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) { /* storage full/blocked */ }
}

/* ══════════════════ FORMULAS ══════════════════ */

const car = () => CARS[S.currentCar];
const upLv = id => S.upgrades[id] || 0;

const premiumMult = () => 1 + upLv('premium') * 0.20;
const boostActive = () => Date.now() < S.boostUntil;
const boostMult = () => (boostActive() ? 2 : 1);

const repairPerTap = () => 1 + upLv('tools') + upLv('lift') * 3;
const coinsPerTap = () => Math.ceil(car().tapCoins * (1 + upLv('paint') * 0.25) * premiumMult() * boostMult());
const repairReward = () => Math.ceil(car().reward * (1 + upLv('turbo') * 0.30) * premiumMult() * boostMult());
const repairPerSec = () => MECHANICS.reduce((s, m) => s + m.rps * (S.mechanics[m.id] || 0), 0);
const racePower = () => 20 + S.currentCar * 15 + upLv('engine') * 15 + (S.level - 1) * 3;

const xpNeeded = lvl => Math.floor(50 * Math.pow(lvl, 1.5));
const upgradeCost = u => Math.floor(u.base * Math.pow(u.mult, upLv(u.id)));
const mechCost = m => Math.floor(m.base * Math.pow(m.mult, S.mechanics[m.id] || 0));

function winChance(race) {
  const p = racePower();
  return Math.max(0.05, Math.min(0.95, p / (p + race.diff)));
}

function fmt(n) {
  n = Math.floor(n);
  if (n < 1000) return String(n);
  const units = ['K', 'M', 'B', 'T', 'Qa'];
  let u = -1, x = n;
  while (x >= 1000 && u < units.length - 1) { x /= 1000; u++; }
  const s = x >= 100 ? x.toFixed(0) : x >= 10 ? x.toFixed(1) : x.toFixed(2);
  return s.replace(/\.0+$/, '').replace(/(\.\d)0$/, '$1') + units[u];
}

/* ══════════════════ DOM SHORTCUTS ══════════════════ */

const $ = s => document.querySelector(s);
const hudCoins = $('#hudCoins'), hudGems = $('#hudGems'), hudLevel = $('#hudLevel');
const xpFill = $('#xpFill'), xpText = $('#xpText');
const carNameEl = $('#carName'), rewardInfo = $('#rewardInfo');
const tapArea = $('#tapArea'), carSprite = $('#carSprite'), carGlow = $('#carGlow'), fxLayer = $('#fxLayer');
const repairFill = $('#repairFill'), repairPct = $('#repairPct');
const autoInfo = $('#autoInfo');
const boostNitroBtn = $('#boostNitro'), boostFixBtn = $('#boostFix');
const toastWrap = $('#toastWrap');

/* ══════════════════ TOASTS & FX ══════════════════ */

function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  toastWrap.appendChild(t);
  if (toastWrap.children.length > 4) toastWrap.removeChild(toastWrap.firstChild);
  setTimeout(() => t.remove(), 2900);
}

function floatText(x, y, text, big) {
  if (fxLayer.children.length > 40) return;
  const el = document.createElement('div');
  el.className = 'float-text' + (big ? ' big' : '');
  el.textContent = text;
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  fxLayer.appendChild(el);
  setTimeout(() => el.remove(), big ? 1450 : 950);
}

function sparks(x, y) {
  if (fxLayer.children.length > 40) return;
  for (let i = 0; i < 6; i++) {
    const s = document.createElement('div');
    s.className = 'spark' + (i % 2 ? ' blue' : '');
    const ang = Math.random() * Math.PI * 2;
    const dist = 30 + Math.random() * 55;
    s.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
    s.style.setProperty('--dy', Math.sin(ang) * dist - 20 + 'px');
    s.style.left = x + 'px';
    s.style.top = y + 'px';
    fxLayer.appendChild(s);
    setTimeout(() => s.remove(), 600);
  }
}

function carPop() {
  carSprite.classList.remove('pop');
  void carSprite.offsetWidth;
  carSprite.classList.add('pop');
}

function carCelebrate() {
  carSprite.classList.remove('celebrate');
  void carSprite.offsetWidth;
  carSprite.classList.add('celebrate');
}

/* ══════════════════ CORE MECHANICS ══════════════════ */

function addCoins(n) {
  S.coins += n;
  S.totalCoins += n;
}

function addXP(n, silent) {
  S.xp += n;
  while (S.xp >= xpNeeded(S.level)) {
    S.xp -= xpNeeded(S.level);
    S.level++;
    const bonus = 100 * S.level;
    addCoins(bonus);
    let gemMsg = '';
    if (S.level % 3 === 0) {
      S.gems += 2;
      gemMsg = ' +2 💎';
    }
    if (!silent) toast(`⬆️ LEVEL ${S.level}! +${fmt(bonus)} 🪙${gemMsg}`);
  }
}

function completeRepair(fromAuto) {
  const c = car();
  const coins = repairReward();
  addCoins(coins);
  addXP(c.xp, fromAuto);
  S.carsFixed++;
  S.progress[S.currentCar] = 0;
  if (S.carsFixed % 10 === 0) {
    S.gems += 2;
    toast(`🎖️ Milestone: ${S.carsFixed} cars fixed! +2 💎`);
  }
  if (!fromAuto) {
    const r = tapArea.getBoundingClientRect();
    floatText(r.width / 2, r.height * 0.3, `✅ REPAIRED! +${fmt(coins)} 🪙`, true);
    carCelebrate();
    if (navigator.vibrate) navigator.vibrate([20, 40, 20]);
  }
}

function doTap(clientX, clientY) {
  S.taps++;
  const coins = coinsPerTap();
  addCoins(coins);
  S.progress[S.currentCar] += repairPerTap();

  const r = tapArea.getBoundingClientRect();
  const x = clientX - r.left, y = clientY - r.top;
  floatText(x, y - 12, `+${fmt(coins)} 🪙`);
  sparks(x, y);
  carPop();
  if (navigator.vibrate) navigator.vibrate(8);

  if (S.progress[S.currentCar] >= car().req) completeRepair(false);

  updateHUD();
  updateRepairUI();
}

/* ══════════════════ UI: HUD & GARAGE ══════════════════ */

function updateHUD() {
  hudCoins.textContent = fmt(S.coins);
  hudGems.textContent = fmt(S.gems);
  hudLevel.textContent = S.level;
  const need = xpNeeded(S.level);
  xpFill.style.width = Math.min(100, (S.xp / need) * 100) + '%';
  xpText.textContent = `${fmt(S.xp)} / ${fmt(need)}`;
}

function updateRepairUI() {
  const c = car();
  const p = Math.min(1, S.progress[S.currentCar] / c.req);
  repairFill.style.width = (p * 100) + '%';
  repairPct.textContent = Math.floor(p * 100) + '%';
  const dmg = carSprite.querySelector('.damage-layer');
  if (dmg) dmg.style.opacity = Math.max(0, (1 - p) * 0.95);
}

function renderGarage() {
  const c = car();
  carNameEl.textContent = c.name;
  rewardInfo.innerHTML = `🪙 <b>${fmt(coinsPerTap())}</b>/tap &nbsp;·&nbsp; Full repair: <b>${fmt(repairReward())}</b> 🪙 + ${fmt(c.xp)} XP`;
  carSprite.innerHTML = carSVG(c, 'main', true);
  carGlow.style.setProperty('--car-glow', c.glow + '55');
  carGlow.style.background = `radial-gradient(50% 50% at 50% 50%, ${c.glow}4d 0%, transparent 70%)`;
  autoInfo.textContent = fmt(repairPerSec());
  updateRepairUI();
}

function updateBoostButtons() {
  if (boostActive()) {
    const left = Math.ceil((S.boostUntil - Date.now()) / 1000);
    boostNitroBtn.classList.add('active');
    boostNitroBtn.querySelector('span').textContent = `🔥 Nitro ×2 ACTIVE`;
    boostNitroBtn.querySelector('small').textContent = `${left}s left`;
  } else {
    boostNitroBtn.classList.remove('active');
    boostNitroBtn.querySelector('span').textContent = '🔥 Nitro ×2 coins';
    boostNitroBtn.querySelector('small').textContent = `${NITRO_COST} 💎 · 60s`;
  }
  boostNitroBtn.disabled = !boostActive() && S.gems < NITRO_COST;
  boostFixBtn.disabled = S.gems < FIX_COST;
}

/* ══════════════════ UI: UPGRADES & MECHANICS ══════════════════ */

const upgradeBtns = {}, mechanicBtns = {};

function renderUpgrades() {
  const list = $('#upgradeList');
  list.innerHTML = '';
  UPGRADES.forEach(u => {
    const lv = upLv(u.id);
    const cost = upgradeCost(u);
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-icon">${u.icon}</div>
      <div class="card-body">
        <div class="card-name">${u.name} <span class="lvl-tag">LV ${lv}</span></div>
        <div class="card-desc">${u.desc}</div>
      </div>
      <button class="buy-btn">🪙 ${fmt(cost)}</button>`;
    const btn = card.querySelector('.buy-btn');
    btn.addEventListener('click', () => buyUpgrade(u));
    upgradeBtns[u.id] = { btn, cost };
    list.appendChild(card);
  });

  const mlist = $('#mechanicList');
  mlist.innerHTML = '';
  MECHANICS.forEach(m => {
    const owned = S.mechanics[m.id] || 0;
    const cost = mechCost(m);
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-icon">${m.icon}</div>
      <div class="card-body">
        <div class="card-name">${m.name} <span class="lvl-tag">×${owned}</span></div>
        <div class="card-desc">+${m.rps} repair/sec each · now: <b>${fmt(m.rps * owned)}/s</b></div>
      </div>
      <button class="buy-btn">🪙 ${fmt(cost)}</button>`;
    const btn = card.querySelector('.buy-btn');
    btn.addEventListener('click', () => buyMechanic(m));
    mechanicBtns[m.id] = { btn, cost };
    mlist.appendChild(card);
  });
  updateAffordability();
}

function buyUpgrade(u) {
  const cost = upgradeCost(u);
  if (S.coins < cost) return;
  S.coins -= cost;
  S.upgrades[u.id] = upLv(u.id) + 1;
  toast(`${u.icon} ${u.name} → LV ${S.upgrades[u.id]}`);
  renderUpgrades();
  renderGarage();
  updateHUD();
  saveGame();
}

function buyMechanic(m) {
  const cost = mechCost(m);
  if (S.coins < cost) return;
  S.coins -= cost;
  S.mechanics[m.id] = (S.mechanics[m.id] || 0) + 1;
  toast(`${m.icon} Hired ${m.name}! +${m.rps} repair/s`);
  renderUpgrades();
  renderGarage();
  updateHUD();
  saveGame();
}

/* ══════════════════ UI: CARS ══════════════════ */

const carBtns = [];

function renderCars() {
  const list = $('#carList');
  list.innerHTML = '';
  carBtns.length = 0;
  CARS.forEach((c, i) => {
    const unlocked = S.unlocked[i];
    const selected = S.currentCar === i;
    const card = document.createElement('div');
    card.className = 'card car-card' + (unlocked ? '' : ' locked') + (selected ? ' selected' : '');
    card.innerHTML = `
      <div class="car-thumb">${carSVG(c, 'card' + i, false)}${unlocked ? '' : '<div class="lock-badge">🔒</div>'}</div>
      <div class="card-body">
        <div class="card-name">${c.name}</div>
        <div class="car-stats">
          <span>🔧 <b>${fmt(c.req)}</b></span>
          <span>🪙 <b>${fmt(c.reward)}</b> + ${fmt(c.xp)} XP</span>
          <span>👆 <b>${fmt(c.tapCoins)}</b>/tap</span>
        </div>
      </div>
      ${
        selected
          ? '<button class="buy-btn selected-btn" disabled>✓ ACTIVE</button>'
          : unlocked
            ? '<button class="buy-btn">Select</button>'
            : `<button class="buy-btn">🪙 ${fmt(c.unlock)}</button>`
      }`;
    const btn = card.querySelector('.buy-btn');
    if (!selected) {
      btn.addEventListener('click', () => (unlocked ? selectCar(i) : unlockCar(i)));
    }
    carBtns[i] = { btn, locked: !unlocked, cost: c.unlock, selected };
    list.appendChild(card);
  });
  updateAffordability();
}

function unlockCar(i) {
  const c = CARS[i];
  if (S.unlocked[i] || S.coins < c.unlock) return;
  S.coins -= c.unlock;
  S.unlocked[i] = true;
  toast(`🎉 Unlocked ${c.name}!`);
  selectCar(i);
}

function selectCar(i) {
  if (!S.unlocked[i]) return;
  S.currentCar = i;
  renderCars();
  renderGarage();
  renderRaces();
  updateHUD();
  saveGame();
}

/* ══════════════════ UI: RACES ══════════════════ */

const raceBtns = [];
let racing = false;

function renderRaces() {
  $('#racePowerLabel').textContent = fmt(racePower());
  const list = $('#raceList');
  list.innerHTML = '';
  raceBtns.length = 0;
  RACES.forEach((r, i) => {
    const ch = winChance(r);
    const pct = Math.round(ch * 100);
    const cls = pct >= 60 ? 'good' : pct >= 30 ? 'mid' : 'bad';
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-icon">${r.icon}</div>
      <div class="card-body">
        <div class="card-name">${r.name}</div>
        <div class="card-desc">Win: <b>${fmt(r.coins)} 🪙</b> + ${fmt(r.xp)} XP · ${Math.round(r.gemChance * 100)}% 💎</div>
        <div class="card-desc">Chance: <span class="race-chance ${cls}">${pct}%</span> · Entry: ${fmt(r.fee)} 🪙</div>
      </div>
      <button class="buy-btn">🏁 Race</button>`;
    const btn = card.querySelector('.buy-btn');
    btn.addEventListener('click', () => startRace(i));
    raceBtns[i] = { btn, cost: r.fee };
    list.appendChild(card);
  });
  updateAffordability();
}

function startRace(i) {
  if (racing) return;
  const r = RACES[i];
  if (S.coins < r.fee) { toast('Not enough coins for the entry fee!'); return; }
  racing = true;
  S.coins -= r.fee;
  updateHUD();

  const win = Math.random() < winChance(r);

  const modal = $('#raceModal');
  const you = $('#racerYou'), rival = $('#racerRival');
  const result = $('#raceResult'), collect = $('#raceCollectBtn');
  $('#raceTitle').textContent = `${r.icon} ${r.name}`;
  result.innerHTML = '<small>3… 2… 1… GO!</small>';
  collect.classList.add('hidden');
  you.style.transition = 'none';
  rival.style.transition = 'none';
  you.style.left = '6px';
  rival.style.left = '6px';
  modal.classList.remove('hidden');
  void you.offsetWidth;

  const fast = 2.0 + Math.random() * 0.3;
  const slow = 2.6 + Math.random() * 0.4;
  you.style.transition = `left ${win ? fast : slow}s cubic-bezier(.35,.75,.45,1)`;
  rival.style.transition = `left ${win ? slow : fast}s cubic-bezier(.35,.75,.45,1)`;
  you.style.left = 'calc(100% - 44px)';
  rival.style.left = 'calc(100% - 44px)';

  setTimeout(() => {
    let html;
    if (win) {
      const coins = Math.ceil(r.coins * premiumMult());
      addCoins(coins);
      addXP(r.xp);
      S.racesWon++;
      let gemTxt = '';
      if (Math.random() < r.gemChance) {
        S.gems += r.gems;
        gemTxt = ` + ${r.gems} 💎`;
      }
      html = `<span class="win">🏆 YOU WIN!</span><small>+${fmt(coins)} 🪙 · +${fmt(r.xp)} XP${gemTxt}</small>`;
      if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
    } else {
      const consolation = Math.ceil(r.fee * 0.3);
      addCoins(consolation);
      addXP(Math.ceil(r.xp * 0.1));
      S.racesLost++;
      html = `<span class="lose">💥 YOU LOST…</span><small>Consolation: +${fmt(consolation)} 🪙 · +${fmt(Math.ceil(r.xp * 0.1))} XP</small>`;
    }
    result.innerHTML = html;
    collect.classList.remove('hidden');
    updateHUD();
    saveGame();
  }, slow * 1000 + 300);
}

$('#raceCollectBtn').addEventListener('click', () => {
  $('#raceModal').classList.add('hidden');
  racing = false;
  renderRaces();
  updateHUD();
});

/* ══════════════════ AFFORDABILITY (cheap per-tick refresh) ══════════════════ */

function updateAffordability() {
  for (const u of UPGRADES) {
    const e = upgradeBtns[u.id];
    if (e) e.btn.disabled = S.coins < e.cost;
  }
  for (const m of MECHANICS) {
    const e = mechanicBtns[m.id];
    if (e) e.btn.disabled = S.coins < e.cost;
  }
  carBtns.forEach(e => {
    if (!e || e.selected) return;
    e.btn.disabled = e.locked && S.coins < e.cost;
  });
  raceBtns.forEach(e => {
    if (e) e.btn.disabled = racing || S.coins < e.cost;
  });
  updateBoostButtons();
}

/* ══════════════════ BOOSTS ══════════════════ */

boostNitroBtn.addEventListener('click', () => {
  if (boostActive() || S.gems < NITRO_COST) return;
  S.gems -= NITRO_COST;
  S.boostUntil = Date.now() + NITRO_MS;
  toast('🔥 NITRO! Double coins for 60 seconds!');
  renderGarage();
  updateHUD();
  saveGame();
});

boostFixBtn.addEventListener('click', () => {
  if (S.gems < FIX_COST) return;
  S.gems -= FIX_COST;
  completeRepair(false);
  toast('⚡ Instant fix! Car repaired.');
  renderGarage();
  updateHUD();
  saveGame();
});

/* ══════════════════ TAP INPUT ══════════════════ */

tapArea.addEventListener('pointerdown', e => {
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  e.preventDefault();
  doTap(e.clientX, e.clientY);
});

/* ══════════════════ TABS ══════════════════ */

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b === btn));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    $('#tab-' + btn.dataset.tab).classList.add('active');
    if (btn.dataset.tab === 'upgrades') renderUpgrades();
    if (btn.dataset.tab === 'cars') renderCars();
    if (btn.dataset.tab === 'race') renderRaces();
  });
});

/* ══════════════════ SETTINGS / RESET ══════════════════ */

const settingsModal = $('#settingsModal');
let resetArmed = false;

$('#settingsBtn').addEventListener('click', () => {
  $('#statsBox').innerHTML = `
    <span>👆 Taps: <b>${fmt(S.taps)}</b></span>
    <span>✅ Cars fixed: <b>${fmt(S.carsFixed)}</b></span>
    <span>🏆 Races won: <b>${fmt(S.racesWon)}</b></span>
    <span>💥 Races lost: <b>${fmt(S.racesLost)}</b></span>
    <span>🪙 Total earned: <b>${fmt(S.totalCoins)}</b></span>
    <span>⭐ Level: <b>${S.level}</b></span>`;
  resetArmed = false;
  $('#resetBtn').textContent = '🗑️ Reset progress';
  settingsModal.classList.remove('hidden');
});

$('#settingsCloseBtn').addEventListener('click', () => settingsModal.classList.add('hidden'));

$('#saveBtn').addEventListener('click', () => {
  saveGame();
  toast('💾 Game saved!');
});

$('#resetBtn').addEventListener('click', () => {
  if (!resetArmed) {
    resetArmed = true;
    $('#resetBtn').textContent = '⚠️ Tap again to confirm reset';
    return;
  }
  resetting = true;
  localStorage.removeItem(SAVE_KEY);
  location.reload();
});

/* ══════════════════ OFFLINE EARNINGS ══════════════════ */

function applyOfflineEarnings() {
  const awaySec = (Date.now() - (S.lastSeen || Date.now())) / 1000;
  if (awaySec < 60) return;
  const rps = repairPerSec();
  if (rps <= 0) return;

  const effective = Math.min(awaySec, OFFLINE_CAP_SEC) * OFFLINE_RATE;
  const c = car();
  let points = rps * effective + S.progress[S.currentCar];
  const fixes = Math.floor(points / c.req);
  S.progress[S.currentCar] = Math.floor(points % c.req);
  if (fixes <= 0) return;

  const coinsEach = Math.ceil(c.reward * (1 + upLv('turbo') * 0.30) * premiumMult());
  const coins = fixes * coinsEach;
  const xp = fixes * c.xp;
  addCoins(coins);
  addXP(xp, true);
  S.carsFixed += fixes;

  const hrs = Math.floor(awaySec / 3600), mins = Math.floor((awaySec % 3600) / 60);
  const awayTxt = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  $('#offlineText').innerHTML =
    `You were away for <b>${awayTxt}</b>.<br>Your crew fixed <b>${fmt(fixes)}</b> car${fixes > 1 ? 's' : ''} and earned<br><b>${fmt(coins)} 🪙</b> + <b>${fmt(xp)} XP</b>!`;
  $('#offlineModal').classList.remove('hidden');
}

$('#offlineCollectBtn').addEventListener('click', () => {
  $('#offlineModal').classList.add('hidden');
  updateHUD();
  renderGarage();
});

/* ══════════════════ GAME LOOP ══════════════════ */

let lastTick = Date.now();
let repairAcc = 0;

function tick() {
  const now = Date.now();
  const dt = Math.min(2, (now - lastTick) / 1000);
  lastTick = now;

  const rps = repairPerSec();
  if (rps > 0) {
    repairAcc += rps * dt;
    const whole = Math.floor(repairAcc);
    if (whole > 0) {
      repairAcc -= whole;
      S.progress[S.currentCar] += whole;
      let guard = 0;
      while (S.progress[S.currentCar] >= car().req && guard++ < 1000) {
        completeRepair(true);
      }
      updateHUD();
      updateRepairUI();
    }
  }

  updateBoostButtons();
  updateAffordability();
}

setInterval(tick, 250);
setInterval(saveGame, 15000);

document.addEventListener('visibilitychange', () => {
  if (document.hidden) saveGame();
});
window.addEventListener('beforeunload', saveGame);

/* ══════════════════ INIT ══════════════════ */

loadGame();
applyOfflineEarnings();
renderGarage();
renderUpgrades();
renderCars();
renderRaces();
updateHUD();
updateBoostButtons();
saveGame();

/* debug/test hook */
window.__GE = { get state() { return S; }, save: saveGame };
