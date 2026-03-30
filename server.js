const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Вопросы: текст, варианты, правильный ответ (0-3)
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
];

const MAX_LEVEL = 20; // количество вопросов
const DEFAULT_SCORE = 0;

let gameState = {
  currentQuestion: 0,
  scores: { Alex: 0, Vika: 0, Batya: 0 },
  answered: false,
  gameCompleted: false,
  players: ['Alex', 'Vika', 'Batya']
};

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('Участник подключён');
  socket.emit('init', { state: gameState, question: questions[gameState.currentQuestion] });

  // Ответ игрока
  socket.on('answer', (player, answerIndex) => {
    if (gameState.answered || gameState.gameCompleted) return;

    const isCorrect = (answerIndex === questions[gameState.currentQuestion].correct);
    if (isCorrect) {
      gameState.scores[player] += 1;
    }

    gameState.answered = true;

    // Показываем результат всем
    io.emit('result', { player, isCorrect, correctAnswer: questions[gameState.currentQuestion].options[questions[gameState.currentQuestion].correct] });

    // Через 2 секунды переходим к следующему вопросу или завершаем игру
    setTimeout(() => {
      if (gameState.currentQuestion + 1 < MAX_LEVEL) {
        gameState.currentQuestion++;
        gameState.answered = false;
        io.emit('nextQuestion', { question: questions[gameState.currentQuestion], scores: gameState.scores });
      } else {
        gameState.gameCompleted = true;
        io.emit('gameOver', { scores: gameState.scores });
      }
    }, 2000);
  });

  // Сброс игры
  socket.on('reset', () => {
    gameState = {
      currentQuestion: 0,
      scores: { Alex: 0, Vika: 0, Batya: 0 },
      answered: false,
      gameCompleted: false,
      players: ['Alex', 'Vika', 'Batya']
    };
    io.emit('init', { state: gameState, question: questions[0] });
  });

  socket.on('disconnect', () => console.log('Участник отключён'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Викторина запущена на порту ${PORT}`));
