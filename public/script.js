const socket = io();

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

let currentQuestion = null;
let totalQuestions = 39; // обновлено
let pendingPlayer = null; // кто сейчас нажал "Ответить"

const questionTextEl = document.getElementById('question-text');
const optionsEl = document.getElementById('options');
const currentQSpan = document.getElementById('current-q');
const totalQSpan = document.getElementById('total-q');
const scoreElements = {
    Alex: document.getElementById('score-Alex'),
    Vika: document.getElementById('score-Vika'),
    Batya: document.getElementById('score-Batya')
};
const coinsElements = {
    Alex: document.getElementById('coins-Alex'),
    Vika: document.getElementById('coins-Vika'),
    Batya: document.getElementById('coins-Batya')
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
const hintModal = document.getElementById('hint-modal');
const hintText = document.getElementById('hint-text');
const closeHintBtn = document.getElementById('close-hint');
const soundToggle = document.getElementById('sound-toggle');
let soundsEnabled = true;
const sounds = {
    correct: document.getElementById('sound-correct'),
    wrong: document.getElementById('sound-wrong'),
    bonus: document.getElementById('sound-bonus'),
    ambient: document.getElementById('sound-ambient')
};

function playSound(name) {
    if (soundsEnabled && sounds[name]) {
        sounds[name].currentTime = 0;
        sounds[name].play().catch(e => console.log('Audio play failed', e));
    }
}

soundToggle.addEventListener('click', () => {
    soundsEnabled = !soundsEnabled;
    soundToggle.innerHTML = soundsEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
    if (soundsEnabled && sounds.ambient) {
        sounds.ambient.play().catch(e => console.log);
    } else if (!soundsEnabled && sounds.ambient) {
        sounds.ambient.pause();
    }
});

function updateMapProgress() {
    const progress = (gameState.currentQuestion / totalQuestions) * 100;
    mapTrack.style.width = `${progress}%`;
}

function updateScoresUI() {
    for (let p of gameState.players) {
        scoreElements[p].textContent = gameState.scores[p];
        coinsElements[p].textContent = `💰 ${gameState.coins[p].toLocaleString()}`;
        // Обновляем кнопки бонусов
        const askBtn = document.querySelector(`.bonus-btn.ask-chat[data-player="${p}"]`);
        const skipBtn = document.querySelector(`.bonus-btn.skip[data-player="${p}"]`);
        if (askBtn) askBtn.disabled = !gameState.bonuses[p].includes('askChat');
        if (skipBtn) skipBtn.disabled = !gameState.bonuses[p].includes('skipQuestion');
    }
}

function renderQuestion(question) {
    questionTextEl.textContent = question.text;
    optionsEl.innerHTML = '';
    question.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.dataset.index = idx;
        btn.addEventListener('click', () => {
            if (gameState.answered || gameState.gameCompleted) {
                showToast('На этот вопрос уже ответили!');
                return;
            }
            if (!pendingPlayer) {
                showToast('Сначала нажмите кнопку "Ответить" под своим именем!');
                return;
            }
            // Отправляем ответ
            socket.emit('answer', pendingPlayer, idx);
            pendingPlayer = null;
            gameState.answered = true;
            document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);
        });
        optionsEl.appendChild(btn);
    });
    // Если вопрос активен, включаем варианты
    if (!gameState.answered && !gameState.gameCompleted) {
        document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = false);
    } else {
        document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);
    }
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
    totalQSpan.textContent = totalQuestions;
    currentQSpan.textContent = gameState.currentQuestion + 1;
    updateScoresUI();
    updateMapProgress();
    renderQuestion(currentQuestion);
    gameState.answered = data.state.answered;
    gameState.gameCompleted = data.state.gameCompleted;
    pendingPlayer = null;
    if (gameState.gameCompleted) {
        // возможно, уже конец
    }
    if (soundsEnabled && sounds.ambient) sounds.ambient.play().catch(e=>console.log);
});

socket.on('nextQuestion', (data) => {
    gameState.scores = data.scores;
    gameState.coins = data.coins;
    gameState.bonuses = data.bonuses;
    gameState.streak = data.streak;
    gameState.currentQuestion++;
    gameState.answered = false;
    gameState.gameCompleted = false;
    currentQuestion = data.question;
    currentQSpan.textContent = gameState.currentQuestion + 1;
    updateScoresUI();
    updateMapProgress();
    renderQuestion(currentQuestion);
    pendingPlayer = null;
});

socket.on('result', (data) => {
    const playerName = { Alex: 'Алексей', Vika: 'Вика', Batya: 'Батя' }[data.player];
    const message = data.isCorrect
        ? `${playerName} ответил(а) верно! +100 000 монет.`
        : `${playerName} ошибся(лась). Штраф 300 000 монет. Правильный ответ: ${data.correctAnswer}`;
    resultTitle.textContent = data.isCorrect ? '✅ Верно!' : '❌ Неверно';
    resultMessage.textContent = message;
    resultModal.classList.remove('hidden');
    playSound(data.isCorrect ? 'correct' : 'wrong');
    gameState.scores = data.scores;
    gameState.coins[data.player] = data.coins;
    gameState.streak[data.player] = data.streak;
    updateScoresUI();
});

socket.on('gameOver', (data) => {
    gameState.gameCompleted = true;
    finalScoresDiv.innerHTML = '';
    const sorted = Object.entries(data.scores).sort((a,b) => b[1] - a[1]);
    sorted.forEach(([player, score]) => {
        const name = { Alex: 'Алексей', Vika: 'Вика', Batya: 'Батя' }[player];
        const coins = data.coins[player];
        finalScoresDiv.innerHTML += `<p>${name}: ${score} очков (💰 ${coins.toLocaleString()} монет)</p>`;
    });
    gameoverModal.classList.remove('hidden');
    if (sounds.ambient) sounds.ambient.pause();
});

socket.on('chatHint', (data) => {
    hintText.textContent = `📢 Чат считает, что правильный ответ: "${data.hint}"`;
    hintModal.classList.remove('hidden');
});

socket.on('skipBroadcast', (data) => {
    const playerName = { Alex: 'Алексей', Vika: 'Вика', Batya: 'Батя' }[data.player];
    showToast(`${playerName} использовал пропуск вопроса!`);
    playSound('bonus');
});

socket.on('bonusUpdate', (data) => {
    gameState.bonuses = data.bonuses;
    updateScoresUI();
});

socket.on('bonusError', (msg) => {
    showToast(msg);
});

closeModalBtn.addEventListener('click', () => {
    resultModal.classList.add('hidden');
});
closeHintBtn.addEventListener('click', () => {
    hintModal.classList.add('hidden');
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

answerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const player = btn.dataset.player;
        if (gameState.answered || gameState.gameCompleted) {
            showToast('На этот вопрос уже ответили!');
            return;
        }
        if (pendingPlayer) {
            showToast(`Сейчас отвечает другой игрок!`);
            return;
        }
        pendingPlayer = player;
        showToast(`Игрок ${player}, выберите вариант ответа!`);
    });
});

// Бонусные кнопки
document.querySelectorAll('.bonus-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const player = btn.dataset.player;
        const bonusType = btn.dataset.bonus;
        if (gameState.answered || gameState.gameCompleted) {
            showToast('Сейчас нельзя использовать бонус');
            return;
        }
        socket.emit('useBonus', player, bonusType);
    });
});

// Инициализация
updateMapProgress();