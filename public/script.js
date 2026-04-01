// Данные тем и вопросов
const themesData = {
    history: {
        name: 'История',
        icon: 'fas fa-landmark',
        questions: [
            { value: 1, text: 'В каком году началась Вторая мировая война?', answer: '1939', casinoTask: 'Сделайте ставку на чёрное в рулетке и выиграйте', completed: false },
            { value: 2, text: 'Кто был первым президентом США?', answer: 'Джордж Вашингтон', casinoTask: 'Сыграйте в блэкджек и наберите 21', completed: false },
            { value: 3, text: 'Какое событие произошло в 1066 году в Англии?', answer: 'Битва при Гастингсе', casinoTask: 'Сделайте три ставки на зеро в рулетке', completed: false },
            { value: 4, text: 'Назовите имя древнегреческого бога морей', answer: 'Посейдон', casinoTask: 'Выиграйте 2 раунда в покере подряд', completed: false },
            { value: 5, text: 'Какая империя правила большей частью Южной Америки до прихода европейцев?', answer: 'Империя инков', casinoTask: 'Удвойте свой банк за одну минуту', completed: false }
        ]
    },
    geography: {
        name: 'География',
        icon: 'fas fa-map',
        questions: [
            { value: 1, text: 'Какая река является самой длинной в мире?', answer: 'Нил', casinoTask: 'Поставьте на 1-12 в рулетке', completed: false },
            { value: 2, text: 'Столица Австралии?', answer: 'Канберра', casinoTask: 'Сыграйте в слот и получите бонус', completed: false },
            { value: 3, text: 'Самая высокая гора на Земле?', answer: 'Эверест', casinoTask: 'Сделайте ставку на точное число в рулетке', completed: false },
            { value: 4, text: 'Назовите самый большой океан', answer: 'Тихий', casinoTask: 'Выиграйте три раза подряд в кости', completed: false },
            { value: 5, text: 'Какая страна имеет самое большое количество часовых поясов?', answer: 'Россия', casinoTask: 'Сделайте ставку на все числа от 1 до 10 и выиграйте', completed: false }
        ]
    },
    cinema: {
        name: 'Кино',
        icon: 'fas fa-film',
        questions: [
            { value: 1, text: 'Кто сыграл роль Джека Воробья?', answer: 'Джонни Депп', casinoTask: 'Сделайте ставку на зеро', completed: false },
            { value: 2, text: 'Как называется фильм, где Леонардо Ди Каприо играет на рулетке?', answer: 'Поймай меня, если сможешь', casinoTask: 'Сыграйте в блэкджек и не переберите', completed: false },
            { value: 3, text: 'Назовите режиссёра "Криминального чтива"', answer: 'Квентин Тарантино', casinoTask: 'Сделайте три ставки на красное', completed: false },
            { value: 4, text: 'В каком фильме звучит фраза "Я оглянулся посмотреть, не оглянулась ли она"?', answer: 'Ирония судьбы', casinoTask: 'Выиграйте в покере с парой', completed: false },
            { value: 5, text: 'Какой актёр получил Оскар за роль Джокера в "Тёмном рыцаре"?', answer: 'Хит Леджер', casinoTask: 'Удвойте ставку в блэкджеке', completed: false }
        ]
    },
    science: {
        name: 'Наука',
        icon: 'fas fa-flask',
        questions: [
            { value: 1, text: 'Кто открыл закон всемирного тяготения?', answer: 'Ньютон', casinoTask: 'Поставьте на чётное', completed: false },
            { value: 2, text: 'Какой химический элемент обозначается буквой O?', answer: 'Кислород', casinoTask: 'Сыграйте в слот с множителем x2', completed: false },
            { value: 3, text: 'Сколько планет в Солнечной системе?', answer: '8', casinoTask: 'Сделайте ставку на 8 в рулетке', completed: false },
            { value: 4, text: 'Назовите самую маленькую частицу, сохраняющую свойства элемента', answer: 'Атом', casinoTask: 'Сделайте пять ставок подряд и выиграйте', completed: false },
            { value: 5, text: 'Кто изобрёл радио?', answer: 'Попов', casinoTask: 'Угадайте карту в покере', completed: false }
        ]
    },
    casino: {
        name: 'Казино',
        icon: 'fas fa-dice',
        questions: [
            { value: 1, text: 'Что означает RTP в слотах?', answer: 'Return to Player', casinoTask: 'Сделайте минимальную ставку', completed: false },
            { value: 2, text: 'Сколько чисел в европейской рулетке?', answer: '37', casinoTask: 'Сыграйте на одно число', completed: false },
            { value: 3, text: 'Какая карта в блэкджеке самая ценная?', answer: 'Туз', casinoTask: 'Получите блэкджек', completed: false },
            { value: 4, text: 'Как называется комбинация в покере: 2, 3, 4, 5, 6 одной масти?', answer: 'Стрит-флеш', casinoTask: 'Соберите стрит-флеш в покере', completed: false },
            { value: 5, text: 'Назовите самый популярный слот в мире', answer: 'Starburst', casinoTask: 'Выиграйте джекпот', completed: false }
        ]
    }
};

let currentScore = 0; // общий счёт стримера (можно не использовать, но оставим)
let playerScores = {
    alex: 0,
    vika: 0,
    batya: 0
};

let selectedTheme = null;
let selectedQuestion = null;
let currentHelpMultiplier = 1;
let waitingForViewer = false;
let viewerName = '';

// DOM элементы
const themeGrid = document.getElementById('themes-grid');
const themeModal = document.getElementById('theme-modal');
const questionModal = document.getElementById('question-modal');
const viewerModal = document.getElementById('viewer-modal');
const resultModal = document.getElementById('result-modal');
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
const newGameCongrats = document.getElementById('new-game-congrats');
const answerPlayerSelect = document.getElementById('answer-player');

// Обновление счёта на экране (стримера)
function updateScoreDisplay() {
    document.getElementById('total-score').innerText = currentScore;
}

// Обновление таблицы лидеров
function updateLeaderboard() {
    document.getElementById('score-alex').innerText = playerScores.alex;
    document.getElementById('score-vika').innerText = playerScores.vika;
    document.getElementById('score-batya').innerText = playerScores.batya;
}

// Изменение баланса игрока
function changePlayerBalance(player, delta) {
    playerScores[player] += delta;
    updateLeaderboard();
}

// Сброс счёта всех игроков
function resetAllScores() {
    playerScores = { alex: 0, vika: 0, batya: 0 };
    updateLeaderboard();
}

// Проверка, все ли вопросы отвечены
function checkAllQuestionsCompleted() {
    for (let themeKey in themesData) {
        for (let q of themesData[themeKey].questions) {
            if (!q.completed) return false;
        }
    }
    // Если все завершены, показываем поздравление
    congratsModal.classList.remove('hidden');
    return true;
}

// Рендер тем
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
    theme.questions.forEach((q, idx) => {
        const cell = document.createElement('div');
        cell.className = 'question-cell';
        if (q.completed) cell.classList.add('completed');
        cell.innerText = q.value;
        if (!q.completed) {
            cell.addEventListener('click', () => openQuestion(idx));
        }
        questionsGrid.appendChild(cell);
    });
    themeModal.classList.remove('hidden');
}

// Открыть конкретный вопрос
function openQuestion(index) {
    const theme = themesData[selectedTheme];
    const q = theme.questions[index];
    if (q.completed) return; // защита
    selectedQuestion = { theme: selectedTheme, index, data: q };
    questionCategory.innerText = theme.name;
    questionValueSpan.innerText = `💰 ${q.value * 1000} очков`;
    questionTextEl.innerText = q.text;
    answerInput.value = '';
    feedbackDiv.innerHTML = '';
    currentHelpMultiplier = 1;
    questionModal.classList.remove('hidden');
}

// Проверка ответа
function checkAnswer() {
    if (!selectedQuestion) return;
    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = selectedQuestion.data.answer.toLowerCase();
    const isCorrect = userAnswer === correctAnswer;
    const selectedPlayer = answerPlayerSelect.value;
    let message = '';

    // Обновляем счёт игрока
    if (isCorrect) {
        playerScores[selectedPlayer] += 1;
        message = `✅ Правильно! ${getPlayerName(selectedPlayer)} получает +1 очко.`;
    } else {
        playerScores[selectedPlayer] -= 1;
        message = `❌ Неправильно. Правильный ответ: ${correctAnswer}. ${getPlayerName(selectedPlayer)} теряет 1 очко.`;
    }
    updateLeaderboard();

    // Отмечаем вопрос как отвеченный
    selectedQuestion.data.completed = true;
    // Закрываем модалку вопроса
    questionModal.classList.add('hidden');
    // Обновляем сетку вопросов в текущей теме (если открыта)
    if (selectedTheme && !themeModal.classList.contains('hidden')) {
        const cells = document.querySelectorAll('#questions-grid .question-cell');
        cells[selectedQuestion.index].classList.add('completed');
        cells[selectedQuestion.index].style.pointerEvents = 'none';
    }

    // Задание казино
    let casinoTask = selectedQuestion.data.casinoTask;
    if (currentHelpMultiplier > 1) {
        casinoTask = `${casinoTask} (усложнено на ${(currentHelpMultiplier-1)*100}%)`;
    }
    message += `<br>🎰 Задание казино: ${casinoTask}`;

    // Показываем результат
    showResultMessage(isCorrect ? 'Верно!' : 'Неверно', message);

    // Проверяем, все ли вопросы завершены
    checkAllQuestionsCompleted();
}

function getPlayerName(playerId) {
    const map = { alex: 'Алексей', vika: 'Вика', batya: 'Батя' };
    return map[playerId];
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
    } else {
        let helper = (type === 'vika') ? 'Вика' : 'Батя';
        currentHelpMultiplier = 1.3;
        feedbackDiv.innerHTML = `🤝 Вы спросили у ${helper}. Сложность задания увеличена на 30%.`;
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

// Закрытие модалок
closeThemeModal.addEventListener('click', () => themeModal.classList.add('hidden'));
closeQuestionModal.addEventListener('click', () => questionModal.classList.add('hidden'));
closeResultBtn.addEventListener('click', () => resultModal.classList.add('hidden'));
newGameCongrats.addEventListener('click', () => {
    // Сброс всех вопросов и счёта
    for (let themeKey in themesData) {
        for (let q of themesData[themeKey].questions) {
            q.completed = false;
        }
    }
    playerScores = { alex: 0, vika: 0, batya: 0 };
    updateLeaderboard();
    congratsModal.classList.add('hidden');
    // Перерисовываем темы и закрываем модалки
    renderThemes();
    themeModal.classList.add('hidden');
    questionModal.classList.add('hidden');
});

submitAnswer.addEventListener('click', checkAnswer);
helpChat.addEventListener('click', () => useHelp('chat'));
helpVika.addEventListener('click', () => useHelp('vika'));
helpBatya.addEventListener('click', () => useHelp('batya'));

// Кнопки изменения баланса
document.querySelectorAll('.balance-add').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const player = btn.dataset.player;
        changePlayerBalance(player, 1000);
    });
});
document.querySelectorAll('.balance-sub').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const player = btn.dataset.player;
        changePlayerBalance(player, -500);
    });
});
document.getElementById('reset-scores').addEventListener('click', resetAllScores);

// Закрытие модалок по клику вне
window.addEventListener('click', (e) => {
    if (e.target === themeModal) themeModal.classList.add('hidden');
    if (e.target === questionModal) questionModal.classList.add('hidden');
    if (e.target === viewerModal) viewerModal.classList.add('hidden');
    if (e.target === resultModal) resultModal.classList.add('hidden');
    if (e.target === congratsModal) congratsModal.classList.add('hidden');
});

// Инициализация
renderThemes();
updateLeaderboard();
updateScoreDisplay();