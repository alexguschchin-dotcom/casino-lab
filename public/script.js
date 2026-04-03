// Данные: темы и вопросы (5 тем, по 5 вопросов) с вариантами ответов
const themesData = {
    history: {
        name: 'История',
        icon: 'fas fa-landmark',
        questions: [
            { value: 1, text: 'В каком году началась Вторая мировая война?', options: ['1939', '1941', '1937', '1945'], correct: 0, casinoTask: 'Сделайте 100 спинов по 20$  в Dog house' },
            { value: 2, text: 'Кто был первым президентом США?', options: ['Томас Джефферсон', 'Джордж Вашингтон', 'Авраам Линкольн', 'Бенджамин Франклин'], correct: 1, casinoTask: 'Сыграйте в блэкджек на две руки по ставке 500$ на руку' },
            { value: 3, text: 'Какое событие произошло в 1066 году в Англии?', options: ['Великая хартия вольностей', 'Битва при Гастингсе', 'Чума', 'Строительство Тауэра'], correct: 1, casinoTask: 'Купить бонус в Money train 4 за 2000$' },
            { value: 4, text: 'Назовите имя древнегреческого бога морей', options: ['Зевс', 'Аид', 'Посейдон', 'Аполлон'], correct: 2, casinoTask: 'Выбейте топовую бонуску в le bandit ставка от 24$ ' },
            { value: 5, text: 'Какая империя правила большей частью Южной Америки до прихода европейцев?', options: ['Ацтеки', 'Майя', 'Империя инков', 'Ольмеки'], correct: 2, casinoTask: 'Бонус за 1600$ в sweet bonanza' }
        ]
    },
    geography: {
        name: 'География',
        icon: 'fas fa-map',
        questions: [
            { value: 1, text: 'Какая река является самой длинной в мире?', options: ['Амазонка', 'Нил', 'Янцзы', 'Миссисипи'], correct: 1, casinoTask: 'Поставьте на 1-12 в рулетке по 40$' },
            { value: 2, text: 'Столица Австралии?', options: ['Сидней', 'Мельбурн', 'Канберра', 'Перт'], correct: 2, casinoTask: 'Выбить бонус в hot fiesta от  21$ за спин (с шансом)' },
            { value: 3, text: 'Самая высокая гора на Земле?', options: ['К2', 'Эверест', 'Канченджанга', 'Лхоцзе'], correct: 1, casinoTask: 'Сделать депное колесо от 1000$ на 400$ между 5-ю людьми' },
            { value: 4, text: 'Назовите самый большой океан', options: ['Атлантический', 'Индийский', 'Северный Ледовитый', 'Тихий'], correct: 3, casinoTask: 'Выбить любой бонус в crazy time' },
            { value: 5, text: 'Какая страна имеет самое большое количество часовых поясов?', options: ['США', 'Канада', 'Россия', 'Китай'], correct: 2, casinoTask: 'Сделать накид создателю ( по желанию )' }
        ]
    },
    cinema: {
        name: 'Кино',
        icon: 'fas fa-film',
        questions: [
            { value: 1, text: 'Кто сыграл роль Джека Воробья?', options: ['Орландо Блум', 'Киану Ривз', 'Джонни Депп', 'Брэд Питт'], correct: 2, casinoTask: 'Купить бонус в sweet rush bonanza ставка от 500$' },
            { value: 2, text: 'Как называется фильм, где Леонардо Ди Каприо сбегает из дома и становится мошенником?', options: ['Волк с Уолл-стрит', 'Остров проклятых', 'Поймай меня, если сможешь', 'Начало'], correct: 2, casinoTask: 'Купить бонус в gates of olympus за 1000$' },
            { value: 3, text: 'Назовите режиссёра "Криминального чтива"', options: ['Мартин Скорсезе', 'Квентин Тарантино', 'Дэвид Финчер', 'Кристофер Нолан'], correct: 1, casinoTask: 'Выбить минотавра на любом барабане по ставке от 20$ ' },
            { value: 4, text: 'В каком фильме звучит фраза "Я оглянулся посмотреть, не оглянулась ли она"?', options: ['Москва слезам не верит', 'Ирония судьбы', 'Служебный роман', 'Карнавальная ночь'], correct: 1, casinoTask: 'Окупить бонус в dog house multihold за 1000$' },
            { value: 5, text: 'Какой актёр получил Оскар за роль Джокера в "Тёмном рыцаре"?', options: ['Хоакин Феникс', 'Джек Николсон', 'Хит Леджер', 'Джаред Лето'], correct: 2, casinoTask: 'Выбить хот мод в le cowboy' }
        ]
    },
    science: {
        name: 'Наука',
        icon: 'fas fa-flask',
        questions: [
            { value: 1, text: 'Кто открыл закон всемирного тяготения?', options: ['Эйнштейн', 'Ньютон', 'Галилей', 'Коперник'], correct: 1, casinoTask: 'Поставить 800$ в любой лайв игре' },
            { value: 2, text: 'Какой химический элемент обозначается буквой O?', options: ['Осмий', 'Олово', 'Кислород', 'Золото'], correct: 2, casinoTask: 'Окупить бонус в retro sweet в бонуске от 600$' },
            { value: 3, text: 'Сколько планет в Солнечной системе?', options: ['7', '8', '9', '6'], correct: 1, casinoTask: 'Пробить топовую бонуску в Мумии в рандомке за 900$' },
            { value: 4, text: 'Назовите самую маленькую частицу, сохраняющую свойства элемента', options: ['Молекула', 'Протон', 'Электрон', 'Атом'], correct: 3, casinoTask: 'Покупать топовый бонус в le pharaon за 1000$ пока не окупиться' },
            { value: 5, text: 'Кто изобрёл радио?', options: ['Попов', 'Маркони', 'Тесла', 'Эдисон'], correct: 0, casinoTask: 'Выбить х1000 в sweet bonanza 1000 в бонуске за 400$' }
        ]
    },
    casino: {
        name: 'Казино',
        icon: 'fas fa-dice',
        questions: [
            { value: 1, text: 'Что означает RTP в слотах?', options: ['Return to Player', 'Real Time Play', 'Random Table Payout', 'Реальный шанс выигрыша'], correct: 0, casinoTask: 'Зрители которые напишут <<Леха, Вика и Батя - самые умные стримеры + id>> рандомно получат 50$ (5 человек)' },
            { value: 2, text: 'Какая карта в блэкджеке самая ценная?', options: ['Король', 'Туз', 'Десятка', 'Дама'], correct: 1, casinoTask: 'Получите блэкджек по ставке 300$ за руку' },
            { value: 3, text: 'Сколько чисел в европейской рулетке?', options: ['36', '37', '38', '39'], correct: 1, casinoTask: 'Выбить бонуску в pirates pub ставка от 9$' },
            { value: 4, text: 'Как называется комбинация в покере: 2, 3, 4, 5, 6 одной масти?', options: ['Флеш', 'Стрит', 'Стрит-флеш', 'Каре'], correct: 2, casinoTask: 'Выбить ретриггер в sugar rush в бонуске от 800$' },
            { value: 5, text: 'Какой биохимический процесс в мозге усиливает желание играть в казино?', options: ['Выработка адреналина', 'Выработка дофамина', 'Выработка эндорфинов', 'Выработка серотонина'], correct: 2, casinoTask: 'Выиграйте х300 в Sweet bonanza по ставке ' }
        ]
    }
};

// Игроки
const players = [
    { id: 'alex', name: 'Алексей', icon: 'fas fa-user-astronaut', score: 0 },
    { id: 'vika', name: 'Вика', icon: 'fas fa-user-ninja', score: 0 },
    { id: 'batya', name: 'Батя', icon: 'fas fa-user-tie', score: 0 }
];

let currentScore = 0;
let selectedTheme = null;
let selectedQuestion = null;
let currentHelpMultiplier = 1;
let waitingForViewer = false;
let viewerName = '';
let isChatHelpUsed = false;
let answeredQuestions = {};

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
const optionsArea = document.getElementById('options-area');
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

// Рендер вариантов ответа (всегда активны, если вопрос не отвечен)
function renderOptions(question) {
    optionsArea.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    question.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `<span class="option-letter">${letters[idx]}</span> <span class="option-text">${opt}</span>`;
        btn.dataset.index = idx;
        // Делаем кнопки активными, если вопрос ещё не отвечен и игра не завершена
        if (gameStateAnswered || gameStateCompleted) {
            btn.disabled = true;
        } else {
            btn.disabled = false;
        }
        btn.addEventListener('click', () => {
            if (gameStateAnswered || gameStateCompleted) {
                showToast('На этот вопрос уже ответили!');
                return;
            }
            const answerIndex = parseInt(btn.dataset.index);
            submitAnswer(answerIndex);
        });
        optionsArea.appendChild(btn);
    });
}

// Состояние игры (глобальные флаги)
let gameStateAnswered = false;
let gameStateCompleted = false;

function openQuestion(index) {
    const theme = themesData[selectedTheme];
    const q = theme.questions[index];
    selectedQuestion = { theme: selectedTheme, index, data: q };
    questionCategory.innerText = theme.name;
    const pointsForCorrect = q.value * 1000;
    questionValueSpan.innerText = `💰 ${q.value} очков (${pointsForCorrect} баллов)`;
    questionTextEl.innerText = q.text;
    feedbackDiv.innerHTML = '';
    currentHelpMultiplier = 1;
    isChatHelpUsed = false;
    gameStateAnswered = false;
    gameStateCompleted = false;
    renderOptions(q);
    questionModal.classList.remove('hidden');
}

function submitAnswer(answerIndex) {
    if (!selectedQuestion) return;
    const isCorrect = (answerIndex === selectedQuestion.data.correct);
    const questionLevel = selectedQuestion.data.value;
    const selectedPlayerId = answeringPlayerSelect.value;
    let message = '';

    if (isCorrect) {
        message = `✅ Правильно!`;
        let casinoTask = selectedQuestion.data.casinoTask;
        if (currentHelpMultiplier > 1) {
            casinoTask = `${casinoTask} (усложнено на ${Math.round((currentHelpMultiplier-1)*100)}%)`;
        }
        message += `<br>🎰 Задание казино: ${casinoTask}`;
        addPlayerScore(selectedPlayerId, questionLevel);
        if (isChatHelpUsed && viewerName) {
            message += `<br>💬 Зритель ${viewerName} получает +5000 монет за правильный ответ!`;
        }
    } else {
        const correctOption = selectedQuestion.data.options[selectedQuestion.data.correct];
        message = `❌ Неправильно. Правильный ответ: ${correctOption}.<br>🎰 Задание казино: ${selectedQuestion.data.casinoTask} (необходимо выполнить дважды, так как вы ошиблись)`;
        addPlayerScore(selectedPlayerId, -questionLevel);
        if (isChatHelpUsed && viewerName) {
            message += `<br>💬 К сожалению, зритель ${viewerName} не получает бонус, так как ответ неверный.`;
        }
    }

    gameStateAnswered = true;
    const wasLastQuestion = checkIfLastQuestion();
    showResultMessage(isCorrect ? 'Верно!' : 'Неверно', message, wasLastQuestion);
    isChatHelpUsed = false;
    viewerName = '';
}

function checkIfLastQuestion() {
    let answeredCount = 0;
    for (const themeKey of Object.keys(themesData)) {
        const answered = answeredQuestions[themeKey] ? answeredQuestions[themeKey].length : 0;
        answeredCount += answered;
    }
    const totalQuestions = 25;
    return answeredCount === totalQuestions - 1;
}

function showResultMessage(title, message, isLastQuestion) {
    document.getElementById('result-title').innerText = title;
    document.getElementById('result-message').innerHTML = message;
    resultModal.classList.remove('hidden');
    if (isLastQuestion) {
        pendingLastQuestion = true;
    } else {
        pendingLastQuestion = false;
    }
}

let pendingLastQuestion = false;

// Обработчик кнопки "Продолжить" в модалке результата
closeResultBtn.onclick = () => {
    resultModal.classList.add('hidden');
    // Помечаем вопрос отвеченным
    if (selectedQuestion) {
        const themeKey = selectedQuestion.theme;
        const qIndex = selectedQuestion.index;
        if (!answeredQuestions[themeKey]) answeredQuestions[themeKey] = [];
        if (!answeredQuestions[themeKey].includes(qIndex)) {
            answeredQuestions[themeKey].push(qIndex);
        }
        selectedQuestion = null;
        gameStateAnswered = false;
        // Закрываем модалку вопроса
        questionModal.classList.add('hidden');
        // Обновляем сетку вопросов, если открыта тема
        if (!themeModal.classList.contains('hidden') && selectedTheme === themeKey) {
            openTheme(themeKey);
        }
        // Проверяем завершение
        if (pendingLastQuestion) {
            checkAllQuestionsAnswered();
        }
    }
    pendingLastQuestion = false;
};

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
        showCongratsModal();
    }
}

function showCongratsModal() {
    const container = document.getElementById('congrats-scores');
    container.innerHTML = '';
    const sorted = [...players].sort((a,b) => b.score - a.score);
    sorted.forEach(player => {
        const item = document.createElement('div');
        item.className = 'congrats-score-item';
        item.innerHTML = `
            <div class="congrats-score-name"><i class="${player.icon}"></i> ${player.name}</div>
            <div class="congrats-score-value">${player.score} очков</div>
        `;
        container.appendChild(item);
    });
    congratsModal.classList.remove('hidden');
}

function addPlayerScore(playerId, delta) {
    const player = players.find(p => p.id === playerId);
    if (player) {
        player.score += delta;
        updateLeaderScoreUI(playerId, player.score);
    }
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
    // Обработчики для +1 / -1
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
closeRulesBtn.addEventListener('click', () => {
    rulesModal.classList.add('hidden');
});

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

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

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
    rulesModal.classList.remove('hidden');
});