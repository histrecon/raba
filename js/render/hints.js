import { W, H, S } from '../config.js';

export function drawHints(ctx, state) {
  ctx.font = 'bold 18px "Segoe UI", sans-serif'; ctx.textAlign = 'center';
  let hint = '', color = '#fff';
  switch (state.current) {
    case S.IDLE: hint = '👆 Нажми на воду или свайпни вниз'; break;
    case S.WAITING: hint = '⏳ Ждём поклёвки...'; break;
    case S.BITE: hint = '❗ КЛЮЁТ! Скорее нажми!'; color = '#ffdd44'; break;
    case S.RETURNING: hint = '✨ Тянешь улов...'; break;
    case S.RESULT: hint = '👉 Нажми, чтобы продолжить'; break;
    case S.BOSS_INSTRUCTION: hint = '📖 Прочти инструкцию и жми «В БОЙ!»'; color = '#ff8888'; break;
    case S.BOSS_INTRO: hint = '🐋 ИЗ ВОДЫ ПОКАЗАЛСЯ ГИГАНТСКИЙ СОМ!'; color = '#ff4444'; break;
    case S.BOSS_QTE: hint = '⌨️ НАЖИМАЙ КНОПКИ!'; color = '#ffdd44'; break;
    case S.BOSS_DEATH: hint = '💀 СОМ УТАЩИЛ ТЕБЯ В ОМУТ!'; color = '#ff4444'; break;
    case S.BOSS_WIN: hint = '🏆 ТЫ ОДОЛЕЛ РЕЧНОГО МОНСТРА!'; color = '#ffd700'; break;
  }
  if (hint && state.current !== S.BOSS_INSTRUCTION) {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.beginPath(); ctx.roundRect(W / 2 - 230, H - 55, 460, 38, 10); ctx.fill();
    ctx.fillStyle = color;
    ctx.fillText(hint, W / 2, H - 30);
  }
}
