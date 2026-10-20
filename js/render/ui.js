import { W, WEATHER_DURATION, WEATHER_ICONS } from '../config.js';
import { save } from '../save.js';
import { state } from '../state.js';
import { getWeather, getNextWeather, formatTime } from '../weather.js';
import { calcPoints } from '../fishing.js';
import { S } from '../config.js';

export function drawSundial(ctx, x, y, radius) {
  ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.beginPath(); ctx.arc(x, y, radius + 8, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(255,215,0,0.4)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, radius + 8, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#c8b888'; ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#e0d0a0'; ctx.beginPath(); ctx.arc(x, y, radius - 4, 0, Math.PI * 2); ctx.fill();
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const innerR = radius - 12;
    const outerR = i % 3 === 0 ? radius - 3 : radius - 7;
    ctx.strokeStyle = i % 3 === 0 ? '#6a5a3a' : '#8a7a5a';
    ctx.lineWidth = i % 3 === 0 ? 2.5 : 1.5;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(angle) * innerR, y + Math.sin(angle) * innerR);
    ctx.lineTo(x + Math.cos(angle) * outerR, y + Math.sin(angle) * outerR);
    ctx.stroke();
  }
  const hourAngle = ((state.gameTimeMinutes / 60) / 24) * Math.PI * 2 - Math.PI / 2;
  const shadowLen = radius - 10;
  ctx.strokeStyle = 'rgba(60,40,20,0.7)'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(hourAngle) * shadowLen, y + Math.sin(hourAngle) * shadowLen);
  ctx.stroke();
  ctx.fillStyle = '#5a4a2a'; ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.font = 'bold 13px "Segoe UI", sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(formatTime(), x, y + radius + 20);
  ctx.font = '12px "Segoe UI", sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText(`${WEATHER_ICONS[getWeather()]} ${Math.max(0, Math.ceil(WEATHER_DURATION - state.weatherTimer))}с → ${WEATHER_ICONS[getNextWeather()]}`, x, y + radius + 36);
}

export function drawUI(ctx) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)'; ctx.beginPath(); ctx.roundRect(15, 15, 250, 110, 10); ctx.fill();
  ctx.font = 'bold 20px "Segoe UI", sans-serif'; ctx.textAlign = 'left'; ctx.fillStyle = '#fff';
  ctx.fillText(`💰 Очки: ${save.score}`, 30, 45);
  ctx.font = '14px "Segoe UI", sans-serif'; ctx.fillStyle = '#ffd700';
  ctx.fillText(`🏆 Рекорд: ${save.bestScore}`, 30, 70);
  ctx.fillStyle = '#aaddff'; ctx.fillText(`🎣 Поймано: ${save.totalCaught}`, 30, 90);
  if (save.baitCount > 0) {
    ctx.fillStyle = '#ff9966';
    ctx.fillText(`🪱 Наживка: ×${save.baitCount} (×3 к редким!)`, 30, 110);
  }
  if (state.catchStreak >= 3) {
    ctx.fillStyle = '#ff9966'; ctx.font = 'bold 12px "Segoe UI"';
    ctx.fillText(`🔥 Серия ${state.catchStreak}!`, 30, 130);
  } else if (state.missStreak >= 2) {
    ctx.fillStyle = '#99ff99'; ctx.font = 'bold 12px "Segoe UI"';
    ctx.fillText(`🍀 Удача рыбака`, 30, 130);
  }
  drawSundial(ctx, W - 80, 75, 40);

  if (state.lastCatch && (state.current === S.RESULT || state.current === S.RETURNING)) {
    const panelW = 240;
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.beginPath(); ctx.roundRect(W - panelW - 15, 160, panelW, 60, 10); ctx.fill();
    ctx.font = 'bold 20px "Segoe UI", sans-serif'; ctx.textAlign = 'center';
    ctx.fillStyle = state.lastCatch.color;
    ctx.fillText(`${state.lastCatch.emoji} ${state.lastCatch.name}`, W - panelW / 2 - 15, 190);
    ctx.font = '14px "Segoe UI", sans-serif';
    ctx.fillStyle = state.lastCatch.isTrash ? '#ff8888' : '#fff';
    const pts = calcPoints(state.lastCatch);
    ctx.fillText(state.lastCatch.isTrash ? '🗑 Мусор...' : `+${pts} очков`, W - panelW / 2 - 15, 210);
  }
}
