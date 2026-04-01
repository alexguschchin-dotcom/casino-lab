// Данные: темы и вопросы (5 тем, по 5 вопросов)
const themesData = {
    history: {
        name: 'История',
        icon: 'fas fa-landmark',
        questions: [
            { value: 1, text: 'В каком году началась Вторая мировая война? Ответ цифрами', answer: '1939', casinoTask: 'Сделайте 100 спинов по 1000 монет в Dog house' },
            { value: 2, text: 'Кто был первым президентом США?', answer: 'Джордж Вашингтон', casinoTask: 'Сыграйте в блэкджек на две руки по ставке 70000 монет на руку' },
            { value: 3, text: 'Какое событие произошло в 1066 году в Англии?', answer: 'Битва при Гастингсе', casinoTask: 'Купить бонус в Money train 3 за 200000' },
            { value: 4, text: 'Назовите имя древнегреческого бога морей', answer: 'Посейдон', casinoTask: 'Выбейте топовую бонуску в le bandit ставка от 1000 монет' },
            { value: 5, text: 'Какая империя правила большей частью Южной Америки до прихода европейцев?', answer: 'Империя инков', casinoTask: 'Бонус за 300000 в sweet bonanza' }
        ]
    },
    geography: {
        name: 'География',
        icon: 'fas fa-map',
        questions: [
            { value: 1, text: 'Какая река является самой длинной в мире?', answer: 'Нил', casinoTask: 'Поставьте на 1-12 в рулетке по 5к' },
            { value: 2, text: 'Столица Австралии?', answer: 'Канберра', casinoTask: 'Выбить бонус в hot fiesta от 1000 монет' },
            { value: 3, text: 'Самая высокая гора на Земле?', answer: 'Эверест', casinoTask: 'Сделать депное колесо от 1000$ на 50к' },
            { value: 4, text: 'Назовите самый большой океан', answer: 'Тихий', casinoTask: 'Выбить любой бонус в crazy time' },
            { value: 5, text: 'Какая страна имеет самое большое количество часовых поясов?', answer: 'Россия', casinoTask: 'Сделать накид создателю' }
        ]
    },
    cinema: {
        name: 'Кино',
        icon: 'fas fa-film',
        questions: [
            { value: 1, text: 'Кто сыграл роль Джека Воробья?', answer: 'Джонни Депп', casinoTask: 'Купить бонус в sweet rush bonanza ставка от 50к' },
            { value: 2, text: 'Как называется фильм, где Леонардо Ди Каприо сбегает из дома и становится мошенником?', answer: 'Поймай меня, если сможешь', casinoTask: 'Купить бонус в gates of olympus за 100000 монет' },
            { value: 3, text: 'Назовите режиссёра "Криминального чтива"', answer: 'Квентин Тарантино', casinoTask: 'Выбить минотавра на любом барабане по ставке от 2000 монет' },
            { value: 4, text: 'В каком фильме звучит фраза "Я оглянулся посмотреть, не оглянулась ли она"?', answer: 'Ирония судьбы', casinoTask: 'Окупить бонус в dog house multihold по ставке 100000 монет' },
            { value: 5, text: 'Какой актёр получил Оскар за роль Джокера в "Тёмном рыцаре"?', answer: 'Хит Леджер', casinoTask: 'Выбить хот мод в le cowboy' }
        ]
    },
    science: {
        name: 'Наука',
        icon: 'fas fa-flask',
        questions: [
            { value: 1, text: 'Кто открыл закон всемирного тяготения?', answer: 'Ньютон', casinoTask: 'Поставить 100к в любой лайв игре' },
            { value: 2, text: 'Какой химический элемент обозначается буквой O?', answer: 'Кислород', casinoTask: 'Окупить бонус в retro sweet' },
            { value: 3, text: 'Сколько планет в Солнечной системе? Ответ цифрой', answer: '8', casinoTask: 'Пробить топовую бонуску в Мумии в рандомке за 90к ' },
            { value: 4, text: 'Назовите самую маленькую частицу, сохраняющую свойства элемента', answer: 'Атом', casinoTask: 'Покупать топовый бонус в le bandit за 100к пока не окупиться' },
            { value: 5, text: 'Кто изобрёл радио?', answer: 'Попов', casinoTask: 'Выбить х1000 в sweet bonanza 1000 в бонуске за 36к' }
        ]
    },
    casino: {
        name: 'Казино',
        icon: 'fas fa-dice',
        questions: [
            { value: 1, text: 'Что означает RTP в слотах? Ответ на английском', answer: 'Return to Player', casinoTask: 'Купить бонус в hot fiesta за 50000 монет' },
            { value: 2, text: 'Какая карта в блэкджеке самая ценная?Сколько чисел в европейской рулетке?', answer: 'Туз', casinoTask: 'Получите блэкджек' },
            { value: 3, text: 'Сколько чисел в европейской рулетке? Ответ цифрой', answer: '37', casinoTask: 'Выбить бонуску в pirates pub ставка от 500 монет' },
            { value: 4, text: 'Как называется комбинация в покере: 2, 3, 4, 5, 6 одной масти?', answer: 'Стрит-флеш', casinoTask: 'Выбить ретриггер в sugar rush в бонуске от 80000 монет' },
            { value: 5, text: 'Какой биохимический процесс в мозге усиливает желание играть в казино?', answer: 'Выроботка эндорфинов', casinoTask: 'Выиграйте х300 в Sweet bonanza' }
        ]
    }
};

// Игроки
const players = [
    { id: 'alex', name: 'Алексей', icon: 'fas fa-user-astronaut', score: 0 },
    { id: 'vika', name: 'Вика', icon: 'fas fa-user-ninja', score: 0 },
    { id: 'batya', name: 'Батя', icon: 'fas fa-user-tie', score: 0 }
];

let currentScore = 0; // общий счёт (баланс казино) — изменяется только вручную
let selectedTheme = null;
let selectedQuestion = null;
let currentHelpMultiplier = 1;
let waitingForViewer = false;
let viewerName = '';
let isChatHelpUsed = false; // флаг, использовалась ли помощь чата для текущего вопроса
let answeredQuestions = {}; // { themeKey: [index1, index2] }

// DOM элементы
const themeGrid = document.getElementById('themes-grid');
const themeModal = document.getElementById('theme-modal');
const questionModal = document.getElementById('question-modal');
const viewerModal = document.getElementById('viewer-modal');
const resultModal = document.getElementById('result-modal');
const balanceModal = document.getElementById('balance-modal');
const congratsModal = document.getElementById('congrats-modal');
const rulesModal = document.getElementById('rules-modal');

const themeNameSpan = document.getElementById('theme-name');
const questionsGrid = document.getElementById('questions-grid');
const questionCategory = document.getElementById('question-category');
const questionValueSpan = document.getElementById('question-value');
const questionTextEl = document.getElementById('question-text');
const answerInput = document.getElementById('answer-input');
const submitAnswer = document.getElementById('submit-answer');
const helpChat = document.getElementById('help-chat');
const helpVika = document.getElementById('help-vika');
const helpBatya = document.getElementById('help-batya');
const feedbackDiv = document.getElementById('feedback');
const viewerNameInput = document.getElementById('viewer-name');
const confirmViewer = document.getElementById('confirm-viewer');
const cancelViewer = document.getElementById('cancel-viewer');
const closeThemeModal = document.getElementById('close-theme-modal');
const closeQuestionModal = document.getElementById('close-question-modal');
const closeResultBtn = document.getElementById('close-result');
const totalScoreSpan = document.getElementById('total-score');
const editBalanceBtn = document.getElementById('edit-balance');
const saveBalanceBtn = document.getElementById('save-balance');
const cancelBalanceBtn = document.getElementById('cancel-balance');
const newBalanceInput = document.getElementById('new-balance');
const resetScoresBtn = document.getElementById('reset-scores');
const restartGameBtn = document.getElementById('restart-game');
const answeringPlayerSelect = document.getElementById('answering-player');
const closeRulesBtn = document.getElementById('close-rules');

// Обновление таблицы лидеров
function renderLeaderboard() {
    const container = document.getElementById('leaderboard-players');
    container.innerHTML = '';
    players.forEach(player => {
        const card = document.createElement('div');
        card.className = 'leader-card';
        card.innerHTML = `
            <div class="leader-avatar"><i class="${player.icon}"></i></div>
            <div class="leader-name">${player.name}</div>
            <div class="leader-score" id="score-${player.id}">${player.score}</div>
            <div class="score-controls">
                <button class="inc-score" data-id="${player.id}">+1</button>
                <button class="dec-score" data-id="${player.id}">-1</button>
            </div>
        `;
        container.appendChild(card);
    });
    document.querySelectorAll('.inc-score').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = btn.dataset.id;
            const player = players.find(p => p.id === id);
            if (player) {
                player.score++;
                updateLeaderScoreUI(id, player.score);
            }
        });
    });
    document.querySelectorAll('.dec-score').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = btn.dataset.id;
            const player = players.find(p => p.id === id);
            if (player) {
                player.score--;
                updateLeaderScoreUI(id, player.score);
            }
        });
    });
}

function updateLeaderScoreUI(id, score) {
    const span = document.getElementById(`score-${id}`);
    if (span) span.innerText = score;
}

function updateTotalScoreUI() {
    totalScoreSpan.innerText = currentScore;
}

function renderThemes() {
    themeGrid.innerHTML = '';
    for (const [key, theme] of Object.entries(themesData)) {
        const card = document.createElement('div');
        card.className = 'theme-card';
        card.dataset.theme = key;
        card.innerHTML = `
            <div class="theme-icon"><i class="${theme.icon}"></i></div>
            <div class="theme-name">${theme.name}</div>
            <div class="theme-desc">5 вопросов</div>
        `;
        card.addEventListener('click', () => openTheme(key));
        themeGrid.appendChild(card);
    }
}

function openTheme(themeKey) {
    selectedTheme = themeKey;
    const theme = themesData[themeKey];
    themeNameSpan.innerText = theme.name;
    questionsGrid.innerHTML = '';
    for (let i = 0; i < theme.questions.length; i++) {
        const q = theme.questions[i];
        const cell = document.createElement('div');
        cell.className = 'question-cell';
        cell.innerText = q.value;
        const answered = answeredQuestions[themeKey] && answeredQuestions[themeKey].includes(i);
        if (answered) {
            cell.classList.add('disabled');
        } else {
            cell.addEventListener('click', () => openQuestion(i));
        }
        questionsGrid.appendChild(cell);
    }
    themeModal.classList.remove('hidden');
}

function openQuestion(index) {
    const theme = themesData[selectedTheme];
    const q = theme.questions[index];
    selectedQuestion = { theme: selectedTheme, index, data: q };
    questionCategory.innerText = theme.name;
    const pointsForCorrect = q.value * 1000;
    questionValueSpan.innerText = `💰 ${q.value} очков (${pointsForCorrect} баллов)`;
    questionTextEl.innerText = q.text;
    answerInput.value = '';
    feedbackDiv.innerHTML = '';
    currentHelpMultiplier = 1;
    isChatHelpUsed = false;
    answeringPlayerSelect.value = 'alex';
    questionModal.classList.remove('hidden');
}

function closeQuestionAndMark() {
    if (!selectedQuestion) return;
    const themeKey = selectedQuestion.theme;
    const qIndex = selectedQuestion.index;
    if (!answeredQuestions[themeKey]) answeredQuestions[themeKey] = [];
    if (!answeredQuestions[themeKey].includes(qIndex)) {
        answeredQuestions[themeKey].push(qIndex);
    }
    selectedQuestion = null;
    questionModal.classList.add('hidden');
    if (!themeModal.classList.contains('hidden') && selectedTheme === themeKey) {
        openTheme(themeKey);
    }
    checkAllQuestionsAnswered();
}

function checkAllQuestionsAnswered() {
    let totalAnswered = 0;
    let totalQuestions = 0;
    for (const themeKey of Object.keys(themesData)) {
        const theme = themesData[themeKey];
        totalQuestions += theme.questions.length;
        const answered = answeredQuestions[themeKey] ? answeredQuestions[themeKey].length : 0;
        totalAnswered += answered;
    }
    if (totalAnswered === totalQuestions && totalQuestions > 0) {
        congratsModal.classList.remove('hidden');
    }
}

function addPlayerScore(playerId, delta) {
    const player = players.find(p => p.id === playerId);
    if (player) {
        player.score += delta;
        updateLeaderScoreUI(playerId, player.score);
    }
}

function checkAnswer() {
    if (!selectedQuestion) return;
    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = selectedQuestion.data.answer.toLowerCase();
    const isCorrect = userAnswer === correctAnswer;
    const questionLevel = selectedQuestion.data.value; // 1..5
    let message = '';
    const selectedPlayerId = answeringPlayerSelect.value;

    if (isCorrect) {
        message = `✅ Правильно!`;
        let casinoTask = selectedQuestion.data.casinoTask;
        if (currentHelpMultiplier > 1) {
            casinoTask = `${casinoTask} (усложнено на ${Math.round((currentHelpMultiplier-1)*100)}%)`;
        }
        message += `<br>🎰 Задание казино: ${casinoTask}`;
        // Начисляем игроку +questionLevel баллов (за уровень)
        addPlayerScore(selectedPlayerId, questionLevel);
        
        // Если использовалась помощь чата — начисляем зрителю +5000 монет
        if (isChatHelpUsed && viewerName) {
            message += `<br>💬 Зритель ${viewerName} получает +5000 монет за правильный ответ!`;
            // Здесь можно добавить логику реального начисления монет зрителю, если нужно
        }
    } else {
        message = `❌ Неправильно. Правильный ответ: ${correctAnswer}.<br>🎰 Задание казино: ${selectedQuestion.data.casinoTask} (необходимо выполнить дважды, так как вы ошиблись)`;
        // Штрафуем игрока на questionLevel баллов
        addPlayerScore(selectedPlayerId, -questionLevel);
        // Если помощь чата была использована, но ответ неправильный — зритель не получает бонус
        if (isChatHelpUsed && viewerName) {
            message += `<br>💬 К сожалению, зритель ${viewerName} не получает бонус, так как ответ неверный.`;
        }
    }

    showResultMessage(isCorrect ? 'Верно!' : 'Неверно', message);
    closeQuestionAndMark();
    // Сбрасываем флаги помощи чата
    isChatHelpUsed = false;
    viewerName = '';
}

function showResultMessage(title, message) {
    document.getElementById('result-title').innerText = title;
    document.getElementById('result-message').innerHTML = message;
    resultModal.classList.remove('hidden');
}

function useHelp(type) {
    if (waitingForViewer) return;
    if (type === 'chat') {
        waitingForViewer = true;
        viewerModal.classList.remove('hidden');
        return;
    } else if (type === 'vika') {
        currentHelpMultiplier = 1.3;
        feedbackDiv.innerHTML = `🤝 Вы спросили у Вики. Сложность задания увеличена на 30%.`;
    } else if (type === 'batya') {
        currentHelpMultiplier = 1.3;
        feedbackDiv.innerHTML = `🤝 Вы спросили у Бати. Сложность задания увеличена на 30%.`;
    }
}

confirmViewer.addEventListener('click', () => {
    const viewer = viewerNameInput.value.trim();
    if (!viewer) {
        alert('Введите ник зрителя');
        return;
    }
    viewerName = viewer;
    feedbackDiv.innerHTML = `💬 Чат: ${viewer} помогает! Если ответ будет правильным, зритель получит +5000 монет. Сложность задания увеличена на 60%.`;
    currentHelpMultiplier = 1.6;
    isChatHelpUsed = true;
    waitingForViewer = false;
    viewerModal.classList.add('hidden');
    viewerNameInput.value = '';
});

cancelViewer.addEventListener('click', () => {
    waitingForViewer = false;
    viewerModal.classList.add('hidden');
    viewerNameInput.value = '';
});

editBalanceBtn.addEventListener('click', () => {
    newBalanceInput.value = currentScore;
    balanceModal.classList.remove('hidden');
});
saveBalanceBtn.addEventListener('click', () => {
    const newVal = parseInt(newBalanceInput.value);
    if (!isNaN(newVal)) {
        currentScore = newVal;
        updateTotalScoreUI();
    }
    balanceModal.classList.add('hidden');
});
cancelBalanceBtn.addEventListener('click', () => {
    balanceModal.classList.add('hidden');
});

resetScoresBtn.addEventListener('click', () => {
    players.forEach(p => p.score = 0);
    renderLeaderboard();
});

restartGameBtn.addEventListener('click', () => {
    currentScore = 0;
    updateTotalScoreUI();
    players.forEach(p => p.score = 0);
    renderLeaderboard();
    answeredQuestions = {};
    selectedTheme = null;
    selectedQuestion = null;
    congratsModal.classList.add('hidden');
    renderThemes();
    themeModal.classList.add('hidden');
    questionModal.classList.add('hidden');
});

closeThemeModal.addEventListener('click', () => themeModal.classList.add('hidden'));
closeQuestionModal.addEventListener('click', () => {
    questionModal.classList.add('hidden');
    selectedQuestion = null;
});
closeResultBtn.addEventListener('click', () => resultModal.classList.add('hidden'));
closeRulesBtn.addEventListener('click', () => {
    rulesModal.classList.add('hidden');
});

submitAnswer.addEventListener('click', checkAnswer);
helpChat.addEventListener('click', () => useHelp('chat'));
helpVika.addEventListener('click', () => useHelp('vika'));
helpBatya.addEventListener('click', () => useHelp('batya'));

window.addEventListener('click', (e) => {
    if (e.target === themeModal) themeModal.classList.add('hidden');
    if (e.target === questionModal) {
        questionModal.classList.add('hidden');
        selectedQuestion = null;
    }
    if (e.target === viewerModal) viewerModal.classList.add('hidden');
    if (e.target === resultModal) resultModal.classList.add('hidden');
    if (e.target === balanceModal) balanceModal.classList.add('hidden');
    if (e.target === congratsModal) congratsModal.classList.add('hidden');
    if (e.target === rulesModal) rulesModal.classList.add('hidden');
});

// Генерация падающих лепестков сакуры
function createSakuraPetals() {
    const container = document.getElementById('sakura-container');
    if (!container) return;

    function createPetal() {
        const petal = document.createElement('div');
        petal.classList.add('sakura-petal');
        const size = Math.random() * 18 + 10;
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        petal.style.left = `${Math.random() * 100}%`;
        const duration = Math.random() * 3 + 2;
        petal.style.animationDuration = `${duration}s`;
        petal.style.animationDelay = `${Math.random() * 5}s`;
        const pink = 180 + Math.random() * 75;
        petal.style.background = `radial-gradient(circle at 30% 30%, #ffc0cb, #ff${Math.floor(pink).toString(16)}aa)`;
        container.appendChild(petal);
        petal.addEventListener('animationend', () => petal.remove());
    }

    for (let i = 0; i < 60; i++) {
        setTimeout(() => createPetal(), Math.random() * 2000);
    }

    setInterval(() => {
        if (container.children.length < 120) {
            createPetal();
        }
    }, 400);
}

renderThemes();
renderLeaderboard();
updateTotalScoreUI();
window.addEventListener('load', () => {
    createSakuraPetals();
    // Показываем модалку правил при загрузке
    rulesModal.classList.remove('hidden');
});