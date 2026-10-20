// Константы игры. Меняй здесь — изменения подхватятся везде.
export const W = 900;
export const H = 600;

export const S = {
  IDLE: 'idle', CASTING: 'casting', WAITING: 'waiting', BITE: 'bite',
  REELING: 'reeling', RETURNING: 'returning', RESULT: 'result',
  BOSS_INSTRUCTION: 'boss_instruction', BOSS_INTRO: 'boss_intro',
  BOSS_QTE: 'boss_qte', BOSS_DEATH: 'boss_death', BOSS_WIN: 'boss_win'
};

export const BOSS_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

export const WEATHERS = ['day', 'sunset', 'night', 'rain', 'fog'];
export const WEATHER_ICONS = { day: '☀️', sunset: '🌅', night: '🌙', rain: '🌧️', fog: '🌫️' };
export const WEATHER_DURATION = 45; // секунд реального времени на одну погоду

// Все ключи localStorage в одном месте — чтобы не потерять при миграции
export const STORAGE_KEYS = {
  score: 'fishScore',
  best: 'fishBest',
  total: 'fishTotal',
  catalog: 'fishCatalog',
  upgrades: 'fishUpgrades',
  baitCount: 'fishBaitCount',
  // старый ключ (миграция): fishHasBait -> fishBaitCount
  oldHasBait: 'fishHasBait',
  encyclopedia: 'fishEncyclopedia',
  achievements: 'fishNewAchievements',
  bossDefeated: 'fishBossDefeated',
  hasHarpoon: 'fishHasHarpoon',
  harpoonInShop: 'fishHarpoonInShop',
  bossMet: 'fishBossMet',
  treeUpgrades: 'fishTreeUpgrades',
  character: 'fishCharacter',
  soundEnabled: 'fishSoundEnabled',
  // флаг миграции версии (чтобы не гонять её каждый раз)
  schemaVersion: 'fishSchemaVersion'
};

// Текущая версия схемы сохранений. Поднимай при изменениях формата.
export const SCHEMA_VERSION = 2;
