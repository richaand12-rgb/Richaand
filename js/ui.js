/* ═══════════════════════════════════════════════════════════
   WEAPON CLICKER — UI
   Rendert de HUD, het monster, het wapen, alle panels
   (shop, upgrades, rewards, settings), modals en toasts.
   ═══════════════════════════════════════════════════════════ */

'use strict';

const UI = {

  activePanel: 'battle',   // welk panel is open ('battle' = geen panel)
  weaponTab: 'shop',       // 'shop' of 'loadout' in het Arsenal panel

  // Alle panel-namen (weapons/upgrades/rewards via de nav, de rest via knoppen)
  PANELS: ['weapons', 'upgrades', 'rewards', 'achievements', 'settings'],

  el(id) { return document.getElementById(id); },

  /* ─────────────── ALLES RENDEREN ─────────────── */

  renderAll() {
    this.renderHUD();
    this.renderWorld();
    this.renderWeapon();
    this.renderMonster();
    this.renderWeaponList();
    this.renderUpgradeList();
    this.renderRewards();
    this.renderAchievements();
    this.renderSettings();
  },

  /* ─────────────── HUD ─────────────── */

  renderHUD() {
    this.el('coinsLabel').textContent = fmt(state.coins);
    this.el('gemsLabel').textContent = fmt(state.prestigePoints);
    this.el('tapDmgLabel').textContent = fmt(tapDamage());
    this.el('dpsLabel').textContent = fmt(autoDPS());
    this.el('critLabel').textContent = Math.round(critChance() * 100) + '%';
    this.el('stageLabel').textContent = 'Stage ' + state.stage;
    // Coin-tellers in de panel headers ook bijwerken
    document.querySelectorAll('.pcoins').forEach(n => { n.textContent = fmt(state.coins); });
    this.renderKillDots();
    this.renderWorld();
    // Rood stipje op de Rewards tab als de daily nog te claimen is
    document.querySelector('[data-panel="rewards"]')
      .classList.toggle('notify', dailyAvailable() || prestigeGain() > 0);
  },

  renderWorld() {
    const world = WORLDS[Math.floor((state.stage - 1) / 10) % WORLDS.length];
    this.el('worldLabel').textContent = world.emoji + ' ' + world.name;
    const area = this.el('battleArea');
    area.style.setProperty('--bg1', world.bg1);
    area.style.setProperty('--bg2', world.bg2);
  },

  // 10 stippen die de voortgang binnen de stage tonen; de laatste is de boss
  renderKillDots() {
    const box = this.el('killDots');
    box.innerHTML = '';
    for (let i = 0; i < MONSTERS_PER_STAGE; i++) {
      const dot = document.createElement('span');
      if (i === MONSTERS_PER_STAGE - 1) {
        dot.className = 'kill-dot boss-dot';
        dot.textContent = '👑';
        dot.style.opacity = state.killsThisStage >= MONSTERS_PER_STAGE - 1 ? '1' : '.35';
      } else {
        dot.className = 'kill-dot' + (i < state.killsThisStage ? ' done' : '');
      }
      box.appendChild(dot);
    }
  },

  /* ─────────────── MONSTER ─────────────── */

  renderMonster() {
    if (!currentMonster) return;
    const sprite = this.el('monsterSprite');
    sprite.textContent = currentMonster.emoji;
    sprite.className = currentMonster.isBoss ? 'boss' : '';
    sprite.classList.add('spawn');
    sprite.style.setProperty('--monster-glow', currentMonster.color);
    this.el('monsterSprite').style.filter = `drop-shadow(0 0 18px ${currentMonster.color})`;

    this.el('monsterName').textContent = `${currentMonster.name} · Lv ${state.stage}`;
    this.el('bossTag').classList.toggle('hidden', !currentMonster.isBoss);
    this.updateHP();
    this.renderKillDots();
  },

  updateHP() {
    const pct = Math.max(0, currentMonsterHP / maxMonsterHP);
    const fill = this.el('hpFill');
    fill.style.width = (pct * 100) + '%';
    fill.className = currentMonster && currentMonster.isBoss
      ? 'boss'
      : pct < 0.25 ? 'low' : pct < 0.55 ? 'mid' : '';
    this.el('hpText').textContent = fmt(Math.max(0, currentMonsterHP)) + ' / ' + fmt(maxMonsterHP);
  },

  /* ─────────────── WAPEN ─────────────── */

  renderWeapon() {
    const w = getWeapon();
    const sprite = this.el('weaponSprite');
    sprite.innerHTML = w.svg;
    sprite.querySelector('svg').style.filter = `drop-shadow(0 0 12px ${w.color})`;
    // Preview op het introscherm gebruikt hetzelfde wapen
    const intro = this.el('introWeapon');
    if (intro && !intro.innerHTML) intro.innerHTML = w.svg;
  },

  /* ─────────────── PANELS ─────────────── */

  showPanel(name) {
    // Nogmaals op dezelfde knop tikken sluit het panel weer
    if (name === this.activePanel) name = 'battle';
    this.activePanel = name;
    this.PANELS.forEach(p => {
      this.el('panel-' + p).classList.toggle('hidden', p !== name);
    });
    document.querySelectorAll('.nav-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.panel === name);
    });
    // Panel-inhoud verversen bij openen
    if (name === 'weapons') this.renderWeaponList();
    if (name === 'upgrades') this.renderUpgradeList();
    if (name === 'rewards') this.renderRewards();
    if (name === 'achievements') this.renderAchievements();
    if (name === 'settings') this.renderSettings();
  },

  /* ─────────────── WEAPON SHOP / LOADOUT ─────────────── */

  renderWeaponList() {
    const box = this.el('weaponList');
    box.innerHTML = '';

    const list = this.weaponTab === 'loadout'
      ? WEAPONS.filter(w => state.unlockedWeapons.includes(w.id))
      : WEAPONS;

    if (!list.length) {
      box.innerHTML = '<p class="settings-note">No weapons yet — buy one in the shop!</p>';
      return;
    }

    list.forEach(w => {
      const owned = state.unlockedWeapons.includes(w.id);
      const equipped = state.currentWeapon === w.id;
      const stageLocked = state.maxStage < w.unlockStage;
      const lvl = getWeaponLevel(w.id);
      const dmg = weaponBaseDamage(w, lvl) * globalDamageMult();

      const card = document.createElement('div');
      card.className = 'card' + (equipped ? ' equipped' : '') + (stageLocked && !owned ? ' locked' : '');

      let actions = '';
      if (owned) {
        const upCost = weaponUpgradeCost(w, lvl);
        actions =
          (equipped
            ? `<button class="btn disabled" disabled>✔ Equipped</button>`
            : `<button class="btn" data-action="equip" data-id="${w.id}">Equip</button>`) +
          `<button class="btn gold ${state.coins < upCost ? 'disabled' : ''}" data-action="upgrade" data-id="${w.id}" ${state.coins < upCost ? 'disabled' : ''}>⬆ ${fmt(upCost)} 🪙</button>`;
      } else if (stageLocked) {
        actions = `<button class="btn disabled" disabled>🔒 Stage ${w.unlockStage}</button>`;
      } else {
        const afford = state.coins >= w.price;
        actions = `<button class="btn buy ${afford ? '' : 'disabled'}" data-action="buy" data-id="${w.id}" ${afford ? '' : 'disabled'}>Buy ${fmt(w.price)} 🪙</button>`;
      }

      card.innerHTML = `
        <div class="card-icon">${w.svg}</div>
        <div class="card-info">
          <div class="card-name">${w.name}${owned ? ` <span class="lvl">Lv ${lvl}</span>` : ''}</div>
          <div class="card-stats">⚔️ ${fmt(dmg)} dmg · ⚡ ${w.fireRate.toFixed(1)}/s</div>
          <div class="card-desc">${owned ? 'Owned' : stageLocked ? `Unlocks at stage ${w.unlockStage}` : 'Available now!'}</div>
        </div>
        <div class="card-actions">${actions}</div>`;
      box.appendChild(card);
    });
  },

  /* ─────────────── UPGRADE SHOP ─────────────── */

  renderUpgradeList() {
    const box = this.el('upgradeList');
    box.innerHTML = '';

    UPGRADES.forEach(up => {
      const lvl = state.upgrades[up.id];
      const maxed = up.maxLevel && lvl >= up.maxLevel;
      const cur = up.currency === 'gems' ? '💎' : '🪙';

      // Eén koopknop (Buy 1 / Buy 10 / Buy Max) voor deze upgrade-kaart
      const buyBtn = (amt) => {
        let count = amt === 'max' ? maxAffordable(up) : amt;
        if (up.maxLevel) count = Math.min(count, up.maxLevel - lvl);
        const cost = totalUpgradeCost(up, Math.max(1, count));
        const canAfford = count > 0 && currencyOf(up) >= cost;
        // Toon het échte aantal dat gekocht wordt (bij max level kan dat minder zijn)
        const label = amt === 'max' ? (count > 0 ? `MAX +${count}` : 'MAX') : `+${Math.max(1, count)}`;
        return `<button class="btn buy buy-opt ${canAfford ? '' : 'disabled'}"
                  data-action="buyUpgrade" data-id="${up.id}" data-amt="${amt}" ${canAfford ? '' : 'disabled'}>
                  <span class="buy-count">${label}</span>
                  <span class="buy-cost">${fmt(cost)} ${cur}</span>
                </button>`;
      };

      const card = document.createElement('div');
      card.className = 'card upgrade-card';
      card.innerHTML = `
        <div class="upgrade-head">
          <div class="card-icon">${up.icon}</div>
          <div class="card-info">
            <div class="card-name">${up.name} <span class="lvl">Lv ${lvl}${up.maxLevel ? '/' + up.maxLevel : ''}</span></div>
            <div class="card-desc">${up.desc}</div>
          </div>
        </div>
        ${maxed
          ? '<div class="maxed-badge">✨ MAX LEVEL</div>'
          : `<div class="buy-row">${buyBtn(1)}${buyBtn(10)}${buyBtn('max')}</div>`}`;
      box.appendChild(card);
    });
  },

  /* ─────────────── REWARDS PANEL ─────────────── */

  renderRewards() {
    // Daily reward kaart
    const daily = this.el('dailyCard');
    if (dailyAvailable()) {
      daily.innerHTML = `
        <h4>🎁 Daily Reward</h4>
        <p>Login streak: <b>${state.daily.streak} day${state.daily.streak === 1 ? '' : 's'}</b> — claim today's reward!</p>
        <button class="btn gold" data-action="claimDaily">Claim +${fmt(dailyRewardAmount())} 🪙</button>`;
    } else {
      daily.innerHTML = `
        <h4>🎁 Daily Reward</h4>
        <p>✅ Claimed! Streak: <b>${state.daily.streak} day${state.daily.streak === 1 ? '' : 's'}</b>. Come back tomorrow!</p>`;
    }

    // Prestige kaart
    const prestige = this.el('prestigeCard');
    const gain = prestigeGain();
    prestige.innerHTML = `
      <h4>🌟 Prestige</h4>
      <p>Reset your run for permanent 💎 bonuses.<br>
         Each 💎: <b>+10% damage, +10% coins, +5% fire rate</b>.<br>
         You have <b>${fmt(state.totalPrestigeEarned)}</b> 💎 earned (${fmt(state.prestigePoints)} to spend).</p>
      ${gain > 0
        ? `<button class="btn" data-action="prestige">Prestige now for +${gain} 💎</button>`
        : `<button class="btn disabled" disabled>Reach stage ${PRESTIGE_MIN_STAGE} (best: ${state.maxStage})</button>`}`;
  },

  /* ─────────────── ACHIEVEMENTS PANEL ─────────────── */

  renderAchievements() {
    // Achievements lijst
    const list = this.el('achievementList');
    list.innerHTML = '';
    ACHIEVEMENTS.forEach(a => {
      const done = state.achievements.includes(a.id);
      const rewardTxt = a.reward.coins ? `+${fmt(a.reward.coins)} 🪙` : `+${a.reward.gems} 💎`;
      const card = document.createElement('div');
      card.className = 'card' + (done ? ' done' : ' locked');
      card.innerHTML = `
        <div class="card-icon">${done ? a.icon : '🔒'}</div>
        <div class="card-info">
          <div class="card-name">${a.name}</div>
          <div class="card-desc">${a.desc} — ${rewardTxt}</div>
        </div>
        <div class="card-actions">${done ? '✅' : ''}</div>`;
      list.appendChild(card);
    });

    // Statistieken
    const s = state.stats;
    this.el('statsBox').innerHTML = `
      <div class="stat-row"><span>⚔️ Monsters defeated</span><b>${fmt(s.totalKills)}</b></div>
      <div class="stat-row"><span>👑 Bosses defeated</span><b>${fmt(s.bossKills)}</b></div>
      <div class="stat-row"><span>💥 Total damage</span><b>${fmt(s.totalDamage)}</b></div>
      <div class="stat-row"><span>🪙 Total coins earned</span><b>${fmt(s.totalCoinsEarned)}</b></div>
      <div class="stat-row"><span>👆 Total taps</span><b>${fmt(s.taps)}</b></div>
      <div class="stat-row"><span>🎯 Critical hits</span><b>${fmt(s.crits)}</b></div>
      <div class="stat-row"><span>🗺️ Best stage</span><b>${state.maxStage}</b></div>
      <div class="stat-row"><span>🌟 Prestiges</span><b>${state.prestigeCount}</b></div>`;
  },

  /* ─────────────── SETTINGS ─────────────── */

  renderSettings() {
    this.el('soundToggle').classList.toggle('on', state.settings.sound);
    this.el('musicToggle').classList.toggle('on', state.settings.music);
    this.el('vibrationToggle').classList.toggle('on', state.settings.vibration);
  },

  /* ─────────────── MODAL & TOASTS ─────────────── */

  // Toont een modal; buttons = [{ label, cls, cb }]
  modal(title, bodyHTML, buttons) {
    this.el('modalTitle').textContent = title;
    this.el('modalBody').innerHTML = bodyHTML;
    const btnBox = this.el('modalButtons');
    btnBox.innerHTML = '';
    buttons.forEach(b => {
      const btn = document.createElement('button');
      btn.className = 'btn ' + (b.cls || '');
      btn.textContent = b.label;
      btn.addEventListener('click', () => {
        this.closeModal();
        if (b.cb) b.cb();
      });
      btnBox.appendChild(btn);
    });
    this.el('modalOverlay').classList.remove('hidden');
  },

  closeModal() {
    this.el('modalOverlay').classList.add('hidden');
  },

  // Korte melding bovenin beeld (achievements, unlocks, stage up)
  toast(msg) {
    const box = this.el('toastBox');
    // Maximaal 3 toasts tegelijk
    while (box.childElementCount >= 3) box.firstChild.remove();
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    box.appendChild(t);
    setTimeout(() => t.remove(), 3100);
  },
};
