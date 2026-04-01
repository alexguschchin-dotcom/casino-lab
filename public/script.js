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
let soundsEnabled = true;
let currentTimeLeft = 90;

// DOM элементы
const questionTextEl = document.getElementById('question-text');
const optionsEl = document.getElementById('options');
const currentQSpan = document.getElementById('current-q');
const totalQSpan = document.getElementById('total-q');
const timerText = document.getElementById('timer-text');
const timerDisplay = document.getElementById('timer-display');
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

// Аудио элементы
const musicMain = document.getElementById('music-main');
const musicQuestion = document.getElementById('music-question');
const musicWarning = document.getElementById('music-warning');
const musicUrgent = document.getElementById('music-urgent');
const soundCorrect = document.getElementById('sound-correct');
const soundWrong = document.getElementById('sound-wrong');

function stopAllMusic() {
    musicMain.pause();
    musicQuestion.pause();
    musicWarning.pause();
    musicUrgent.pause();
    musicMain.currentTime = 0;
    musicQuestion.currentTime = 0;
    musicWarning.currentTime = 0;
    musicUrgent.currentTime = 0;
}

function playMusic(type) {
    if (!soundsEnabled) return;
    stopAllMusic();
    
    switch(type) {
        case 'main':
            musicMain.play().catch(e => console.log);
            break;
        case 'question':
            musicQuestion.play().catch(e => console.log);
            break;
        case 'warning':
            musicWarning.play().catch(e => console.log);
            break;
        case 'urgent':
            musicUrgent.play().catch(e => console.log);
            break;
    }
}

function updateTimer(seconds) {
    currentTimeLeft = seconds;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    timerText.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    
    timerDisplay.classList.remove('warning', 'urgent');
    if (seconds <= 60 && seconds > 30) {
        timerDisplay.classList.add('warning');
    } else if (seconds <= 30 && seconds > 0) {
        timerDisplay.classList.add('urgent');
    }
}

function initMapMarkers() {
    mapMarkers.innerHTML = '';
    for (let i = 0; i < totalQuestions; i++) {
        const marker = document.createElement('div');
        marker.className = 'marker';
        if (i < gameState.currentQuestion) marker.classList.add('completed');
        if (i === gameState.currentQuestion) marker.classList.add('active');
        marker.setAttribute('data-num', i+1);
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

function updateUI() {
    for (let p of gameState.players) {
        scoreElements[p].textContent = gameState.scores[p];
        coinsElements[p].textContent = `💰 ${gameState.coins[p].toLocaleString()}`;
        streakElements[p].textContent = `🔥 ${gameState.streak[p]}`;
        const askBtn = document.querySelector(`.bonus-btn.ask-chat[data-player="${p}"]`);
        if (askBtn) askBtn.disabled = !gameState.bonuses[p].includes('askChat');
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

function startCoinRain() {
    const container = document.createElement('div');
    container.className = 'coin-rain';
    document.body.appendChild(container);
    for (let i = 0; i < 70; i++) {
        const coin = document.createElement('div');
        coin.className = 'coin';
        coin.style.left = Math.random() * 100 + '%';
        coin.style.animationDuration = 1 + Math.random() * 2.5 + 's';
        coin.style.animationDelay = Math.random() * 0.8 + 's';
        container.appendChild(coin);
    }
    setTimeout(() => container.remove(), 3000);
}

function flashRed() {
    flashOverlay.classList.add('active');
    setTimeout(() => flashOverlay.classList.remove('active'), 500);
}

function renderQuestion(question) {
    if (!question) {
        questionTextEl.textContent = 'Ошибка загрузки вопроса';
        return;
    }
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
    card.style.animation = 'none';
    card.offsetHeight;
    card.style.animation = 'scrollReveal 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1)';
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

// Сокет события
socket.on('init', (data) => {
    console.log('Init received');
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
    updateTimer(90);
    playMusic('question');
});

socket.on('nextQuestion', (data) => {
    gameState.scores = data.scores;
    gameState.coins = data.coins;
    gameState.bonuses = data.bonuses;
    gameState.streak = data.streak;
    gameState.currentQuestion = data.currentQuestion;
    gameState.answered = false;
    gameState.gameCompleted = false;
    currentQuestion = data.question;
    currentQSpan.textContent = gameState.currentQuestion + 1;
    updateUI();
    updateMapMarkers();
    renderQuestion(currentQuestion);
    pendingPlayer = null;
    updateTimer(90);
    playMusic('question');
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
        if (soundsEnabled) soundCorrect.play();
        startCoinRain();
    } else {
        if (soundsEnabled) soundWrong.play();
        flashRed();
    }
    
    gameState.scores = data.scores;
    gameState.coins[data.player] = data.coins;
    gameState.streak[data.player] = data.streak;
    updateUI();
    
    setTimeout(() => {
        resultModal.classList.add('hidden');
    }, 2000);
});

socket.on('timerUpdate', (data) => {
    updateTimer(data.timeLeft);
});

socket.on('playMusic', (type) => {
    playMusic(type);
});

socket.on('stopMusic', () => {
    playMusic('question'); // возвращаем основную музыку вопроса
});

socket.on('timeout', () => {
    showToast('Время вышло! Никто не ответил.');
    playMusic('urgent');
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
    stopAllMusic();
});

socket.on('chatHint', (data) => {
    hintText.textContent = `📢 Чат считает, что правильный ответ: "${data.hint}"`;
    hintModal.classList.remove('hidden');
});

socket.on('bonusUpdate', (data) => {
    gameState.bonuses = data.bonuses;
    updateUI();
});

socket.on('bonusError', (msg) => {
    showToast(msg);
});

socket.on('error', (msg) => {
    showToast(msg);
});

socket.on('resetGame', (data) => {
    gameState = data.state;
    currentQuestion = data.question;
    totalQSpan.textContent = totalQuestions;
    currentQSpan.textContent = gameState.currentQuestion + 1;
    updateUI();
    initMapMarkers();
    updateMapMarkers();
    renderQuestion(currentQuestion);
    gameState.answered = false;
    gameState.gameCompleted = false;
    pendingPlayer = null;
    updateTimer(90);
    playMusic('question');
});

// Обработчики кнопок
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
        document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = false);
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

soundToggle.addEventListener('click', () => {
    soundsEnabled = !soundsEnabled;
    soundToggle.innerHTML = soundsEnabled ? '<i class="fas fa-music"></i>' : '<i class="fas fa-volume-mute"></i>';
    if (!soundsEnabled) {
        stopAllMusic();
    } else {
        playMusic('question');
    }
});

// Инициализация UI
updateUI();
initMapMarkers();

const style = document.createElement('style');
style.textContent = `
    @keyframes scrollReveal {
        0% { opacity: 0; transform: translateY(30px) rotateX(15deg); }
        100% { opacity: 1; transform: translateY(0) rotateX(0); }
    }
`;
document.head.appendChild(style);