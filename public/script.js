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

// ========== Звуки через Web Audio (улучшенная фоновая музыка) ==========
let audioCtx = null;
let soundsEnabled = true;
let bgGain = null;
let bgInterval = null;
let currentMelodyIndex = 0;
const melody = [
    { freq: 262, duration: 0.5 }, // C4
    { freq: 294, duration: 0.5 }, // D4
    { freq: 330, duration: 0.5 }, // E4
    { freq: 349, duration: 0.5 }, // F4
    { freq: 392, duration: 0.5 }, // G4
    { freq: 440, duration: 0.5 }, // A4
    { freq: 494, duration: 0.5 }, // B4
    { freq: 523, duration: 1.0 }  // C5
];

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playTone(frequency, duration, type = 'sine', volume = 0.3, delay = 0) {
    if (!soundsEnabled) return;
    if (!audioCtx) initAudio();
    const now = audioCtx.currentTime + delay;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + duration);
}

function playCorrect() {
    playTone(880, 0.2, 'sine', 0.4);
    playTone(1100, 0.3, 'sine', 0.3);
    playTone(1320, 0.4, 'sine', 0.2);
}
function playWrong() {
    playTone(440, 0.3, 'sawtooth', 0.3);
    playTone(330, 0.4, 'sawtooth', 0.3);
}
function playBonus() {
    playTone(1318, 0.15, 'sine', 0.2);
    playTone(1568, 0.15, 'sine', 0.2);
    playTone(1760, 0.2, 'sine', 0.2);
    playTone(2093, 0.3, 'sine', 0.2);
}
function playClick() {
    playTone(800, 0.05, 'triangle', 0.1);
}
function playScroll() {
    playTone(400, 0.1, 'sine', 0.1);
    playTone(300, 0.15, 'sine', 0.1);
}
function playTransition() {
    playTone(600, 0.2, 'sine', 0.15);
    playTone(500, 0.2, 'sine', 0.15);
}

// Фоновая мелодия (эпическая)
function playNextNote() {
    if (!soundsEnabled || !audioCtx) return;
    const note = melody[currentMelodyIndex % melody.length];
    playTone(note.freq, note.duration, 'sine', 0.08);
    currentMelodyIndex++;
    if (bgInterval) clearTimeout(bgInterval);
    bgInterval = setTimeout(playNextNote, note.duration * 1000 + 200);
}
function startBackgroundMusic() {
    if (!soundsEnabled) return;
    if (!audioCtx) initAudio();
    if (bgInterval) clearTimeout(bgInterval);
    currentMelodyIndex = 0;
    playNextNote();
}
function stopBackgroundMusic() {
    if (bgInterval) {
        clearTimeout(bgInterval);
        bgInterval = null;
    }
}
soundToggle.addEventListener('click', () => {
    soundsEnabled = !soundsEnabled;
    soundToggle.innerHTML = soundsEnabled ? '<i class="fas fa-music"></i>' : '<i class="fas fa-volume-mute"></i>';
    if (soundsEnabled) {
        if (!audioCtx) initAudio();
        audioCtx.resume();
        startBackgroundMusic();
    } else {
        stopBackgroundMusic();
    }
});

// ========== Частицы ==========
const canvas = document.getElementById('particle-canvas');
let ctx = canvas.getContext('2d');
let particles = [];
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5 + 0.2;
        this.color = `rgba(212, 175, 55, ${Math.random() * 0.5})`;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.y > canvas.height) this.y = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}
function initParticles() {
    particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
}
function animateParticles() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}
initParticles();
animateParticles();

// ========== Прогресс и UI ==========
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
        console.error('Нет данных вопроса');
        questionTextEl.textContent = 'Ошибка загрузки вопроса. Перезагрузите страницу.';
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
            playClick();
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
    playScroll();
}
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

// ========== Сокеты ==========
socket.on('init', (data) => {
    console.log('Init received', data);
    if (!data || !data.state || !data.question) {
        console.error('Ошибка: неполные данные инициализации');
        questionTextEl.textContent = 'Ошибка подключения к серверу. Обновите страницу.';
        return;
    }
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
    if (soundsEnabled) {
        initAudio();
        audioCtx.resume().catch(e => console.log('AudioContext resume failed', e));
        startBackgroundMusic();
    }
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
    playTransition();
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
        playCorrect();
        startCoinRain();
    } else {
        playWrong();
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
    stopBackgroundMusic();
});
socket.on('chatHint', (data) => {
    hintText.textContent = `📢 Чат считает, что правильный ответ: "${data.hint}"`;
    hintModal.classList.remove('hidden');
    playBonus();
});
socket.on('skipBroadcast', (data) => {
    const playerName = { Alex: 'Алексей', Vika: 'Вика', Batya: 'Батя' }[data.player];
    showToast(`${playerName} использовал пропуск вопроса!`);
    playBonus();
});
socket.on('bonusUpdate', (data) => {
    gameState.bonuses = data.bonuses;
    updateUI();
});
socket.on('bonusError', (msg) => {
    showToast(msg);
});

// Обработчики модалок и кнопок
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
        // Принудительно возобновляем аудио контекст при первом клике
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume().then(() => {
                if (soundsEnabled && !bgInterval) startBackgroundMusic();
            });
        }
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

// Инициализация UI
updateUI();
initMapMarkers();

// Добавляем анимацию для карточки
const style = document.createElement('style');
style.textContent = `
    @keyframes scrollReveal {
        0% { opacity: 0; transform: translateY(30px) rotateX(15deg); }
        100% { opacity: 1; transform: translateY(0) rotateX(0); }
    }
`;
document.head.appendChild(style);