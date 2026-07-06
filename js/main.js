/* ═══════════════════════════════════════════════════════════
   WEAPON CLICKER — Initialisatie, events en game loop
   ═══════════════════════════════════════════════════════════ */

'use strict';

let autoFireAcc = 0;      // accumulator voor automatische schoten
let lastFrame = 0;        // timestamp van het vorige frame

/* ─────────────── GAME START ─────────────── */

function init() {
  load();               // save laden (of verse state houden)
  FX.introSparkles();   // sparkles op het introscherm
  UI.renderWeapon();    // wapen preview op intro + battle screen
  bindEvents();
}

// Wordt aangeroepen bij de eerste tap op het introscherm
function startGame() {
  document.getElementById('introScreen').classList.add('hidden');
  document.getElementById('gameScreen').classList.remove('hidden');

  AudioSys.unlock();    // AudioContext mag pas na een user-gesture
  AudioSys.syncMusic();

  spawnMonster();
  UI.renderAll();

  // Offline earnings tonen, daarna eventueel de daily reward
  const offlineCoins = offlineEarningsCalc();
  state.lastSeen = Date.now();
  if (offlineCoins > 0) {
    state.coins += offlineCoins;
    state.stats.totalCoinsEarned += offlineCoins;
    UI.renderHUD();
    UI.modal('🌙 Welcome back!',
      `Your weapon kept firing while you were away:<span class="big-reward">+${fmt(offlineCoins)} 🪙</span>`,
      [{ label: 'Awesome!', cls: 'gold', cb: () => maybeShowDaily() }]);
  } else {
    maybeShowDaily();
  }

  save();
  requestAnimationFrame(gameLoop);
}

// Toont de daily reward popup als die nog te claimen is
function maybeShowDaily() {
  if (!dailyAvailable()) return;
  UI.modal('🎁 Daily Reward!',
    `Login streak: <b>${state.daily.streak}</b> — claim your daily coins:<span class="big-reward">+${fmt(dailyRewardAmount())} 🪙</span>Every 7 days in a row you also get +1 💎!`,
    [
      { label: 'Claim!', cls: 'gold', cb: () => claimDaily() },
      { label: 'Later', cls: '' },
    ]);
}

/* ─────────────── GAME LOOP ─────────────── */

function gameLoop(now) {
  const dt = Math.min(0.1, (now - lastFrame) / 1000 || 0);
  lastFrame = now;

  // Auto Fire: schiet vanzelf als de upgrade gekocht is
  const rate = autoFireRate();
  if (rate > 0 && monsterAlive) {
    autoFireAcc += rate * dt;
    if (autoFireAcc >= 1) {
      autoFireAcc = Math.min(autoFireAcc - 1, 1); // niet oneindig opstapelen
      fireShot();
    }
  }

  requestAnimationFrame(gameLoop);
}

/* ─────────────── EVENTS ─────────────── */

function bindEvents() {

  // Intro: tap waar dan ook om te starten
  document.getElementById('introScreen').addEventListener('pointerdown', () => {
    startGame();
  }, { once: true });

  // Tikken op het slagveld = je wapen vuurt op het monster
  document.getElementById('battleArea').addEventListener('pointerdown', () => {
    AudioSys.unlock();
    tapAttack();
  });

  // Navigatie onderin (nogmaals tikken sluit het panel)
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => UI.showPanel(btn.dataset.panel));
  });

  // Zwevende knoppen rechts: settings en achievements
  document.getElementById('settingsFab').addEventListener('click', () => UI.showPanel('settings'));
  document.getElementById('achievementsFab').addEventListener('click', () => UI.showPanel('achievements'));

  // Sluitknoppen (✕) in de panel headers
  document.querySelectorAll('.panel-close').forEach(btn => {
    btn.addEventListener('click', () => UI.showPanel('battle'));
  });

  // Arsenal tabs: Shop / Loadout
  document.getElementById('tabShop').addEventListener('click', () => {
    UI.weaponTab = 'shop';
    document.getElementById('tabShop').classList.add('active');
    document.getElementById('tabLoadout').classList.remove('active');
    UI.renderWeaponList();
  });
  document.getElementById('tabLoadout').addEventListener('click', () => {
    UI.weaponTab = 'loadout';
    document.getElementById('tabLoadout').classList.add('active');
    document.getElementById('tabShop').classList.remove('active');
    UI.renderWeaponList();
  });

  // Weapon shop: koop / equip / upgrade (event delegation, want de lijst wordt opnieuw gerenderd)
  document.getElementById('weaponList').addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn || btn.disabled) return;
    const { action, id } = btn.dataset;
    if (action === 'buy') buyWeapon(id);
    if (action === 'equip') equipWeapon(id);
    if (action === 'upgrade') upgradeWeapon(id);
  });

  // Upgrade shop: elke kaart heeft eigen Buy 1 / Buy 10 / Buy Max knoppen
  document.getElementById('upgradeList').addEventListener('click', e => {
    const btn = e.target.closest('[data-action="buyUpgrade"]');
    if (!btn || btn.disabled) return;
    const amt = btn.dataset.amt === 'max' ? 'max' : parseInt(btn.dataset.amt, 10);
    buyUpgrade(btn.dataset.id, amt);
  });

  // Rewards panel: daily claim + prestige
  document.getElementById('panel-rewards').addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn || btn.disabled) return;
    if (btn.dataset.action === 'claimDaily') claimDaily();
    if (btn.dataset.action === 'prestige') confirmPrestige();
  });

  // Settings toggles
  document.getElementById('soundToggle').addEventListener('click', () => {
    state.settings.sound = !state.settings.sound;
    UI.renderSettings();
    save();
  });
  document.getElementById('musicToggle').addEventListener('click', () => {
    state.settings.music = !state.settings.music;
    AudioSys.unlock();
    AudioSys.syncMusic();
    UI.renderSettings();
    save();
  });
  document.getElementById('vibrationToggle').addEventListener('click', () => {
    state.settings.vibration = !state.settings.vibration;
    vibrate(30);
    UI.renderSettings();
    save();
  });

  // Reset progress (met bevestiging)
  document.getElementById('resetBtn').addEventListener('click', () => {
    UI.modal('🗑️ Reset Progress?',
      'This deletes <b>everything</b>: coins, weapons, upgrades, achievements and 💎 prestige points.<br>This cannot be undone!',
      [
        { label: 'Cancel', cls: '' },
        { label: 'RESET', cls: 'gold', cb: () => { resetAll(); UI.toast('Progress reset. Good luck!'); } },
      ]);
  });

  // Regelmatig opslaan + affordability van open panels verversen
  setInterval(() => {
    save();
  }, 10000);

  setInterval(() => {
    checkAchievements();
    UI.renderHUD();
    if (UI.activePanel === 'weapons') UI.renderWeaponList();
    if (UI.activePanel === 'upgrades') UI.renderUpgradeList();
    if (UI.activePanel === 'achievements') UI.renderAchievements();
  }, 1500);

  // Opslaan wanneer de app naar de achtergrond gaat of sluit
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) save();
  });
  window.addEventListener('pagehide', save);
}

// Prestige bevestigen via een modal
function confirmPrestige() {
  const gain = prestigeGain();
  if (gain <= 0) return;
  UI.modal('🌟 Prestige?',
    `You will lose your coins, weapons and upgrades, but gain:<span class="big-reward">+${gain} 💎</span>Each 💎 gives <b>+10% damage, +10% coins and +5% fire rate</b> — forever!`,
    [
      { label: 'Not yet', cls: '' },
      { label: 'PRESTIGE!', cls: 'gold', cb: () => doPrestige() },
    ]);
}

// Start zodra de pagina geladen is
window.addEventListener('DOMContentLoaded', init);
