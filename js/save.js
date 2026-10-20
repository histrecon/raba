import { STORAGE_KEYS, SCHEMA_VERSION } from './config.js';

// Глобальное состояние загружается сюда. Другие модули читают/пишут через него.
export const save = {
  score: 0, bestScore: 0, totalCaught: 0,
  catalog: {}, upgrades: { reel: 0, zone: 0, luck: 0 },
  baitCount: 0, encyclopedia: {}, achievements: {},
  bossDefeated: false, hasHarpoon: false, harpoonInShop: false, bossMet: false,
  treeUpgrades: { body: 0, line: 0, float: 0, hook: 0, keeper: 0, reel: 0, handle: 0, net: 0, bait: 0 },
  character: null,
  soundEnabled: true
};

export function loadSave() {
  const K = STORAGE_KEYS;

  // ---- МИГРАЦИЯ СТАРЫХ СОХРАНЕНИЙ ----
  // Если fishHasBait === 'true' и fishBaitCount отсутствует — переносим как 1 наживку.
  // Старый ключ не удаляем, чтобы откат был безопасным.
  const oldBait = localStorage.getItem(K.oldHasBait);
  const newBait = localStorage.getItem(K.baitCount);
  if (newBait === null && oldBait === 'true') {
    localStorage.setItem(K.baitCount, '1');
  }

  // Если схема ещё не проставлена — ставим текущую (данные уже совместимы)
  const v = parseInt(localStorage.getItem(K.schemaVersion) || '1');
  if (v < SCHEMA_VERSION) {
    localStorage.setItem(K.schemaVersion, String(SCHEMA_VERSION));
  }

  // ---- ЗАГРУЗКА ----
  save.score = parseInt(localStorage.getItem(K.score) || '0');
  save.bestScore = parseInt(localStorage.getItem(K.best) || '0');
  save.totalCaught = parseInt(localStorage.getItem(K.total) || '0');
  save.catalog = safeJSON(K.catalog, {});
  save.upgrades = safeJSON(K.upgrades, { reel: 0, zone: 0, luck: 0 });
  save.baitCount = parseInt(localStorage.getItem(K.baitCount) || '0');
  save.encyclopedia = safeJSON(K.encyclopedia, {});
  save.achievements = safeJSON(K.achievements, {});
  save.bossDefeated = localStorage.getItem(K.bossDefeated) === 'true';
  save.hasHarpoon = localStorage.getItem(K.hasHarpoon) === 'true';
  save.harpoonInShop = localStorage.getItem(K.harpoonInShop) === 'true';
  save.bossMet = localStorage.getItem(K.bossMet) === 'true';
  save.treeUpgrades = safeJSON(K.treeUpgrades, { body: 0, line: 0, float: 0, hook: 0, keeper: 0, reel: 0, handle: 0, net: 0, bait: 0 });
  save.character = localStorage.getItem(K.character) || null;
  save.soundEnabled = localStorage.getItem(K.soundEnabled) !== 'false';
}

export function persistSave() {
  const K = STORAGE_KEYS;
  localStorage.setItem(K.score, save.score);
  localStorage.setItem(K.best, save.bestScore);
  localStorage.setItem(K.total, save.totalCaught);
  localStorage.setItem(K.catalog, JSON.stringify(save.catalog));
  localStorage.setItem(K.upgrades, JSON.stringify(save.upgrades));
  localStorage.setItem(K.baitCount, save.baitCount);
  localStorage.setItem(K.encyclopedia, JSON.stringify(save.encyclopedia));
  localStorage.setItem(K.achievements, JSON.stringify(save.achievements));
  localStorage.setItem(K.bossDefeated, save.bossDefeated);
  localStorage.setItem(K.hasHarpoon, save.hasHarpoon);
  localStorage.setItem(K.harpoonInShop, save.harpoonInShop);
  localStorage.setItem(K.bossMet, save.bossMet);
  localStorage.setItem(K.treeUpgrades, JSON.stringify(save.treeUpgrades));
  if (save.character) localStorage.setItem(K.character, save.character);
  localStorage.setItem(K.soundEnabled, save.soundEnabled);
  localStorage.setItem(K.schemaVersion, String(SCHEMA_VERSION));
}

export function clearSave() {
  localStorage.clear();
}

function safeJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}
