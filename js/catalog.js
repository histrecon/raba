import { save, persistSave } from './save.js';
import { ACHV_LIST } from './data/achievements.js';
import { FISH_ONLY, TRASH_ONLY, FISH_DESCRIPTIONS } from './data/fish.js';
import { BOOKS } from './data/books.js';
import { playSound } from './audio.js';
import { vibrate } from './utils.js';

export function isFishKnown(fishName) {
  if (save.catalog[fishName] > 0) return true;
  for (const book of BOOKS) {
    if (save.encyclopedia[book.id] && book.opens.includes(fishName)) return true;
  }
  return false;
}

export function checkNewAchievements() {
  for (const a of ACHV_LIST) {
    if (!save.achievements[a.id] && a.check()) {
      save.achievements[a.id] = true;
      persistSave();
      if (!a.secret || save.bossMet) {
        showAchievementToast(a.name);
        playSound('achv');
        vibrate([100, 50, 100, 50, 200]);
      }
    }
  }
}

export function showAchievementToast(text) {
  const el = document.getElementById('achvToast');
  el.innerHTML = `🏆 Достижение!<br><span style="font-size:11px;">${text}</span>`;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3000);
}

export function toggleCatalog() {
  const overlay = document.getElementById('catalogOverlay');
  overlay.classList.toggle('show');
  if (overlay.classList.contains('show')) renderCatalog();
  else document.getElementById('shopOverlay').classList.remove('show');
}

export function renderCatalog() {
  document.getElementById('fishGrid').innerHTML = FISH_ONLY.map(f => {
    const count = save.catalog[f.name] || 0;
    const known = isFishKnown(f.name);
    const desc = FISH_DESCRIPTIONS[f.name];
    return `<div class="fish-card ${count > 0 ? 'caught' : ''} ${known && count === 0 ? 'known' : ''}">
        <span class="emoji">${f.emoji}</span><div class="name">${known ? f.name : '???'}</div>
        <div class="pts">${count > 0 ? '+' + f.pts + ' ×' + count : (known ? 'не поймана' : '')}</div>
        ${known && desc ? `<div class="desc">📍 ${desc.where}<br>⏰ ${desc.when}<br>💡 ${desc.how}</div>` : ''}
      </div>`;
  }).join('');

  document.getElementById('trashGrid').innerHTML = TRASH_ONLY.map(f => {
    const count = save.catalog[f.name] || 0;
    const known = isFishKnown(f.name);
    const desc = FISH_DESCRIPTIONS[f.name];
    return `<div class="fish-card trash-card ${count > 0 ? 'caught' : ''} ${known && count === 0 ? 'known' : ''}">
        <span class="emoji">${f.emoji}</span><div class="name">${known ? f.name : '???'}</div>
        <div class="pts">${count > 0 ? '🗑 ×' + count : (known ? 'не найден' : '')}</div>
        ${known && desc ? `<div class="desc">📍 ${desc.where}<br>⏰ ${desc.when}<br>💡 ${desc.how}</div>` : ''}
      </div>`;
  }).join('');

  document.getElementById('achvGrid').innerHTML = ACHV_LIST.map(a => {
    const done = save.achievements[a.id];
    const isSecret = a.secret && !save.bossMet;
    let pct = 0;
    if (a.id === 'pro') pct = Math.min(save.totalCaught, 100);
    else if (a.id === 'night') pct = Math.min((save.achievements.nightCount || 0), 10) * 10;
    else if (a.id === 'millionaire') pct = Math.min(save.bestScore / 5000 * 100, 100);
    else if (a.id === 'rodmaster') {
      const TREE_KEYS = Object.keys(requireTree());
      pct = TREE_KEYS.filter(k => save.treeUpgrades[k] >= requireTree()[k].levels.length - 1).length / TREE_KEYS.length * 100;
    }
    else if (a.id === 'collector') pct = FISH_ONLY.filter(f => save.catalog[f.name] > 0).length / FISH_ONLY.length * 100;
    else if (a.id === 'trashman') pct = TRASH_ONLY.filter(f => save.catalog[f.name] > 0).length / TRASH_ONLY.length * 100;
    else if (a.id === 'leviathan') pct = save.bossDefeated ? 100 : 0;

    if (isSecret) {
      return `<div class="achv secret">
        <div class="title">❓ Секретное достижение</div>
        <div class="desc">Продолжайте играть, чтобы узнать...</div>
        <div class="progress-bar"><div class="progress-fill" style="width:0%"></div></div>
      </div>`;
    }

    return `<div class="achv ${done ? 'done' : ''} ${a.secret ? 'secret' : ''}">
        <div class="title">${a.name}</div><div class="desc">${a.desc}</div>
        <div class="desc" style="margin-top:2px;">Прогресс: ${a.progress()}</div>
        ${done ? `<div class="bonus">✓ ${a.bonus}</div>` : `<div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>`}
      </div>`;
  }).join('');
}

// Ленивый импорт дерева, чтобы избежать цикла
function requireTree() {
  // eslint-disable-next-line
  return window.__TREE_DATA_CACHE__ || {};
}
