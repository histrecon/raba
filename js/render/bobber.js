import { save } from '../save.js';
import { rod } from '../state.js';
import { getWeather } from '../weather.js';

export function drawBobber(ctx, x, y) {
  const floatLvl = save.treeUpgrades.float || 0;
  let lineColor = 'rgba(255,255,255,0.4)';
  if (save.treeUpgrades.line === 1) lineColor = 'rgba(200,255,200,0.6)';
  if (save.treeUpgrades.line === 2) lineColor = 'rgba(150,150,150,0.8)';
  if (save.treeUpgrades.line === 3) lineColor = 'rgba(100,200,255,0.9)';

  ctx.strokeStyle = lineColor; ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(rod.tipX, rod.tipY);
  ctx.quadraticCurveTo((rod.tipX + x) / 2, Math.min(rod.tipY, y) - 30, x, y);
  ctx.stroke();

  if (getWeather() === 'night' || floatLvl >= 2) {
    ctx.shadowColor = floatLvl >= 2 ? '#00ffff' : '#ffff88';
    ctx.shadowBlur = 15;
  }

  if (floatLvl === 0) {
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(x, y, 4, 12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ff4444'; ctx.beginPath(); ctx.arc(x, y - 8, 5, 0, Math.PI * 2); ctx.fill();
  } else if (floatLvl === 1 || floatLvl === 3) {
    ctx.strokeStyle = '#ff3333'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, y - 8); ctx.lineTo(x, y - 22); ctx.stroke();
    ctx.fillStyle = '#ff4444'; ctx.beginPath(); ctx.arc(x, y, 9, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI); ctx.fill();
    ctx.strokeStyle = '#333'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.stroke();
  } else {
    ctx.strokeStyle = '#00ffff'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, y - 8); ctx.lineTo(x, y - 22); ctx.stroke();
    ctx.fillStyle = '#00ffff'; ctx.beginPath(); ctx.arc(x, y, 9, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI); ctx.fill();
    ctx.strokeStyle = '#005555'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.shadowBlur = 0;
}
