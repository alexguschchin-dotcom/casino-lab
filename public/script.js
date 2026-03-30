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
let totalQuestions = 39;
let pendingPlayer = null;

// DOM элементы
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
const streakElements = {
    Alex: document.getElementById('streak-Alex'),
    Vika: document.getElementById('streak-Vika'),
    Batya: document.getElementById('streak-Batya')
};
const answerBtns = document.querySelectorAll('.answer-btn');
const resetBtn = document.getElementById('reset-btn');
const mapTrack = document.getElementById('map-track');
const mapMarkers = document.getElementById('map-markers');
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
const flashOverlay = document.getElementById('flash-overlay');
const leaderboardList = document.getElementById('leaderboard-list');

// Звуки
let soundsEnabled = true;
const sounds = {
    bg: document.getElementById('sound-bg'),
    scroll: document.getElementById('sound-scroll'),
    click: document.getElementById('sound-click'),
    correct: document.getElementById('sound-correct'),
    wrong: document.getElementById('sound-wrong'),
    bonus: document.getElementById('sound-bonus'),
    transition: document.getElementById('sound-transition')
};

function playSound(name) {
    if (soundsEnabled && sounds[name]) {
        sounds[name].currentTime = 0;
        sounds[name].play().catch(e => console.log('Audio play failed', e));
    }
}

// Переключение звука
soundToggle.addEventListener('click', () => {
    soundsEnabled = !soundsEnabled;
    soundToggle.innerHTML = soundsEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
    if (soundsEnabled && sounds.bg) {
        sounds.bg.play().catch(e => console.log);
    } else if (!soundsEnabled && sounds.bg) {
        sounds.bg.pause();
    }
});

// Инициализация карты-прогресса с маркерами
function initMapMarkers() {
    mapMarkers.innerHTML = '';
    for (let i = 0; i < totalQuestions; i++) {
        const marker = document.createElement('div');
        marker.className = 'marker';
        if (i < gameState.currentQuestion) marker.classList.add('completed');
        if (i === gameState.currentQuestion) marker.classList.add('active');
        marker.setAttribute('data-num', i+1);
        marker.style.left = `${(i / (totalQuestions-1)) * 100}%`;
        mapMarkers.appendChild(marker);
    }
}

function updateMapMarkers() {
    const markers = document.querySelectorAll('.marker');
    markers.forEach((marker, idx) => {
        marker.classList.remove('completed', 'active');
        if (idx < gameState.currentQuestion) marker.classList.add('completed');
        if (idx === gameState.currentQuestion) marker.classList.add('active');
    });
    const progress = (gameState.currentQuestion / totalQuestions) * 100;
    mapTrack.style.width = `${progress}%`;
}

// Обновление UI (очки, монеты, серии, бонусы, лидерборд)
function updateUI() {
    for (let p of gameState.players) {
        scoreElements[p].textContent = gameState.scores[p];
        coinsElements[p].textContent = `💰 ${gameState.coins[p].toLocaleString()}`;
        streakElements[p].textContent = `🔥 ${gameState.streak[p]}`;
        const askBtn = document.querySelector(`.bonus-btn.ask-chat[data-player="${p}"]`);
        const skipBtn = document.querySelector(`.bonus-btn.skip[data-player="${p}"]`);
        if (askBtn) askBtn.disabled = !gameState.bonuses[p].includes('askChat');
        if (skipBtn) skipBtn.disabled = !gameState.bonuses[p].includes('skipQuestion');
    }
    updateLeaderboard();
}

function updateLeaderboard() {
    const sorted = [...gameState.players].sort((a,b) => gameState.scores[b] - gameState.scores[a]);
    leaderboardList.innerHTML = sorted.map(p => {
        const name = { Alex: 'Алексей', Vika: 'Вика', Batya: 'Батя' }[p];
        return `<div class="leader-entry">${name}: ${gameState.scores[p]} очков (💰 ${gameState.coins[p].toLocaleString()})</div>`;
    }).join('');
}

// Анимация падающих монет
function startCoinRain() {
    const container = document.createElement('div');
    container.className = 'coin-rain';
    document.body.appendChild(container);
    for (let i = 0; i < 50; i++) {
        const coin = document.createElement('div');
        coin.className = 'coin';
        coin.style.left = Math.random() * 100 + '%';
        coin.style.animationDuration = 1 + Math.random() * 2 + 's';
        coin.style.animationDelay = Math.random() * 0.5 + 's';
        container.appendChild(coin);
    }
    setTimeout(() => container.remove(), 3000);
}

// Эффект штрафа
function flashRed() {
    flashOverlay.classList.add('active');
    setTimeout(() => flashOverlay.classList.remove('active'), 500);
}

// Отображение вопроса с анимацией свитка
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
            playSound('click');
            socket.emit('answer', pendingPlayer, idx);
            pendingPlayer = null;
            gameState.answered = true;
            document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);
        });
        optionsEl.appendChild(btn);
    });
    if (!gameState.answered && !gameState.gameCompleted) {
        document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = false);
    } else {
        document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);
    }
    // Анимация свитка
    const card = document.getElementById('question-card');
    card.classList.remove('scroll-animation');
    void card.offsetWidth;
    card.classList.add('scroll-animation');
    playSound('scroll');
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

// Обработчики сокетов
socket.on('init', (data) => {
    gameState = data.state;
    currentQuestion = data.question;
    totalQSpan.textContent = totalQuestions;
    currentQSpan.textContent = gameState.currentQuestion + 1;
    updateUI();
    initMapMarkers();
    updateMapMarkers();
    renderQuestion(currentQuestion);
    gameState.answered = data.state.answered;
    gameState.gameCompleted = data.state.gameCompleted;
    pendingPlayer = null;
    if (soundsEnabled && sounds.bg) sounds.bg.play().catch(e=>console.log);
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
    updateUI();
    updateMapMarkers();
    renderQuestion(currentQuestion);
    pendingPlayer = null;
    playSound('transition');
});

socket.on('result', (data) => {
    const playerName = { Alex: 'Алексей', Vika: 'Вика', Batya: 'Батя' }[data.player];
    const message = data.isCorrect
        ? `${playerName} ответил(а) верно! +100 000 монет.`
        : `${playerName} ошибся(лась). Штраф 300 000 монет. Правильный ответ: ${data.correctAnswer}`;
    resultTitle.textContent = data.isCorrect ? '✅ Верно!' : '❌ Неверно';
    resultMessage.textContent = message;
    resultModal.classList.remove('hidden');
    if (data.isCorrect) {
        playSound('correct');
        startCoinRain();
    } else {
        playSound('wrong');
        flashRed();
    }
    gameState.scores = data.scores;
    gameState.coins[data.player] = data.coins;
    gameState.streak[data.player] = data.streak;
    updateUI();
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
    if (sounds.bg) sounds.bg.pause();
});

socket.on('chatHint', (data) => {
    hintText.textContent = `📢 Чат считает, что правильный ответ: "${data.hint}"`;
    hintModal.classList.remove('hidden');
    playSound('bonus');
});

socket.on('skipBroadcast', (data) => {
    const playerName = { Alex: 'Алексей', Vika: 'Вика', Batya: 'Батя' }[data.player];
    showToast(`${playerName} использовал пропуск вопроса!`);
    playSound('bonus');
});

socket.on('bonusUpdate', (data) => {
    gameState.bonuses = data.bonuses;
    updateUI();
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
updateUI();
initMapMarkers();