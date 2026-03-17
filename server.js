const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const MAX_LEVEL = 30;
const DEFAULT_BALANCE = 1500000;

// ================== ПУЛ ЗАДАНИЙ ==================
const taskTemplates = [
  // ⭐ 1 звезда (класс F) — 42 задания (уже ваши)
  { difficulty: 1, texts: [
    'Эксперимент №F1: Сделать 20 спинов в Sweet Bonanza по 400₽. Зафиксировать результаты.',
    'Эксперимент №F2: приобрести бонус в Pirate‘s Pub за 5 000₽. Оценить эффективность.',
    'Эксперимент №F3: приобрести бонус в Gates of Olympus за 30 000₽.',
    'Эксперимент №F4: выдать двум зрителям по 500₽. Отметить в журнале.',
    'Эксперимент №F5: Узнать можно ли выбить минотавра по 100₽.',
    'Эксперимент №F6: 30 спинов в Coin Up (ставка 500₽).',
    'Эксперимент №F7: протестировать две «радуги» в Le King по 6 000₽.',
    'Эксперимент №F8: Узнать, можно ли окупить бонус Wild West Gold за 4800₽.',
    'Эксперимент №F9: приобрести бонус в RIP City за 8 000₽, узнать можно ли увидеть 3-х котов.',
    'Эксперимент №F10: приобрести топовый бонус в Coin Volcano за 7500₽, записать результаты.',
    'Эксперимент №F11: Протестировать бонус в Cleocatra за 8000₽.',
    'Эксперимент №F12: Увидить х64 в wild skullz.',
    'Эксперимент №F13: Удивите деда! Купите бонус в gates of olympus и окупитесь!',
    'Эксперимент №F14: Узнать мощность поезда Money Train 4 купив бонус за 5к.',
    'Эксперимент №F15: приобрести бонус в Money Train 3 за 5 000₽, записать резлуьтаты.',
    'Эксперимент №F16: Проверка на смелость! Поставьте 10000₽ в любой live игре.',
    'Эксперимент №F17: Узнать вероятность выпадения 10-ки в crazy time поставив на нее 1к пять раз.',
    'Эксперимент №F18: Проверка на жадность! Выдать трём зрителям по 1000₽.',
    'Эксперимент №F19: Узнать вероятность выпадения бонуса в RIP City, 30 спинов по 300₽.',
    'Эксперимент №F20: приобрести топовый бонус в «Мумии» за 10 000₽, записать результаты.',
    'Эксперимент №F21: Узнать вероятность выпадения бонуса в Dog House Multihold, 30 спинов по 500₽.',
    'Эксперимент №F22: приобрести топовый бонус в Big Bass Secrets of the Golden Lake и выбить 4 скаттера.',
    'Эксперимент №F23: Проверить бонус в Release the Kraken за 8 000₽, можно ли в нем окупиться?.',
    'Эксперимент №F24: Отдых! Послушать музыку в in jazz купив бонус по любой цене.',
    'Эксперимент №F25: выбить обычный бонус в Le Fisherman (ставка 300₽).',
    'Эксперимент №F26: Поймать wild на 5-й барабан в Wild West Gold Megaways в бонуске за 6 000₽.',
    'Эксперимент №F27: 30 спинов в Wild West Gold Megaways по 400₽.',
    'Эксперимент №F28: Купить все 3 бонуски 3 Buzzing Wilds и выяснить какая лучше.',
    'Эксперимент №F29: Высосать кровь из вампиров! Окупить бонус в Vampy party.',
    'Эксперимент №F30: Узнать правду о Dog House Royale Hunt, правда ли в топовой бонуске королевская выдача? .',
    'Эксперимент №F31: Учебная поездка на реку! Выбить бонус в любом рыбаке по 500Р.',
    'Эксперимент №F32: Нападение пиратского судна! Пираты хотят забрать наше исследование окупить бонус в Dog House Muttley Crew.',
    'Эксперимент №F33: протестировать две «радуги» в Ze Zeus за 6 000₽.',
    'Эксперимент №F34: Атака наблюдателей! Требование сделать бездепозитное колесо на 5 000₽.',
    'Эксперимент №F35: Атака наблюдателей! Требование сделать депозитное колесо на 5 000₽.',
    'Эксперимент №F36: Атака наблюдателей! Требование сделать депозитное колесо на 5 000₽ один победитель.',
    'Эксперимент №F37: Узнать вероятность выпадения 5 в Crazy Time, сделать три ставки по 5 000Р.',
    'Эксперимент №F38: Удача для наблюдателя! выдать 3 000₽.',
    'Эксперимент №F39: Узнать вкус конфеток в sugar rush, бонус за 8 000₽.',
    'Эксперимент №F40: Узнать о величии богов! Купить бонус в Whisdom of athena за 8000Р.',
    'Эксперимент №F41: Изучение котов! поймать ретригер в Fonzo‘s Feline Fortune (бонус за 4800₽).'
  ]},

  // ⭐⭐ 2 звезды (класс D) — 27 заданий (переработаны)
  { difficulty: 2, texts: [
    'Испытание D1: Поставить 5 000₽ в Crazy Time и выйти в плюс (или заплакать).',
    'Испытание D2: 20 спинов в Hot Fiesta по 1 000₽ — подсчитать количество фиест.',
    'Испытание D3: Купить бонус в Dead or Alive 2 за 8 000₽ и попытаться не умереть от скуки.',
    'Испытание D4: 30 спинов в Sweet Bonanza по 500₽ — найти хотя бы один множитель x5.',
    'Испытание D5: Приобрести бонус в Gates of Olympus за 15 000₽ и задобрить Зевса.',
    'Испытание D6: Поставить 7 000₽ на любое число в рулетке — проверить интуицию.',
    'Испытание D7: 20 спинов в Dead or Alive 2 по 1 000₽ — почувствовать себя ковбоем.',
    'Испытание D8: Выдать 3 000₽ одному зрителю — сделать его счастливым.',
    'Испытание D9: Купить бонус в Big Bass Bonanza за 6 000₽ и поймать золотую рыбку.',
    'Испытание D10: 40 спинов в Book of Dead по 500₽ — найти книгу Ра.',
    'Испытание D11: Поставить 5 000₽ на 5 и 5 000₽ на 10 в Crazy Time — удвоить риск.',
    'Испытание D12: Купить бонус в Money Train 3 за 12 000₽ — доехать до станции "Прибыль".',
    'Испытание D13: 15 спинов в Le Bandit по 2 000₽ — ограбить банк (виртуально).',
    'Испытание D14: Топовый бонус в «Мумии» за 8 000₽ — выбраться из пирамиды живым.',
    'Испытание D15: Купить бонус в Sugar Rush за 10 000₽ — не слипнуться от сладости.',
    'Испытание D16: Бонус Sugar Rush за 6 000₽, выбить >3 скаттеров (или съесть конфету).',
    'Испытание D17: Бонус Six Six Six за 7 000₽ — пройти ад и вернуться.',
    'Испытание D18: Окупить бонус в Le Santa за 5 000₽ — подарок под ёлку.',
    'Испытание D19: Бездепозитное колесо на 7 000₽ (5 минут) — покрутить удачу.',
    'Испытание D20: Депозитное колесо на 5 000₽ (3 минуты) — быстрое счастье.',
    'Испытание D21: Депозитное колесо для зрителей 3 000₽ (1 минута) — раздача.',
    'Испытание D22: Купить бонус в Densho за 6 000₽ и познать дзен.',
    'Испытание D23: Купить бонус в Cloud Princess за 6 000₽ — улететь в облака.',
    'Испытание D24: Бонус в любом «Рыбаке» с первой попытки — насадить червя.',
    'Испытание D25: Поймать линию вилдов в Hand of Midas 2 (бонус от 5 000₽).',
    'Испытание D26: Пройти до лягушки 4x4 в Wild Hop Drop (ставка 10 000₽) — ква-ква.',
    'Испытание D27: Устроить конкурс для зрителей на 5 000₽ — кто громче крикнет.'
  ]},

  // ⭐⭐⭐ 3 звезды (класс C) — 28 заданий
  { difficulty: 3, texts: [
    'Синтез C1: 50 спинов в Gates of Olympus по 1 000₽ — задобрить Зевса дважды.',
    'Синтез C2: Два бонуса в Hot Fiesta за 10 000₽ каждый — устроить латиноамериканскую вечеринку.',
    'Синтез C3: 50 спинов в Fortune of Giza (ставка 1 000₽) — найти фараона.',
    'Синтез C4: Две «радуги» в Le Bandit (ставка от 2 000₽) — поймать удачу за хвост.',
    'Синтез C5: 30 спинов в Minotauros по 1 500₽ — не заблудиться в лабиринте.',
    'Синтез C6: 100 спинов в Gates of Olympus по 500₽ — эпическая битва с богами.',
    'Синтез C7: Бонус в Sweet Bonanza за 15 000₽ — собрать конфетный микс.',
    'Синтез C8: Выиграть 50 000₽ в любом слоте за одну бонуску — джекпот-лайт.',
    'Синтез C9: Поставить 20 000₽ на чёрное и победить — рулетка, детка.',
    'Синтез C10: 50 спинов в Dead or Alive 2 по 2 000₽ — охота на призраков.',
    'Синтез C11: Выдать 2 000₽ пяти зрителям — щедрость за гранью.',
    'Синтез C12: Бонус в Money Train 4 за 25 000₽ — экспресс до богатства.',
    'Синтез C13: Поймать множитель x25 в Sweet Bonanza (бонус от 10 000₽) — сладкий удар.',
    'Синтез C14: Поставить 30 000₽ в рулетке — хайроллер на минималках.',
    'Синтез C15: Выбить бонус в Le King за 50 спинов (ставка от 1 000₽) — коронация.',
    'Синтез C16: Дойти до метки 4x4 в Sky Bounty (бонус от 15 000₽) — космический рейс.',
    'Синтез C17: Выбить Super Scatter в Sweet Bonanza Super Scatter (бонус от 8 000₽).',
    'Синтез C18: Бонус Six Six Six, пробить >10 спинов (ставка от 7 000₽) — адский замес.',
    'Синтез C19: Окупить бонус в Frkn Bananas (ставка 12 000₽, макс.2 попытки) — банановое безумие.',
    'Синтез C20: Топовый бонус в San Quentin (ставка 10 000₽) — тюремное заключение.',
    'Синтез C21: Получить минимум 8x в Madame Destiny Megaways (бонус 10 000₽) — гадание на картах.',
    'Синтез C22: Бонус в любом «Рыбаке», дойти до x3 (ставка 12 000₽) — рыбный день.',
    'Синтез C23: Окупить бонус за 15 000₽ во Fruit Party — фруктовый салат.',
    'Синтез C24: Выбить x1000 в Big Bass Bonanza 1000 (бонус 10 000₽) — золотая рыбка-гигант.',
    'Синтез C25: Поймать x200 в Wild West Gold (бонус 12 000₽) — ковбойский дуэль.',
    'Синтез C26: Поймать бонус в Big Bass Splash (ставка 1 000₽) за 40 спинов.',
    'Синтез C27: Поймать 2 шторы в Angel vs Sinner (бонус 10 000₽) — битва добра и зла.',
    'Синтез C28: Топовый бонус в Sugar Rush 1000 за 20 000₽ — сахарная кома.'
  ]},

  // ⭐⭐⭐⭐ 4 звезды (класс B) — 20 заданий
  { difficulty: 4, texts: [
    'Критический B1: Поймать бонус в Sweet Bonanza (ставка от 2 000₽) — сладкая жизнь.',
    'Критический B2: Выбить множитель x50 в Sweet Bonanza — конфетный взрыв.',
    'Критический B3: Выбить три бонуса в Le Bandit (ставка от 500₽) — тройное ограбление.',
    'Критический B4: Трём зрителям выдать по 2 500₽ — благотворительность.',
    'Критический B5: Специальный протокол — пропуск одного задания (без последствий).',
    'Критический B6: Разыграть в Telegram бонус за 30 000₽ — шоу для подписчиков.',
    'Критический B7: Топовый бонус в «Мумии» (ставка 15 000₽) — проклятие фараона.',
    'Критический B8: Рандомка в Duck Hunters за 30 000₽ — охота на уток.',
    'Критический B9: Поймать «под иксом» любую ставку в Crazy Time — колесо фортуны.',
    'Критический B10: Поймать множитель x20 в Gates of Olympus — гнев Зевса.',
    'Критический B11: Выбить три бонуса в любом «Рыбаке» — рыболов-экстремал.',
    'Критический B12: 100 спинов в Le Fisherman по 2 000₽ и выбить топовый бонус.',
    'Критический B13: 5 зрителей получают по 2 500₽ — массовая раздача.',
    'Критический B14: Бонус в Dead or Alive 2 за 30 000₽ — прогулка с призраками.',
    'Критический B15: Ставка 50 000₽ в лайв-игре — ва-банк.',
    'Критический B16: Бонус в Dog House Multihold за 30 000₽ и окупиться — собачья радость.',
    'Критический B17: Выиграть x200 в любом слоте с первой попытки — герой-одиночка.',
    'Критический B18: Бонус в слоте от No Limit за 30 000₽ — игра без лимитов.',
    'Критический B19: 50 спинов в Le Bandit по 2 000₽ и выбить любой бонус.',
    'Критический B20: Выбить снайпера в Money Train 4 (ставка от 15 000₽) — меткий стрелок.'
  ]},

  // ⭐⭐⭐⭐⭐ 5 звезд (класс A) — 10 заданий
  { difficulty: 5, texts: [
    'Опыт A1: Выбить множитель x100 в Sweet Bonanza — конфетная лихорадка.',
    'Опыт A2: All-in в Le Bandit — всё на кон!',
    'Опыт A3: All-in в Hot Fiesta — фиеста на полную катушку.',
    'Опыт A4: Выиграть 500x в Sweet Bonanza (ставка 10 000₽) — сладкий миллион.',
    'Опыт A5: Выбить Crazy Time — главный приз колеса.',
    'Опыт A6: Выбить 2 топ-бонуса в Le Pharaon (ставка 1 000₽) — двойное богатство фараона.',
    'Опыт A7: Поймать линию вилдов в Pirate‘s Pub — пиратская удача.',
    'Опыт A8: Поймать x100 в Sweet Bonanza — ещё разок.',
    'Опыт A9: Купить бонус в Money Train 4 за 60 000₽ — поезд в никуда.',
    'Опыт A10: Создатель получает накид (личное сообщение стримеру).'
  ]},

  // ⭐⭐⭐⭐⭐⭐ 6 звезд (класс S) — 2 задания
  { difficulty: 6, texts: [
    'Секретный S1: Выбить Hot Mode в Le Bandit (любая ставка) — режим бога.',
    'Секретный S2: Поймать три десятки подряд в Crazy Time — идеальный шторм.'
  ]}
];

// ================== ПУЛ ШТРАФОВ ==================
const penaltyTemplates = [
  'Штраф: сделать 5 приседаний',
  'Штраф: отжаться 10 раз',
  'Штраф: спеть любую песню в течение 30 секунд',
  'Штраф: прочитать скороговорку',
  'Штраф: показать любое животное',
  'Штраф: рассказать анекдот',
  'Штраф: написать комплимент каждому зрителю в чате',
  'Штраф: станцевать 1 минуту',
  'Штраф: сделать 10 прыжков',
  'Штраф: простоять в позе стула 1 минуту',
  'Штраф: издать звук любого животного',
  'Штраф: надеть смешной головной убор',
  'Штраф: показать пантомиму',
  'Штраф: приседать, пока не закончится таймер (30 секунд)',
  'Штраф: сделать комплимент самому себе',
  'Штраф: рассказать стихотворение',
  'Штраф: нарисовать что-то на камеру',
  'Штраф: показать 5 различных эмоций',
  'Штраф: сделать массаж лицу',
  'Штраф: поморгать 30 раз подряд'
];


function createInitialPool() {
  const tasks = [];
  const counts = [100, 60, 30, 20, 10, 2];
  for (let star = 1; star <= 6; star++) {
    const template = taskTemplates.find(t => t.difficulty === star);
    if (!template) continue;
    for (let i = 0; i < counts[star-1]; i++) {
      const text = template.texts[i % template.texts.length];
      tasks.push({
        id: `task_${Date.now()}_${Math.random()}`,
        description: text,
        difficulty: star
      });
    }
  }
  const penalties = penaltyTemplates.map((text, index) => ({
    id: `penalty_${Date.now()}_${Math.random()}_${index}`,
    description: text,
    difficulty: 0,
    isPenalty: true
  }));
  return { tasks: shuffle(tasks), penalties: shuffle(penalties) };
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let questState = {
  level: 1,
  availableTasks: [],
  penaltyPool: [],
  currentBalance: DEFAULT_BALANCE,
  balanceHistory: [{ timestamp: Date.now(), desc: 'Стартовый баланс', change: DEFAULT_BALANCE, balance: DEFAULT_BALANCE }]
};

const initial = createInitialPool();
questState.availableTasks = initial.tasks;
questState.penaltyPool = initial.penalties;

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('Клиент подключён');
  socket.emit('state', questState);

  socket.on('completeTask', (taskId, change) => {
    const idx = questState.availableTasks.findIndex(t => t.id === taskId);
    if (idx !== -1) questState.availableTasks.splice(idx, 1);

    questState.currentBalance += change;
    questState.balanceHistory.push({ timestamp: Date.now(), desc: 'Задание выполнено', change, balance: questState.currentBalance });

    if (questState.level < MAX_LEVEL) questState.level++;
    io.emit('state', questState);
  });

  socket.on('penaltyWithBalance', (taskId, newBalance) => {
    const idx = questState.availableTasks.findIndex(t => t.id === taskId);
    if (idx !== -1) questState.availableTasks.splice(idx, 1);

    const change = newBalance - questState.currentBalance;
    questState.currentBalance = newBalance;
    questState.balanceHistory.push({ timestamp: Date.now(), desc: 'Задание провалено', change, balance: questState.currentBalance });

    if (questState.level < MAX_LEVEL) questState.level++;
    io.emit('state', questState);
  });

  socket.on('applyPenaltyTask', (taskId, newBalance) => {
    const idx = questState.penaltyPool.findIndex(p => p.id === taskId);
    if (idx !== -1) questState.penaltyPool.splice(idx, 1);

    const change = newBalance - questState.currentBalance;
    questState.currentBalance = newBalance;
    questState.balanceHistory.push({ timestamp: Date.now(), desc: 'Штраф выполнен', change, balance: questState.currentBalance });

    if (questState.level < MAX_LEVEL) questState.level++;
    io.emit('state', questState);
  });

  socket.on('addBalance', (description, amount) => {
    questState.currentBalance += amount;
    questState.balanceHistory.push({ timestamp: Date.now(), desc: description, change: amount, balance: questState.currentBalance });
    io.emit('state', questState);
  });

  socket.on('reset', (newBalance) => {
    const start = (newBalance !== undefined && !isNaN(newBalance)) ? newBalance : DEFAULT_BALANCE;
    const initial = createInitialPool();
    questState = {
      level: 1,
      availableTasks: initial.tasks,
      penaltyPool: initial.penalties,
      currentBalance: start,
      balanceHistory: [{ timestamp: Date.now(), desc: 'Стартовый баланс', change: start, balance: start }]
    };
    io.emit('state', questState);
  });

  socket.on('loadSavedGame', (savedState) => {
    questState = {
      level: savedState.level || 1,
      availableTasks: savedState.availableTasks || createInitialPool().tasks,
      penaltyPool: savedState.penaltyPool || createInitialPool().penalties,
      currentBalance: savedState.currentBalance,
      balanceHistory: savedState.balanceHistory || []
    };
    io.emit('state', questState);
  });

  socket.on('disconnect', () => console.log('Клиент отключён'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
