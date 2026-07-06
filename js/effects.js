/* ═══════════════════════════════════════════════════════════
   WEAPON CLICKER — Visuele effecten
   Damage popups, projectielen, muzzle flash, death effects,
   coin bursts, screen shake en intro sparkles.
   ═══════════════════════════════════════════════════════════ */

'use strict';

const FX = {

  // Maximaal aantal effect-nodes tegelijk (voor performance op mobiel)
  MAX_NODES: 60,

  layer() { return document.getElementById('fxLayer'); },

  // Middelpunt van een element, relatief aan de fx-laag
  centerOf(el) {
    const r = el.getBoundingClientRect();
    const l = this.layer().getBoundingClientRect();
    return { x: r.left + r.width / 2 - l.left, y: r.top + r.height / 2 - l.top };
  },

  monsterCenter() { return this.centerOf(document.getElementById('monsterSprite')); },

  // De loop van het wapen (bovenkant van de wapen-sprite, want hij wijst omhoog)
  weaponTip() {
    const r = document.getElementById('weaponSprite').getBoundingClientRect();
    const l = this.layer().getBoundingClientRect();
    return { x: r.left + r.width / 2 - l.left, y: r.top - l.top + 10 };
  },

  spawnNode(cls, x, y) {
    if (this.layer().childElementCount > this.MAX_NODES) return null;
    const el = document.createElement('div');
    el.className = cls;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    this.layer().appendChild(el);
    return el;
  },

  /* ── Damage popup: -10, -50, CRIT! ── */
  damagePopup(amount, isCrit, x, y) {
    let pos;
    if (x !== undefined && y !== undefined) {
      // Positie van de tap omrekenen naar fx-laag coördinaten
      const l = this.layer().getBoundingClientRect();
      pos = { x: x - l.left, y: y - l.top };
    } else {
      const c = this.monsterCenter();
      pos = { x: c.x + (Math.random() * 80 - 40), y: c.y + (Math.random() * 40 - 30) };
    }
    const el = this.spawnNode('popup' + (isCrit ? ' crit' : ''), pos.x, pos.y);
    if (!el) return;
    el.textContent = (isCrit ? 'CRIT! ' : '') + '-' + fmt(Math.round(amount));
    setTimeout(() => el.remove(), 850);
  },

  /* ── Coin popup + coins die naar de teller vliegen ── */
  coinReward(amount) {
    const c = this.monsterCenter();
    const el = this.spawnNode('popup coin', c.x, c.y - 20);
    if (el) {
      el.textContent = '+' + fmt(amount) + ' 🪙';
      setTimeout(() => el.remove(), 850);
    }
    this.coinFly(3);
  },

  // Laat n coin-emoji's naar de coin-teller vliegen
  coinFly(n) {
    const target = document.getElementById('coinsLabel').getBoundingClientRect();
    const from = document.getElementById('monsterSprite').getBoundingClientRect();
    for (let i = 0; i < n; i++) {
      const coin = document.createElement('div');
      coin.className = 'coin-fly';
      coin.textContent = '🪙';
      coin.style.left = (from.left + from.width / 2 + (Math.random() * 60 - 30)) + 'px';
      coin.style.top = (from.top + from.height / 2) + 'px';
      document.body.appendChild(coin);
      // Volgende frame: naar de teller bewegen
      requestAnimationFrame(() => requestAnimationFrame(() => {
        coin.style.left = (target.left + target.width / 2) + 'px';
        coin.style.top = target.top + 'px';
        coin.style.opacity = '0';
        coin.style.transform = 'scale(0.4)';
      }));
      setTimeout(() => coin.remove(), 750);
    }
  },

  /* ── Monster geraakt: flits + schudden ── */
  hitMonster() {
    const sprite = document.getElementById('monsterSprite');
    sprite.classList.remove('hit');
    void sprite.offsetWidth; // reflow forceren zodat de animatie opnieuw start
    sprite.classList.add('hit');
  },

  /* ── Death effect: monster verdwijnt + particle burst ── */
  deathFX(color) {
    const sprite = document.getElementById('monsterSprite');
    sprite.classList.remove('hit', 'spawn');
    sprite.classList.add('dead');

    const c = this.monsterCenter();
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 * i) / 10 + Math.random() * 0.5;
      const dist = 50 + Math.random() * 60;
      const el = this.spawnNode('spark', c.x, c.y);
      if (!el) break;
      el.style.background = color || '#ffd54f';
      el.style.boxShadow = `0 0 8px ${color || '#ffd54f'}`;
      el.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
      el.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
      setTimeout(() => el.remove(), 700);
    }
  },

  /* ── Impact flits op het monster ── */
  impact() {
    const c = this.monsterCenter();
    const el = this.spawnNode('impact-flash', c.x + (Math.random() * 40 - 20), c.y + (Math.random() * 30 - 15));
    if (el) setTimeout(() => el.remove(), 250);
  },

  /* ── Muzzle flash bij de loop van het wapen ── */
  muzzleFlash() {
    const t = this.weaponTip();
    const el = this.spawnNode('muzzle-flash', t.x, t.y);
    if (el) {
      const w = getWeapon();
      el.style.background = `radial-gradient(circle, #fff, ${w.color} 40%, transparent 70%)`;
      setTimeout(() => el.remove(), 160);
    }
  },

  /* ── Terugslag-animatie van het wapen ── */
  weaponRecoil() {
    const sprite = document.getElementById('weaponSprite');
    sprite.classList.remove('recoil');
    void sprite.offsetWidth;
    sprite.classList.add('recoil');
  },

  /* ── Projectiel van wapen naar monster; onHit vuurt bij impact ── */
  projectile(weapon, onHit) {
    const from = this.weaponTip();
    const to = this.monsterCenter();

    // Laser is instant: een lichtstraal + meteen impact
    if (weapon.proj === 'laser') {
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      const beam = this.spawnNode('laser-beam', from.x, from.y);
      if (beam) {
        beam.style.width = len + 'px';
        beam.style.transform = `rotate(${Math.atan2(dy, dx)}rad)`;
        setTimeout(() => beam.remove(), 240);
      }
      this.impact();
      onHit();
      return;
    }

    // Shotgun: meerdere pellets met spreiding (schade valt één keer)
    if (weapon.proj === 'pellets') {
      for (let i = 0; i < 5; i++) {
        this.flyingNode('proj proj-pellet', from,
          { x: to.x + (Math.random() * 90 - 45), y: to.y + (Math.random() * 60 - 30) }, 170);
      }
      setTimeout(() => { this.impact(); onHit(); }, 170);
      return;
    }

    // Overige projectielen: één vliegend object
    const cfg = {
      bullet: { cls: 'proj proj-bullet', ms: 130, text: '' },
      rocket: { cls: 'proj proj-rocket', ms: 330, text: '🚀' },
      plasma: { cls: 'proj proj-plasma', ms: 240, text: '' },
      slash:  { cls: 'proj proj-slash',  ms: 200, text: '⚔️' },
      orb:    { cls: 'proj proj-orb',    ms: 240, text: '' },
    }[weapon.proj] || { cls: 'proj proj-bullet', ms: 130, text: '' };

    this.flyingNode(cfg.cls, from, to, cfg.ms, cfg.text, weapon);
    setTimeout(() => { this.impact(); onHit(); }, cfg.ms);
  },

  // Maakt een node die van 'from' naar 'to' vliegt in 'ms' milliseconden
  flyingNode(cls, from, to, ms, text, weapon) {
    const el = this.spawnNode(cls, from.x, from.y);
    if (!el) return;
    if (text) el.textContent = text;
    if (weapon && cls.includes('bullet')) {
      el.style.background = weapon.color;
      el.style.boxShadow = `0 0 10px ${weapon.color}`;
    }
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    // Projectiel in de vliegrichting draaien
    const angle = Math.atan2(dy, dx);
    el.style.transitionDuration = ms + 'ms';
    el.style.transform = `rotate(${angle}rad)`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.transform = `translate(${dx}px, ${dy}px) rotate(${angle}rad)`;
    }));
    setTimeout(() => el.remove(), ms + 60);
  },

  /* ── Screen shake (bosses, explosies) ── */
  shake() {
    const area = document.getElementById('battleArea');
    area.classList.remove('shake');
    void area.offsetWidth;
    area.classList.add('shake');
  },

  /* ── Sparkles op het introscherm ── */
  introSparkles() {
    const box = document.getElementById('introParticles');
    for (let i = 0; i < 26; i++) {
      const s = document.createElement('div');
      s.className = 'sparkle';
      const size = 2 + Math.random() * 5;
      s.style.width = size + 'px';
      s.style.height = size + 'px';
      s.style.left = Math.random() * 100 + '%';
      s.style.bottom = -(Math.random() * 30) + 'vh';
      s.style.animationDuration = (6 + Math.random() * 9) + 's';
      s.style.animationDelay = -(Math.random() * 12) + 's';
      if (Math.random() < 0.4) {
        s.style.background = ['#ffd54f', '#80deea', '#ff8a80', '#b388ff'][Math.floor(Math.random() * 4)];
        s.style.boxShadow = `0 0 8px ${s.style.background}`;
      }
      box.appendChild(s);
    }
  },
};
