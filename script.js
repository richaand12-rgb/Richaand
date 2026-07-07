/* ═══════════════════════════════════════════════════════════
   GARAGE EMPIRE CLICKER — game logic
   Plain JavaScript, no libraries. Saves to localStorage.
   Artwork: PNG asset pack in ./assets (@2x exports).
   ═══════════════════════════════════════════════════════════ */
'use strict';

/* ══════════════════ GAME DATA ══════════════════ */

const CARS = [
  { name: 'Rusty Hatchback', slug: 'rusty_hatchback', glow: '#ff8c42', req: 100,    unlock: 0,        tapCoins: 1,   reward: 30,     xp: 8 },
  { name: 'Old Sedan',       slug: 'old_sedan',       glow: '#9ecbff', req: 350,    unlock: 2500,     tapCoins: 2,   reward: 120,    xp: 20 },
  { name: 'Broken Van',      slug: 'broken_van',      glow: '#6fd3ff', req: 1000,   unlock: 12000,    tapCoins: 4,   reward: 400,    xp: 50 },
  { name: 'Street Racer',    slug: 'street_racer',    glow: '#22d3ee', req: 3000,   unlock: 60000,    tapCoins: 8,   reward: 1400,   xp: 120 },
  { name: 'Muscle Car',      slug: 'muscle_car',      glow: '#ff5c2e', req: 8000,   unlock: 250000,   tapCoins: 15,  reward: 4500,   xp: 300 },
  { name: 'Sports Car',      slug: 'sports_car',      glow: '#ff2e63', req: 20000,  unlock: 1000000,  tapCoins: 30,  reward: 15000,  xp: 700 },
  { name: 'Luxury SUV',      slug: 'luxury_suv',      glow: '#ffffff', req: 50000,  unlock: 4000000,  tapCoins: 60,  reward: 50000,  xp: 1600 },
  { name: 'Supercar',        slug: 'supercar',        glow: '#ffc93d', req: 130000, unlock: 15000000, tapCoins: 120, reward: 160000, xp: 3600 },
  { name: 'Hypercar',        slug: 'hypercar',        glow: '#a26bff', req: 350000, unlock: 60000000, tapCoins: 250, reward: 550000, xp: 8000 },
];

const UPGRADES = [
  { id: 'tools',   name: 'Better Tools',  img: 'assets/upgrades/better_tools.png',  desc: '+1 repair power per tap',    base: 75,   mult: 1.75 },
  { id: 'turbo',   name: 'Turbo Kit',     img: 'assets/upgrades/turbo_kit.png',     desc: '+30% coins per full repair', base: 300,  mult: 1.85 },
  { id: 'lift',    name: 'Garage Lift',   img: 'assets/upgrades/garage_lift.png',   desc: '+3 repair power per tap',    base: 800,  mult: 1.80 },
  { id: 'paint',   name: 'Paint Booth',   img: 'assets/upgrades/paint_booth.png',   desc: '+25% coins per tap',         base: 500,  mult: 1.85 },
  { id: 'engine',  name: 'Engine Tuning', img: 'assets/upgrades/engine_tuning.png', desc: '+12 race power',             base: 600,  mult: 1.85 },
  { id: 'premium', name: 'Premium Parts', img: 'assets/upgrades/premium_parts.png', desc: '+20% to ALL income',         base: 2000, mult: 2.0 },
];

const MECHANICS = [
  { id: 'apprentice', name: 'Apprentice Mechanic', img: 'assets/mechanics/apprentice_mechanic.png', rps: 2,   base: 600,    mult: 1.6 },
  { id: 'pro',        name: 'Pro Mechanic',        img: 'assets/mechanics/pro_mechanic.png',        rps: 10,  base: 6000,   mult: 1.6 },
  { id: 'master',     name: 'Master Mechanic',     img: 'assets/mechanics/master_mechanic.png',     rps: 50,  base: 60000,  mult: 1.6 },
  { id: 'pitcrew',    name: 'Pit Crew',            img: 'assets/mechanics/pit_crew.png',            rps: 300, base: 600000, mult: 1.6 },
];

const RACES = [
  { name: 'Street Sprint', img: 'assets/race_icons/street_sprint.png', diff: 60,   fee: 150,    coins: 500,    xp: 35,   gemChance: 0.10, gems: 1 },
  { name: 'Night Drag',    img: 'assets/race_icons/night_drag.png',    diff: 200,  fee: 800,    coins: 2500,   xp: 100,  gemChance: 0.15, gems: 1 },
  { name: 'City Circuit',  img: 'assets/race_icons/city_circuit.png',  diff: 550,  fee: 4000,   coins: 12000,  xp: 350,  gemChance: 0.20, gems: 2 },
  { name: 'Neon Highway',  img: 'assets/race_icons/neon_highway.png',  diff: 1500, fee: 20000,  coins: 60000,  xp: 1000, gemChance: 0.30, gems: 3 },
  { name: 'Supercar Cup',  img: 'assets/race_icons/supercar_cup.png',  diff: 4000, fee: 100000, coins: 320000, xp: 3500, gemChance: 0.40, gems: 5 },
];

const NITRO_COST = 5, NITRO_MS = 60000;
const FIX_COST = 6;
const SAVE_KEY = 'garageEmpireSave_v1';
const OFFLINE_CAP_SEC = 8 * 3600;
const OFFLINE_RATE = 0.5;

/* resolver: de single-file bundel (artifact) zet window.__ASSETS met data-URI's */
const ASSET = p => (window.__ASSETS && window.__ASSETS[p]) || p;

const carImg = c => ASSET(`assets/cars/${c.slug}.png`);
const carDamageImg = c => ASSET(`assets/cars_damage/${c.slug}_damage.png`);
const carThumb = (c, locked) => ASSET(locked
  ? `assets/cars_thumbnails_locked/${c.slug}_locked_thumb.png`
  : `assets/cars_thumbnails/${c.slug}_thumb.png`);

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
const racePower = () => 20 + S.currentCar * 15 + upLv('engine') * 12 + (S.level - 1) * 2;

const xpNeeded = lvl => Math.floor(80 * Math.pow(lvl, 1.6));
const upgradeCost = u => Math.floor(u.base * Math.pow(u.mult, upLv(u.id)));
const mechCost = m => Math.floor(m.base * Math.pow(m.mult, S.mechanics[m.id] || 0));

function winChance(race) {
  const p = racePower();
  return Math.max(0.03, Math.min(0.90, p / (p + race.diff)));
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
const autoInfo = $('#autoInfo'), equipRow = $('#equipRow');
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

function sparks(x, y, count) {
  if (fxLayer.children.length > 60) return;
  for (let i = 0; i < (count || 6); i++) {
    const s = document.createElement('div');
    s.className = 'spark' + (i % 2 ? ' blue' : '');
    const ang = Math.random() * Math.PI * 2;
    const dist = 30 + Math.random() * (count > 6 ? 110 : 55);
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
  tapArea.classList.remove('flash');
  void tapArea.offsetWidth;
  tapArea.classList.add('flash');
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
    sparks(r.width / 2, r.height * 0.55, 18);
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
  if (Math.random() < 0.25) floatText(x + 26, y - 34, '🔧');
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
  const dmg = carSprite.querySelector('.car-damage');
  if (dmg) dmg.style.opacity = Math.max(0, 1 - p);
}

function renderEquipRow(justBoughtId) {
  equipRow.innerHTML = '';
  UPGRADES.forEach(u => {
    const lv = upLv(u.id);
    if (lv <= 0) return;
    const d = document.createElement('div');
    d.className = 'equip' + (u.id === justBoughtId ? ' just-bought' : '');
    d.innerHTML = `<img src="${ASSET(u.img)}" alt="${u.name}"><span class="equip-lv">${lv}</span>`;
    equipRow.appendChild(d);
  });
  MECHANICS.forEach(m => {
    const n = S.mechanics[m.id] || 0;
    if (n <= 0) return;
    const d = document.createElement('div');
    d.className = 'equip mech' + (m.id === justBoughtId ? ' just-bought' : '');
    d.innerHTML = `<img src="${ASSET(m.img)}" alt="${m.name}"><span class="equip-lv">×${n}</span>`;
    equipRow.appendChild(d);
  });
}

function renderGarage(justBoughtId) {
  const c = car();
  carNameEl.textContent = c.name;
  rewardInfo.innerHTML = `⚒ <b>${fmt(repairPerTap())}</b> repair &amp; 🪙 <b>${fmt(coinsPerTap())}</b> per tap · Full repair: <b>${fmt(repairReward())}</b> 🪙 + ${fmt(c.xp)} XP`;
  carSprite.innerHTML = `
    <div class="car-stack">
      <img class="car-img" src="${carImg(c)}" alt="${c.name}" draggable="false">
      <img class="car-damage" src="${carDamageImg(c)}" alt="" draggable="false">
    </div>`;
  carGlow.style.background = `radial-gradient(50% 50% at 50% 50%, ${c.glow}4d 0%, transparent 70%)`;
  autoInfo.textContent = fmt(repairPerSec());
  renderEquipRow(justBoughtId);
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
    boostNitroBtn.querySelector('span').textContent = '🔥 Nitro ×2';
    boostNitroBtn.querySelector('small').textContent = `${NITRO_COST} 💎 · 60s`;
  }
  boostFixBtn.querySelector('small').textContent = `${FIX_COST} 💎`;
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
      <div class="card-icon"><img src="${ASSET(u.img)}" alt=""></div>
      <div class="card-body">
        <div class="card-name">${u.name} <span class="lvl-tag">LV ${lv}</span></div>
        <div class="card-desc">${u.desc}</div>
      </div>
      <button class="buy-btn">🪙 ${fmt(cost)}</button>`;
    const btn = card.querySelector('.buy-btn');
    btn.addEventListener('click', () => buyUpgrade(u, card));
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
      <div class="card-icon"><img src="${ASSET(m.img)}" alt=""></div>
      <div class="card-body">
        <div class="card-name">${m.name} <span class="lvl-tag">×${owned}</span></div>
        <div class="card-desc">+${m.rps} repair/sec each · now: <b>${fmt(m.rps * owned)}/s</b></div>
      </div>
      <button class="buy-btn">🪙 ${fmt(cost)}</button>`;
    const btn = card.querySelector('.buy-btn');
    btn.addEventListener('click', () => buyMechanic(m, card));
    mechanicBtns[m.id] = { btn, cost };
    mlist.appendChild(card);
  });
  updateAffordability();
}

function flashCard(card) {
  card.classList.remove('just-bought');
  void card.offsetWidth;
  card.classList.add('just-bought');
}

function buyUpgrade(u, cardEl) {
  const cost = upgradeCost(u);
  if (S.coins < cost) return;
  S.coins -= cost;
  S.upgrades[u.id] = upLv(u.id) + 1;
  toast(`⬆️ ${u.name} → LV ${S.upgrades[u.id]}`);
  renderUpgrades();
  renderGarage(u.id);
  updateHUD();
  saveGame();
  const fresh = upgradeBtns[u.id];
  if (fresh) flashCard(fresh.btn.closest('.card'));
}

function buyMechanic(m, cardEl) {
  const cost = mechCost(m);
  if (S.coins < cost) return;
  S.coins -= cost;
  S.mechanics[m.id] = (S.mechanics[m.id] || 0) + 1;
  toast(`🧑‍🔧 Hired ${m.name}! +${m.rps} repair/s`);
  renderUpgrades();
  renderGarage(m.id);
  updateHUD();
  saveGame();
  const fresh = mechanicBtns[m.id];
  if (fresh) flashCard(fresh.btn.closest('.card'));
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
      <div class="car-thumb"><img src="${carThumb(c, !unlocked)}" alt="${c.name}" draggable="false"></div>
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
      <div class="card-icon"><img src="${ASSET(r.img)}" alt=""></div>
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
  $('#raceTitle').textContent = r.name;
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
  you.style.left = 'calc(100% - 48px)';
  rival.style.left = 'calc(100% - 48px)';

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
      const consolation = Math.ceil(r.fee * 0.15);
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

/* boost-taps mogen geen repair-tap triggeren */
$('#boostRow').addEventListener('pointerdown', e => e.stopPropagation());

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
