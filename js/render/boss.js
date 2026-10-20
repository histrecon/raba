import { W, H, S } from '../config.js';
import { state } from '../state.js';

export function drawBoss(ctx) {
  if (!state.boss) return;
  let shakeX = 0, shakeY = 0;
  if (state.current === S.BOSS_INTRO) {
    shakeX = (Math.random() - 0.5) * 10;
    shakeY = (Math.random() - 0.5) * 10;
  }
  const boss = state.boss;
  ctx.save(); ctx.translate(shakeX, shakeY);

  ctx.fillStyle = '#2a2a2a';
  ctx.beginPath(); ctx.ellipse(boss.x - 100, boss.y, 250, 80, 0, 0, Math.PI * 2); ctx.fill();

  ctx.beginPath();
  ctx.moveTo(boss.x - 300, boss.y);
  ctx.lineTo(boss.x - 400, boss.y - 100);
  ctx.lineTo(boss.x - 400, boss.y + 100);
  ctx.closePath(); ctx.fill();

  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath(); ctx.ellipse(boss.x + 150, boss.y, 120, 90, 0, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.ellipse(boss.x + 220, boss.y + 20, 80, 50, -0.2, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#ddd';
  for (let i = 0; i < 12; i++) {
    const tx = boss.x + 160 + (i % 6) * 20;
    const ty = boss.y - 20 + Math.floor(i / 6) * 60;
    ctx.beginPath();
    ctx.moveTo(tx, ty); ctx.lineTo(tx + 10, ty + 15); ctx.lineTo(tx + 20, ty);
    ctx.fill();
  }

  ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 8; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(boss.x + 200, boss.y - 40); ctx.quadraticCurveTo(boss.x + 300, boss.y - 150, boss.x + 400, boss.y - 100); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(boss.x + 200, boss.y + 60); ctx.quadraticCurveTo(boss.x + 300, boss.y + 150, boss.x + 400, boss.y + 100); ctx.stroke();

  ctx.fillStyle = '#ff0000';
  ctx.beginPath(); ctx.arc(boss.x + 120, boss.y - 40, 20, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(boss.x + 120, boss.y + 40, 20, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffff00';
  ctx.beginPath(); ctx.arc(boss.x + 120, boss.y - 40, 8, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(boss.x + 120, boss.y + 40, 8, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#2a2a2a';
  ctx.beginPath(); ctx.moveTo(boss.x - 50, boss.y - 60); ctx.lineTo(boss.x - 100, boss.y - 180); ctx.lineTo(boss.x + 20, boss.y - 80); ctx.fill();
  ctx.beginPath(); ctx.moveTo(boss.x - 50, boss.y + 60); ctx.lineTo(boss.x - 100, boss.y + 180); ctx.lineTo(boss.x + 20, boss.y + 80); ctx.fill();

  ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.ellipse(boss.x, boss.y + 100, 350, 50, 0, 0, Math.PI * 2); ctx.stroke();

  ctx.restore();
}

export function drawBossQte(ctx) {
  if (state.current !== S.BOSS_QTE || !state.qteSequence[state.qteIndex]) return;
  ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0, 0, W, H);
  ctx.font = 'bold 28px "Segoe UI", sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#fff';
  ctx.fillText(`Атака ${state.qteIndex + 1} / ${state.qteSequence.length}`, W / 2, 100);
  const timerWidth = 400; const timerX = (W - timerWidth) / 2;
  ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.fillRect(timerX, 130, timerWidth, 20);
  const ratio = state.qteTimer / state.qteMaxTime;
  ctx.fillStyle = ratio > 0.5 ? '#4CAF50' : ratio > 0.25 ? '#ffa000' : '#ff3333';
  ctx.fillRect(timerX, 130, timerWidth * ratio, 20);
  const key = state.qteSequence[state.qteIndex].key;
  const symbols = { 'ArrowUp': '↑', 'ArrowDown': '↓', 'ArrowLeft': '←', 'ArrowRight': '→' };
  ctx.font = 'bold 200px "Segoe UI", sans-serif'; ctx.fillStyle = '#ffdd44';
  ctx.shadowColor = '#ff4444'; ctx.shadowBlur = 40;
  ctx.fillText(symbols[key], W / 2, H / 2 + 60); ctx.shadowBlur = 0;
  ctx.font = 'bold 24px "Segoe UI", sans-serif'; ctx.fillStyle = '#fff';
  ctx.fillText('Нажми правильную кнопку!', W / 2, H / 2 + 180);
}
