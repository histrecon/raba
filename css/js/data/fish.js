export const FISH_DESCRIPTIONS = {
  'Окунь':         { where: 'Мелководье', when: 'День, закат', how: 'Клюёт часто. Идеален для новичков.' },
  'Карась':        { where: 'Заводи', when: 'День', how: 'Медленно берёт, но стабильно.' },
  'Щука':          { where: 'У камышей', when: 'Закат, туман', how: 'Хищник. Шанс выше на закате.' },
  'Сом':           { where: 'Глубина', when: 'Ночь', how: 'Редкий. Ночью шанс ×3.' },
  'Золотая рыбка': { where: 'Глубина', when: 'Закат', how: 'Очень редкая. На закате шанс ×3. Не клюёт ночью.' },
  'Форель':        { where: 'Холодная вода', when: 'День', how: 'Любит прохладную воду.' },
  'Лещ':           { where: 'Омуты', when: 'День', how: 'Стайная рыба.' },
  'Ёрш':           { where: 'Песчаное дно', when: 'Любое', how: 'Мелкая рыба, ловится всегда.' },
  'Плотва':        { where: 'Поверхность', when: 'День', how: 'Мелкая, но частая.' },
  'Карп':          { where: 'Глубина', when: 'Закат, туман', how: 'Редкий. Требует наживки.' },
  'Угорь':         { where: 'Коряги', when: 'Ночь', how: 'Редкий. Ночью шанс ×3.' },
  'Ботинок':       { where: 'Дно', when: 'Любое', how: 'Мусор. Хорошо клюёт в начале.' },
  'Бутылка':       { where: 'Дно', when: 'Дождь', how: 'Мусор. В дождь чаще.' },
  'Шина':          { where: 'Дно', when: 'Любое', how: 'Крупный мусор.' },
  'Банка':         { where: 'Дно', when: 'Любое', how: 'Мелкий мусор.' }
};

export const FISH_TYPES = [
  { name: 'Окунь',         color: '#e8a020', size: 25, pts: 10,  baseWeight: 30, emoji: '🐟', isTrash: false, isRare: false },
  { name: 'Карась',        color: '#d4b048', size: 30, pts: 15,  baseWeight: 25, emoji: '🐠', isTrash: false, isRare: false },
  { name: 'Щука',          color: '#4a8a3a', size: 45, pts: 30,  baseWeight: 15, emoji: '🦈', isTrash: false, isRare: false },
  { name: 'Сом',           color: '#5a4a3a', size: 55, pts: 50,  baseWeight: 8,  emoji: '🐋', isTrash: false, isRare: true },
  { name: 'Золотая рыбка', color: '#ffd700', size: 25, pts: 100, baseWeight: 2,  emoji: '✨', isTrash: false, isRare: true },
  { name: 'Форель',        color: '#c08060', size: 35, pts: 40,  baseWeight: 4,  emoji: '🐡', isTrash: false, isRare: false },
  { name: 'Лещ',           color: '#8a7a5a', size: 38, pts: 25,  baseWeight: 5,  emoji: '🎏', isTrash: false, isRare: false },
  { name: 'Ёрш',           color: '#6a7a8a', size: 20, pts: 8,   baseWeight: 6,  emoji: '🐟', isTrash: false, isRare: false },
  { name: 'Плотва',        color: '#aab0a0', size: 22, pts: 12,  baseWeight: 8,  emoji: '🐠', isTrash: false, isRare: false },
  { name: 'Карп',          color: '#b08040', size: 50, pts: 60,  baseWeight: 2,  emoji: '🐳', isTrash: false, isRare: true },
  { name: 'Угорь',         color: '#4a5a4a', size: 60, pts: 70,  baseWeight: 3,  emoji: '🐍', isTrash: false, isRare: true },
  { name: 'Ботинок',       color: '#3a3a3a', size: 35, pts: 1,   baseWeight: 6,  emoji: '👢', isTrash: true, isRare: false },
  { name: 'Бутылка',       color: '#4a8a4a', size: 28, pts: 1,   baseWeight: 6,  emoji: '🍾', isTrash: true, isRare: false },
  { name: 'Шина',          color: '#1a1a1a', size: 45, pts: 1,   baseWeight: 6,  emoji: '🛞', isTrash: true, isRare: false },
  { name: 'Банка',         color: '#8a8a9a', size: 20, pts: 1,   baseWeight: 6,  emoji: '🥫', isTrash: true, isRare: false }
];

export const FISH_ONLY = FISH_TYPES.filter(f => !f.isTrash);
export const TRASH_ONLY = FISH_TYPES.filter(f => f.isTrash);
