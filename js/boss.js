import { S, BOSS_KEYS, W } from './config.js';
import { save, persistSave } from './save.js';
import { state } from './state.js';
import { FISH_ONLY, TRASH_ONLY } from './data/fish.js';
import { playSound } from './audio.js';
import { vibrate } from './utils.js';

export function checkBossTrigger() {
  if (save.bossDefeated || state.current === S.BOSS_INSTRUCTION || state.current === S.BOSS_INTRO || state.current === S.BOSS_QTE) return false;
  const hasCollector = FISH_ONLY.every(f => save.catalog[f.name] > 0);
  const hasTrashman = TRASH_ONLY.every(f => save.catalog[f.name] > 0);
  const hasPro = save.totalCaught >= 100;
  const hasNight = (save.achievements.nightCount || 0) >= 10;
  return hasCollector && hasTrashman && hasPro && hasNight;
}

export function startBossFromInstruction() {
  document.getElementById('bossInstruction').classList.remove('show');
  startBossFight();
}

export function startBossFight() {
  state.current = S.BOSS_INTRO; state.time = 0;
  state.boss = { x: W / 2, y: 800, targetY: 350, shake: 0 };
  save.bossMet = true;
  persistSave();
  playSound('roar');
  vibrate([200, 100, 200, 100, 300]);
  document.getElementById('qteControls').classList.remove('show');
}

export function startQte() {
  state.qteIndex = 0;
  state.qteSequence = [];
  const isSecondFight = save.hasHarpoon;
  const length = isSecondFight ? 5 : 8;
  const baseTime = isSecondFight ? 1.8 : 0.45;

  for (let i = 0; i < length; i++) {
    state.qteSequence.push({
      key: BOSS_KEYS[Math.floor(Math.random() * BOSS_KEYS.length)],
      time: baseTime
    });
  }
  state.qteMaxTime = baseTime;
  state.qteTimer = baseTime;
  document.getElementById('qteControls').classList.add('show');
}

export function handleQteKey(key) {
  if (state.current !== S.BOSS_QTE) return;
  if (state.qteTimer <= 0) return;
  if (state.qteSequence[state.qteIndex] && state.qteSequence[state.qteIndex].key === key) {
    state.qteIndex++;
    state.qteTimer = state.qteSequence[state.qteIndex] ? state.qteSequence[state.qteIndex].time : 0;
    playSound('buy');
    vibrate(30);
    if (state.qteIndex >= state.qteSequence.length) winBossFight();
  } else {
    loseBossFight();
  }
}

export function winBossFight() {
  state.current = S.BOSS_WIN; state.time = 0;
  save.bossDefeated = true;
  save.score += 5000;
  if (save.score > save.bestScore) save.bestScore = save.score;
  persistSave();
  playSound('achv');
  document.getElementById('qteControls').classList.remove('show');
  showBossAchievement();
  vibrate([100, 50, 100, 50, 300]);
}

export function loseBossFight() {
  state.current = S.BOSS_DEATH; state.time = 0;
  playSound('hurt');
  document.getElementById('qteControls').classList.remove('show');
  vibrate([200, 100, 200]);
  // Обнуляем только коллекцию рыб. totalCaught сохраняется.
  FISH_ONLY.forEach(f => { delete save.catalog[f.name]; });
  save.achievements.collector = false;
  save.harpoonInShop = true;
  persistSave();
}

function showBossAchievement() {
  const el = document.getElementById('achvToast');
  el.innerHTML = `🏆 Достижение!<br><span style="font-size:11px;">Убийца Сома-Гиганта!</span>`;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3000);
}

export function updateBoss(dt, t) {
  if (state.boss) {
    if (state.current === S.BOSS_INTRO) {
      state.boss.y += (state.boss.targetY - state.boss.y) * 0.05;
      state.boss.shake = Math.sin(t * 30) * 5;
      if (state.boss.y > state.boss.targetY + 5) state.boss.y = state.boss.targetY;
    } else if (state.current === S.BOSS_DEATH) {
      state.boss.y += 200 * dt;
    } else if (state.current === S.BOSS_WIN) {
      state.boss.y -= 100 * dt;
    }
  }
  if (state.current === S.BOSS_QTE) {
    state.qteTimer -= dt;
    if (state.qteTimer <= 0) loseBossFight();
  }
}
