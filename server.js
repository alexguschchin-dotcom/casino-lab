

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
  // ⭐ 1 звезда (класс F) — 42 задания
  { difficulty: 1, texts: [
    'Эксперимент №F1: 20 спинов в Sweet Bonanza (ставка 1000₽). Зафиксировать результаты.',
    'Эксперимент №F2: приобрести бонус в Pirate‘s Pub за 20 000₽. Оценить эффективность.',
    'Эксперимент №F3: приобрести бонус в Gates of Olympus за 30 000₽.',
    'Эксперимент №F4: выдать двум зрителям по 2000₽. Отметить в журнале.',
    'Эксперимент №F5: 10 спинов в любом «Рыбаке» (ставка от 1000₽).',
    'Эксперимент №F6: 20 спинов в Coin Up (ставка от 1000₽).',
    'Эксперимент №F7: приобрести две «радуги» в Le King по 10 000₽.',
    'Эксперимент №F8: 30 спинов в Wild West Gold (ставка 1000₽).',
    'Эксперимент №F9: приобрести бонус в RIP City за 50 000₽.',
    'Эксперимент №F10: приобрести топовый бонус в Coin Volcano за 30 000₽.',
    'Эксперимент №F11: 20 спинов в Cleocatra (ставка 1000₽).',
    'Эксперимент №F12: 10 спинов в Hot Fiesta (ставка 2000₽).',
    'Эксперимент №F13: приобрести бонус в Hot Fiesta за 20 000₽.',
    'Эксперимент №F14: приобрести бонус в Money Train 4 за 50 000₽.',
    'Эксперимент №F15: приобрести бонус в Money Train 3 за 50 000₽.',
    'Эксперимент №F16: поставить 50 000₽ на красное в баккару.',
    'Эксперимент №F17: поставить 30 000₽ на 5 и 20 000₽ на 10 в Crazy Time.',
    'Эксперимент №F18: выдать трём зрителям по 3000₽.',
    'Эксперимент №F19: 30 спинов в RIP City по 2000₽.',
    'Эксперимент №F20: приобрести топовый бонус в «Мумии» за 50 000₽.',
    'Эксперимент №F21: 30 спинов в Dog House Multihold по 1000₽.',
    'Эксперимент №F22: приобрести топовый бонус в Big Bass Secrets of the Golden Lake за 40 000₽.',
    'Эксперимент №F23: приобрести бонус в Release the Kraken за 50 000₽.',
    'Эксперимент №F24: 30 спинов в In Jazz по 1000₽.',
    'Эксперимент №F25: выбить обычный бонус в Le Fisherman (ставка 1000₽).',
    'Эксперимент №F26: приобрести бонус в Wild West Gold Megaways за 40 000₽.',
    'Эксперимент №F27: 30 спинов в Wild West Gold Megaways по 1000₽.',
    'Эксперимент №F28: 20 спинов в 3 Buzzing Wilds по 2000₽.',
    'Эксперимент №F29: приобрести бонус в 3 Buzzing Wilds за 30 000₽.',
    'Эксперимент №F30: 20 спинов в Dog House Royale Hunt по 2000₽.',
    'Эксперимент №F31: выбить бонус в любом «Рыбаке» (ставка от 500₽).',
    'Эксперимент №F32: приобрести топовый бонус в Dog House Muttley Crew за 30 000₽.',
    'Эксперимент №F33: приобрести две «радуги» в Ze Zeus за 20 000₽.',
    'Эксперимент №F34: провести бездепозитное колесо на 10 000₽ (5 минут).',
    'Эксперимент №F35: провести депозитное колесо на 5 000₽ (3 минуты).',
    'Эксперимент №F36: провести бездепозитное колесо на 10 000₽ (10 минут).',
    'Эксперимент №F37: поставить 20 000₽ на 5 в Crazy Time.',
    'Эксперимент №F38: выдать 5 000₽ одному зрителю.',
    'Эксперимент №F39: приобрести бонус в Gates of Olympus за 40 000₽.',
    'Эксперимент №F40: дойти до лягушки 4x4 в Wild Hop Drop (бонус от 20 000₽, 2 попытки).',
    'Эксперимент №F41: поймать ретригер в Fonzo‘s Feline Fortune (бонус 20 000₽).'
  ]},

  // ⭐⭐ 2 звезды (класс D) — 27 заданий
  { difficulty: 2, texts: [
    'Испытание реагента D1: поставить 30 000₽ в Crazy Time и выйти в плюс.',
    'Испытание реагента D2: поставить 40 000₽ на 2 в Crazy Time.',
    'Испытание реагента D3: приобрести бонус в Dead or Alive 2 за 50 000₽.',
    'Испытание реагента D4: 10 спинов в Hot Fiesta по 4000₽.',
    'Испытание реагента D5: 30 спинов в Sweet Bonanza по 3000₽.',
    'Испытание реагента D6: приобрести бонус в Gates of Olympus за 75 000₽.',
    'Испытание реагента D7: поставить 50 000₽ на любое число в рулетке.',
    'Испытание реагента D8: 20 спинов в Dead or Alive 2 по 2000₽.',
    'Испытание реагента D9: выдать 10 000₽ одному зрителю.',
    'Испытание реагента D10: приобрести бонус в Big Bass Bonanza за 40 000₽.',
    'Испытание реагента D11: 40 спинов в Book of Dead по 1500₽.',
    'Испытание реагента D12: поставить 25 000₽ на 5 и 25 000₽ на 10 в Crazy Time.',
    'Испытание реагента D13: приобрести бонус в Money Train 3 за 75 000₽.',
    'Испытание реагента D14: 15 спинов в Le Bandit по 5000₽.',
    'Испытание реагента D15: топовый бонус в «Мумии» за 50 000₽, выбить >10 спинов (макс.3 попытки).',
    'Испытание реагента D16: приобрести бонус в Sugar Rush за 60 000₽.',
    'Испытание реагента D17: бонус Sugar Rush за 30 000₽, выбить >3 скаттеров (макс.3 попытки).',
    'Испытание реагента D18: бонус Six Six Six, пробить >10 спинов (ставка от 30 000₽).',
    'Испытание реагента D19: окупить бонус в Le Santa (ставка от 20 000₽, макс.3 попытки).',
    'Испытание реагента D20: бездепозитное колесо на 20 000₽ (10 минут).',
    'Испытание реагента D21: депозитное колесо на 15 000₽ (3 минуты).',
    'Испытание реагента D22: депозитное колесо для крупных депёров 5 000₽ (1 минута).',
    'Испытание реагента D23: купить бонус в Densho за 30 000₽, окупиться.',
    'Испытание реагента D24: купить бонуску в Cloud Princess за 30 000₽, окупиться.',
    'Испытание реагента D25: бонус в любом «Рыбаке», дойти до x2 (ставка 30 000₽, 2 попытки).',
    'Испытание реагента D26: поймать линию вилдов в Hand of Midas 2 (бонус от 20 000₽).',
    'Испытание реагента D27: пройти до лягушки 4x4 в Wild Hop Drop (ставка от 50 000₽) с первой попытки.'
  ]},

  // ⭐⭐⭐ 3 звезды (класс C) — 28 заданий
  { difficulty: 3, texts: [
    'Синтез соединения C1: 50 спинов в Gates of Olympus по 2000₽ и выбить бонус.',
    'Синтез соединения C2: два бонуса в Hot Fiesta за 50 000₽, один должен окупиться.',
    'Синтез соединения C3: 50 спинов в Fortune of Giza (ставка 2000₽).',
    'Синтез соединения C4: две «радуги» в Le Bandit (ставка от 5000₽), хотя бы одна окупается.',
    'Синтез соединения C5: 30 спинов в Minotauros по 4000₽ и выбить бонус.',
    'Синтез соединения C6: 100 спинов в Gates of Olympus по 3000₽.',
    'Синтез соединения C7: бонус в Sweet Bonanza за 100 000₽, окупиться.',
    'Синтез соединения C8: выиграть 150 000₽ в любом слоте за одну бонуску.',
    'Синтез соединения C9: поставить 100 000₽ на чёрное и победить.',
    'Синтез соединения C10: 50 спинов в Dead or Alive 2 по 5000₽.',
    'Синтез соединения C11: выдать 5 000₽ пяти зрителям.',
    'Синтез соединения C12: бонус в Money Train 4 за 150 000₽.',
    'Синтез соединения C13: поймать множитель x25 в Sweet Bonanza (бонус от 40 000₽).',
    'Синтез соединения C14: поставить 100 000₽ в рулетке.',
    'Синтез соединения C15: выбить бонус в Le King за 40 спинов (ставка от 2 000₽).',
    'Синтез соединения C16: дойти до метки 4x4 в Sky Bounty (бонус от 50 000₽).',
    'Синтез соединения C17: выбить Super Scatter в Sweet Bonanza Super Scatter (бонус от 30 000₽).',
    'Синтез соединения C18: бонус Six Six Six, пробить >10 спинов (ставка от 30 000₽).',
    'Синтез соединения C19: окупить бонус в Frkn Bananas (ставка 50 000₽, макс.2 попытки).',
    'Синтез соединения C20: топовый бонус в San Quentin (рандомка от 40 000₽, макс.3 попытки).',
    'Синтез соединения C21: получить минимум 8x в Madame Destiny Megaways (бонус 50 000₽, 2 попытки).',
    'Синтез соединения C22: бонус в любом «Рыбаке», дойти до x3 (ставка 50 000₽, 2 попытки).',
    'Синтез соединения C23: окупить бонус за 80 000₽ во Fruit Party с первой попытки.',
    'Синтез соединения C24: выбить x1000 в Big Bass Bonanza 1000 (бонус 45 000₽, 3 попытки).',
    'Синтез соединения C25: поймать x200 в Wild West Gold (бонус 60 000₽, 2 попытки).',
    'Синтез соединения C26: поймать бонус в Big Bass Splash (ставка 2000₽) за 50 спинов.',
    'Синтез соединения C27: поймать 2 шторы в Angel vs Sinner (бонус 50 000₽) с первой попытки.',
    'Синтез соединения C28: топовый бонус в Sugar Rush 1000 за 100 000₽.'
  ]},

  // ⭐⭐⭐⭐ 4 звезды (класс B) — 20 заданий
  { difficulty: 4, texts: [
    'Критический эксперимент B1: поймать бонус в Sweet Bonanza (ставка от 4000₽).',
    'Критический эксперимент B2: выбить множитель x50 в Sweet Bonanza.',
    'Критический эксперимент B3: выбить три бонуса в Le Bandit (ставка от 1000₽).',
    'Критический эксперимент B4: трём зрителям выдать по 7500₽.',
    'Критический эксперимент B5: специальный протокол — пропуск одного задания.',
    'Критический эксперимент B6: разыграть в Telegram бонус за 100 000₽.',
    'Критический эксперимент B7: топовый бонус в «Мумии» с рандомки (ставка 50 000₽, 3 попытки).',
    'Критический эксперимент B8: рандомка в Duck Hunters за 200 000₽.',
    'Критический эксперимент B9: поймать «под иксом» любую ставку в Crazy Time.',
    'Критический эксперимент B10: поймать множитель x20-25 в Gates of Olympus.',
    'Критический эксперимент B11: выбить три бонуса в любом «Рыбаке».',
    'Критический эксперимент B12: 100 спинов в Le Fisherman по 4000₽ и выбить топовый бонус.',
    'Критический эксперимент B13: 5 зрителей получают по 7500₽.',
    'Критический эксперимент B14: бонус в Dead or Alive 2 за 200 000₽ — должен дать минимум половину.',
    'Критический эксперимент B15: ставка 200 000₽ в лайв-игре.',
    'Критический эксперимент B16: бонус в Dog House Multihold за 200 000₽ и окупиться.',
    'Критический эксперимент B17: выиграть x200 в любом слоте с первой попытки.',
    'Критический эксперимент B18: бонуску в слоте от No Limit за 200 000₽ — должна дать минимум половину.',
    'Критический эксперимент B19: 50 спинов в Le Bandit по 5 000₽ и выбить любой бонус.',
    'Критический эксперимент B20: выбить снайпера в Money Train 4 (ставка от 75 000₽, макс.3 попытки).'
  ]},

  // ⭐⭐⭐⭐⭐ 5 звезд (класс A) — 10 заданий
  { difficulty: 5, texts: [
    'Опыт с элементом A1: выбить множитель x100 в Sweet Bonanza.',
    'Опыт с элементом A2: all-in в Le Bandit.',
    'Опыт с элементом A3: all-in в Hot Fiesta.',
    'Опыт с элементом A4: выиграть 500x в Sweet Bonanza (ставка 50 000₽).',
    'Опыт с элементом A5: выбить Crazy Time.',
    'Опыт с элементом A6: выбить 2 топ-бонуса в Le Pharaon (ставка 500₽).',
    'Опыт с элементом A7: поймать линию вилдов в Pirate‘s Pub.',
    'Опыт с элементом A8: поймать x100 в Sweet Bonanza.',
    'Опыт с элементом A9: купить бонус в Money Train 4 за 400 000₽.',
    'Опыт с элементом A10: создатель получает накид.'
  ]},

  // ⭐⭐⭐⭐⭐⭐ 6 звезд (класс S) — 2 задания
  { difficulty: 6, texts: [
    'Секретный протокол S1: выбить Hot Mode в Le Bandit (любая ставка).',
    'Секретный протокол S2: поймать три десятки подряд в Crazy Time.'
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
  // Задания
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
  // Штрафы
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

// Инициализация
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

    if (questState.level < MAX_LEVEL) {
      questState.level++;
    }
    io.emit('state', questState);
  });

  // Провал задания (или выполнение штрафа)
  socket.on('penaltyWithBalance', (taskId, newBalance) => {
    // Для задания: удаляем из availableTasks
    const taskIdx = questState.availableTasks.findIndex(t => t.id === taskId);
    if (taskIdx !== -1) {
      questState.availableTasks.splice(taskIdx, 1);
    }

    const change = newBalance - questState.currentBalance;
    questState.currentBalance = newBalance;
    questState.balanceHistory.push({ timestamp: Date.now(), desc: 'Эксперимент провален', change, balance: questState.currentBalance });

    if (questState.level < MAX_LEVEL) {
      questState.level++;
    }
    io.emit('state', questState);
  });

  // Специальный обработчик для штрафа (удаляет из penaltyPool)
  socket.on('applyPenaltyTask', (taskId, newBalance) => {
    const penaltyIdx = questState.penaltyPool.findIndex(p => p.id === taskId);
    if (penaltyIdx !== -1) {
      questState.penaltyPool.splice(penaltyIdx, 1);
    }

    const change = newBalance - questState.currentBalance;
    questState.currentBalance = newBalance;
    questState.balanceHistory.push({ timestamp: Date.now(), desc: 'Штраф выполнен', change, balance: questState.currentBalance });

    if (questState.level < MAX_LEVEL) {
      questState.level++;
    }
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
    console.log('Загружено сохранение с уровня', questState.level);
  });

  socket.on('disconnect', () => console.log('Клиент отключён'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
