const socket = io();

// ========== ВОПРОСЫ (полная копия из server.js) ==========
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

const totalQuestions = questions.length;

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

let pendingPlayer = null;
let isWaitingForNext = false; // блокировка кликов на время перехода

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

// ========== Звуки через Web Audio (короткие эффекты) ==========
let audioCtx = null;
let soundsEnabled = true;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playTone(frequency, duration, type = 'sine', volume = 0.3) {
    if (!soundsEnabled) return;
    if (!audioCtx) initAudio();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
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

// Фоновая музыка (из элемента audio)
const bgMusic = document.getElementById('bg-music');
bgMusic.volume = 0.3;
bgMusic.loop = true;

soundToggle.addEventListener('click', () => {
    soundsEnabled = !soundsEnabled;
    soundToggle.innerHTML = soundsEnabled ? '<i class="fas fa-music"></i>' : '<i class="fas fa-volume-mute"></i>';
    if (soundsEnabled) {
        bgMusic.play().catch(e => console.log('Autoplay blocked'));
        if (audioCtx) audioCtx.resume();
    } else {
        bgMusic.pause();
    }
});

// ========== Частицы (упрощённые) ==========
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
        this.size = Math.random() * 2 + 1;
        this.speedY = Math.random() * 0.5 + 0.1;
        this.color = `rgba(212, 175, 55, ${Math.random() * 0.4})`;
    }
    update() {
        this.y += this.speedY;
        if (this.y > canvas.height) this.y = 0;
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
    for (let i = 0; i < 80; i++) particles.push(new Particle());
}
function animateParticles() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
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
    for (let i = 0; i < 60; i++) {
        const coin = document.createElement('div');
        coin.className = 'coin';
        coin.style.left = Math.random() * 100 + '%';
        coin.style.animationDuration = 1 + Math.random() * 2 + 's';
        coin.style.animationDelay = Math.random() * 0.8 + 's';
        container.appendChild(coin);
    }
    setTimeout(() => container.remove(), 3000);
}
function flashRed() {
    flashOverlay.classList.add('active');
    setTimeout(() => flashOverlay.classList.remove('active'), 500);
}
function renderQuestion(question, questionIndex) {
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
            if (isWaitingForNext || gameState.answered || gameState.gameCompleted) {
                showToast('На этот вопрос уже ответили или идёт загрузка!');
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
            isWaitingForNext = true;
            document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);
        });
        optionsEl.appendChild(btn);
    });
    if (!gameState.answered && !gameState.gameCompleted && !isWaitingForNext) {
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

// ========== Инициализация: показываем первый вопрос ==========
function initGameFromLocal() {
    totalQSpan.textContent = totalQuestions;
    currentQSpan.textContent = gameState.currentQuestion + 1;
    renderQuestion(questions[gameState.currentQuestion], gameState.currentQuestion);
    updateUI();
    initMapMarkers();
    updateMapMarkers();
}
initGameFromLocal();

// ========== Сокеты ==========
socket.on('init', (data) => {
    // Принимаем данные с сервера для синхронизации счёта, монет, бонусов
    if (data && data.state) {
        gameState.scores = data.state.scores;
        gameState.coins = data.state.coins;
        gameState.bonuses = data.state.bonuses;
        gameState.streak = data.state.streak;
        gameState.currentQuestion = data.state.currentQuestion;
        gameState.answered = data.state.answered;
        gameState.gameCompleted = data.state.gameCompleted;
        currentQSpan.textContent = gameState.currentQuestion + 1;
        renderQuestion(questions[gameState.currentQuestion], gameState.currentQuestion);
        updateUI();
        updateMapMarkers();
    }
    if (soundsEnabled) {
        bgMusic.play().catch(e => console.log('Autoplay blocked, click anywhere to start music'));
        if (audioCtx) audioCtx.resume();
    }
});
socket.on('nextQuestion', (data) => {
    // Сервер подтвердил переход к следующему вопросу
    gameState.scores = data.scores;
    gameState.coins = data.coins;
    gameState.bonuses = data.bonuses;
    gameState.streak = data.streak;
    gameState.currentQuestion++;
    gameState.answered = false;
    isWaitingForNext = false;
    gameState.gameCompleted = false;
    currentQSpan.textContent = gameState.currentQuestion + 1;
    renderQuestion(questions[gameState.currentQuestion], gameState.currentQuestion);
    updateUI();
    updateMapMarkers();
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
    // Через 2 секунды модалка закроется сама (уже есть таймер на сервере, но и здесь закроем)
    setTimeout(() => {
        resultModal.classList.add('hidden');
    }, 2000);
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
    bgMusic.pause();
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
        if (isWaitingForNext || gameState.answered || gameState.gameCompleted) {
            showToast('На этот вопрос уже ответили или идёт загрузка!');
            return;
        }
        if (pendingPlayer) {
            showToast(`Сейчас отвечает другой игрок!`);
            return;
        }
        pendingPlayer = player;
        showToast(`Игрок ${player}, выберите вариант ответа!`);
        // Разблокируем варианты, если они были заблокированы (на случай повторного клика)
        document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = false);
        // Пытаемся запустить музыку, если ещё не запущена
        if (soundsEnabled && bgMusic.paused) {
            bgMusic.play().catch(e => console.log);
        }
    });
});
document.querySelectorAll('.bonus-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const player = btn.dataset.player;
        const bonusType = btn.dataset.bonus;
        if (gameState.answered || gameState.gameCompleted || isWaitingForNext) {
            showToast('Сейчас нельзя использовать бонус');
            return;
        }
        socket.emit('useBonus', player, bonusType);
    });
});

// Добавляем стиль анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes scrollReveal {
        0% { opacity: 0; transform: translateY(30px) rotateX(15deg); }
        100% { opacity: 1; transform: translateY(0) rotateX(0); }
    }
`;
document.head.appendChild(style);