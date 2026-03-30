const socket = io();

let gameState = {
    currentQuestion: 0,
    scores: { Alex: 0, Vika: 0, Batya: 0 },
    answered: false,
    gameCompleted: false,
    players: ['Alex', 'Vika', 'Batya']
};

let currentQuestion = null;

const totalQuestions = 20; // должно совпадать с количеством вопросов в server.js
const questionTextEl = document.getElementById('question-text');
const optionsEl = document.getElementById('options');
const currentQSpan = document.getElementById('current-q');
const totalQSpan = document.getElementById('total-q');
const scoreElements = {
    Alex: document.getElementById('score-Alex'),
    Vika: document.getElementById('score-Vika'),
    Batya: document.getElementById('score-Batya')
};
const answerBtns = document.querySelectorAll('.answer-btn');
const resetBtn = document.getElementById('reset-btn');
const mapTrack = document.getElementById('map-track');
const resultModal = document.getElementById('result-modal');
const resultTitle = document.getElementById('result-title');
const resultMessage = document.getElementById('result-message');
const closeModalBtn = document.getElementById('close-modal');
const gameoverModal = document.getElementById('gameover-modal');
const finalScoresDiv = document.getElementById('final-scores');
const newGameBtn = document.getElementById('new-game-btn');

// Рендер прогресса на карте (проценты)
function updateMapProgress() {
    const progress = (gameState.currentQuestion / totalQuestions) * 100;
    mapTrack.style.width = `${progress}%`;
}

// Отображение вопроса и вариантов
function renderQuestion(question) {
    questionTextEl.textContent = question.text;
    optionsEl.innerHTML = '';
    question.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.dataset.index = idx;
        btn.addEventListener('click', () => {
            // Если кто-то уже ответил, блокируем
            if (gameState.answered || gameState.gameCompleted) {
                showToast('На этот вопрос уже ответили!');
                return;
            }
            // Выбираем игрока, который сейчас ответит — для простоты, показываем окно выбора игрока
            // В реальности можно сделать отдельную кнопку для каждого игрока.
            // У нас уже есть кнопки "Ответить" под именами, поэтому здесь просто показываем подсказку
            showToast('Нажмите кнопку "Ответить" под своим именем!');
        });
        optionsEl.appendChild(btn);
    });
}

function updateScoresUI() {
    scoreElements.Alex.textContent = gameState.scores.Alex;
    scoreElements.Vika.textContent = gameState.scores.Vika;
    scoreElements.Batya.textContent = gameState.scores.Batya;
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

socket.on('init', (data) => {
    gameState = data.state;
    currentQuestion = data.question;
    renderQuestion(currentQuestion);
    currentQSpan.textContent = gameState.currentQuestion + 1;
    totalQSpan.textContent = totalQuestions;
    updateScoresUI();
    updateMapProgress();
    gameState.answered = false;
    gameState.gameCompleted = false;
});

socket.on('nextQuestion', (data) => {
    gameState.scores = data.scores;
    gameState.currentQuestion++;
    currentQuestion = data.question;
    renderQuestion(currentQuestion);
    currentQSpan.textContent = gameState.currentQuestion + 1;
    updateScoresUI();
    updateMapProgress();
    gameState.answered = false;
    gameState.gameCompleted = false;
});

socket.on('result', (data) => {
    const playerName = { Alex: 'Алексей', Vika: 'Вика', Batya: 'Батя' }[data.player];
    const message = data.isCorrect
        ? `${playerName} ответил(а) верно!`
        : `${playerName} ошибся(лась). Правильный ответ: ${data.correctAnswer}`;
    resultTitle.textContent = data.isCorrect ? '✅ Верно!' : '❌ Неверно';
    resultMessage.textContent = message;
    resultModal.classList.remove('hidden');
});

socket.on('gameOver', (data) => {
    gameState.gameCompleted = true;
    finalScoresDiv.innerHTML = '';
    const sorted = Object.entries(data.scores).sort((a,b) => b[1] - a[1]);
    sorted.forEach(([player, score]) => {
        const name = { Alex: 'Алексей', Vika: 'Вика', Batya: 'Батя' }[player];
        finalScoresDiv.innerHTML += `<p>${name}: ${score} баллов</p>`;
    });
    gameoverModal.classList.remove('hidden');
});

closeModalBtn.addEventListener('click', () => {
    resultModal.classList.add('hidden');
});

newGameBtn.addEventListener('click', () => {
    socket.emit('reset');
    gameoverModal.classList.add('hidden');
});

resetBtn.addEventListener('click', () => {
    if (confirm('Начать новую игру?')) {
        socket.emit('reset');
    }
});

// Обработка ответа игрока
answerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const player = btn.dataset.player;
        if (gameState.answered || gameState.gameCompleted) {
            showToast('На этот вопрос уже ответили!');
            return;
        }
        // Показываем всплывающее окно с вариантами? Нет, игрок должен выбрать вариант ответа.
        // Мы сделаем проще: при клике на "Ответить" активируем выбор варианта.
        // Но вариант уже может быть выбран. В нашем UI нет выделения варианта. 
        // Упростим: после клика на кнопку "Ответить" игроку нужно кликнуть на один из вариантов.
        // Для этого сохраним выбранного игрока и вариант.
        if (!gameState.pendingPlayer) {
            gameState.pendingPlayer = player;
            showToast(`Игрок ${player}, выберите вариант ответа!`);
        } else {
            showToast(`Сейчас отвечает другой игрок`);
        }
    });
});

// Логика выбора варианта после нажатия "Ответить"
optionsEl.addEventListener('click', (e) => {
    const optionBtn = e.target.closest('.option-btn');
    if (!optionBtn) return;
    if (!gameState.pendingPlayer) {
        showToast('Сначала нажмите кнопку "Ответить" под своим именем!');
        return;
    }
    const player = gameState.pendingPlayer;
    const answerIndex = parseInt(optionBtn.dataset.index);
    socket.emit('answer', player, answerIndex);
    gameState.pendingPlayer = null;
    gameState.answered = true;
    // Блокируем варианты
    document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);
});

// Инициализация
updateMapProgress();