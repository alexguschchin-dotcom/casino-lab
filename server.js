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
    'Эксперимент №F32: Нападение пиратского судна! Пираты хотят забрать наше исследование, окупить бонус в Dog House Muttley Crew.',
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

  // ⭐⭐ 2 звезды (класс D) — 27 заданий 
  { difficulty: 2, texts: [
    'Испытание D1: Поставить 5 000₽ в Crazy Time и выйти в плюс (или заплакать).',
    'Испытание D2: 20 спинов в Hot Fiesta по  625₽ — подсчитать количество пиньят.',
    'Испытание D3: Купить бонус в wanted Dead or a wild 2 за 8 000₽ и попытаться не умереть от скуки.',
    'Испытание D4: Исследование сладких фруктов! Купить бонус в sweet bonanaza цель — найти хотя бы один множитель x10.',
    'Испытание D5: Приобрести бонус в Gates of Olympus за  9600₽ и задобрить Зевса.',
    'Испытание D6: Поставить 7 000₽ на любое число в рулетке — проверить интуицию.',
    'Испытание D7: 20 спинов в Le Cowboy по 600₽ — почувствовать себя ковбоем.',
    'Испытание D8: Выдать 3 000₽ одному зрителю — сделать его счастливым.',
    'Испытание D9: Наблюдение за соревнованием! Узнать какой боец лучше в big bass boxing купив бонус за 9600Р.',
    'Испытание D10: Купить бонус в Yeti quest за 8000Р и понаблюдать за поведением ейти, если поведение хорошее взять еще один.',
    'Испытание D11: Поставить 5 000₽ на 5 и 5 000₽ на 10 в Crazy Time — и окупиться.',
    'Испытание D12: Покупать бонуски в Money Train 3 за 10 000₽ —  доехать до станции "Прибыль".',
    'Испытание D13: Ограбить банк! на исследования нужны деньги! Получить х2 от суммы покупки бонуски в iron bank.',
    'Испытание D14: Испытать удачу! Выбить топовый бонус в Мумии за 7200₽ за две попытки.',
    'Испытание D15: Испытание от демоницы! Выбить 2 шторы в angel vs sinner(2 попытки).',
    'Испытание D16: Бонус Sugar Rush за 6 400₽, выбить > 3 скаттеров (3 попытки).',
    'Испытание D17: Бонус Six Six Six за 10 000₽ — пробить больше 10 спинов (3 попытки).',
    'Испытание D18: Окупить бонус в Le Santa за 5 000₽.',
    'Испытание D19: Бездепозитное колесо на 7 000₽ (5 минут).',
    'Испытание D20: Депозитное колесо на 5 000₽ (3 минуты).',
    'Испытание D21: Депозитное колесо для зрителей 3 000₽ (1 минута).',
    'Испытание D22: Наблюдение за древними временами. Купить бонус в Densho за 10 000₽.',
    'Испытание D23: Купить бонус в Cloud Princess за 10 000₽.',
    'Испытание D24: Пройти до х2 в  любом «Рыбаке» с первой попытки.',
    'Испытание D25: Поймать линию вилдов в Hand of Midas 2 в бонусе за 4 800₽).',
    'Испытание D26: Пройти до лягушки 4x4 в Wild Hop Drop (ставка 4 800₽).',
    'Испытание D27: Устроить конкурс для зрителей на 5 000₽ — первые 5 человек что мяукнут в чат получают накид.'
  ]},

  // ⭐⭐⭐ 3 звезды (класс C) — 28 заданий
  { difficulty: 3, texts: [
    'Синтез C1: 30 спинов в Gates of Olympus по 1 000₽ .',
    'Синтез C2: Два бонуса в Hot Fiesta за 10 000₽ каждый — устроить латиноамериканскую вечеринку (хотя бы 1 окупной).',
    'Синтез C3: 30 спинов в Fortune of Giza (ставка 800₽).',
    'Синтез C4: Две «радуги» в Le Bandit по 10000 (одна должна окупиться).',
    'Синтез C5: 30 спинов в Minotauros по 800₽ .',
    'Синтез C6: 100 спинов в Gates of Olympus по 500₽ — эпическая битва с богами.',
    'Синтез C7: Окупить бонус в Sweet Bonanza за 16 000₽.',
    'Синтез C8: Выиграть 20 000₽ в любом слоте за одну бонуску.',
    'Синтез C9: Поставить 20 000₽ на чёрное и победить — рулетка, детка.',
    'Синтез C10: 30 спинов в Undead fortune по 9 000₽ —  попытка избежать смерти.',
    'Синтез C11: Выдать 2 000₽ пяти зрителям — щедрость за гранью.',
    'Синтез C12: Бонус в Money Train 4 за 20 000₽ — экспресс до богатства в исследованиях.',
    'Синтез C13: Поймать множитель x25 в Sweet Bonanza бонус от 8 000₽.',
    'Синтез C14: Поставить 30 000₽ в рулетке — хайроллер на минималках.',
    'Синтез C15: Выбить бонус в Le King за 50 спинов (ставка от 900₽).',
    'Синтез C16: Дойти до метки 4x4 в Sky Bounty (бонус от 10 000₽).',
    'Синтез C17: Выбить Super Scatter в Sweet Bonanza Super Scatter (бонус от 8 000₽).',
    'Синтез C18: Бонус Six Six Six, пробить > 10 спинов (ставка от 10 000₽).',
    'Синтез C19: Окупить бонус в Frkn Bananas (ставка 12 000₽, макс.2 попытки).',
    'Синтез C20: Ииследование вероятноятности получения топового бонуса в San Quentin с рандомки (2 попытки).',
    'Синтез C21: Получить минимум 8x в Madame Destiny Megaways в бонусе за 9600Р (2 попытки).',
    'Синтез C22: Бонус в любом «Рыбаке», дойти до x3 (ставка от 10 000₽).',
    'Синтез C23: Окупить бонус за 16 000₽ во Fruit Party.',
    'Синтез C24: Выбить x1000 в Big Bass Bonanza 1000 (бонус 8 000₽).',
    'Синтез C25: Поймать x200 в Wild West Gold (бонус 12 000₽) — ковбойский дуэль.',
    'Синтез C26: Поймать бонус в Big Bass Splash (ставка 1 000₽) за 40 спинов.',
    'Синтез C27: Поймать 2 шторы в Angel vs Sinner (бонус 10 000₽) — битва добра и зла.',
    'Синтез C28: Топовый бонус в Sugar Rush 1000 за 24 000₽ — сахарная кома.'
  ]},

  // ⭐⭐⭐⭐ 4 звезды (класс B) — 20 заданий
  { difficulty: 4, texts: [
    'Критический B1: Поймать бонус в Sweet Bonanza.',
    'Критический B2: Выбить множитель x50 в Sweet Bonanza.',
    'Критический B3: Выбить три бонуса в Le Bunny (ставка от 500₽) - исследование странно одетых енотов.',
    'Критический B4: Трём зрителям выдать по 2 500₽ — благотворительность.',
    'Критический B5: Специальный протокол — пропуск одного задания (без последствий).',
    'Критический B6: Разыграть в Telegram бонус за 20 000₽ — шоу для подписчиков.',
    'Критический B7: Топовый бонус в «Мумии» (ставка 20 000₽) - выбить больше 10 спинов.',
    'Критический B8: Исследование опасности динамита. Окупить бонус в fire in the hole 2.',
    'Критический B9: Поймать «под иксом» любую ставку в Crazy Time — колесо фортуны.',
    'Критический B10: Поймать множитель x20 в Gates of Olympus — познать милость Зевса.',
    'Критический B11: Найти самое рыбное место! Выбить три бонуса в одном Рыбаке (любом).',
    'Критический B12: 100 спинов в Le Fisherman по  900₽ и выбить топовый бонус.',
    'Критический B13: Проверка на жадность! 5 зрителей получают по 2 500₽.',
    'Критический B14: Учебная прогулка с вампирами. Выбить бонус в The Vampires 2 по 500Р.',
    'Критический B15: Ставка 50 000₽ в лайв-игре.',
    'Критический B16: Купить Бонус в Dog House Megaways за 20 000₽ и окупиться.',
    'Критический B17: Проверка удачи! Выиграть x200 в любом слоте с первой попытки.',
    'Критический B18: Бонус в слоте от No Limit за 30 000₽ и выше.',
    'Критический B19: 50 спинов в Le Bandit по 2 000₽ и выбить любой бонус.',
    'Критический B20: На лабораторию напал убийца! Выбить снайпера в Money Train 4 и устранить его (ставка от 10 000₽).'
  ]},

  // ⭐⭐⭐⭐⭐ 5 звезд (класс A) — 10 заданий
  { difficulty: 5, texts: [
    'Опыт A1: Выбить множитель x100 в Sweet Bonanza .',
    'Опыт A2: Вы стали безумным ученым! All-in в Le Bandit',
    'Опыт A3: Вы стали безумным ученым! All-in в Hot Fiesta.',
    'Опыт A4: Поймать ретриегр в dig dig digger.',
    'Опыт A5: Сделать невозможное исследование! Выбить Crazy Time и узнать насколько он хорош.',
    'Опыт A6: Выбить 2 топ-бонуса в Jelly Slice (ставка 1 000₽).',
    'Опыт A7: Поймать х100 в Sweet bonanza.',
    'Опыт A8: Поймать ретригер в sugar rush 1000 в топовой бонуске.',
    'Опыт A9: Купить бонус в Money Train 4 за 60 000₽ — поезд в никуда.',
    'Опыт A10: Создатель получает накид .'
  ]},

  // ⭐⭐⭐⭐⭐⭐ 6 звезд (класс S) — 2 задания
  { difficulty: 6, texts: [
    'Секретный S1: Сложнейшее исследование! Пробить Hot Mode в Le cowboy (любая ставка).',
    'Секретный S2: Сложнейшее исследование! Выбить красную луну в The vampires 2.'
  ]}
];

// ================== ПУЛ ШТРАФОВ ==================
const penaltyTemplates = [
  'Штраф: сделать 5 приседаний',
  'Штраф: отжаться 5 раз',
  'Штраф: спеть любую песню',
  'Штраф: прочитать скороговорку (На выбор Алексея)',
  'Штраф: Загуглить английские слова с двумя "R" и говорить пока Алексей не будет доволен',
  'Штраф: рассказать анекдот и рассмешить чат (чат решает когда остановиться)',
  'Штраф: написать комплимент 10 людям в чате',
  'Штраф: станцевать 1 минуту',
  'Штраф: сделать 10 приседаний',
  'Штраф: простоять в позе стула 1 минуту',
  'Штраф: издать звук любого животного 10 раз',
  'Штраф: Купить с Алексеем бонуску 50/50 все плюса получает он',
  'Штраф: показать пантомиму',
  'Штраф: Покупать бонуски в money train 4 пока gg wp не будет доволен',
  'Штраф: сделать комплимент gg wp',
  'Штраф: рассказать стихотворение',
  'Штраф: Снимаем очки! Теперь они запрещены',
  'Штраф: показать 5 различных эмоций',
  'Штраф: 5 минут стримом управляет Алексей',
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
  balanceHistory: [{ timestamp: Date.now(), desc: 'Стартовый баланс', change: DEFAULT_BALANCE, balance: DEFAULT_BALANCE }],
  successCount: 0,
  failCount: 0,
  penaltyCount: 0
};

const initial = createInitialPool();
questState.availableTasks = initial.tasks;
questState.penaltyPool = initial.penalties;

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('Клиент подключён');
  socket.emit('state', questState);

  // Успешное выполнение задания
  socket.on('completeTask', (taskId, change) => {
    const idx = questState.availableTasks.findIndex(t => t.id === taskId);
    if (idx !== -1) questState.availableTasks.splice(idx, 1);

    questState.currentBalance += change;
    questState.balanceHistory.push({ timestamp: Date.now(), desc: 'Задание выполнено', change, balance: questState.currentBalance });
    questState.successCount++;

    if (questState.level < MAX_LEVEL) questState.level++;
    io.emit('state', questState);
  });

  // Провал задания (сам штраф ещё не выполнен)
  socket.on('penaltyWithBalance', (taskId, newBalance) => {
    const idx = questState.availableTasks.findIndex(t => t.id === taskId);
    if (idx !== -1) questState.availableTasks.splice(idx, 1);

    const change = newBalance - questState.currentBalance;
    questState.currentBalance = newBalance;
    questState.balanceHistory.push({ timestamp: Date.now(), desc: 'Задание провалено', change, balance: questState.currentBalance });
    questState.failCount++;

    // Уровень НЕ повышаем, потому что предстоит штраф
    io.emit('state', questState);
  });

  // Выполнение штрафа (прямого или после провала)
  socket.on('applyPenaltyTask', (taskId, newBalance) => {
    const idx = questState.penaltyPool.findIndex(p => p.id === taskId);
    if (idx !== -1) questState.penaltyPool.splice(idx, 1);

    const change = newBalance - questState.currentBalance;
    questState.currentBalance = newBalance;
    questState.balanceHistory.push({ timestamp: Date.now(), desc: 'Штраф выполнен', change, balance: questState.currentBalance });
    questState.penaltyCount++;

    // Повышаем уровень, так как штраф отработан и уровень завершён
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
      balanceHistory: [{ timestamp: Date.now(), desc: 'Стартовый баланс', change: start, balance: start }],
      successCount: 0,
      failCount: 0,
      penaltyCount: 0
    };
    io.emit('state', questState);
  });

  socket.on('loadSavedGame', (savedState) => {
    questState = {
      level: savedState.level || 1,
      availableTasks: savedState.availableTasks || createInitialPool().tasks,
      penaltyPool: savedState.penaltyPool || createInitialPool().penalties,
      currentBalance: savedState.currentBalance,
      balanceHistory: savedState.balanceHistory || [],
      successCount: savedState.successCount || 0,
      failCount: savedState.failCount || 0,
      penaltyCount: savedState.penaltyCount || 0
    };
    io.emit('state', questState);
  });

  socket.on('disconnect', () => console.log('Клиент отключён'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
