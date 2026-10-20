import { S } from './config.js';
import { state, bobber } from './state.js';
import { getCanvasCoords } from './utils.js';
import { ensureAudioStarted } from './audio.js';
import { castRod, startReeling, checkReel, resetToIdle } from './fishing.js';
import { startQte, handleQteKey } from './boss.js';

let touchTimeout = null;
export const swipe = state.swipe; // общий объект

export function bindInput(canvas) {
  canvas.addEventListener('mousedown', (e) => handleInput(canvas, e));
  canvas.addEventListener('contextmenu', (e) => { e.preventDefault(); handleInput(canvas, e); });
  canvas.addEventListener('touchstart', (e) => handleSwipeStart(canvas, e), { passive: false });
  canvas.addEventListener('touchmove', (e) => handleSwipeMove(canvas, e), { passive: false });
  canvas.addEventListener('touchend', (e) => handleSwipeEnd(canvas, e), { passive: false });

  window.addEventListener('keydown', (e) => {
    if (state.current === S.BOSS_QTE) {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        handleQteKey(e.key); e.preventDefault();
      }
      return;
    }
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      ensureAudioStarted();
      if (document.querySelector('.overlay.show')) return;
      if (state.current === S.REELING) { checkReel(); return; }
      if (state.current === S.BITE) { startReeling(); return; }
      if (state.current === S.IDLE) { handleAction(bobber.mx, bobber.my); return; }
      handleAction(0, 0);
    }
  });

  document.querySelectorAll('.qte-btn').forEach(btn => {
    btn.addEventListener('mousedown', (e) => { e.preventDefault(); e.stopPropagation(); if (state.current === S.BOSS_QTE) handleQteKey(btn.dataset.key); });
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); e.stopPropagation(); if (state.current === S.BOSS_QTE) handleQteKey(btn.dataset.key); }, { passive: false });
  });
}

export function handleInput(canvas, e) {
  ensureAudioStarted();
  if (document.querySelector('.overlay.show')) return;
  if (state.current === S.BOSS_QTE) return;
  if (state.current === S.BOSS_INSTRUCTION) return;
  if (e.type === 'touchstart' && e.touches && e.touches.length > 0) {
    e.preventDefault();
    if (touchTimeout) return;
    touchTimeout = setTimeout(() => { touchTimeout = null; }, 200);
  }
  const { x, y } = getCanvasCoords(canvas, e);
  bobber.mx = x; bobber.my = y;
  handleAction(x, y);
}

export function handleAction(mx, my) {
  if (state.current === S.IDLE) castRod(mx, my);
  else if (state.current === S.BITE) startReeling();
  else if (state.current === S.REELING) checkReel();
  else if (state.current === S.RESULT && state.time > 0.8) resetToIdle();
  else if (state.current === S.BOSS_INTRO && state.time > 2.5) { state.current = S.BOSS_QTE; startQte(); }
  else if (state.current === S.BOSS_DEATH && state.time > 3) { state.current = S.IDLE; state.time = 0; }
  else if (state.current === S.BOSS_WIN && state.time > 3) { state.current = S.IDLE; state.time = 0; }
}

function handleSwipeStart(canvas, e) {
  ensureAudioStarted();
  if (state.current === S.BOSS_QTE || state.current === S.BOSS_INSTRUCTION) return;
  if (document.querySelector('.overlay.show')) return;
  if (state.current !== S.IDLE) { handleInput(canvas, e); return; }
  e.preventDefault();
  const { x, y } = getCanvasCoords(canvas, e);
  swipe.active = true; swipe.startX = x; swipe.startY = y; swipe.curX = x; swipe.curY = y;
}
function handleSwipeMove(canvas, e) {
  if (!swipe.active) return;
  e.preventDefault();
  const { x, y } = getCanvasCoords(canvas, e);
  swipe.curX = x; swipe.curY = y;
}
function handleSwipeEnd(canvas, e) {
  if (!swipe.active) return;
  e.preventDefault();
  swipe.active = false;
  const dx = swipe.curX - swipe.startX; const dy = swipe.curY - swipe.startY;
  if (Math.hypot(dx, dy) > 50 && dy > 0) castRod(swipe.curX, swipe.curY);
  else handleInput(canvas, e);
}
