import { W, H, S, STORAGE_KEYS } from './config.js';
import { save, loadSave, persistSave, clearSave } from './save.js';
import { state } from './state.js';
import { initAudio, ensureAudioStarted, toggleSound, playSound } from './audio.js';
import { tickWeather, updateGameTime } from './weather.js';
import { updateFishing, resetToIdle } from './fishing.js';
import { updateBoss, startBossFromInstruction, handleQteKey } from './boss.js';
import { updateEnvironmentParticles } from './render/environment.js';
import { bindInput } from './input.js';
import { toggleShop, switchShopTab, renderShop, buyUpgrade, buyBaitPack, buyBook, buyHarpoon, buyTreeUpgrade } from './shop.js';
import { toggleCatalog, renderCatalog } from './catalog.js';
import { drawPreview } from './render/character.js';
import { draw } from './draw.js';
import { resetProgress as resetProgressInternal } from './reset.js';

// Загрузка сохранений (с миграцией) — ДО первого рендера
loadSave();

// Настройка canvas
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
}
window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', () => setTimeout(resizeCanvas, 200));
resizeCanvas();

// Превью персонажей
drawPreview('previewFisher', 'fisher');
drawPreview('previewFisherwoman', 'fisherwoman');

// Если персонаж выбран — скрываем выбор
if (save.character) document.getElementById('charSelect').classList.remove('show');

// Кнопка звука
document.getElementById('soundBtn').textContent = save.soundEnabled ? '🔊' : '🔇';

// Привязка UI-кнопок через data-action (без inline onclick)
document.querySelectorAll('[data-action]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.stopPropagation();
    const action = el.dataset.action;
    if (action === 'sound') toggleSound();
    else if (action === 'fullscreen') toggleFullscreen();
    else if (action === 'reset') handleReset();
    else if (action === 'catalog') toggleCatalog();
    else if (action === 'shop') toggleShop();
    else if (action === 'close-catalog') toggleCatalog();
    else if (action === 'close-shop') toggleShop();
  });
});

document.querySelectorAll('.char-card').forEach(card => {
  card.addEventListener('click', (e) => {
    e.stopPropagation();
    save.character = card.dataset.char;
    localStorage.setItem(STORAGE_KEYS.character, save.character);
    document.getElementById('charSelect').classList.remove('show');
    ensureAudioStarted();
  });
});

document.querySelectorAll('.shop-tab').forEach(tab => {
  tab.addEventListener('click', () => switchShopTab(tab.dataset.tab));
});

document.getElementById('bossStartBtn').addEventListener('click', (e) => {
  e.stopPropagation();
  startBossFromInstruction();
});

// Делегирование кликов в магазине (чтобы не вешать onclick в строках)
document.getElementById('shopItems').addEventListener('click', (e) => {
  const t = e.target.closest('button');
  if (!t) return;
  if (t.dataset.buyUpgrade) buyUpgrade(t.dataset.buyUpgrade);
  else if (t.dataset.buyBait) buyBaitPack(parseInt(t.dataset.buyBait));
  else if (t.dataset.buyBook) buyBook(t.dataset.buyBook);
  else if (t.dataset.buyHarpoon !== undefined) buyHarpoon();
  else if (t.dataset.buyTree) {
    const [branch, idx] = t.dataset.buyTree.split('|');
    buyTreeUpgrade(branch, parseInt(idx));
  }
});

// Закрытие оверлеев по клику на фон
document.getElementById('catalogOverlay').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) toggleCatalog();
});
document.getElementById('shopOverlay').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) toggleShop();
});

// Ввод
bindInput(canvas);

// Fullscreen
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {
      if (document.documentElement.webkitRequestFullscreen) document.documentElement.webkitRequestFullscreen();
    });
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  }
}
document.addEventListener('fullscreenchange', () => setTimeout(resizeCanvas, 100));

// Сброс прогресса
function handleReset() {
  if (!confirm('Сбросить ВЕСЬ прогресс?')) return;
  resetProgressInternal();
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1500);
  save.character = null;
  document.getElementById('charSelect').classList.add('show');
}

// Обновление мира (погода, частицы, фон) — вынесено из updateFishing
function updateWorld(dt, t) {
  state.time += dt;
  updateGameTime(dt);
  const inBossScene = state.current === S.BOSS_INSTRUCTION || state.current === S.BOSS_INTRO || state.current === S.BOSS_QTE || state.current === S.BOSS_DEATH || state.current === S.BOSS_WIN;
  if (!inBossScene) tickWeather(dt);

  updateEnvironmentParticles(dt, t);

  // Частицы
  for (let i = state.particles.length - 1; i >= 0; i--) {
    const p = state.particles[i];
    p.x += p.vx; p.y += p.vy; p.vy += 8 * dt; p.life -= dt * 1.5;
    if (p.life <= 0) state.particles.splice(i, 1);
  }
  for (let i = state.rippleEffects.length - 1; i >= 0; i--) {
    const r = state.rippleEffects[i];
    r.radius += dt * 60; r.life -= dt * 1.2;
    if (r.life <= 0) state.rippleEffects.splice(i, 1);
  }
  for (let i = state.floatingTexts.length - 1; i >= 0; i--) {
    const ft = state.floatingTexts[i];
    ft.y += ft.vy * dt; ft.vy *= 0.95; ft.life -= dt * 1.2;
    if (ft.life <= 0) state.floatingTexts.splice(i, 1);
  }
}

// Игровой цикл
let lastTime = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - lastTime) / 1000);
  lastTime = now;
  const t = now / 1000;

  updateWorld(dt, t);
  updateBoss(dt, t);
  updateFishing(dt, t);

  draw(ctx);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
