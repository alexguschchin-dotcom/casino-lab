const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// 39 вопросов (такой же список)
const questions = [
  { text: 'В какой стране находится знаменитое казино Монте-Карло?', options: ['Монако', 'Франция', 'Италия', 'Испания'], correct: 0 },
  { text: 'Какой слот считается самым популярным в мире?', options: ['Book of Dead', 'Starburst', 'Sweet Bonanza', 'Gates of Olympus'], correct: 1 },
  { text: 'Кто написал роман «Игрок»?', options: ['Толстой', 'Достоевский', 'Чехов', 'Гоголь'], correct: 1 },
  { text: 'Что такое RTP в казино?', options: ['Return to Player', 'Real Time Play', 'Random Table Payout', 'Реальный шанс выигрыша'], correct: 0 },
  { text: 'Какой город называют «мировой столицей азартных игр»?', options: ['Макао', 'Лас-Вегас', 'Атлантик-Сити', 'Монте-Карло'], correct: 1 },
  { text: 'В каком году было открыто первое казино в Лас-Вегасе?', options: ['1905', '1931', '1941', '1955'], correct: 2 },
  { text: 'Какой бонус в слотах активируется выпадением 3+ скаттеров?', options: ['Фриспины', 'Множитель', 'Джекпот', 'Респин'], correct: 0 },
  { text: 'Сколько чисел в европейской рулетке?', options: ['36', '37', '38', '39'], correct: 1 },
  { text: 'Какой фильм о казино считается классикой?', options: ['Казино', 'Одиннадцать друзей Оушена', 'С широко закрытыми глазами', 'Игры разума'], correct: 0 },
  { text: 'Что означает термин «all-in»?', options: ['Ставка на всё', 'Проигрыш', 'Выигрыш', 'Ничья'], correct: 0 },
  { text: 'Какая игра имеет наибольшее преимущество казино?', options: ['Блэкджек', 'Кено', 'Рулетка', 'Слоты'], correct: 1 },
  { text: 'Кто придумал игру «блэкджек»?', options: ['Французы', 'Американцы', 'Итальянцы', 'Испанцы'], correct: 0 },
  { text: 'Как называется крупная ставка на одного игрока в покере?', options: ['Анте', 'Блайнд', 'Рейз', 'Колл'], correct: 2 },
  { text: 'В каком городе находится самое большое казино в мире?', options: ['Макао', 'Лас-Вегас', 'Сингапур', 'Мельбурн'], correct: 0 },
  { text: 'Какой слот от Pragmatic Play имеет функцию «Ante Bet»?', options: ['Sweet Bonanza', 'Gates of Olympus', 'The Dog House', 'Big Bass Bonanza'], correct: 1 },
  { text: 'Сколько очков в блэкджеке даёт туз?', options: ['1 или 11', '10', '11', '1'], correct: 0 },
  { text: 'Как называется «зеркальный» режим в онлайн-казино?', options: ['Демо', 'Live', 'Бонус', 'Турнир'], correct: 0 },
  { text: 'Какая ставка в рулетке самая рискованная?', options: ['На одно число', 'На красное', 'На чёрное', 'На чётное'], correct: 0 },
  { text: 'Кто из этих писателей был азартным игроком?', options: ['Достоевский', 'Пушкин', 'Лермонтов', 'Тургенев'], correct: 0 },
  { text: 'Какой символ в слотах заменяет другие?', options: ['Wild', 'Scatter', 'Bonus', 'Multiplier'], correct: 0 },
  { text: 'Какая река является самой длинной в мире?', options: ['Амазонка', 'Нил', 'Янцзы', 'Миссисипи'], correct: 1 },
  { text: 'Кто открыл Америку?', options: ['Колумб', 'Магеллан', 'Васко да Гама', 'Кук'], correct: 0 },
  { text: 'В каком году произошла Октябрьская революция?', options: ['1917', '1905', '1918', '1921'], correct: 0 },
  { text: 'Как называется самая высокая гора мира?', options: ['К2', 'Эверест', 'Канченджанга', 'Лхоцце'], correct: 1 },
  { text: 'Кто написал «Войну и мир»?', options: ['Достоевский', 'Толстой', 'Чехов', 'Пушкин'], correct: 1 },
  { text: 'Столица Австралии?', options: ['Сидней', 'Мельбурн', 'Канберра', 'Перт'], correct: 2 },
  { text: 'Кто изобрёл радио?', options: ['Попов', 'Маркони', 'Тесла', 'Эдисон'], correct: 0 },
  { text: 'Какой химический элемент обозначается символом O?', options: ['Осмий', 'Кислород', 'Олово', 'Золото'], correct: 1 },
  { text: 'Самый большой океан на Земле?', options: ['Атлантический', 'Индийский', 'Северный Ледовитый', 'Тихий'], correct: 3 },
  { text: 'Кто был первым человеком в космосе?', options: ['Гагарин', 'Титов', 'Армстронг', 'Леонов'], correct: 0 },
  { text: 'В какой стране изобрели бумагу?', options: ['Египет', 'Китай', 'Индия', 'Греция'], correct: 1 },
  { text: 'Как звали древнегреческого бога морей?', options: ['Зевс', 'Аполлон', 'Посейдон', 'Арес'], correct: 2 },
  { text: 'Сколько цветов в радуге?', options: ['6', '7', '8', '5'], correct: 1 },
  { text: 'Какой материк самый маленький?', options: ['Австралия', 'Антарктида', 'Европа', 'Южная Америка'], correct: 0 },
  { text: 'Кто написал «Ромео и Джульетта»?', options: ['Диккенс', 'Шекспир', 'Гюго', 'Пушкин'], correct: 1 },
  { text: 'Столица Японии?', options: ['Пекин', 'Сеул', 'Токио', 'Осака'], correct: 2 },
  { text: 'Как называется национальный инструмент шотландцев?', options: ['Арфа', 'Волынка', 'Гитара', 'Скрипка'], correct: 1 },
  { text: 'Какое животное является символом Австралии?', options: ['Кенгуру', 'Коала', 'Утконос', 'Ехидна'], correct: 0 },
  { text: 'Кто написал картину «Мона Лиза»?', options: ['Ван Гог', 'Пикассо', 'Леонардо да Винчи', 'Рафаэль'], correct: 2 }
];

const MAX_LEVEL = questions.length;
const CORRECT_REWARD = 100000;
const WRONG_PENALTY = 300000;
const STREAK_BONUS_THRESHOLD = 3;

let gameState = {
  currentQuestion: 0,
  scores: { Alex: 0, Vika: 0, Batya: 0 },
  coins: { Alex: 0, Vika: 0, Batya: 0 },
  streak: { Alex: 0, Vika: 0, Batya: 0 },
  bonuses: { Alex: [], Vika: [], Batya: [] },
  answered: false,
  gameCompleted: false,
  players: ['Alex', 'Vika', 'Batya']
};

app.use(express.static(path.join(__dirname, 'public')));

function addBonus(player, bonusName) {
  if (!gameState.bonuses[player].includes(bonusName)) {
    gameState.bonuses[player].push(bonusName);
  }
}

function removeBonus(player, bonusName) {
  const index = gameState.bonuses[player].indexOf(bonusName);
  if (index !== -1) gameState.bonuses[player].splice(index, 1);
}

function nextQuestionOrGameOver(io) {
  if (gameState.currentQuestion + 1 < MAX_LEVEL) {
    gameState.currentQuestion++;
    gameState.answered = false;
    io.emit('nextQuestion', {
      question: questions[gameState.currentQuestion],
      scores: gameState.scores,
      coins: gameState.coins,
      bonuses: gameState.bonuses,
      streak: gameState.streak
    });
  } else {
    gameState.gameCompleted = true;
    io.emit('gameOver', {
      scores: gameState.scores,
      coins: gameState.coins
    });
  }
}

io.on('connection', (socket) => {
  console.log('Участник подключён');
  // Отправляем текущее состояние и вопрос
  socket.emit('init', {
    state: {
      currentQuestion: gameState.currentQuestion,
      scores: gameState.scores,
      coins: gameState.coins,
      bonuses: gameState.bonuses,
      streak: gameState.streak,
      answered: gameState.answered,
      gameCompleted: gameState.gameCompleted
    },
    question: questions[gameState.currentQuestion]
  });

  socket.on('answer', (player, answerIndex) => {
    if (gameState.answered || gameState.gameCompleted) return;

    const isCorrect = (answerIndex === questions[gameState.currentQuestion].correct);
    const currentQ = questions[gameState.currentQuestion];
    const correctAnswerText = currentQ.options[currentQ.correct];

    if (isCorrect) {
      gameState.coins[player] += CORRECT_REWARD;
      gameState.scores[player] += 1;
      gameState.streak[player] += 1;
      if (gameState.streak[player] % STREAK_BONUS_THRESHOLD === 0) {
        addBonus(player, 'askChat');
      }
    } else {
      gameState.coins[player] = Math.max(0, gameState.coins[player] - WRONG_PENALTY);
      gameState.streak[player] = 0;
    }

    gameState.answered = true;
    io.emit('result', {
      player,
      isCorrect,
      correctAnswer: correctAnswerText,
      coins: gameState.coins[player],
      scores: gameState.scores,
      streak: gameState.streak[player]
    });

    setTimeout(() => {
      if (!gameState.gameCompleted) {
        nextQuestionOrGameOver(io);
      }
    }, 2000);
  });

  socket.on('useBonus', (player, bonusType) => {
    if (gameState.answered || gameState.gameCompleted) {
      socket.emit('bonusError', 'Сейчас нельзя использовать бонус');
      return;
    }
    if (!gameState.bonuses[player].includes(bonusType)) {
      socket.emit('bonusError', 'У вас нет такого бонуса');
      return;
    }

    if (bonusType === 'askChat') {
      const currentQ = questions[gameState.currentQuestion];
      const correctIdx = currentQ.correct;
      let hint;
      const rnd = Math.random();
      if (rnd < 0.7) {
        hint = currentQ.options[correctIdx];
      } else {
        let wrongIdx;
        do { wrongIdx = Math.floor(Math.random() * currentQ.options.length); } while (wrongIdx === correctIdx);
        hint = currentQ.options[wrongIdx];
      }
      socket.emit('chatHint', { hint, player });
      removeBonus(player, 'askChat');
      io.emit('bonusUpdate', { bonuses: gameState.bonuses });
    }
    else if (bonusType === 'skipQuestion') {
      if (!gameState.answered) {
        gameState.answered = true;
        io.emit('skipBroadcast', { player });
        setTimeout(() => {
          if (!gameState.gameCompleted) {
            nextQuestionOrGameOver(io);
          }
        }, 1500);
        removeBonus(player, 'skipQuestion');
        io.emit('bonusUpdate', { bonuses: gameState.bonuses });
      } else {
        socket.emit('bonusError', 'Вопрос уже завершён');
      }
    }
  });

  socket.on('reset', () => {
    gameState = {
      currentQuestion: 0,
      scores: { Alex: 0, Vika: 0, Batya: 0 },
      coins: { Alex: 0, Vika: 0, Batya: 0 },
      streak: { Alex: 0, Vika: 0, Batya: 0 },
      bonuses: { Alex: [], Vika: [], Batya: [] },
      answered: false,
      gameCompleted: false,
      players: ['Alex', 'Vika', 'Batya']
    };
    io.emit('init', {
      state: {
        currentQuestion: 0,
        scores: gameState.scores,
        coins: gameState.coins,
        bonuses: gameState.bonuses,
        streak: gameState.streak,
        answered: false,
        gameCompleted: false
      },
      question: questions[0]
    });
  });

  socket.on('disconnect', () => console.log('Участник отключён'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Викторина запущена на порту ${PORT}`));
