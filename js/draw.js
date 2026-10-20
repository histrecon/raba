import { W, H, S } from './config.js';
import { state } from './state.js';
import { save } from './save.js';
import { drawEnvironment } from './render/environment.js';
import { drawFisherman } from './render/character.js';
import { drawBobber } from './render/bobber.js';
import { drawUI } from './render/ui.js';
import { drawReelUI } from './render/reel.js';
import { drawBoss, drawBossQte } from './render/boss.js';
import { drawHints } from './render/hints.js';
import { drawFishBody, drawTrashBody } from './utils.js';
import { rod } from './state.js';
import { bobber } from './state.js';

export function draw(ctx) {
  const t = performance.now() / 1000;
  ctx.clearRect(0, 0, W, H);

  if (state.current === S.BOSS_INSTRUCTION) {
    drawEnvironment(ctx, t);
    drawFisherman(ctx);
    drawBoss(ctx);
    drawHints(ctx, state);
    return;
  }

  if (state.current === S.BOSS_INTRO || state.current === S.BOSS_QTE || state.current === S.BOSS_DEATH || state.current === S.BOSS_WIN) {
    drawEnvironment(ctx, t);
    if (state.boss) drawBoss(ctx);
    if (state.current === S.BOSS_QTE) drawBossQte(ctx);

    if (state.current === S.BOSS_DEATH) {
      ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(0, 0, W, H);
      ctx.font = 'bold 44px "Segoe UI", sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#ff4444';
      ctx.fillText('СОМ-ГИГАНТ ПОБЕДИЛ!', W / 2, 120);
      ctx.font = 'bold 28px "Segoe UI", sans-serif'; ctx.fillStyle = '#ff8888';
      ctx.fillText('❌ Потеряно:', W / 2, 190);
      ctx.font = '22px "Segoe UI", sans-serif'; ctx.fillStyle = '#fff';
      ctx.fillText('Коллекция рыб', W / 2, 225);
      ctx.fillText('Достижение «Коллекционер»', W / 2, 255);
      ctx.font = 'bold 28px "Segoe UI", sans-serif'; ctx.fillStyle = '#88ff88';
      ctx.fillText('✅ Сохранено:', W / 2, 310);
      ctx.font = '22px "Segoe UI", sans-serif'; ctx.fillStyle = '#fff';
      ctx.fillText('Очки, прокачка, удочки, мусор', W / 2, 345);
      ctx.fillStyle = 'rgba(255, 215, 0, 0.2)';
      ctx.beginPath(); ctx.roundRect(W / 2 - 300, 390, 600, 100, 16); ctx.fill();
      ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 3; ctx.stroke();
      ctx.font = 'bold 22px "Segoe UI", sans-serif'; ctx.fillStyle = '#ffd700';
      ctx.fillText('💡 Совет:', W / 2, 425);
      ctx.font = '18px "Segoe UI", sans-serif'; ctx.fillStyle = '#fff';
      ctx.fillText('Купите «Острогу Рыбака» в магазине,', W / 2, 455);
      ctx.fillText('чтобы одолеть Сома в следующий раз!', W / 2, 480);
      if (state.time > 3) {
        ctx.font = '16px "Segoe UI", sans-serif'; ctx.fillStyle = '#aaa';
        ctx.fillText('Кликни, чтобы продолжить', W / 2, 560);
      }
    }

    if (state.current === S.BOSS_WIN) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0, 0, W, H);
      ctx.font = 'bold 44px "Segoe UI", sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#ffd700';
      ctx.fillText('РЕЧНОЙ МОНСТР ПОВЕРЖЕН!', W / 2, H / 2 - 60);
      ctx.font = '28px "Segoe UI", sans-serif'; ctx.fillStyle = '#fff';
      ctx.fillText('+5000 очков', W / 2, H / 2);
      ctx.fillStyle = '#aaffaa'; ctx.font = '22px "Segoe UI", sans-serif';
      ctx.fillText('Сом больше никогда не появится.', W / 2, H / 2 + 50);
      if (state.time > 3) {
        ctx.font = '16px "Segoe UI", sans-serif'; ctx.fillStyle = '#aaa';
        ctx.fillText('Кликни, чтобы продолжить', W / 2, H / 2 + 120);
      }
    }

    drawHints(ctx, state);
    return;
  }

  drawEnvironment(ctx, t);

  for (const r of state.rippleEffects) {
    ctx.strokeStyle = `rgba(200, 230, 255, ${r.life * 0.6})`; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(r.x, r.y, r.radius, r.radius * 0.3, 0, 0, Math.PI * 2); ctx.stroke();
  }

  if (state.current !== S.IDLE) {
    let by = bobber.y;
    if (state.current === S.WAITING) by += Math.sin(bobber.phase * 2) * 3;
    else if (state.current === S.BITE) by += Math.sin(t * 30) * 6;
    else if ((state.current === S.RETURNING || state.current === S.RESULT) && state.lastCatch) {
      if (state.lastCatch.isTrash) drawTrashBody(ctx, bobber.x, by + 22, state.lastCatch.size * 0.7, state.lastCatch.color, state.lastCatch.emoji);
      else drawFishBody(ctx, bobber.x, by + 22, state.lastCatch.size * 0.8, state.lastCatch.color, 1, 1);
    }
    drawBobber(ctx, bobber.x, by);
  }

  drawFisherman(ctx);

  // Удилище по уровню дерева
  const bodyLvl = save.treeUpgrades.body || 0;
  let rodColor = '#8B4513', rodColor2 = '#a06030';
  if (bodyLvl === 1) { rodColor = '#8a9aaa'; rodColor2 = '#aaccee'; }
  else if (bodyLvl === 2) { rodColor = '#2a2a2a'; rodColor2 = '#4a4a4a'; }
  else if (bodyLvl === 3) { rodColor = '#1a1a1a'; rodColor2 = '#2a2a2a'; }
  else if (bodyLvl === 4) { rodColor = '#3a3a3a'; rodColor2 = '#5a5a5a'; }

  ctx.strokeStyle = rodColor; ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(rod.baseX, rod.baseY); ctx.quadraticCurveTo(140, 420, rod.tipX, rod.tipY); ctx.stroke();
  ctx.strokeStyle = rodColor2; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(140, 420); ctx.quadraticCurveTo(165, 400, rod.tipX, rod.tipY); ctx.stroke();

  if (state.swipe.active) drawSwipeIndicator(ctx);

  for (const p of state.particles) {
    ctx.globalAlpha = p.life; ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;

  for (const ft of state.floatingTexts) {
    ctx.globalAlpha = Math.min(1, ft.life * 2);
    ctx.font = 'bold 24px "Segoe UI", sans-serif'; ctx.textAlign = 'center';
    ctx.strokeStyle = 'rgba(0,0,0,0.7)'; ctx.lineWidth = 4;
    ctx.strokeText(ft.text, ft.x, ft.y);
    ctx.fillStyle = ft.color;
    ctx.fillText(ft.text, ft.x, ft.y);
  }
  ctx.globalAlpha = 1;

  drawUI(ctx);
  if (state.current === S.REELING) drawReelUI(ctx);
  drawHints(ctx, state);
}

function drawSwipeIndicator(ctx) {
  const sw = state.swipe;
  const dx = sw.curX - sw.startX; const dy = sw.curY - sw.startY;
  if (Math.hypot(dx, dy) < 20) return;
  ctx.strokeStyle = 'rgba(255, 255, 100, 0.6)'; ctx.lineWidth = 3; ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.moveTo(rod.tipX, rod.tipY);
  ctx.quadraticCurveTo((rod.tipX + sw.curX) / 2, Math.min(rod.tipY, sw.curY) - 50, sw.curX, sw.curY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.strokeStyle = 'rgba(255, 255, 100, 0.8)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(sw.curX, sw.curY, 20, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(sw.curX, sw.curY, 4, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 100, 0.8)'; ctx.fill();
}
