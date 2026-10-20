import { S, W, H } from './config.js';
import { FISH_ONLY } from './data/fish.js';

// Изменяемое состояние рантайма (не сохраняется)
export const state = {
  current: S.IDLE,
  time: 0,
  catchStreak: 0,
  missStreak: 0,
  lastCatch: null,
  reelPos: 0, zoneStart: 0, zoneEnd: 0, reelSpeed: 85,
  lastReelSoundTime: 0,
  particles: [], rippleEffects: [], floatingTexts: [], bubbles: [], rainDrops: [],
  bgFish: [],
  boss: null,
  qteSequence: [], qteIndex: 0, qteTimer: 0, qteMaxTime: 1.0,
  swipe: { active: false, startX: 0, startY: 0, curX: 0, curY: 0 },
  weatherIndex: 0, weatherTimer: 0, gameTimeMinutes: 6 * 60,
  currentShopTab: 'upgrades'
};

export const rod = { baseX: 100, baseY: 480, tipX: 180, tipY: 380 };
export const bobber = { x: 0, y: 0, tx: 0, ty: 0, vx: 0, vy: 0, phase: 0, mx: 600, my: 450, waitSeed: 3 };

// Фоновые объекты
for (let i = 0; i < 12; i++) {
  state.bgFish.push({
    x: Math.random() * W, y: 340 + Math.random() * 230,
    speed: 0.3 + Math.random() * 0.7, dir: Math.random() > 0.5 ? 1 : -1,
    size: 6 + Math.random() * 10,
    color: FISH_ONLY[Math.floor(Math.random() * FISH_ONLY.length)].color,
    wobble: Math.random() * Math.PI * 2, depth: 0.3 + Math.random() * 0.7
  });
}
for (let i = 0; i < 20; i++) {
  state.bubbles.push({ x: Math.random() * W, y: 340 + Math.random() * 250, size: 1 + Math.random() * 3, speed: 0.2 + Math.random() * 0.5, depth: Math.random() });
}
for (let i = 0; i < 80; i++) {
  state.rainDrops.push({ x: Math.random() * W, y: Math.random() * H, speed: 400 + Math.random() * 400, len: 10 + Math.random() * 20 });
}
