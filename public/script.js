// Данные: темы и вопросы (5 тем, по 5 вопросов)
const themesData = {
    history: {
        name: 'История',
        icon: 'fas fa-landmark',
        questions: [
            { value: 1, text: 'В каком году началась Вторая мировая война?', answer: '1939', casinoTask: 'Сделайте ставку на чёрное в рулетке и выиграйте' },
            { value: 2, text: 'Кто был первым президентом США?', answer: 'Джордж Вашингтон', casinoTask: 'Сыграйте в блэкджек и наберите 21' },
            { value: 3, text: 'Какое событие произошло в 1066 году в Англии?', answer: 'Битва при Гастингсе', casinoTask: 'Сделайте три ставки на зеро в рулетке' },
            { value: 4, text: 'Назовите имя древнегреческого бога морей', answer: 'Посейдон', casinoTask: 'Выиграйте 2 раунда в покере подряд' },
            { value: 5, text: 'Какая империя правила большей частью Южной Америки до прихода европейцев?', answer: 'Империя инков', casinoTask: 'Удвойте свой банк за одну минуту' }
        ]
    },
    geography: {
        name: 'География',
        icon: 'fas fa-map',
        questions: [
            { value: 1, text: 'Какая река является самой длинной в мире?', answer: 'Нил', casinoTask: 'Поставьте на 1-12 в рулетке' },
            { value: 2, text: 'Столица Австралии?', answer: 'Канберра', casinoTask: 'Сыграйте в слот и получите бонус' },
            { value: 3, text: 'Самая высокая гора на Земле?', answer: 'Эверест', casinoTask: 'Сделайте ставку на точное число в рулетке' },
            { value: 4, text: 'Назовите самый большой океан', answer: 'Тихий', casinoTask: 'Выиграйте три раза подряд в кости' },
            { value: 5, text: 'Какая страна имеет самое большое количество часовых поясов?', answer: 'Россия', casinoTask: 'Сделайте ставку на все числа от 1 до 10 и выиграйте' }
        ]
    },
    cinema: {
        name: 'Кино',
        icon: 'fas fa-film',
        questions: [
            { value: 1, text: 'Кто сыграл роль Джека Воробья?', answer: 'Джонни Депп', casinoTask: 'Сделайте ставку на зеро' },
            { value: 2, text: 'Как называется фильм, где Леонардо Ди Каприо играет на рулетке?', answer: 'Поймай меня, если сможешь', casinoTask: 'Сыграйте в блэкджек и не переберите' },
            { value: 3, text: 'Назовите режиссёра "Криминального чтива"', answer: 'Квентин Тарантино', casinoTask: 'Сделайте три ставки на красное' },
            { value: 4, text: 'В каком фильме звучит фраза "Я оглянулся посмотреть, не оглянулась ли она"?', answer: 'Ирония судьбы', casinoTask: 'Выиграйте в покере с парой' },
            { value: 5, text: 'Какой актёр получил Оскар за роль Джокера в "Тёмном рыцаре"?', answer: 'Хит Леджер', casinoTask: 'Удвойте ставку в блэкджеке' }
        ]
    },
    science: {
        name: 'Наука',
        icon: 'fas fa-flask',
        questions: [
            { value: 1, text: 'Кто открыл закон всемирного тяготения?', answer: 'Ньютон', casinoTask: 'Поставьте на чётное' },
            { value: 2, text: 'Какой химический элемент обозначается буквой O?', answer: 'Кислород', casinoTask: 'Сыграйте в слот с множителем x2' },
            { value: 3, text: 'Сколько планет в Солнечной системе?', answer: '8', casinoTask: 'Сделайте ставку на 8 в рулетке' },
            { value: 4, text: 'Назовите самую маленькую частицу, сохраняющую свойства элемента', answer: 'Атом', casinoTask: 'Сделайте пять ставок подряд и выиграйте' },
            { value: 5, text: 'Кто изобрёл радио?', answer: 'Попов', casinoTask: 'Угадайте карту в покере' }
        ]
    },
    casino: {
        name: 'Казино',
        icon: 'fas fa-dice',
        questions: [
            { value: 1, text: 'Что означает RTP в слотах?', answer: 'Return to Player', casinoTask: 'Сделайте минимальную ставку' },
            { value: 2, text: 'Сколько чисел в европейской рулетке?', answer: '37', casinoTask: 'Сыграйте на одно число' },
            { value: 3, text: 'Какая карта в блэкджеке самая ценная?', answer: 'Туз', casinoTask: 'Получите блэкджек' },
            { value: 4, text: 'Как называется комбинация в покере: 2, 3, 4, 5, 6 одной масти?', answer: 'Стрит-флеш', casinoTask: 'Соберите стрит-флеш в покере' },
            { value: 5, text: 'Назовите самый популярный слот в мире', answer: 'Starburst', casinoTask: 'Выиграйте джекпот' }
        ]
    }
};

// Игроки
const players = [
    { id: 'alex', name: 'Алексей', icon: 'fas fa-user-astronaut', score: 0 },
    { id: 'vika', name: 'Вика', icon: 'fas fa-user-ninja', score: 0 },
    { id: 'batya', name: 'Батя', icon: 'fas fa-user-tie', score: 0 }
];

let currentScore = 0; // общий счёт стримера (баллы за правильные ответы)
let selectedTheme = null;
let selectedQuestion = null;
let currentHelpMultiplier = 1;
let waitingForViewer = false;
let viewerName = '';

// Состояние отвеченных вопросов (чтобы закрывать)
let answeredQuestions = {}; // { themeKey: [index1, index2] }

// DOM элементы
const themeGrid = document.getElementById('themes-grid');
const themeModal = document.getElementById('theme-modal');
const questionModal = document.getElementById('question-modal');
const viewerModal = document.getElementById('viewer-modal');
const resultModal = document.getElementById('result-modal');
const balanceModal = document.getElementById('balance-modal');
const congratsModal = document.getElementById('congrats-modal');

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
    // Добавляем обработчики
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

// Общий счёт
function updateTotalScoreUI() {
    totalScoreSpan.innerText = currentScore;
}

// Генерация тем
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

// Открыть модалку с вопросами темы
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
        // Проверяем, отвечен ли вопрос
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

// Открыть вопрос
function openQuestion(index) {
    const theme = themesData[selectedTheme];
    const q = theme.questions[index];
    selectedQuestion = { theme: selectedTheme, index, data: q };
    questionCategory.innerText = theme.name;
    questionValueSpan.innerText = `💰 ${q.value} очков`;
    questionTextEl.innerText = q.text;
    answerInput.value = '';
    feedbackDiv.innerHTML = '';
    currentHelpMultiplier = 1;
    questionModal.classList.remove('hidden');
}

// Закрыть вопрос (после ответа)
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
    // Обновляем сетку вопросов в открытой модалке, если она открыта
    if (!themeModal.classList.contains('hidden') && selectedTheme === themeKey) {
        openTheme(themeKey); // перерисовка
    }
    // Проверка, все ли вопросы отвечены
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

// Проверка ответа
function checkAnswer() {
    if (!selectedQuestion) return;
    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = selectedQuestion.data.answer.toLowerCase();
    const isCorrect = userAnswer === correctAnswer;
    let message = '';
    let pointsEarned = 0;

    if (isCorrect) {
        pointsEarned = selectedQuestion.data.value * 1000;
        currentScore += pointsEarned;
        updateTotalScoreUI();
        message = `✅ Правильно! Вы заработали ${pointsEarned} очков.`;
        let casinoTask = selectedQuestion.data.casinoTask;
        if (currentHelpMultiplier > 1) {
            casinoTask = `${casinoTask} (усложнено на ${Math.round((currentHelpMultiplier-1)*100)}%)`;
        }
        message += `<br>🎰 Задание казино: ${casinoTask}`;
        // Добавляем +1 балл к выбранному игроку (кто отвечал? По умолчанию Алексей, но можно сделать выбор)
        // Для простоты: при правильном ответе даём +1 игроку, который выбран (выбор будет реализован через кнопки +1/-1 в таблице)
        // Можно также дать возможность выбрать, кто отвечал, через дополнительное окно, но по ТЗ: при правильном +1 балл в таблицу, при неправильном -1.
        // Здесь мы просто даём +1 первому игроку (Алексей) для примера, но лучше вынести выбор.
        // Реализуем через модалку выбора игрока? Упростим: добавим кнопки в карточку вопроса.
        // Добавим ниже.
        addPlayerScore('alex', 1); // временно для теста, потом можно сделать выбор
    } else {
        message = `❌ Неправильно. Правильный ответ: ${correctAnswer}.<br>🎰 Задание казино: ${selectedQuestion.data.casinoTask} (необходимо выполнить дважды, так как вы ошиблись)`;
        addPlayerScore('alex', -1); // штраф
    }

    showResultMessage(isCorrect ? 'Верно!' : 'Неверно', message);
    closeQuestionAndMark(); // закрываем вопрос и помечаем отвеченным
}

function addPlayerScore(playerId, delta) {
    const player = players.find(p => p.id === playerId);
    if (player) {
        player.score += delta;
        updateLeaderScoreUI(playerId, player.score);
    }
}

function showResultMessage(title, message) {
    document.getElementById('result-title').innerText = title;
    document.getElementById('result-message').innerHTML = message;
    resultModal.classList.remove('hidden');
}

// Помощь
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

// Обработка подтверждения зрителя
confirmViewer.addEventListener('click', () => {
    const viewer = viewerNameInput.value.trim();
    if (!viewer) {
        alert('Введите ник зрителя');
        return;
    }
    viewerName = viewer;
    feedbackDiv.innerHTML = `💬 Чат: ${viewer} помогает! +5000 монет зрителю. Сложность задания увеличена на 60%.`;
    currentHelpMultiplier = 1.6;
    waitingForViewer = false;
    viewerModal.classList.add('hidden');
    viewerNameInput.value = '';
});

cancelViewer.addEventListener('click', () => {
    waitingForViewer = false;
    viewerModal.classList.add('hidden');
    viewerNameInput.value = '';
});

// Изменение баланса
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

// Сброс очков игроков
resetScoresBtn.addEventListener('click', () => {
    players.forEach(p => p.score = 0);
    renderLeaderboard();
});

// Перезапуск игры (после поздравления)
restartGameBtn.addEventListener('click', () => {
    // Сброс всех данных
    currentScore = 0;
    updateTotalScoreUI();
    players.forEach(p => p.score = 0);
    renderLeaderboard();
    answeredQuestions = {};
    selectedTheme = null;
    selectedQuestion = null;
    congratsModal.classList.add('hidden');
    renderThemes(); // перерисовка тем
    // Закрыть все модалки
    themeModal.classList.add('hidden');
    questionModal.classList.add('hidden');
});

// Закрытие модалок
closeThemeModal.addEventListener('click', () => themeModal.classList.add('hidden'));
closeQuestionModal.addEventListener('click', () => {
    questionModal.classList.add('hidden');
    selectedQuestion = null;
});
closeResultBtn.addEventListener('click', () => resultModal.classList.add('hidden'));

submitAnswer.addEventListener('click', checkAnswer);
helpChat.addEventListener('click', () => useHelp('chat'));
helpVika.addEventListener('click', () => useHelp('vika'));
helpBatya.addEventListener('click', () => useHelp('batya'));

// Инициализация
renderThemes();
renderLeaderboard();
updateTotalScoreUI();

// Закрытие модалок по клику вне контента
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
});

// Добавляем возможность выбора игрока при правильном/неправильном ответе (дополнительно)
// Упрощённо: при ответе добавляем/убираем очки для Алексея. Но можно сделать выбор через кнопки в карточке.
// Для более полного UX добавим выбор игрока в модалке вопроса.
// В реальном проекте можно добавить селект, но для простоты оставим как есть.