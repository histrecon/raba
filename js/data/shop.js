export const SHOP_ITEMS = [
  { id: 'reel', name: '⚡ Скорость', desc: 'Замедляет индикатор', max: 5, baseCost: 50, costMult: 2 },
  { id: 'zone', name: '🎯 Зона', desc: 'Шире зелёная зона', max: 5, baseCost: 60, costMult: 2 },
  { id: 'luck', name: '🍀 Удача', desc: 'Меньше мусора', max: 5, baseCost: 80, costMult: 2.5 },
  { id: 'bait', name: '🪱 Наживка', desc: '×3 шанс редкой рыбы. Тратится при улове.', max: 99, baseCost: 150, costMult: 1, isConsumable: true }
];

export function getShopCost(item, upgrades) {
  if (item.isConsumable) return item.baseCost;
  const currentLvl = upgrades[item.id] || 0;
  return Math.floor(item.baseCost * Math.pow(item.costMult, currentLvl));
}
