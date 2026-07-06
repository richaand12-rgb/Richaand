/* ═══════════════════════════════════════════════════════════
   WEAPON CLICKER — Game data
   Alle wapens, monsters, bosses, werelden, upgrades en
   achievements staan hier op één plek.
   ═══════════════════════════════════════════════════════════ */

'use strict';

// Aantal monsters per stage (het 10e monster is altijd een boss)
const MONSTERS_PER_STAGE = 10;

// Crit multiplier: een critical hit doet 2.5x schade
const CRIT_MULT = 2.5;

// Vanaf deze stage mag de speler prestigen
const PRESTIGE_MIN_STAGE = 20;

/* ─────────────── WERELDEN ───────────────
   Elke 10 stages kom je in een nieuwe wereld (andere achtergrond). */
const WORLDS = [
  { name: 'Green Plains', emoji: '🌲', bg1: '#0f3d2e', bg2: '#37996b' },
  { name: 'Dark Caves',   emoji: '🕸️', bg1: '#1b1035', bg2: '#4b2c7f' },
  { name: 'Frozen Peaks', emoji: '❄️', bg1: '#0d2b4e', bg2: '#4f9bd6' },
  { name: 'Lava Lands',   emoji: '🌋', bg1: '#3b0d0d', bg2: '#d64f2a' },
  { name: 'Cyber City',   emoji: '🌆', bg1: '#0d1b3b', bg2: '#20b2aa' },
  { name: 'Cosmic Void',  emoji: '🌌', bg1: '#12082e', bg2: '#7b2ad6' },
];

/* ─────────────── MONSTERS ───────────────
   Gewone monsters. Hogere stages ontgrendelen meer soorten. */
const MONSTERS = [
  { id: 'slime',    name: 'Slime',    emoji: '🦠', color: '#76ff03' },
  { id: 'goblin',   name: 'Goblin',   emoji: '👺', color: '#ff7043' },
  { id: 'skeleton', name: 'Skeleton', emoji: '💀', color: '#e0e0e0' },
  { id: 'bat',      name: 'Bat',      emoji: '🦇', color: '#7e57c2' },
  { id: 'spider',   name: 'Spider',   emoji: '🕷️', color: '#a1887f' },
  { id: 'zombie',   name: 'Zombie',   emoji: '🧟', color: '#66bb6a' },
  { id: 'ghost',    name: 'Ghost',    emoji: '👻', color: '#b3e5fc' },
  { id: 'snake',    name: 'Snake',    emoji: '🐍', color: '#9ccc65' },
  { id: 'robot',    name: 'Robot',    emoji: '🤖', color: '#4fc3f7' },
  { id: 'alien',    name: 'Alien',    emoji: '👾', color: '#ba68c8' },
  { id: 'scorpion', name: 'Scorpion', emoji: '🦂', color: '#ffb74d' },
  { id: 'imp',      name: 'Imp',      emoji: '😈', color: '#ef5350' },
];

/* ─────────────── BOSSES ───────────────
   Elke stage eindigt met een boss (roteert per stage). */
const BOSSES = [
  { id: 'dragon',  name: 'Dragon King',      emoji: '🐉', color: '#ff5252' },
  { id: 'demon',   name: 'Demon Lord',       emoji: '👹', color: '#ff1744' },
  { id: 'kraken',  name: 'Mega Kraken',      emoji: '🐙', color: '#ab47bc' },
  { id: 'rex',     name: 'Rex Titan',        emoji: '🦖', color: '#9ccc65' },
  { id: 'ufo',     name: 'Alien Mothership', emoji: '🛸', color: '#00e5ff' },
  { id: 'wolf',    name: 'Wolf King',        emoji: '🐺', color: '#90a4ae' },
];

/* ─────────────── WAPENS ───────────────
   Elk wapen: naam, damage, fire speed (schoten/sec), prijs,
   unlock requirement (stage), kleur, projectiel-type en een SVG sprite. */
const WEAPONS = [
  {
    id: 'pistol', name: 'Pistol', damage: 5, fireRate: 2.0,
    price: 0, unlockStage: 1, color: '#b0bec5', proj: 'bullet',
    svg: `<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="20" width="78" height="15" rx="5" fill="#78909c"/>
      <rect x="90" y="23" width="26" height="9" rx="4" fill="#546e7a"/>
      <polygon points="30,34 52,34 46,58 24,58" fill="#455a64"/>
      <rect x="55" y="34" width="16" height="5" rx="2" fill="#37474f"/>
      <circle cx="24" cy="27" r="3" fill="#cfd8dc"/>
    </svg>`
  },
  {
    id: 'shotgun', name: 'Shotgun', damage: 18, fireRate: 1.2,
    price: 400, unlockStage: 3, color: '#ff9800', proj: 'pellets',
    svg: `<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
      <polygon points="2,26 30,20 30,40 2,38" fill="#8d6e63"/>
      <rect x="28" y="20" width="88" height="7" rx="3" fill="#616161"/>
      <rect x="28" y="29" width="88" height="7" rx="3" fill="#757575"/>
      <rect x="48" y="37" width="26" height="9" rx="4" fill="#a1887f"/>
      <rect x="30" y="37" width="10" height="15" rx="3" fill="#5d4037"/>
      <circle cx="114" cy="24" r="2" fill="#212121"/>
      <circle cx="114" cy="32" r="2" fill="#212121"/>
    </svg>`
  },
  {
    id: 'rifle', name: 'Rifle', damage: 40, fireRate: 2.5,
    price: 2500, unlockStage: 6, color: '#8bc34a', proj: 'bullet',
    svg: `<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
      <polygon points="2,24 26,20 26,38 2,40" fill="#33691e"/>
      <rect x="24" y="22" width="92" height="9" rx="3" fill="#558b2f"/>
      <rect x="98" y="24" width="20" height="5" rx="2" fill="#424242"/>
      <rect x="38" y="12" width="28" height="7" rx="3" fill="#263238"/>
      <circle cx="40" cy="15" r="4" fill="#80deea"/>
      <polygon points="50,31 63,31 58,50 45,50" fill="#33691e"/>
      <rect x="30" y="31" width="10" height="13" rx="3" fill="#2e7d32"/>
    </svg>`
  },
  {
    id: 'laser', name: 'Laser Gun', damage: 90, fireRate: 3.0,
    price: 12000, unlockStage: 10, color: '#00e5ff', proj: 'laser',
    svg: `<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="18" width="62" height="20" rx="10" fill="#006064"/>
      <circle cx="40" cy="28" r="8" fill="#00e5ff"/>
      <rect x="72" y="23" width="36" height="9" rx="4" fill="#00838f"/>
      <circle cx="111" cy="27" r="6" fill="#84ffff"/>
      <polygon points="26,38 44,38 38,57 20,57" fill="#004d40"/>
      <rect x="20" y="11" width="30" height="4" rx="2" fill="#00bcd4"/>
    </svg>`
  },
  {
    id: 'rocket', name: 'Rocket Launcher', damage: 400, fireRate: 0.8,
    price: 45000, unlockStage: 14, color: '#ff5252', proj: 'rocket',
    svg: `<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="20" width="96" height="18" rx="9" fill="#455a64"/>
      <rect x="58" y="20" width="10" height="18" fill="#ff5252"/>
      <circle cx="102" cy="29" r="11" fill="#263238"/>
      <polygon points="102,22 118,29 102,36" fill="#ff7043"/>
      <polygon points="34,38 52,38 46,58 28,58" fill="#37474f"/>
      <rect x="16" y="12" width="26" height="6" rx="3" fill="#37474f"/>
    </svg>`
  },
  {
    id: 'minigun', name: 'Minigun', damage: 120, fireRate: 6.0,
    price: 150000, unlockStage: 18, color: '#ffd740', proj: 'bullet',
    svg: `<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="16" width="46" height="28" rx="8" fill="#37474f"/>
      <rect x="52" y="16" width="58" height="6" rx="3" fill="#78909c"/>
      <rect x="52" y="27" width="64" height="6" rx="3" fill="#90a4ae"/>
      <rect x="52" y="38" width="58" height="6" rx="3" fill="#78909c"/>
      <circle cx="56" cy="30" r="9" fill="#263238"/>
      <rect x="16" y="44" width="20" height="12" rx="4" fill="#ffd740"/>
      <rect x="18" y="8" width="16" height="8" rx="3" fill="#455a64"/>
    </svg>`
  },
  {
    id: 'plasma', name: 'Plasma Cannon', damage: 1500, fireRate: 2.0,
    price: 600000, unlockStage: 24, color: '#d500f9', proj: 'plasma',
    svg: `<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="16" width="58" height="26" rx="13" fill="#4a148c"/>
      <circle cx="36" cy="29" r="10" fill="#e040fb"/>
      <rect x="62" y="21" width="34" height="16" rx="8" fill="#6a1b9a"/>
      <polygon points="94,18 112,24 94,30" fill="#ab47bc"/>
      <polygon points="94,40 112,34 94,28" fill="#ab47bc"/>
      <circle cx="108" cy="29" r="5" fill="#ea80fc"/>
      <polygon points="24,42 42,42 36,58 18,58" fill="#38006b"/>
    </svg>`
  },
  {
    id: 'sword', name: 'Epic Sword Blaster', damage: 5000, fireRate: 2.5,
    price: 2500000, unlockStage: 30, color: '#ff4081', proj: 'slash',
    svg: `<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
      <polygon points="40,24 112,18 118,29 112,40 40,34" fill="#ff80ab"/>
      <polygon points="44,26 108,22 112,29 108,36 44,32" fill="#ff4081"/>
      <rect x="34" y="14" width="8" height="30" rx="3" fill="#c2185b"/>
      <rect x="8" y="22" width="30" height="14" rx="7" fill="#880e4f"/>
      <circle cx="22" cy="29" r="5" fill="#ff80ab"/>
      <polygon points="14,36 30,36 26,56 10,56" fill="#560027"/>
    </svg>`
  },
  {
    id: 'mythic', name: 'Mythical Weapon', damage: 25000, fireRate: 3.0,
    price: 12000000, unlockStage: 40, color: '#ffd700', proj: 'orb',
    svg: `<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="21" width="86" height="15" rx="7" fill="#ffb300"/>
      <polygon points="30,21 44,4 52,21" fill="#ffe082"/>
      <polygon points="30,36 44,52 52,36" fill="#ffca28"/>
      <circle cx="62" cy="28" r="7" fill="#00e5ff"/>
      <polygon points="96,18 118,28 96,38" fill="#ffd54f"/>
      <circle cx="106" cy="28" r="3" fill="#fffde7"/>
      <polygon points="14,36 30,36 26,56 10,56" fill="#795548"/>
    </svg>`
  },
];

/* ─────────────── UPGRADES ───────────────
   Elke upgrade: naam, effect per level, basisprijs en prijsgroei.
   maxLevel weglaten = oneindig te kopen.
   currency 'gems' = kost prestige points (💎) en blijft na prestige. */
const UPGRADES = [
  { id: 'tapPower',      name: 'Tap Power',        icon: '👆', desc: '+25% tap damage per level',        baseCost: 50,    costMult: 1.55 },
  { id: 'damage',        name: 'Damage Boost',     icon: '💪', desc: '+10% all damage per level',        baseCost: 100,   costMult: 1.60 },
  { id: 'attackSpeed',   name: 'Attack Speed',     icon: '⚡', desc: '+8% fire rate per level',          baseCost: 250,   costMult: 1.70, maxLevel: 30 },
  { id: 'crit',          name: 'Critical Hit',     icon: '🎯', desc: '+2% critical hit chance',          baseCost: 400,   costMult: 1.75, maxLevel: 22 },
  { id: 'autoFire',      name: 'Auto Fire',        icon: '🤖', desc: 'Weapon fires by itself (+25% speed per level)', baseCost: 1000, costMult: 4.0, maxLevel: 4 },
  { id: 'coinMult',      name: 'Coin Multiplier',  icon: '💰', desc: '+15% coins per monster',           baseCost: 300,   costMult: 1.65 },
  { id: 'bossReward',    name: 'Boss Reward',      icon: '👑', desc: '+25% coins from bosses',           baseCost: 800,   costMult: 1.85 },
  { id: 'weaponPower',   name: 'Weapon Power',     icon: '🔧', desc: '+10% weapon damage per level',     baseCost: 600,   costMult: 1.70 },
  { id: 'offline',       name: 'Offline Earnings', icon: '🌙', desc: '+5% of your DPS earns coins while away (max 8h)', baseCost: 2500, costMult: 2.50, maxLevel: 10 },
  { id: 'prestigeBoost', name: 'Prestige Boost',   icon: '🌟', desc: '+10% prestige bonus power (permanent!)', baseCost: 5, costMult: 2.0, maxLevel: 10, currency: 'gems' },
];

/* ─────────────── ACHIEVEMENTS ───────────────
   check(s) krijgt de game state en geeft true als het doel gehaald is. */
const ACHIEVEMENTS = [
  { id: 'firstKill',   name: 'First Blood',       icon: '🩸', desc: 'Defeat your first monster',        check: s => s.stats.totalKills >= 1,          reward: { coins: 50 } },
  { id: 'coins100',    name: 'Pocket Money',      icon: '🪙', desc: 'Earn 100 coins in total',          check: s => s.stats.totalCoinsEarned >= 100,  reward: { coins: 100 } },
  { id: 'firstWeapon', name: 'Locked & Loaded',   icon: '🔫', desc: 'Buy your first weapon',            check: s => s.unlockedWeapons.length >= 2,    reward: { coins: 250 } },
  { id: 'kills10',     name: 'Monster Hunter',    icon: '⚔️', desc: 'Defeat 10 monsters',               check: s => s.stats.totalKills >= 10,         reward: { coins: 200 } },
  { id: 'firstBoss',   name: 'Boss Slayer',       icon: '👑', desc: 'Defeat your first boss',           check: s => s.stats.bossKills >= 1,           reward: { coins: 500 } },
  { id: 'coins1k',     name: 'Getting Rich',      icon: '💵', desc: 'Earn 1,000 coins in total',        check: s => s.stats.totalCoinsEarned >= 1000, reward: { coins: 500 } },
  { id: 'dmg10k',      name: 'Heavy Hitter',      icon: '💥', desc: 'Deal 10,000 total damage',         check: s => s.stats.totalDamage >= 10000,     reward: { coins: 1000 } },
  { id: 'taps1000',    name: 'Tap Master',        icon: '👆', desc: 'Tap 1,000 times',                  check: s => s.stats.taps >= 1000,             reward: { coins: 1000 } },
  { id: 'crits100',    name: 'Critical Thinker',  icon: '🎯', desc: 'Land 100 critical hits',           check: s => s.stats.crits >= 100,             reward: { coins: 1500 } },
  { id: 'kills100',    name: 'Exterminator',      icon: '☠️', desc: 'Defeat 100 monsters',              check: s => s.stats.totalKills >= 100,        reward: { coins: 2500 } },
  { id: 'stage10',     name: 'World Traveler',    icon: '🗺️', desc: 'Reach stage 10',                   check: s => s.maxStage >= 10,                 reward: { coins: 2000 } },
  { id: 'boss10',      name: 'Boss Nightmare',    icon: '😈', desc: 'Defeat 10 bosses',                 check: s => s.stats.bossKills >= 10,          reward: { coins: 5000 } },
  { id: 'coins1m',     name: 'Millionaire',       icon: '🤑', desc: 'Earn 1 million coins in total',    check: s => s.stats.totalCoinsEarned >= 1e6,  reward: { coins: 50000 } },
  { id: 'allWeapons',  name: 'Full Arsenal',      icon: '🎖️', desc: 'Own every weapon',                 check: s => s.unlockedWeapons.length >= WEAPONS.length, reward: { gems: 5 } },
  { id: 'prestige1',   name: 'Reborn',            icon: '🌟', desc: 'Prestige for the first time',      check: s => s.prestigeCount >= 1,             reward: { gems: 3 } },
];

/* ─────────────── HULPFUNCTIES ─────────────── */

// Formatteert grote getallen: 1234 → "1.23K", 5600000 → "5.60M"
function fmt(n) {
  n = Math.floor(n);
  if (n < 1000) return n.toString();
  const units = ['K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp'];
  let u = -1;
  let x = n;
  while (x >= 1000 && u < units.length - 1) { x /= 1000; u++; }
  return (x >= 100 ? x.toFixed(0) : x >= 10 ? x.toFixed(1) : x.toFixed(2)) + units[u];
}
