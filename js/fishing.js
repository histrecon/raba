import { S } from './config.js';
import { save, persistSave } from './save.js';
import { state, rod, bobber } from './state.js';
import { getWeather } from './weather.js';
import { addParticles, addRipple, addFloatingText, vibrate } from './utils.js';
import { playSound } from './audio.js';
import { FISH_TYPES, FISH_ONLY, TRASH_ONLY } from './data/fish.js';
import { TREE_DATA } from './data/tree.js';
import { checkNewAchievements } from './catalog.js';
import { checkBossTrigger, startBossFight } from './boss.js';
import { W, H } from './config.js';

export function castRod(mx, my) {
  if (checkBossTrigger() && !save.bossDefeated) {
    state.current = S.BOSS_INSTRUCTION;
    state.time = 0;
    document.getElementById('bossInstruction').classList.add('show');
    return;
  }
  bobber.x = rod.tipX; bobber.y = rod.tipY;
  bobber.tx = Math.max(300, Math.min(W - 60, mx));
  bobber.ty = Math.max(340, Math.min(H - 60, my));
  const dx = bobber.tx - bobber.x, dy = bobber.ty - bobber.y;
  const dist = Math.hypot(dx, dy);
  const flightTime = Math.max(0.3, dist / 900);
  bobber.vx = dx / flightTime; bobber.vy = dy / flightTime - 400 * flightTime;
  state.current = S.CASTING; state.time = 0;
  playSound('cast'); vibrate(30);
}

export function startReeling() {
  state.current = S.REELING; state.time = 0;
  state.reelPos = 0; state.lastReelSoundTime = 0;

  const lineBonus = (TREE_DATA.line.levels[save.treeUpgrades.line || 0]?.bonus || 0);
  const keeperBonus = (TREE_DATA.keeper.levels[save.treeUpgrades.keeper || 0]?.bonus || 0);
  const reelBonus = (TREE_DATA.reel.levels[save.treeUpgrades.reel || 0]?.bonus || 0);
  const netBonus = (TREE_DATA.net.levels[save.treeUpgrades.net || 0]?.bonus || 0);

  let speedReduction = (save.upgrades.reel || 0) * 0.15 + lineBonus + reelBonus;
  if (save.achievements.trashman) speedReduction += 0.15;
  if (save.achievements.rodmaster) speedReduction += 0.10;
  let difficultyMultiplier = 1;
  if (state.catchStreak >= 3) difficultyMultiplier = 1 + (state.catchStreak - 2) * 0.15;
  if (state.missStreak >= 2) difficultyMultiplier = Math.max(0.5, 1 - (state.missStreak - 1) * 0.2);
  state.reelSpeed = (85 + Math.random() * 40) * Math.max(0.2, 1 - speedReduction) * difficultyMultiplier;

  state.zoneStart = 35 + Math.random() * 25;
  let baseZone = 18 + Math.random() * 12;
  let bonusZone = (save.upgrades.zone || 0) * 4;
  if (save.achievements.trashman) bonusZone += 4;
  let finalZone = baseZone + bonusZone + (keeperBonus * 20) + (netBonus * 10);
  if (state.catchStreak >= 3) finalZone *= 0.8;
  if (state.missStreak >= 2) finalZone *= 1.3;
  state.zoneEnd = Math.min(95, state.zoneStart + finalZone);

  addParticles(bobber.x, bobber.y, '#fff', 15);
  addRipple(bobber.x, bobber.y);
  vibrate(80);
}

export function pickFish() {
  const w = getWeather();
  const trashMult = getTrashMultiplier();
  const allTrashCollected = TRASH_ONLY.every(f => save.catalog[f.name] > 0);
  const rareBonus = (TREE_DATA.hook.levels[save.treeUpgrades.hook || 0]?.bonus || 0);
  const netBonus = (TREE_DATA.net.levels[save.treeUpgrades.net || 0]?.bonus || 0);

  const adjusted = FISH_TYPES.map(f => {
    let weight = f.baseWeight;
    if (f.isTrash) {
      weight *= trashMult * (1 - netBonus);
      if (allTrashCollected) {
        const luckReduction = 1 - (save.upgrades.luck || 0) * 0.15;
        weight *= Math.max(0.05, luckReduction);
      } else {
        weight = Math.max(1, weight);
      }
    }
    if (w === 'night') {
      if (f.name === 'Сом' || f.name === 'Угорь') weight *= 3;
      if (f.name === 'Золотая рыбка') weight = 0;
    } else if (w === 'sunset') {
      if (f.name === 'Золотая рыбка') weight *= 3;
      if (f.name === 'Щука') weight *= 1.5;
    } else if (w === 'fog') {
      if (!f.isTrash) weight *= 1.5;
    } else if (w === 'rain') {
      if (f.isTrash) weight *= 1.2;
    }
    if (save.baitCount > 0 && !f.isTrash && f.isRare) weight *= 3;
    if (!f.isTrash && f.isRare) weight *= (1 + rareBonus);
    if (w === 'night' && save.achievements.night && !f.isTrash && f.isRare) weight *= 1.05;
    return { ...f, weight };
  });

  const total = adjusted.reduce((s, f) => s + f.weight, 0);
  let r = Math.random() * total;
  for (const f of adjusted) { r -= f.weight; if (r <= 0) return f; }
  return adjusted[0];
}

function getTrashMultiplier() {
  const caughtCount = Object.values(save.catalog).reduce((a, b) => a + b, 0);
  if (caughtCount < 10) return 2.5;
  if (caughtCount < 25) return 1.8;
  if (caughtCount < 50) return 1.3;
  return 0.8;
}

export function calcPoints(fish) {
  const bodyBonus = TREE_DATA.body.levels[save.treeUpgrades.body || 0]?.bonus || 0;
  const handleBonus = TREE_DATA.handle.levels[save.treeUpgrades.handle || 0]?.bonus || 0;
  let points = fish.pts;
  if (save.achievements.collector) points = Math.floor(points * 1.1);
  if (save.achievements.pro) points = Math.floor(points * 1.05);
  if (save.achievements.millionaire) points = Math.floor(points * 1.02);
  points = Math.floor(points * (1 + bodyBonus + handleBonus));
  return points;
}

export function checkReel() {
  if (state.reelPos >= state.zoneStart && state.reelPos <= state.zoneEnd) {
    state.catchStreak++; state.missStreak = 0;
    const fish = pickFish();
    state.lastCatch = fish;
    const points = calcPoints(fish);

    save.score += points; save.totalCaught++;
    if (save.score > save.bestScore) save.bestScore = save.score;
    if (save.baitCount > 0) save.baitCount--;

    addToCatalogInternal(fish.name);
    state.current = S.RETURNING; state.time = 0;
    addParticles(bobber.x, bobber.y, fish.color, 25, 6);
    addRipple(bobber.x, bobber.y);
    addFloatingText(`+${points}`, bobber.x, bobber.y - 20, fish.color);
    if (fish.isRare) { playSound('rare'); vibrate([50, 30, 50, 30, 100]); }
    else { playSound('catch'); vibrate(50); }

    persistSave();
    checkNewAchievements();
  } else {
    state.catchStreak = 0; state.missStreak++;
    state.current = S.RESULT; state.time = 0;
    addFloatingText('Сорвалась!', bobber.x, bobber.y - 20, '#ff6666');
    playSound('miss'); vibrate([50, 50, 50]);
  }
}

function addToCatalogInternal(name) {
  if (!save.catalog[name]) save.catalog[name] = 0;
  save.catalog[name]++;
  if (getWeather() === 'night') save.achievements.nightCount = (save.achievements.nightCount || 0) + 1;
}

export function resetToIdle() { state.current = S.IDLE; state.time = 0; state.lastCatch = null; }

export function updateFishing(dt, t) {
  if (state.current === S.CASTING) {
    bobber.x += bobber.vx * dt; bobber.y += bobber.vy * dt; bobber.vy += 800 * dt;
    if (bobber.y >= bobber.ty && bobber.vy > 0) {
      bobber.y = bobber.ty; state.current = S.WAITING; state.time = 0;
      bobber.waitSeed = 1.5 + Math.random() * 4;
      addRipple(bobber.x, bobber.y); addParticles(bobber.x, bobber.y, '#aaddff', 10);
      playSound('splash'); vibrate(30);
    }
  } else if (state.current === S.WAITING) {
    bobber.phase += dt * 2;
    if (state.time > (bobber.waitSeed || 3)) {
      state.current = S.BITE; state.time = 0;
      addParticles(bobber.x, bobber.y, '#fff', 20); addRipple(bobber.x, bobber.y);
      playSound('bite'); vibrate([100, 50, 100]);
    }
  } else if (state.current === S.BITE) {
    if (state.time > 0.9) {
      state.current = S.RESULT; state.time = 0;
      addFloatingText('Сорвалась!', bobber.x, bobber.y - 30, '#ff6666');
      state.missStreak++;
    }
  } else if (state.current === S.REELING) {
    state.reelPos += state.reelSpeed * dt;
    if (performance.now() - state.lastReelSoundTime > 120) { playSound('reel'); state.lastReelSoundTime = performance.now(); }
    if (state.reelPos > 100) {
      state.current = S.RESULT; state.time = 0;
      addFloatingText('Сорвалась!', bobber.x, bobber.y - 30, '#ff6666');
      state.missStreak++; state.catchStreak = 0;
    }
  } else if (state.current === S.RETURNING) {
    const progress = Math.min(1, state.time / 0.8);
    const ease = 1 - Math.pow(1 - progress, 3);
    bobber.x = bobber.tx + (rod.tipX - bobber.tx) * ease;
    bobber.y = bobber.ty + (rod.tipY - bobber.ty) * ease;
    if (progress >= 1) { state.current = S.RESULT; state.time = 0; }
  } else if (state.current === S.RESULT) {
    if (state.time > 2) resetToIdle();
  }
}
