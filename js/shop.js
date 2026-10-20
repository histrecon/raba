import { save, persistSave } from './save.js';
import { SHOP_ITEMS, getShopCost } from './data/shop.js';
import { TREE_DATA } from './data/tree.js';
import { BOOKS } from './data/books.js';
import { playSound } from './audio.js';
import { vibrate } from './utils.js';
import { checkNewAchievements } from './catalog.js';

export function switchShopTab(tab) {
  save._currentShopTab = tab; // временно в save, либо вынеси в state — см. ниже
  document.getElementById('tabUpgrades').classList.toggle('active', tab === 'upgrades');
  document.getElementById('tabTree').classList.toggle('active', tab === 'tree');
  document.getElementById('tabBooks').classList.toggle('active', tab === 'books');
  renderShop(tab);
}

export function toggleShop() {
  const overlay = document.getElementById('shopOverlay');
  overlay.classList.toggle('show');
  if (overlay.classList.contains('show')) renderShop();
  else document.getElementById('catalogOverlay').classList.remove('show');
}

export function buyUpgrade(id) {
  const item = SHOP_ITEMS.find(i => i.id === id);
  if (!item) return;
  const cost = getShopCost(item, save.upgrades);
  if (save.score < cost) return;
  if (item.isConsumable) {
    save.baitCount++;
  } else {
    if ((save.upgrades[id] || 0) >= item.max) return;
    save.upgrades[id] = (save.upgrades[id] || 0) + 1;
  }
  save.score -= cost;
  playSound('buy'); persistSave(); renderShop(); checkNewAchievements();
}

export function buyBaitPack(count) {
  const item = SHOP_ITEMS.find(i => i.id === 'bait');
  const cost = item.baseCost * count;
  if (save.score < cost) return;
  save.score -= cost;
  save.baitCount += count;
  playSound('buy'); persistSave(); renderShop(); checkNewAchievements();
  vibrate(50);
}

export function buyBook(bookId) {
  const book = BOOKS.find(b => b.id === bookId);
  if (!book || save.encyclopedia[bookId] || save.score < book.cost) return;
  save.score -= book.cost;
  save.encyclopedia[bookId] = true;
  book.opens.forEach(f => { if (!save.catalog[f]) save.catalog[f] = 0; });
  playSound('buy'); persistSave(); renderShop(); checkNewAchievements();
}

export function buyHarpoon() {
  if (save.hasHarpoon || save.score < 1000) return;
  save.score -= 1000;
  save.hasHarpoon = true;
  playSound('buy'); persistSave(); renderShop();
}

export function buyTreeUpgrade(branch, levelIndex) {
  const branchData = TREE_DATA[branch];
  const currentLevel = save.treeUpgrades[branch] || 0;
  if (levelIndex !== currentLevel + 1) return;
  const levelData = branchData.levels[levelIndex];
  if (save.score < levelData.cost) return;
  if (levelData.requires) {
    if ((save.treeUpgrades[levelData.requires.branch] || 0) < levelData.requires.level) return;
  }
  save.score -= levelData.cost;
  save.treeUpgrades[branch] = levelIndex;
  playSound('buy');
  persistSave();
  renderShop();
  checkNewAchievements();
  vibrate(100);
}

let currentTab = 'upgrades';

export function renderShop(tab) {
  if (tab) currentTab = tab;
  document.getElementById('shopScore').textContent = save.score;
  const container = document.getElementById('shopItems');

  if (currentTab === 'upgrades') {
    container.innerHTML = SHOP_ITEMS.map(item => {
      const cost = getShopCost(item, save.upgrades);
      if (item.isConsumable) {
        const canBuy1 = save.score >= cost;
        const canBuy5 = save.score >= cost * 5;
        const canBuy10 = save.score >= cost * 10;
        return `
          <div class="shop-item ${save.baitCount > 0 ? 'owned' : ''}">
            <div class="icon">${item.name.split(' ')[0]}</div>
            <div class="info">
              <div class="name">${item.name.substring(2)} <span style="color:#ffd700;">(в запасе: ${save.baitCount})</span></div>
              <div class="desc">${item.desc}</div>
            </div>
            <div class="bait-buy-row">
              <button class="buy-btn" data-buy-bait="1" ${canBuy1 ? '' : 'disabled'}>×1<br>${cost}</button>
              <button class="buy-btn" data-buy-bait="5" ${canBuy5 ? '' : 'disabled'}>×5<br>${cost * 5}</button>
              <button class="buy-btn" data-buy-bait="10" ${canBuy10 ? '' : 'disabled'}>×10<br>${cost * 10}</button>
            </div>
          </div>`;
      }
      const lvl = save.upgrades[item.id] || 0;
      const isMax = lvl >= item.max;
      const canBuy = !isMax && save.score >= cost;
      return `
        <div class="shop-item">
          <div class="icon">${item.name.split(' ')[0]}</div>
          <div class="info"><div class="name">${item.name.substring(2)} (ур. ${lvl}/${item.max})</div><div class="desc">${item.desc}</div></div>
          <button class="buy-btn" data-buy-upgrade="${item.id}" ${canBuy ? '' : 'disabled'}>${isMax ? 'MAX' : `Купить (${cost})`}</button>
        </div>`;
    }).join('');
  } else if (currentTab === 'tree') {
    let html = '';
    for (const [branchKey, branchData] of Object.entries(TREE_DATA)) {
      const currentLevel = save.treeUpgrades[branchKey] || 0;
      html += `<div class="tree-branch">`;
      html += `<div class="tree-branch-title">${branchData.icon} ${branchData.name}</div>`;
      html += `<div class="tree-nodes">`;
      branchData.levels.forEach((level, idx) => {
        const isUnlocked = idx <= currentLevel;
        const isNext = idx === currentLevel + 1;
        let reqMet = true, reqText = '';
        if (level.requires) {
          const reqLvl = save.treeUpgrades[level.requires.branch] || 0;
          if (reqLvl < level.requires.level) {
            reqMet = false;
            const reqName = TREE_DATA[level.requires.branch].name;
            const reqLevelName = TREE_DATA[level.requires.branch].levels[level.requires.level].name;
            reqText = `Требуется: ${reqName} — ${reqLevelName}`;
          }
        }
        const canBuy = isNext && reqMet && save.score >= level.cost;
        const bonusText = level.bonus > 0 ? `+${Math.round(level.bonus * 100)}% к эффективности` : 'Базовая экипировка';
        let nodeClass = 'tree-node';
        if (isUnlocked) nodeClass += ' unlocked';
        else if (isNext) nodeClass += ' next';
        else nodeClass += ' locked';
        html += `
          <div class="${nodeClass}">
            <div class="node-icon">${isUnlocked ? '✅' : '🔒'}</div>
            <div class="node-info">
              <div class="node-name">${level.name} <span class="node-level">Ур. ${idx}</span></div>
              <div class="node-desc">${level.desc}</div>
              <div class="node-bonus">${bonusText}</div>
              ${!reqMet ? `<div class="node-req">${reqText}</div>` : ''}
            </div>
            ${isUnlocked
              ? `<button class="buy-btn owned-btn" disabled>✓ Куплено</button>`
              : `<button class="buy-btn" data-buy-tree="${branchKey}|${idx}" ${canBuy ? '' : 'disabled'}>Купить (${level.cost})</button>`
            }
          </div>`;
      });
      html += `</div></div>`;
    }
    if (save.harpoonInShop && !save.hasHarpoon) {
      html += `
        <div class="tree-branch" style="border-color:rgba(255,100,100,0.5); background:rgba(255,100,100,0.1);">
          <div class="tree-branch-title" style="color:#ff8888;">🔱 Спецснаряжение</div>
          <div class="tree-nodes">
            <div class="tree-node" style="border-color:rgba(255,100,100,0.5);">
              <div class="node-icon">🔱</div>
              <div class="node-info">
                <div class="node-name">Острога Рыбака</div>
                <div class="node-desc">Позволяет победить Сома-Гиганта во второй раз</div>
                <div class="node-bonus">Значительно упрощает бой</div>
              </div>
              <button class="buy-btn" data-buy-harpoon ${save.score >= 1000 ? '' : 'disabled'}>Купить (1000)</button>
            </div>
          </div>
        </div>`;
    } else if (save.hasHarpoon) {
      html += `
        <div class="tree-branch" style="border-color:rgba(255,100,100,0.5); background:rgba(255,100,100,0.1);">
          <div class="tree-branch-title" style="color:#ff8888;">🔱 Спецснаряжение</div>
          <div class="tree-nodes">
            <div class="tree-node unlocked">
              <div class="node-icon">✅</div>
              <div class="node-info">
                <div class="node-name">Острога Рыбака</div>
                <div class="node-desc">Куплена и готова к бою!</div>
                <div class="node-bonus">✓ Активна</div>
              </div>
              <button class="buy-btn owned-btn" disabled>✓ Есть</button>
            </div>
          </div>
        </div>`;
    }
    container.innerHTML = html;
  } else if (currentTab === 'books') {
    container.innerHTML = BOOKS.map(book => {
      const owned = save.encyclopedia[book.id];
      const canBuy = !owned && save.score >= book.cost;
      return `
        <div class="shop-item ${owned ? 'owned' : ''}">
          <div class="icon">📕</div>
          <div class="info"><div class="name">${book.name}</div><div class="desc">Открывает: ${book.opens.join(', ')}</div></div>
          <button class="buy-btn" data-buy-book="${book.id}" ${canBuy ? '' : 'disabled'}>${owned ? '✓ Куплено' : `Купить (${book.cost})`}</button>
        </div>`;
    }).join('');
  }
}
