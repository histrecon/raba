import { W, H } from './config.js';
import { state } from './state.js';

export function vibrate(pattern) { if (navigator.vibrate) navigator.vibrate(pattern); }

export function addParticles(x, y, color, count, spread = 4) {
  for (let i = 0; i < count; i++) {
    state.particles.push({
      x, y,
      vx: (Math.random() - 0.5) * spread * 2,
      vy: (Math.random() - 0.5) * spread * 2 - 1,
      life: 1, color, size: 2 + Math.random() * 4
    });
  }
}
export function addRipple(x, y) { state.rippleEffects.push({ x, y, radius: 5, life: 1 }); }
export function addFloatingText(text, x, y, color) {
  state.floatingTexts.push({ text, x, y, color, life: 1.5, vy: -50 });
}

export function getCanvasCoords(canvas, e) {
  const rect = canvas.getBoundingClientRect();
  let clientX, clientY;
  if (e.touches && e.touches.length > 0) { clientX = e.touches[0].clientX; clientY = e.touches[0].clientY; }
  else if (e.changedTouches && e.changedTouches.length > 0) { clientX = e.changedTouches[0].clientX; clientY = e.changedTouches[0].clientY; }
  else { clientX = e.clientX; clientY = e.clientY; }
  const canvasAspect = W / H; const rectAspect = rect.width / rect.height;
  let renderedW, renderedH, offsetX, offsetY;
  if (rectAspect > canvasAspect) { renderedH = rect.height; renderedW = rect.height * canvasAspect; }
  else { renderedW = rect.width; renderedH = rect.width / canvasAspect; }
  offsetX = (rect.width - renderedW) / 2;
  offsetY = (rect.height - renderedH) / 2;
  const scale = renderedW / W;
  return { x: (clientX - rect.left - offsetX) / scale, y: (clientY - rect.top - offsetY) / scale };
}

export function drawFishBody(ctx, x, y, size, color, dir = 1, alpha = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1); ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.ellipse(0, 0, size, size * 0.45, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-size * 0.9, 0); ctx.lineTo(-size * 1.5, -size * 0.5); ctx.lineTo(-size * 1.5, size * 0.5); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(size * 0.5, -size * 0.1, size * 0.1, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

export function drawTrashBody(ctx, x, y, size, color, emoji) {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(0, 0, size * 0.8, size * 0.6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(0, 0, size * 0.6, size * 0.4, 0, 0, Math.PI * 2); ctx.fill();
  ctx.font = `${size * 1.2}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(emoji, 0, 0);
  ctx.restore();
}

export function drawTrashBody(ctx, x, y, size
