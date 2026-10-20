import { W, H } from '../config.js';
import { state } from '../state.js';

export function drawReelUI(ctx) {
  const barW = 500, barH = 32;
  const barX = (W - barW) / 2, barY = H - 130;
  ctx.fillStyle = 'rgba(0,0,0,0.85)';
  ctx.beginPath(); ctx.roundRect(barX - 25, barY - 55, barW + 50, barH + 100, 16); ctx.fill();
  ctx.strokeStyle = 'rgba(100,200,100,0.5)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.font = 'bold 22px "Segoe UI", sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#fff';
  ctx.fillText('🎣 Кликни в зелёной зоне!', W / 2, barY - 22);
  ctx.fillStyle = '#222';
  ctx.beginPath(); ctx.roundRect(barX, barY, barW, barH, 8); ctx.fill();
  const zx = barX + (state.zoneStart / 100) * barW;
  const zw = ((state.zoneEnd - state.zoneStart) / 100) * barW;
  const grad = ctx.createLinearGradient(zx, barY, zx + zw, barY);
  grad.addColorStop(0, '#4CAF50'); grad.addColorStop(0.5, '#7fff7f'); grad.addColorStop(1, '#4CAF50');
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.roundRect(zx, barY, zw, barH, 6); ctx.fill();
  ctx.strokeStyle = '#aaffaa'; ctx.lineWidth = 2; ctx.strokeRect(zx, barY, zw, barH);
  const ix = barX + (state.reelPos / 100) * barW;
  ctx.shadowColor = '#fff'; ctx.shadowBlur = 20;
  ctx.fillStyle = '#fff'; ctx.fillRect(ix - 3, barY - 8, 6, barH + 16);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.moveTo(ix, barY - 12); ctx.lineTo(ix - 6, barY - 20); ctx.lineTo(ix + 6, barY - 20); ctx.closePath(); ctx.fill();
}
