import { save, persistSave, clearSave } from './save.js';
import { state } from './state.js';

export function resetProgress() {
  save.score = 0; save.bestScore = 0; save.totalCaught = 0;
  save.catalog = {}; save.upgrades = { reel: 0, zone: 0, luck: 0 };
  save.baitCount = 0;
  save.encyclopedia = {}; save.achievements = {};
  save.bossDefeated = false; save.hasHarpoon = false; save.harpoonInShop = false; save.bossMet = false;
  save.treeUpgrades = { body: 0, line: 0, float: 0, hook: 0, keeper: 0, reel: 0, handle: 0, net: 0, bait: 0 };
  save.character = null;
  save.soundEnabled = true;

  state.catchStreak = 0; state.missStreak = 0;

  clearSave();
  // после clearSave ставим только schemaVersion, чтобы миграция не сработала повторно
  localStorage.setItem('fishSchemaVersion', '2');
  localStorage.setItem('fishSoundEnabled', 'true');
}
