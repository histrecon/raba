import { FISH_ONLY, TRASH_ONLY } from './fish.js';
import { TREE_DATA } from './tree.js';
import { save } from '../save.js';

export const ACHV_LIST = [
  {
    id: 'collector', name: '🏆 Коллекционер', desc: 'Поймать всех рыб', bonus: '+10% к очкам',
    check: () => FISH_ONLY.every(f => save.catalog[f.name] > 0),
    progress: () => FISH_ONLY.filter(f => save.catalog[f.name] > 0).length + '/' + FISH_ONLY.length
  },
  {
    id: 'trashman', name: '🗑️ Мусорщик', desc: 'Собрать весь мусор', bonus: '+15% к скорости вываживания, +4% к зоне',
    check: () => TRASH_ONLY.every(f => save.catalog[f.name] > 0),
    progress: () => TRASH_ONLY.filter(f => save.catalog[f.name] > 0).length + '/' + TRASH_ONLY.length
  },
  {
    id: 'pro', name: '🎣 Рыбак-профи', desc: 'Поймать 100 рыб', bonus: '+5% к очкам',
    check: () => save.totalCaught >= 100,
    progress: () => Math.min(save.totalCaught, 100) + '/100'
  },
  {
    id: 'night', name: '🌙 Ночной охотник', desc: 'Поймать 10 рыб ночью', bonus: '+5% к шансу редкой рыбы ночью',
    check: () => (save.achievements.nightCount || 0) >= 10,
    progress: () => Math.min(save.achievements.nightCount || 0, 10) + '/10'
  },
  {
    id: 'millionaire', name: '💎 Миллионер', desc: 'Накопить 5000 очков', bonus: '+2% к очкам',
    check: () => save.bestScore >= 5000,
    progress: () => Math.min(save.bestScore, 5000) + '/5000'
  },
  {
    id: 'rodmaster', name: '🎣 Мастер удочек', desc: 'Прокачать все ветки дерева', bonus: '+10% к скорости вываживания',
    check: () => Object.keys(TREE_DATA).every(k => save.treeUpgrades[k] >= TREE_DATA[k].levels.length - 1),
    progress: () => Object.keys(TREE_DATA).filter(k => save.treeUpgrades[k] >= TREE_DATA[k].levels.length - 1).length + '/' + Object.keys(TREE_DATA).length
  },
  {
    id: 'leviathan', name: '🐋 Убийца Сома-Гиганта', desc: 'Секретное достижение', bonus: '+5000 очков',
    check: () => save.bossDefeated,
    progress: () => save.bossDefeated ? '✓' : '???',
    secret: true
  }
];
