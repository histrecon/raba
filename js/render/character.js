import { getWeather } from '../weather.js';
import { save } from '../save.js';
import { rod } from '../state.js';

export function drawCharacterBody(cCtx, x, y, type, scale = 1, isPreview = false) {
  cCtx.save(); cCtx.translate(x, y); cCtx.scale(scale, scale);
  const isWoman = type === 'fisherwoman';
  if (isPreview) {
    cCtx.fillStyle = '#6a4a2a'; cCtx.beginPath(); cCtx.ellipse(0, 40, 45, 12, 0, 0, Math.PI * 2); cCtx.fill();
    cCtx.fillStyle = '#8a6a3a'; cCtx.beginPath(); cCtx.ellipse(0, 38, 40, 8, 0, 0, Math.PI * 2); cCtx.fill();
  }
  cCtx.fillStyle = isWoman ? '#c0392b' : '#2a4a6a';
  cCtx.beginPath(); cCtx.ellipse(0, 10, 20, 35, 0, 0, Math.PI * 2); cCtx.fill();
  if (isWoman) {
    cCtx.fillStyle = '#c0392b';
    cCtx.beginPath();
    cCtx.moveTo(-20, 10); cCtx.lineTo(-25, 45); cCtx.lineTo(25, 45); cCtx.lineTo(20, 10); cCtx.closePath(); cCtx.fill();
    cCtx.strokeStyle = '#8a2a1a'; cCtx.lineWidth = 1.5;
    cCtx.beginPath(); cCtx.moveTo(-10, 15); cCtx.lineTo(-12, 42); cCtx.stroke();
    cCtx.beginPath(); cCtx.moveTo(10, 15); cCtx.lineTo(12, 42); cCtx.stroke();
  } else {
    cCtx.fillStyle = '#1a2a3a'; cCtx.beginPath(); cCtx.ellipse(0, 35, 18, 15, 0, 0, Math.PI * 2); cCtx.fill();
  }
  cCtx.strokeStyle = isWoman ? '#c0392b' : '#2a4a6a'; cCtx.lineWidth = 10; cCtx.lineCap = 'round';
  cCtx.beginPath(); cCtx.moveTo(-12, 0); cCtx.lineTo(-25, 15); cCtx.stroke();
  cCtx.beginPath(); cCtx.moveTo(12, 0); cCtx.lineTo(25, 15); cCtx.stroke();
  cCtx.fillStyle = '#f0c090'; cCtx.beginPath(); cCtx.arc(0, -25, 20, 0, Math.PI * 2); cCtx.fill();
  if (isWoman) {
    cCtx.fillStyle = '#8a5a2a'; cCtx.beginPath(); cCtx.ellipse(0, -20, 24, 28, 0, 0, Math.PI * 2); cCtx.fill();
    cCtx.fillStyle = '#f0c090'; cCtx.beginPath(); cCtx.ellipse(0, -25, 16, 18, 0, 0, Math.PI * 2); cCtx.fill();
    cCtx.fillStyle = '#8a5a2a'; cCtx.beginPath(); cCtx.ellipse(0, -5, 6, 15, 0, 0, Math.PI * 2); cCtx.fill();
  } else {
    cCtx.fillStyle = '#2a3a2a'; cCtx.beginPath(); cCtx.ellipse(0, -35, 24, 8, 0, 0, Math.PI * 2); cCtx.fill();
    cCtx.fillStyle = '#3a4a3a'; cCtx.beginPath(); cCtx.ellipse(0, -42, 20, 12, 0, Math.PI, 0); cCtx.fill();
  }
  cCtx.restore();
}

export function drawPreview(canvasId, type) {
  const c = document.getElementById(canvasId);
  if (!c) return;
  const cCtx = c.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  c.width = 120 * dpr; c.height = 120 * dpr;
  c.style.width = '90px'; c.style.height = '90px';
  cCtx.scale(dpr, dpr);
  drawCharacterBody(cCtx, 60, 80, type, 1.1, true);
}

export function drawFisherman(ctx) {
  const weather = getWeather();
  const isWoman = save.character === 'fisherwoman';
  ctx.fillStyle = '#6a4a2a'; ctx.beginPath(); ctx.ellipse(82, 490, 60, 18, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#8a6a3a'; ctx.beginPath(); ctx.ellipse(82, 487, 52, 12, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#5a3a1a'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(50, 490); ctx.lineTo(30, 520); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(114, 490); ctx.lineTo(134, 520); ctx.stroke();
  ctx.fillStyle = '#7a5a2a';
  ctx.beginPath(); ctx.ellipse(30, 525, 10, 4, -0.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(134, 525, 10, 4, 0.5, 0, Math.PI * 2); ctx.fill();
  if (isWoman) {
    ctx.fillStyle = '#c0392b'; ctx.beginPath();
    ctx.moveTo(62, 460); ctx.lineTo(52, 500); ctx.lineTo(112, 500); ctx.lineTo(102, 460); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#8a2a1a'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(72, 470); ctx.lineTo(68, 495); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(92, 470); ctx.lineTo(96, 495); ctx.stroke();
  } else {
    ctx.fillStyle = '#1a2a3a'; ctx.fillRect(65, 480, 18, 30); ctx.fillRect(88, 480, 18, 30);
  }
  ctx.fillStyle = isWoman ? '#c0392b' : '#2a4a6a';
  ctx.beginPath(); ctx.ellipse(82, 460, 28, 40, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = isWoman ? '#c0392b' : '#2a4a6a'; ctx.lineWidth = 11; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(70, 440); ctx.lineTo(115, 460); ctx.lineTo(rod.baseX, rod.baseY); ctx.stroke();
  ctx.fillStyle = '#f0c090'; ctx.beginPath(); ctx.arc(82, 400, 23, 0, Math.PI * 2); ctx.fill();
  if (isWoman) {
    ctx.fillStyle = '#8a5a2a'; ctx.beginPath(); ctx.ellipse(82, 400, 28, 32, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f0c090'; ctx.beginPath(); ctx.ellipse(82, 400, 18, 22, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#8a5a2a'; ctx.beginPath(); ctx.ellipse(82, 430, 8, 20, 0, 0, Math.PI * 2); ctx.fill();
  } else {
    ctx.fillStyle = '#2a3a2a'; ctx.beginPath(); ctx.ellipse(82, 388, 28, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#3a4a3a'; ctx.beginPath(); ctx.ellipse(82, 378, 22, 14, 0, Math.PI, 0); ctx.fill();
  }
  if (weather === 'night') {
    ctx.fillStyle = 'rgba(255, 220, 100, 0.2)'; ctx.beginPath(); ctx.arc(100, 450, 40, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffdd44'; ctx.beginPath(); ctx.arc(100, 450, 6, 0, Math.PI * 2); ctx.fill();
  }
}
