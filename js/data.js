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
   unlock requirement (stage), kleur, projectiel-type en een SVG sprite.
   De SVG's gebruiken gradients voor een 3D-look (licht van boven,
   schaduw onder, glans-strepen op de lopen). */
const WEAPONS = [
  {
    id: 'pistol', name: 'Pistol', damage: 5, fireRate: 2.0,
    price: 0, unlockStage: 1, color: '#b0bec5', proj: 'bullet',
    svg: `<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wg-pistol-a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfd8dc"/><stop offset=".5" stop-color="#78909c"/><stop offset="1" stop-color="#37474f"/></linearGradient>
        <linearGradient id="wg-pistol-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#607d8b"/><stop offset="1" stop-color="#1c262b"/></linearGradient>
      </defs>
      <rect x="90" y="23" width="26" height="9" rx="4" fill="url(#wg-pistol-a)" stroke="#22303a" stroke-width="1.2"/>
      <rect x="18" y="20" width="78" height="15" rx="5" fill="url(#wg-pistol-a)" stroke="#22303a" stroke-width="1.2"/>
      <rect x="22" y="22.5" width="66" height="3" rx="1.5" fill="#fff" opacity=".4"/>
      <polygon points="30,34 52,34 46,58 24,58" fill="url(#wg-pistol-b)" stroke="#141c21" stroke-width="1.2"/>
      <rect x="55" y="34" width="16" height="5" rx="2.5" fill="#263238"/>
      <circle cx="24" cy="27" r="3" fill="#eceff1"/>
    </svg>`
  },
  {
    id: 'shotgun', name: 'Shotgun', damage: 18, fireRate: 1.2,
    price: 400, unlockStage: 3, color: '#ff9800', proj: 'pellets',
    svg: `<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wg-shotgun-w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bcaaa4"/><stop offset=".5" stop-color="#8d6e63"/><stop offset="1" stop-color="#4e342e"/></linearGradient>
        <linearGradient id="wg-shotgun-m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b0bec5"/><stop offset=".55" stop-color="#607d8b"/><stop offset="1" stop-color="#263238"/></linearGradient>
      </defs>
      <polygon points="2,26 30,20 30,40 2,38" fill="url(#wg-shotgun-w)" stroke="#3e2723" stroke-width="1.2"/>
      <rect x="28" y="20" width="88" height="7" rx="3" fill="url(#wg-shotgun-m)" stroke="#22303a" stroke-width="1"/>
      <rect x="28" y="29" width="88" height="7" rx="3" fill="url(#wg-shotgun-m)" stroke="#22303a" stroke-width="1"/>
      <rect x="31" y="21.2" width="82" height="2" rx="1" fill="#fff" opacity=".4"/>
      <rect x="48" y="37" width="26" height="9" rx="4" fill="url(#wg-shotgun-w)" stroke="#3e2723" stroke-width="1.2"/>
      <rect x="30" y="37" width="10" height="15" rx="3" fill="url(#wg-shotgun-w)" stroke="#3e2723" stroke-width="1.2"/>
      <circle cx="114" cy="23.5" r="2" fill="#111"/>
      <circle cx="114" cy="32.5" r="2" fill="#111"/>
    </svg>`
  },
  {
    id: 'rifle', name: 'Rifle', damage: 40, fireRate: 2.5,
    price: 2500, unlockStage: 6, color: '#8bc34a', proj: 'bullet',
    svg: `<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wg-rifle-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#aed581"/><stop offset=".5" stop-color="#558b2f"/><stop offset="1" stop-color="#1b3d10"/></linearGradient>
        <linearGradient id="wg-rifle-d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#546e7a"/><stop offset="1" stop-color="#11181c"/></linearGradient>
        <radialGradient id="wg-rifle-l" cx=".35" cy=".35" r=".8"><stop offset="0" stop-color="#e0f7fa"/><stop offset="1" stop-color="#0097a7"/></radialGradient>
      </defs>
      <polygon points="2,24 26,20 26,38 2,40" fill="url(#wg-rifle-g)" stroke="#1b3d10" stroke-width="1.2"/>
      <rect x="24" y="22" width="92" height="9" rx="3" fill="url(#wg-rifle-g)" stroke="#1b3d10" stroke-width="1"/>
      <rect x="27" y="23.2" width="86" height="2.2" rx="1" fill="#fff" opacity=".35"/>
      <rect x="98" y="24" width="20" height="5" rx="2" fill="url(#wg-rifle-d)"/>
      <rect x="38" y="12" width="28" height="7" rx="3" fill="url(#wg-rifle-d)" stroke="#0a0f12" stroke-width="1"/>
      <circle cx="40" cy="15" r="4" fill="url(#wg-rifle-l)"/>
      <polygon points="50,31 63,31 58,50 45,50" fill="url(#wg-rifle-g)" stroke="#1b3d10" stroke-width="1.2"/>
      <rect x="30" y="31" width="10" height="13" rx="3" fill="url(#wg-rifle-d)"/>
    </svg>`
  },
  {
    id: 'laser', name: 'Laser Gun', damage: 90, fireRate: 3.0,
    price: 12000, unlockStage: 10, color: '#00e5ff', proj: 'laser',
    svg: `<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wg-laser-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4dd0e1"/><stop offset=".5" stop-color="#00838f"/><stop offset="1" stop-color="#00262b"/></linearGradient>
        <radialGradient id="wg-laser-c" cx=".35" cy=".35" r=".9"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#84ffff"/><stop offset="1" stop-color="#00acc1"/></radialGradient>
      </defs>
      <rect x="14" y="18" width="62" height="20" rx="10" fill="url(#wg-laser-b)" stroke="#00363a" stroke-width="1.2"/>
      <rect x="20" y="20.5" width="50" height="3" rx="1.5" fill="#fff" opacity=".4"/>
      <circle cx="40" cy="28" r="8" fill="url(#wg-laser-c)"/>
      <rect x="72" y="23" width="36" height="9" rx="4" fill="url(#wg-laser-b)" stroke="#00363a" stroke-width="1"/>
      <circle cx="111" cy="27" r="6" fill="url(#wg-laser-c)"/>
      <polygon points="26,38 44,38 38,57 20,57" fill="#00363a" stroke="#001518" stroke-width="1.2"/>
      <rect x="20" y="11" width="30" height="4" rx="2" fill="#00bcd4" opacity=".85"/>
    </svg>`
  },
  {
    id: 'rocket', name: 'Rocket Launcher', damage: 400, fireRate: 0.8,
    price: 45000, unlockStage: 14, color: '#ff5252', proj: 'rocket',
    svg: `<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wg-rocket-t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#90a4ae"/><stop offset=".5" stop-color="#546e7a"/><stop offset="1" stop-color="#1c262b"/></linearGradient>
        <linearGradient id="wg-rocket-n" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffcc80"/><stop offset="1" stop-color="#e64a19"/></linearGradient>
      </defs>
      <rect x="6" y="20" width="96" height="18" rx="9" fill="url(#wg-rocket-t)" stroke="#141c21" stroke-width="1.2"/>
      <rect x="10" y="22.5" width="88" height="3" rx="1.5" fill="#fff" opacity=".35"/>
      <rect x="58" y="20" width="10" height="18" fill="#ff5252" stroke="#8e1c1c" stroke-width="1"/>
      <circle cx="102" cy="29" r="11" fill="#141c21" stroke="#455a64" stroke-width="2"/>
      <polygon points="102,22 118,29 102,36" fill="url(#wg-rocket-n)" stroke="#8e2c0c" stroke-width="1"/>
      <polygon points="34,38 52,38 46,58 28,58" fill="#263238" stroke="#0d1417" stroke-width="1.2"/>
      <rect x="16" y="12" width="26" height="6" rx="3" fill="#37474f"/>
    </svg>`
  },
  {
    id: 'minigun', name: 'Minigun', damage: 120, fireRate: 6.0,
    price: 150000, unlockStage: 18, color: '#ffd740', proj: 'bullet',
    svg: `<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wg-mini-m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfd8dc"/><stop offset=".55" stop-color="#78909c"/><stop offset="1" stop-color="#37474f"/></linearGradient>
        <linearGradient id="wg-mini-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#546e7a"/><stop offset="1" stop-color="#141c21"/></linearGradient>
        <linearGradient id="wg-mini-y" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe082"/><stop offset="1" stop-color="#f9a825"/></linearGradient>
      </defs>
      <rect x="10" y="16" width="46" height="28" rx="8" fill="url(#wg-mini-b)" stroke="#0a0f12" stroke-width="1.2"/>
      <rect x="14" y="18.5" width="38" height="3" rx="1.5" fill="#fff" opacity=".25"/>
      <rect x="52" y="16" width="58" height="6" rx="3" fill="url(#wg-mini-m)" stroke="#22303a" stroke-width="1"/>
      <rect x="52" y="27" width="64" height="6" rx="3" fill="url(#wg-mini-m)" stroke="#22303a" stroke-width="1"/>
      <rect x="52" y="38" width="58" height="6" rx="3" fill="url(#wg-mini-m)" stroke="#22303a" stroke-width="1"/>
      <circle cx="56" cy="30" r="9" fill="url(#wg-mini-b)" stroke="#455a64" stroke-width="1.5"/>
      <rect x="16" y="44" width="20" height="12" rx="4" fill="url(#wg-mini-y)" stroke="#9c6500" stroke-width="1.2"/>
      <rect x="18" y="8" width="16" height="8" rx="3" fill="#455a64"/>
    </svg>`
  },
  {
    id: 'plasma', name: 'Plasma Cannon', damage: 1500, fireRate: 2.0,
    price: 600000, unlockStage: 24, color: '#d500f9', proj: 'plasma',
    svg: `<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wg-plasma-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ab47bc"/><stop offset=".5" stop-color="#6a1b9a"/><stop offset="1" stop-color="#25064a"/></linearGradient>
        <radialGradient id="wg-plasma-o" cx=".35" cy=".35" r=".9"><stop offset="0" stop-color="#fce4ec"/><stop offset=".5" stop-color="#e040fb"/><stop offset="1" stop-color="#7b1fa2"/></radialGradient>
        <linearGradient id="wg-plasma-p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ce93d8"/><stop offset="1" stop-color="#4a148c"/></linearGradient>
      </defs>
      <rect x="8" y="16" width="58" height="26" rx="13" fill="url(#wg-plasma-b)" stroke="#1a0333" stroke-width="1.2"/>
      <rect x="14" y="18.5" width="46" height="3" rx="1.5" fill="#fff" opacity=".3"/>
      <circle cx="36" cy="29" r="10" fill="url(#wg-plasma-o)"/>
      <circle cx="33" cy="26" r="2.5" fill="#fff" opacity=".8"/>
      <rect x="62" y="21" width="34" height="16" rx="8" fill="url(#wg-plasma-b)" stroke="#1a0333" stroke-width="1"/>
      <polygon points="94,18 112,24 94,30" fill="url(#wg-plasma-p)" stroke="#38006b" stroke-width="1"/>
      <polygon points="94,40 112,34 94,28" fill="url(#wg-plasma-p)" stroke="#38006b" stroke-width="1"/>
      <circle cx="108" cy="29" r="5" fill="url(#wg-plasma-o)"/>
      <polygon points="24,42 42,42 36,58 18,58" fill="#38006b" stroke="#1a0333" stroke-width="1.2"/>
    </svg>`
  },
  {
    id: 'sword', name: 'Epic Sword Blaster', damage: 5000, fireRate: 2.5,
    price: 2500000, unlockStage: 30, color: '#ff4081', proj: 'slash',
    svg: `<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wg-sword-bl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffc1e3"/><stop offset=".5" stop-color="#ff4081"/><stop offset="1" stop-color="#880e4f"/></linearGradient>
        <linearGradient id="wg-sword-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c2185b"/><stop offset="1" stop-color="#4a0027"/></linearGradient>
        <radialGradient id="wg-sword-e" cx=".35" cy=".35" r=".9"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#ff80ab"/></radialGradient>
      </defs>
      <polygon points="40,24 112,18 118,29 112,40 40,34" fill="url(#wg-sword-bl)" stroke="#6a0038" stroke-width="1.2"/>
      <polygon points="44,26 108,21.5 111,25 44,29" fill="#fff" opacity=".45"/>
      <rect x="34" y="14" width="8" height="30" rx="3" fill="url(#wg-sword-b)" stroke="#38001d" stroke-width="1.2"/>
      <rect x="8" y="22" width="30" height="14" rx="7" fill="url(#wg-sword-b)" stroke="#38001d" stroke-width="1.2"/>
      <circle cx="22" cy="29" r="5" fill="url(#wg-sword-e)"/>
      <polygon points="14,36 30,36 26,56 10,56" fill="#560027" stroke="#2d0014" stroke-width="1.2"/>
    </svg>`
  },
  {
    id: 'mythic', name: 'Mythical Weapon', damage: 25000, fireRate: 3.0,
    price: 12000000, unlockStage: 40, color: '#ffd700', proj: 'orb',
    svg: `<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wg-myth-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff8e1"/><stop offset=".5" stop-color="#ffb300"/><stop offset="1" stop-color="#b26a00"/></linearGradient>
        <linearGradient id="wg-myth-w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffde7"/><stop offset="1" stop-color="#ffb300"/></linearGradient>
        <radialGradient id="wg-myth-gem" cx=".35" cy=".35" r=".9"><stop offset="0" stop-color="#e0f7fa"/><stop offset=".5" stop-color="#00e5ff"/><stop offset="1" stop-color="#006064"/></radialGradient>
      </defs>
      <rect x="12" y="21" width="86" height="15" rx="7" fill="url(#wg-myth-g)" stroke="#8a5300" stroke-width="1.2"/>
      <rect x="16" y="23" width="78" height="3" rx="1.5" fill="#fff" opacity=".5"/>
      <polygon points="30,21 44,4 52,21" fill="url(#wg-myth-w)" stroke="#c88a00" stroke-width="1"/>
      <polygon points="30,36 44,52 52,36" fill="url(#wg-myth-w)" stroke="#c88a00" stroke-width="1"/>
      <circle cx="62" cy="28" r="7" fill="url(#wg-myth-gem)"/>
      <circle cx="59.5" cy="25.5" r="2" fill="#fff" opacity=".85"/>
      <polygon points="96,18 118,28 96,38" fill="url(#wg-myth-g)" stroke="#8a5300" stroke-width="1.2"/>
      <circle cx="106" cy="28" r="3" fill="#fffde7"/>
      <polygon points="14,36 30,36 26,56 10,56" fill="#795548" stroke="#3e2723" stroke-width="1.2"/>
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
