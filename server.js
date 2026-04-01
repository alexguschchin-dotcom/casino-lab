const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ========== ДАННЫЕ ИГРЫ ==========
// Темы и вопросы (вопрос + правильный ответ)
const topics = {
  'История': [
    { question: 'В каком году началась Вторая мировая война?', answer: '1939', difficulty: 1 },
    { question: 'Кто был первым президентом США?', answer: 'Вашингтон', difficulty: 2 },
    { question: 'Какое событие произошло 12 апреля 1961 года?', answer: 'Полет Гагарина', difficulty: 3 },
    { question: 'Назовите имя древнегреческого философа, учителя Александра Македонского.', answer: 'Аристотель', difficulty: 4 },
    { question: 'В каком году была подписана Декларация независимости США?', answer: '1776', difficulty: 5 }
  ],
  'География': [
    { question: 'Самая длинная река в мире?', answer: 'Нил', difficulty: 1 },
    { question: 'Столица Австралии?', answer: 'Канберра', difficulty: 2 },
    { question: 'Самый высокий водопад в мире?', answer: 'Анхель', difficulty: 3 },
    { question: 'Как называется пустыня в Южной Америке?', answer: 'Атакама', difficulty: 4 },
    { question: 'Самое глубокое озеро в мире?', answer: 'Байкал', difficulty: 5 }
  ],
  'Кино': [
    { question: 'Кто сыграл Джека Воробья в "Пиратах Карибского моря"?', answer: 'Депп', difficulty: 1 },
    { question: 'Назовите режиссёра фильма "Титаник".', answer: 'Кэмерон', difficulty: 2 },
    { question: 'В каком фильме звучит фраза "Я вернусь"?', answer: 'Терминатор', difficulty: 3 },
    { question: 'Кто сыграл главную роль в фильме "Бегущий по лезвию"?', answer: 'Форд', difficulty: 4 },
    { question: 'Какой фильм получил "Оскар" как лучший фильм в 2020 году?', answer: 'Паразиты', difficulty: 5 }
  ],
  'Наука': [
    { question: 'Формула воды?', answer: 'H2O', difficulty: 1 },
    { question: 'Кто изобрёл радио?', answer: 'Попов', difficulty: 2 },
    { question: 'Самая близкая звезда к Земле (кроме Солнца)?', answer: 'Проксима Центавра', difficulty: 3 },
    { question: 'Кто открыл закон всемирного тяготения?', answer: 'Ньютон', difficulty: 4 },
    { question: 'Как называется теория, описывающая происхождение Вселенной?', answer: 'Большой взрыв', difficulty: 5 }
  ],
  'Казино': [
    { question: 'Как называется карточная игра с дилером, где нужно набрать 21 очко?', answer: 'Блэкджек', difficulty: 1 },
    { question: 'Какой символ в слотах заменяет другие?', answer: 'Wild', difficulty: 2 },
    { question: 'Что означает RTP?', answer: 'Return to Player', difficulty: 3 },
    { question: 'Сколько чисел в европейской рулетке?', answer: '37', difficulty: 4 },
    { question: 'Назовите самый известный покерный турнир в мире.', answer: 'WSOP', difficulty: 5 }
  ]
};

// Задания казино (разной сложности)
const casinoTasks = {
  1: 'Сделать ставку 100₽ на красное в рулетке',
  2: 'Сделать ставку 500₽ на число 7',
  3: 'Сыграть 10 спинов в слот с бонусной игрой',
  4: 'Сделать ставку 2000₽ на точный счёт в футболе',
  5: 'Поставить все накопленные монеты на одно число в рулетке'
};

let gameState = {
  selectedTopic: null,
  selectedDifficulty: null,
  currentQuestion: null,
  currentTask: null,
  asked: false,
  answerGiven: false,
  lastAnswer: null,
  helpUsed: false,
  helpType: null, // 'chat', 'vika', 'batya'
  score: 0,
  answeredQuestions: [] // { topic, difficulty, correct }
};

const helpMultipliers = {
  chat: 1.6,   // сложность бонуса +60%
  vika: 1.3,   // +30%
  batya: 1.3
};

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('Стример подключился');
  socket.emit('init', { topics: Object.keys(topics), gameState });

  // Выбор темы и сложности
  socket.on('selectCell', (topic, difficulty) => {
    if (gameState.asked) {
      socket.emit('error', 'Уже выбран вопрос');
      return;
    }
    const questionObj = topics[topic][difficulty-1];
    gameState.selectedTopic = topic;
    gameState.selectedDifficulty = difficulty;
    gameState.currentQuestion = questionObj;
    gameState.currentTask = casinoTasks[difficulty];
    gameState.asked = true;
    gameState.answerGiven = false;
    gameState.helpUsed = false;
    gameState.helpType = null;

    socket.emit('questionSelected', {
      topic,
      difficulty,
      question: questionObj.question,
      task: gameState.currentTask
    });
  });

  // Ответ игрока
  socket.on('answer', (userAnswer) => {
    if (!gameState.asked || gameState.answerGiven) {
      socket.emit('error', 'Невозможно ответить сейчас');
      return;
    }

    const correctAnswer = gameState.currentQuestion.answer.toLowerCase().trim();
    const userAnswerNorm = userAnswer.toLowerCase().trim();
    const isCorrect = (userAnswerNorm === correctAnswer);

    gameState.answerGiven = true;

    let bonusMultiplier = 1;
    if (gameState.helpUsed) {
      bonusMultiplier = helpMultipliers[gameState.helpType];
    }

    let resultMessage = '';
    let taskModifier = '';
    let points = 0;

    if (isCorrect) {
      points = gameState.selectedDifficulty * 100 * bonusMultiplier;
      gameState.score += points;
      resultMessage = `✅ Верно! +${points} очков.`;
      taskModifier = `Ваше задание: ${gameState.currentTask}`;
      // Сохраняем что вопрос отвечен
      gameState.answeredQuestions.push({
        topic: gameState.selectedTopic,
        difficulty: gameState.selectedDifficulty,
        correct: true
      });
    } else {
      // Неправильный ответ: сложность задания увеличивается на 100%
      const newTaskDifficulty = Math.min(5, gameState.selectedDifficulty + 1);
      const newTask = casinoTasks[newTaskDifficulty];
      resultMessage = `❌ Неправильно. Правильный ответ: ${gameState.currentQuestion.answer}. Сложность задания увеличена!`;
      taskModifier = `Ваше новое задание: ${newTask}`;
      // Не добавляем очки, но записываем неправильный ответ
      gameState.answeredQuestions.push({
        topic: gameState.selectedTopic,
        difficulty: gameState.selectedDifficulty,
        correct: false
      });
    }

    socket.emit('answerResult', {
      isCorrect,
      resultMessage,
      taskModifier,
      points: isCorrect ? points : 0,
      score: gameState.score
    });

    // Сбрасываем состояние для следующего вопроса
    gameState.asked = false;
    gameState.answerGiven = false;
    gameState.helpUsed = false;
    gameState.helpType = null;
    gameState.selectedTopic = null;
    gameState.selectedDifficulty = null;
    gameState.currentQuestion = null;
  });

  // Использование помощи
  socket.on('useHelp', (type) => {
    if (!gameState.asked || gameState.answerGiven) {
      socket.emit('error', 'Сейчас нельзя использовать помощь');
      return;
    }
    if (gameState.helpUsed) {
      socket.emit('error', 'Помощь уже использована');
      return;
    }
    gameState.helpUsed = true;
    gameState.helpType = type;
    let helpText = '';
    switch(type) {
      case 'chat':
        helpText = 'Чат подсказывает: возможно, ответ начинается с буквы "' + gameState.currentQuestion.answer[0] + '"';
        break;
      case 'vika':
        helpText = 'Вика считает, что правильный ответ: ' + gameState.currentQuestion.answer;
        break;
      case 'batya':
        helpText = 'Батя уверен: ответ — ' + gameState.currentQuestion.answer;
        break;
    }
    socket.emit('helpResult', { type, helpText });
  });

  socket.on('reset', () => {
    gameState = {
      selectedTopic: null,
      selectedDifficulty: null,
      currentQuestion: null,
      currentTask: null,
      asked: false,
      answerGiven: false,
      lastAnswer: null,
      helpUsed: false,
      helpType: null,
      score: 0,
      answeredQuestions: []
    };
    socket.emit('resetComplete');
  });

  socket.on('disconnect', () => console.log('Стример отключился'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Своя игра запущена на порту ${PORT}`));
