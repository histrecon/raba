import { save } from './save.js';

let audioCtx = null;
let bgNoiseNode = null;

export function initAudio() {
  if (audioCtx) return;
  try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
}

export function playSound(type) {
  if (!save.soundEnabled || !audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const now = audioCtx.currentTime;
  if (type === 'cast') {
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.type = 'sine'; osc.frequency.setValueAtTime(800, now); osc.frequency.exponentialRampToValueAtTime(300, now + 0.2);
    gain.gain.setValueAtTime(0.15, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.connect(gain); gain.connect(audioCtx.destination); osc.start(now); osc.stop(now + 0.2);
  } else if (type === 'splash') {
    const bufferSize = audioCtx.sampleRate * 0.3;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const source = audioCtx.createBufferSource(); source.buffer = buffer;
    const filter = audioCtx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 1000;
    const gain = audioCtx.createGain(); gain.gain.setValueAtTime(0.2, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    source.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination); source.start(now);
  } else if (type === 'bite') {
    [880, 1320].forEach((freq, i) => {
      const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
      osc.type = 'sine'; osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.15);
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(now + i * 0.08); osc.stop(now + i * 0.08 + 0.15);
    });
  } else if (type === 'reel') {
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.type = 'sawtooth'; osc.frequency.value = 120;
    gain.gain.setValueAtTime(0.08, now); gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
    osc.connect(gain); gain.connect(audioCtx.destination); osc.start(now); osc.stop(now + 0.1);
  } else if (type === 'catch') {
    [523, 659, 784, 1046].forEach((freq, i) => {
      const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
      osc.type = 'triangle'; osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.3);
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(now + i * 0.08); osc.stop(now + i * 0.08 + 0.3);
    });
  } else if (type === 'rare') {
    [659, 784, 987, 1318, 1568].forEach((freq, i) => {
      const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
      osc.type = 'triangle'; osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.07 + 0.4);
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(now + i * 0.07); osc.stop(now + i * 0.07 + 0.4);
    });
  } else if (type === 'achv') {
    [523, 659, 784, 1046, 1318].forEach((freq, i) => {
      const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
      osc.type = 'sine'; osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.5);
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(now + i * 0.1); osc.stop(now + i * 0.1 + 0.5);
    });
  } else if (type === 'miss') {
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.type = 'sawtooth'; osc.frequency.setValueAtTime(300, now); osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
    gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.connect(gain); gain.connect(audioCtx.destination); osc.start(now); osc.stop(now + 0.3);
  } else if (type === 'buy') {
    [660, 880].forEach((freq, i) => {
      const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
      osc.type = 'square'; osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.1, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.15);
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(now + i * 0.05); osc.stop(now + i * 0.05 + 0.15);
    });
  } else if (type === 'roar') {
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.type = 'sawtooth'; osc.frequency.setValueAtTime(60, now); osc.frequency.linearRampToValueAtTime(40, now + 1.5);
    gain.gain.setValueAtTime(0.5, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
    osc.connect(gain); gain.connect(audioCtx.destination); osc.start(now); osc.stop(now + 1.5);
  } else if (type === 'hurt') {
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.type = 'square'; osc.frequency.setValueAtTime(200, now); osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
    gain.gain.setValueAtTime(0.3, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.connect(gain); gain.connect(audioCtx.destination); osc.start(now); osc.stop(now + 0.3);
  }
}

export function startAmbientSound() {
  if (!save.soundEnabled || !audioCtx || bgNoiseNode) return;
  const bufferSize = audioCtx.sampleRate * 2;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.1;
  const source = audioCtx.createBufferSource(); source.buffer = buffer; source.loop = true;
  const filter = audioCtx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 400;
  const gain = audioCtx.createGain(); gain.gain.value = 0.15;
  source.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination);
  source.start(); bgNoiseNode = { source, gain };
}

export function stopAmbientSound() {
  if (bgNoiseNode) { try { bgNoiseNode.source.stop(); } catch (e) {} bgNoiseNode = null; }
}

export function toggleSound() {
  save.soundEnabled = !save.soundEnabled;
  localStorage.setItem('fishSoundEnabled', save.soundEnabled);
  document.getElementById('soundBtn').textContent = save.soundEnabled ? '🔊' : '🔇';
  if (save.soundEnabled) { initAudio(); if (!bgNoiseNode) startAmbientSound(); playSound('buy'); }
  else stopAmbientSound();
  // вызываем persistSave лениво — просто пишем ключ напрямую
}

export function ensureAudioStarted() {
  if (!audioCtx) initAudio();
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  if (save.soundEnabled && audioCtx && !bgNoiseNode) startAmbientSound();
}
