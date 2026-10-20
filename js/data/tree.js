export const TREE_DATA = {
  body: {
    name: 'Тело удилища', icon: '🎣',
    levels: [
      { name: 'Бамбук', desc: 'Классическая бамбуковая палка', cost: 0, bonus: 0, requires: null },
      { name: 'Телескоп', desc: 'Стеклопластик, удобно носить', cost: 300, bonus: 0.05, requires: null },
      { name: 'Карбон', desc: 'Лёгкий и прочный карбон', cost: 1200, bonus: 0.10, requires: { branch: 'line', level: 1 } },
      { name: 'Спиннинг', desc: 'Профессиональная снасть', cost: 3000, bonus: 0.15, requires: { branch: 'reel', level: 2 } },
      { name: 'Фидер', desc: 'Английская донная снасть', cost: 6000, bonus: 0.20, requires: { branch: 'line', level: 2 } }
    ]
  },
  line: {
    name: 'Леска', icon: '🧵',
    levels: [
      { name: 'Монофил', desc: 'Обычная леска', cost: 0, bonus: 0, requires: null },
      { name: 'Флюорокарбон', desc: 'Менее заметна в воде', cost: 200, bonus: 0.1, requires: null },
      { name: 'Плетёнка', desc: 'Крепкая и прочная', cost: 800, bonus: 0.2, requires: { branch: 'reel', level: 1 } },
      { name: 'Нанофил', desc: 'Тонкая, но невероятно прочная', cost: 2500, bonus: 0.35, requires: { branch: 'reel', level: 2 } }
    ]
  },
  float: {
    name: 'Поплавок', icon: '🎈',
    levels: [
      { name: 'Перо', desc: 'Классический гусиный поплавок', cost: 0, bonus: 0, requires: null },
      { name: 'Пластик', desc: 'Яркий и прочный', cost: 150, bonus: 0.15, requires: null },
      { name: 'Светящийся', desc: 'Виден даже ночью', cost: 600, bonus: 0.3, requires: null },
      { name: 'Эхолот', desc: 'Показывает рыбу под водой', cost: 2000, bonus: 0.5, requires: { branch: 'hook', level: 2 } }
    ]
  },
  hook: {
    name: 'Крючок', icon: '🪝',
    levels: [
      { name: 'Обычный', desc: 'Стандартный крючок', cost: 0, bonus: 0, requires: null },
      { name: 'Кованый', desc: 'Не разгибается', cost: 250, bonus: 0.1, requires: null },
      { name: 'С кольцом', desc: 'Для крупной рыбы', cost: 1000, bonus: 0.25, requires: { branch: 'line', level: 1 } },
      { name: 'Двойной', desc: 'Двойная зацепка', cost: 3000, bonus: 0.4, requires: { branch: 'line', level: 2 } }
    ]
  },
  keeper: {
    name: 'Садок', icon: '🧺',
    levels: [
      { name: 'Сетка', desc: 'Простая сетка', cost: 0, bonus: 0, requires: null },
      { name: 'Ведро', desc: 'Вместительное ведро', cost: 200, bonus: 0.1, requires: null },
      { name: 'Садок', desc: 'Профессиональный садок', cost: 800, bonus: 0.2, requires: null },
      { name: 'Морозильник', desc: 'Сохраняет улов свежим', cost: 2500, bonus: 0.3, requires: { branch: 'body', level: 2 } }
    ]
  },
  reel: {
    name: 'Катушка', icon: '⚙️',
    levels: [
      { name: 'Инерционная', desc: 'Простая катушка', cost: 0, bonus: 0, requires: null },
      { name: 'Безынерционная', desc: 'Плавный ход', cost: 400, bonus: 0.15, requires: null },
      { name: 'Мультипликаторная', desc: 'Для троллинга', cost: 1800, bonus: 0.3, requires: { branch: 'body', level: 1 } }
    ]
  },
  handle: {
    name: 'Рукоять', icon: '🪵',
    levels: [
      { name: 'Дерево', desc: 'Деревянная рукоять', cost: 0, bonus: 0, requires: null },
      { name: 'Пробка', desc: 'Удобная пробка', cost: 300, bonus: 0.05, requires: null },
      { name: 'Неопрен', desc: 'Не скользит в руке', cost: 1200, bonus: 0.1, requires: null }
    ]
  },
  net: {
    name: 'Подсачек', icon: '🥅',
    levels: [
      { name: 'Без подсачека', desc: 'Рискованно', cost: 0, bonus: 0, requires: null },
      { name: 'Мелкий', desc: 'Для мелочи', cost: 150, bonus: 0.05, requires: null },
      { name: 'Крупный', desc: 'Для трофеев', cost: 700, bonus: 0.15, requires: null }
    ]
  },
  bait: {
    name: 'Прикормка', icon: '🌾',
    levels: [
      { name: 'Без прикормки', desc: 'Как есть', cost: 0, bonus: 0, requires: null },
      { name: 'Хлеб', desc: 'Простая прикормка', cost: 100, bonus: 0.1, requires: null },
      { name: 'Смесь', desc: 'Специальная смесь', cost: 500, bonus: 0.2, requires: null }
    ]
  }
};
