/* ═══════════════════════════════════════════════════════════
   WEAPON CLICKER — Audio systeem
   Alle geluiden en muziek worden live gegenereerd met WebAudio,
   dus er zijn geen audiobestanden nodig.
   ═══════════════════════════════════════════════════════════ */

'use strict';

const AudioSys = {
  ctx: null,          // AudioContext (wordt pas gemaakt na eerste tap, iOS-vereiste)
  musicTimer: null,   // interval dat de muzieknoten afspeelt
  musicStep: 0,       // huidige positie in het muziekpatroon

  // Maakt de AudioContext aan / hervat hem (moet vanuit een user-gesture)
  unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  },

  // Basis-bliep: oscillator met volume-envelope en optionele pitch-slide
  beep(freq, endFreq, dur, type, vol) {
    if (!this.ctx || !state.settings.sound) return;
    this.tone(freq, endFreq, dur, type, vol);
  },

  // Zelfde als beep maar zonder de sound-setting check (voor muziek)
  tone(freq, endFreq, dur, type, vol) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type || 'square';
    osc.frequency.setValueAtTime(freq, t);
    if (endFreq && endFreq !== freq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), t + dur);
    }
    gain.gain.setValueAtTime(vol || 0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  },

  /* ── Sound effects ── */
  shoot()    { this.beep(340, 90, 0.09, 'square', 0.07); },
  pellets()  { for (let i = 0; i < 3; i++) setTimeout(() => this.beep(280 + Math.random() * 120, 80, 0.07, 'square', 0.05), i * 25); },
  laserSfx() { this.beep(900, 240, 0.14, 'sawtooth', 0.06); },
  hit()      { this.beep(160, 110, 0.05, 'square', 0.06); },
  crit()     { this.beep(500, 950, 0.13, 'sawtooth', 0.09); },
  death()    { this.beep(320, 55, 0.28, 'square', 0.09); },
  coin()     { this.beep(950, 950, 0.07, 'sine', 0.09); setTimeout(() => this.beep(1400, 1400, 0.09, 'sine', 0.08), 70); },
  buy()      { [520, 700, 940].forEach((f, i) => setTimeout(() => this.beep(f, f, 0.09, 'triangle', 0.09), i * 70)); },
  achieve()  { [600, 800, 1000, 1250].forEach((f, i) => setTimeout(() => this.beep(f, f, 0.11, 'triangle', 0.09), i * 90)); },
  boss()     { this.beep(90, 45, 0.5, 'sawtooth', 0.12); setTimeout(() => this.beep(70, 40, 0.5, 'sawtooth', 0.12), 250); },
  prestige() { [400, 600, 800, 1200, 1600].forEach((f, i) => setTimeout(() => this.beep(f, f * 1.2, 0.16, 'triangle', 0.09), i * 110)); },
  error()    { this.beep(140, 90, 0.14, 'square', 0.07); },

  /* ── Muziek: simpele chiptune-loop ── */

  // MIDI-nootnummer → frequentie in Hz
  midiToFreq(m) { return 440 * Math.pow(2, (m - 69) / 12); },

  startMusic() {
    if (this.musicTimer || !this.ctx || !state.settings.music) return;
    // Vrolijk arcade-loopje in A mineur (0 = rust)
    const lead = [69, 0, 72, 0, 76, 0, 72, 0, 74, 0, 72, 0, 69, 0, 67, 0,
                  69, 0, 72, 0, 76, 0, 79, 0, 77, 0, 76, 0, 72, 0, 74, 0];
    const bass = [45, 0, 45, 0, 48, 0, 48, 0, 43, 0, 43, 0, 50, 0, 50, 0,
                  45, 0, 45, 0, 48, 0, 48, 0, 53, 0, 53, 0, 52, 0, 52, 0];
    this.musicStep = 0;
    this.musicTimer = setInterval(() => {
      if (!state.settings.music) return;
      const i = this.musicStep % lead.length;
      if (lead[i]) this.tone(this.midiToFreq(lead[i]), 0, 0.16, 'square', 0.025);
      if (bass[i]) this.tone(this.midiToFreq(bass[i]), 0, 0.22, 'triangle', 0.045);
      this.musicStep++;
    }, 170);
  },

  stopMusic() {
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  },

  // Zet muziek aan/uit op basis van de settings
  syncMusic() {
    if (state.settings.music) this.startMusic();
    else this.stopMusic();
  },
};
