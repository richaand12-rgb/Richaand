/* ═══════════════════════════════════════════════════════════
   WEAPON CLICKER — Kern gamelogica
   State, formules, monsters, wapens, upgrades, prestige,
   daily rewards, achievements en het save-systeem.
   ═══════════════════════════════════════════════════════════ */

'use strict';

const SAVE_KEY = 'weaponClickerSave_v1';

/* ─────────────── GAME STATE ─────────────── */

// Maakt een verse (nieuwe) game state aan
function freshState() {
  return {
    // Valuta
    coins: 0,                    // huidige coins
    prestigePoints: 0,           // besteedbare gems (💎)
    totalPrestigeEarned: 0,      // alle ooit verdiende gems → basis van de prestige-bonus
    prestigeCount: 0,            // hoe vaak de speler geprestiged heeft

    // Voortgang
    stage: 1,                    // huidige stage / level
    maxStage: 1,                 // hoogste stage deze run (voor weapon unlocks)
    killsThisStage: 0,           // 0..9, het 10e monster is de boss

    // Wapens
    currentWeapon: 'pistol',     // id van het actieve wapen
    unlockedWeapons: ['pistol'], // gekochte wapens
    weaponLevels: { pistol: 0 }, // upgrade level per wapen

    // Upgrade levels
    upgrades: {
      tapPower: 0, damage: 0, attackSpeed: 0, crit: 0, autoFire: 0,
      coinMult: 0, bossReward: 0, weaponPower: 0, offline: 0, prestigeBoost: 0,
    },

    // Statistieken (blijven bewaard door prestige heen)
    stats: {
      totalKills: 0, bossKills: 0, totalDamage: 0,
      totalCoinsEarned: 0, taps: 0, crits: 0,
    },

    achievements: [],            // ids van behaalde achievements

    settings: { sound: true, music: true, vibration: true },

    daily: { lastClaim: '', streak: 0 },  // daily reward / login streak

    lastSeen: Date.now(),        // voor offline earnings
  };
}

let state = freshState();

/* ─────────────── MONSTER RUNTIME ───────────────
   (wordt niet opgeslagen; bij laden spawnt een vers monster) */

let currentMonsterHP = 0;    // huidige HP van het monster
let maxMonsterHP = 0;        // max HP van het monster
let currentMonster = null;   // { name, emoji, color, isBoss }
let monsterAlive = false;

/* ─────────────── HELPERS ─────────────── */

// Trilfunctie voor mobiel (alleen als vibration aanstaat)
function vibrate(ms) {
  if (state.settings.vibration && navigator.vibrate) navigator.vibrate(ms);
}

function getWeapon(id) {
  return WEAPONS.find(w => w.id === (id || state.currentWeapon));
}

function getWeaponLevel(id) {
  return state.weaponLevels[id] || 0;
}

/* ─────────────── DAMAGE & STAT FORMULES ─────────────── */

// Schade van een wapen inclusief zijn eigen upgrade level
function weaponBaseDamage(weapon, level) {
  return weapon.damage * Math.pow(1.25, level);
}

// Hoe sterk de prestige-bonus werkt (Prestige Boost upgrade versterkt hem)
function prestigeBoostFactor() {
  return 1 + 0.10 * state.upgrades.prestigeBoost;
}

// Permanente prestige bonussen: per 💎 +10% damage, +10% coins, +5% fire rate
function prestigeDamageMult() {
  return 1 + 0.10 * state.totalPrestigeEarned * prestigeBoostFactor();
}

function prestigeCoinMult() {
  return 1 + 0.10 * state.totalPrestigeEarned * prestigeBoostFactor();
}

function prestigeRateMult() {
  return Math.min(2, 1 + 0.05 * state.totalPrestigeEarned); // max +100%
}

// Totale damage-multiplier van alle upgrades samen
function globalDamageMult() {
  return (1 + 0.10 * state.upgrades.damage)
       * (1 + 0.10 * state.upgrades.weaponPower)
       * prestigeDamageMult();
}

// Schade van één schot met het huidige wapen
function shotDamage() {
  const w = getWeapon();
  return weaponBaseDamage(w, getWeaponLevel(w.id)) * globalDamageMult();
}

// Schade van één tap (helft van een schot, versterkt door Tap Power)
function tapDamage() {
  return shotDamage() * 0.5 * (1 + 0.25 * state.upgrades.tapPower);
}

// Kans op een critical hit (max 50%)
function critChance() {
  return Math.min(0.5, 0.05 + 0.02 * state.upgrades.crit);
}

// Schoten per seconde van het huidige wapen (max 12 voor de effecten)
function fireRate() {
  return Math.min(12, getWeapon().fireRate * (1 + 0.08 * state.upgrades.attackSpeed) * prestigeRateMult());
}

// Automatische schoten per seconde (Auto Fire upgrade: 25% per level)
function autoFireRate() {
  return fireRate() * Math.min(1, 0.25 * state.upgrades.autoFire);
}

// Gemiddelde automatische damage per seconde (voor de HUD)
function autoDPS() {
  return autoFireRate() * shotDamage() * (1 + critChance() * (CRIT_MULT - 1));
}

// Coin-multiplier van upgrades + prestige
function coinMultiplier() {
  return (1 + 0.15 * state.upgrades.coinMult) * prestigeCoinMult();
}

/* ─────────────── MONSTER SYSTEEM ─────────────── */

// Max HP van een monster op een bepaalde stage
function monsterMaxHpFor(stage, isBoss) {
  const base = 18 * stage * Math.pow(1.16, stage - 1);
  return Math.max(10, Math.round(base * (isBoss ? 6 : 1)));
}

// Basis coin-beloning van een monster (vóór multipliers)
function baseCoinReward(stage, isBoss) {
  return Math.max(3, Math.round(7 * stage * Math.pow(1.14, stage - 1) * (isBoss ? 10 : 1)));
}

// Spawnt een nieuw monster (het 10e monster van elke stage is een boss)
function spawnMonster() {
  const isBoss = state.killsThisStage === MONSTERS_PER_STAGE - 1;

  let def;
  if (isBoss) {
    def = BOSSES[(state.stage - 1) % BOSSES.length];
  } else {
    // Hogere stages ontgrendelen meer monstersoorten
    const poolSize = Math.min(MONSTERS.length, 3 + Math.floor(state.stage / 3));
    def = MONSTERS[Math.floor(Math.random() * poolSize)];
  }

  maxMonsterHP = monsterMaxHpFor(state.stage, isBoss);
  if (!isBoss) maxMonsterHP = Math.round(maxMonsterHP * (0.9 + Math.random() * 0.25));
  currentMonsterHP = maxMonsterHP;

  currentMonster = { name: def.name, emoji: def.emoji, color: def.color, isBoss };
  monsterAlive = true;

  UI.renderMonster();
  if (isBoss) {
    UI.toast('👑 BOSS INCOMING!');
    AudioSys.boss();
    FX.shake();
  }
}

// Brengt schade toe aan het huidige monster
function dealDamage(amount, isCrit, x, y) {
  if (!monsterAlive) return;

  currentMonsterHP -= amount;
  state.stats.totalDamage += amount;

  FX.damagePopup(amount, isCrit, x, y);
  FX.hitMonster();
  UI.updateHP();

  if (isCrit) AudioSys.crit();

  if (currentMonsterHP <= 0) killMonster();
}

// Monster verslagen: coins uitkeren, stage-voortgang en respawn
function killMonster() {
  monsterAlive = false;
  const wasBoss = currentMonster.isBoss;

  // Beloning berekenen (bosses krijgen ook de Boss Reward bonus)
  let reward = baseCoinReward(state.stage, wasBoss) * coinMultiplier();
  if (wasBoss) reward *= 1 + 0.25 * state.upgrades.bossReward;
  reward = Math.round(reward);

  state.coins += reward;
  state.stats.totalCoinsEarned += reward;
  state.stats.totalKills++;
  if (wasBoss) state.stats.bossKills++;

  // Effecten
  FX.deathFX(currentMonster.color);
  FX.coinReward(reward);
  AudioSys.death();
  setTimeout(() => AudioSys.coin(), 150);
  vibrate(wasBoss ? 80 : 35);
  if (wasBoss) FX.shake();

  // Stage voortgang
  state.killsThisStage++;
  if (state.killsThisStage >= MONSTERS_PER_STAGE) {
    // Boss verslagen → volgende stage!
    state.killsThisStage = 0;
    state.stage++;
    if (state.stage > state.maxStage) {
      state.maxStage = state.stage;
      UI.toast(`🎉 Stage ${state.stage} reached!`);
      // Melden welke wapens nu te koop zijn
      WEAPONS.forEach(w => {
        if (w.unlockStage === state.maxStage) UI.toast(`🔓 New weapon in the shop: ${w.name}!`);
      });
    }
  }

  checkAchievements();
  UI.renderHUD();
  save();

  // Nieuw monster na een korte pauze
  setTimeout(spawnMonster, 550);
}

// Tap/klik op het slagveld = tap-aanval
function tapAttack(x, y) {
  if (!monsterAlive) return;
  state.stats.taps++;

  const isCrit = Math.random() < critChance();
  if (isCrit) state.stats.crits++;
  const dmg = tapDamage() * (isCrit ? CRIT_MULT : 1);

  AudioSys.hit();
  vibrate(12);
  dealDamage(dmg, isCrit, x, y);
}

// Vuurt één schot af met het huidige wapen ('manual' via FIRE knop, 'auto' via Auto Fire)
function fireShot() {
  if (!monsterAlive) return false;

  const isCrit = Math.random() < critChance();
  if (isCrit) state.stats.crits++;
  const dmg = shotDamage() * (isCrit ? CRIT_MULT : 1);

  const w = getWeapon();
  if (w.proj === 'pellets') AudioSys.pellets();
  else if (w.proj === 'laser') AudioSys.laserSfx();
  else AudioSys.shoot();

  FX.muzzleFlash();
  FX.weaponRecoil();
  // Het projectiel vliegt naar het monster; de schade valt bij impact
  FX.projectile(w, () => dealDamage(dmg, isCrit));
  return true;
}

/* ─────────────── WAPEN SHOP ─────────────── */

// Kosten om een wapen één level te upgraden
function weaponUpgradeCost(weapon, level) {
  const base = weapon.price > 0 ? weapon.price * 0.15 : 40;
  return Math.round(base * Math.pow(1.6, level));
}

function canBuyWeapon(weapon) {
  return !state.unlockedWeapons.includes(weapon.id)
      && state.maxStage >= weapon.unlockStage
      && state.coins >= weapon.price;
}

function buyWeapon(id) {
  const w = getWeapon(id);
  if (!w || !canBuyWeapon(w)) { AudioSys.error(); return; }

  state.coins -= w.price;
  state.unlockedWeapons.push(id);
  state.weaponLevels[id] = state.weaponLevels[id] || 0;
  state.currentWeapon = id; // nieuw wapen meteen uitrusten

  AudioSys.buy();
  vibrate(25);
  UI.toast(`🔫 ${w.name} unlocked & equipped!`);
  checkAchievements();
  UI.renderHUD();
  UI.renderWeapon();
  UI.renderWeaponList();
  save();
}

function equipWeapon(id) {
  if (!state.unlockedWeapons.includes(id)) return;
  state.currentWeapon = id;
  AudioSys.buy();
  UI.renderHUD();
  UI.renderWeapon();
  UI.renderWeaponList();
  save();
}

function upgradeWeapon(id) {
  const w = getWeapon(id);
  if (!w || !state.unlockedWeapons.includes(id)) return;
  const lvl = getWeaponLevel(id);
  const cost = weaponUpgradeCost(w, lvl);
  if (state.coins < cost) { AudioSys.error(); return; }

  state.coins -= cost;
  state.weaponLevels[id] = lvl + 1;
  AudioSys.buy();
  UI.renderHUD();
  UI.renderWeaponList();
  save();
}

/* ─────────────── UPGRADE SHOP ─────────────── */

// Prijs van een upgrade op een bepaald level
function upgradeCost(upgrade, level) {
  return Math.round(upgrade.baseCost * Math.pow(upgrade.costMult, level));
}

// Welke valuta heeft de speler voor deze upgrade?
function currencyOf(upgrade) {
  return upgrade.currency === 'gems' ? state.prestigePoints : state.coins;
}

// Hoeveel levels kan de speler kopen (voor Buy Max)?
function maxAffordable(upgrade) {
  let level = state.upgrades[upgrade.id];
  let budget = currencyOf(upgrade);
  let count = 0;
  while (count < 500) {
    if (upgrade.maxLevel && level >= upgrade.maxLevel) break;
    const cost = upgradeCost(upgrade, level);
    if (budget < cost) break;
    budget -= cost;
    level++;
    count++;
  }
  return count;
}

// Totale prijs voor 'amount' levels vanaf het huidige level
function totalUpgradeCost(upgrade, amount) {
  let level = state.upgrades[upgrade.id];
  let total = 0;
  for (let i = 0; i < amount; i++) {
    if (upgrade.maxLevel && level >= upgrade.maxLevel) break;
    total += upgradeCost(upgrade, level);
    level++;
  }
  return total;
}

// Koopt 1, 10 of max levels van een upgrade
function buyUpgrade(id, amount) {
  const up = UPGRADES.find(u => u.id === id);
  if (!up) return;

  let count = amount === 'max' ? maxAffordable(up) : amount;
  // Niet over maxLevel heen kopen
  if (up.maxLevel) count = Math.min(count, up.maxLevel - state.upgrades[id]);
  if (count <= 0) { AudioSys.error(); return; }

  const cost = totalUpgradeCost(up, count);
  if (currencyOf(up) < cost) { AudioSys.error(); return; }

  if (up.currency === 'gems') state.prestigePoints -= cost;
  else state.coins -= cost;
  state.upgrades[id] += count;

  AudioSys.buy();
  vibrate(20);
  UI.renderHUD();
  UI.renderUpgradeList();
  save();
}

/* ─────────────── PRESTIGE SYSTEEM ─────────────── */

// Hoeveel 💎 levert prestigen nu op?
function prestigeGain() {
  if (state.maxStage < PRESTIGE_MIN_STAGE) return 0;
  return Math.max(1, Math.floor(Math.pow(state.maxStage - 15, 1.25) / 2));
}

// Reset de run maar geef permanente prestige points
function doPrestige() {
  const gain = prestigeGain();
  if (gain <= 0) return;

  state.prestigePoints += gain;
  state.totalPrestigeEarned += gain;
  state.prestigeCount++;

  // Reset de gewone voortgang
  state.coins = 0;
  state.stage = 1;
  state.maxStage = 1;
  state.killsThisStage = 0;
  state.currentWeapon = 'pistol';
  state.unlockedWeapons = ['pistol'];
  state.weaponLevels = { pistol: 0 };
  const keptPrestigeBoost = state.upgrades.prestigeBoost; // gem-upgrade blijft!
  state.upgrades = freshState().upgrades;
  state.upgrades.prestigeBoost = keptPrestigeBoost;

  AudioSys.prestige();
  vibrate(100);
  UI.toast(`🌟 Prestige! +${gain} 💎`);
  checkAchievements();

  spawnMonster();
  UI.renderAll();
  save();
}

/* ─────────────── DAILY REWARD / LOGIN STREAK ─────────────── */

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function dailyAvailable() {
  return state.daily.lastClaim !== todayStr();
}

// Hoeveel coins levert de daily reward van vandaag op?
function dailyRewardAmount() {
  const nextStreak = isStreakContinuing() ? state.daily.streak + 1 : 1;
  return Math.round(100 * state.maxStage * Math.min(nextStreak, 7) * coinMultiplier());
}

function isStreakContinuing() {
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  return state.daily.lastClaim === yesterday;
}

function claimDaily() {
  if (!dailyAvailable()) return;

  state.daily.streak = isStreakContinuing() ? state.daily.streak + 1 : 1;
  state.daily.lastClaim = todayStr();

  const coins = dailyRewardAmount();
  state.coins += coins;
  state.stats.totalCoinsEarned += coins;

  let msg = `🎁 Daily reward: +${fmt(coins)} 🪙 (day ${state.daily.streak})`;
  // Elke 7e dag op rij: bonus gem!
  if (state.daily.streak % 7 === 0) {
    state.prestigePoints += 1;
    state.totalPrestigeEarned += 1;
    msg += ' +1 💎';
  }

  AudioSys.coin();
  UI.toast(msg);
  UI.renderHUD();
  UI.renderRewards();
  save();
}

/* ─────────────── OFFLINE EARNINGS ─────────────── */

// Berekent hoeveel coins de speler verdiende terwijl hij weg was
function offlineEarningsCalc() {
  const lvl = state.upgrades.offline;
  const away = (Date.now() - state.lastSeen) / 1000;
  if (lvl <= 0 || away < 120) return 0; // pas na 2 minuten weg

  const cappedSeconds = Math.min(away, 8 * 3600); // max 8 uur
  // Theoretische kills per seconde op de huidige stage
  const theoDPS = shotDamage() * fireRate();
  const hp = monsterMaxHpFor(state.stage, false);
  const reward = baseCoinReward(state.stage, false) * coinMultiplier();
  const coinsPerSecond = (theoDPS / hp) * reward;

  return Math.round(coinsPerSecond * cappedSeconds * 0.05 * lvl);
}

/* ─────────────── ACHIEVEMENTS ─────────────── */

// Controleert alle achievements en keert beloningen uit
function checkAchievements() {
  ACHIEVEMENTS.forEach(a => {
    if (state.achievements.includes(a.id)) return;
    if (!a.check(state)) return;

    state.achievements.push(a.id);
    let rewardTxt = '';
    if (a.reward.coins) {
      state.coins += a.reward.coins;
      state.stats.totalCoinsEarned += a.reward.coins;
      rewardTxt = `+${fmt(a.reward.coins)} 🪙`;
    }
    if (a.reward.gems) {
      state.prestigePoints += a.reward.gems;
      state.totalPrestigeEarned += a.reward.gems;
      rewardTxt = `+${a.reward.gems} 💎`;
    }
    AudioSys.achieve();
    UI.toast(`🏅 ${a.name} — ${rewardTxt}`);
  });
}

/* ─────────────── SAVE / LOAD SYSTEEM ─────────────── */

// Slaat de game op in localStorage
function save() {
  try {
    state.lastSeen = Date.now();
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (e) {
    // localStorage kan vol of geblokkeerd zijn; game blijft gewoon werken
  }
}

// Laadt de save en vult ontbrekende velden aan met defaults
function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    const fresh = freshState();
    // Ondiepe merge + geneste objecten apart mergen (save-compatibiliteit)
    state = Object.assign(fresh, saved);
    state.upgrades = Object.assign(fresh.upgrades, saved.upgrades || {});
    state.stats = Object.assign(fresh.stats, saved.stats || {});
    state.settings = Object.assign(fresh.settings, saved.settings || {});
    state.daily = Object.assign(fresh.daily, saved.daily || {});
    if (!Array.isArray(state.unlockedWeapons) || !state.unlockedWeapons.length) {
      state.unlockedWeapons = ['pistol'];
    }
    if (!WEAPONS.some(w => w.id === state.currentWeapon)) state.currentWeapon = 'pistol';
  } catch (e) {
    state = freshState();
  }
}

// Volledige reset (via Settings)
function resetAll() {
  try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* negeren */ }
  state = freshState();
  spawnMonster();
  UI.renderAll();
  save();
}
