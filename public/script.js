// Данные: темы и вопросы
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

let currentScore = 0;
let selectedTheme = null;
let selectedQuestion = null;
let currentHelpMultiplier = 1;
let waitingForViewer = false;
let viewerName = '';

// Отслеживание отвеченных вопросов
let answeredQuestions = {}; // ключ: `${themeKey}-${index}`

const themeGrid = document.getElementById('themes-grid');
const themeModal = document.getElementById('theme-modal');
const questionModal = document.getElementById('question-modal');
const viewerModal = document.getElementById('viewer-modal');
const resultModal = document.getElementById('result-modal');
const congratsModal = document.getElementById('congrats-modal'); // новое окно

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
const closeCongratsBtn = document.getElementById('close-congrats');

function updateScoreDisplay() {
    document.getElementById('total-score').innerText = currentScore;
}

// Проверка, все ли вопросы отвечены
function checkAllQuestionsAnswered() {
    let totalQuestions = 0;
    let answeredCount = 0;
    for (const themeKey in themesData) {
        const theme = themesData[themeKey];
        for (let i = 0; i < theme.questions.length; i++) {
            totalQuestions++;
            if (answeredQuestions[`${themeKey}-${i}`]) answeredCount++;
        }
    }
    if (totalQuestions === answeredCount && totalQuestions > 0) {
        // Показать окно поздравлений
        congratsModal.classList.remove('hidden');
    }
}

// Отметить вопрос как отвеченный
function markQuestionAnswered(themeKey, index) {
    const key = `${themeKey}-${index}`;
    if (!answeredQuestions[key]) {
        answeredQuestions[key] = true;
    }
    // Обновляем сетку вопросов, если открыта
    if (selectedTheme === themeKey && !themeModal.classList.contains('hidden')) {
        refreshQuestionsGrid(themeKey);
    }
    // Проверяем, все ли вопросы отвечены
    checkAllQuestionsAnswered();
}

// Обновить сетку вопросов (добавить крестики на отвеченные)
function refreshQuestionsGrid(themeKey) {
    const theme = themesData[themeKey];
    const cells = document.querySelectorAll('.question-cell');
    for (let i = 0; i < theme.questions.length; i++) {
        const key = `${themeKey}-${i}`;
        const cell = cells[i];
        if (answeredQuestions[key]) {
            cell.classList.add('answered');
            // Добавляем крестик, если ещё нет
            if (!cell.querySelector('.checkmark')) {
                const check = document.createElement('i');
                check.className = 'fas fa-times checkmark';
                check.style.marginLeft = '5px';
                cell.appendChild(check);
            }
            cell.style.pointerEvents = 'none';
        }
    }
}

// Генерация карточек тем
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
        const key = `${themeKey}-${i}`;
        if (answeredQuestions[key]) {
            cell.classList.add('answered');
            cell.style.pointerEvents = 'none';
            const check = document.createElement('i');
            check.className = 'fas fa-times checkmark';
            cell.appendChild(check);
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
    questionValueSpan.innerText = `💰 ${q.value} очков`;
    questionTextEl.innerText = q.text;
    answerInput.value = '';
    feedbackDiv.innerHTML = '';
    currentHelpMultiplier = 1;
    questionModal.classList.remove('hidden');
}

function checkAnswer() {
    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = selectedQuestion.data.answer.toLowerCase();
    const isCorrect = userAnswer === correctAnswer;
    let message = '';

    if (isCorrect) {
        const points = selectedQuestion.data.value * 1000;
        currentScore += points;
        updateScoreDisplay();
        message = `✅ Правильно! Вы заработали ${points} очков.`;
        let casinoTask = selectedQuestion.data.casinoTask;
        if (currentHelpMultiplier > 1) {
            casinoTask = `${casinoTask} (усложнено на ${(currentHelpMultiplier-1)*100}%)`;
        }
        message += `<br>🎰 Задание казино: ${casinoTask}`;
        // Отмечаем вопрос как отвеченный
        markQuestionAnswered(selectedQuestion.theme, selectedQuestion.index);
    } else {
        const multipliedTask = `⚠️ Задание усложнено в 2 раза: ${selectedQuestion.data.casinoTask} (необходимо выполнить дважды)`;
        message = `❌ Неправильно. Правильный ответ: ${correctAnswer}.<br>🎰 ${multipliedTask}`;
    }

    showResultMessage(isCorrect ? 'Верно!' : 'Неверно', message);
    questionModal.classList.add('hidden');
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

closeThemeModal.addEventListener('click', () => themeModal.classList.add('hidden'));
closeQuestionModal.addEventListener('click', () => questionModal.classList.add('hidden'));
closeResultBtn.addEventListener('click', () => resultModal.classList.add('hidden'));
closeCongratsBtn.addEventListener('click', () => congratsModal.classList.add('hidden'));

submitAnswer.addEventListener('click', checkAnswer);
helpChat.addEventListener('click', () => useHelp('chat'));
helpVika.addEventListener('click', () => useHelp('vika'));
helpBatya.addEventListener('click', () => useHelp('batya'));

// Инициализация
renderThemes();
updateScoreDisplay();

window.addEventListener('click', (e) => {
    if (e.target === themeModal) themeModal.classList.add('hidden');
    if (e.target === questionModal) questionModal.classList.add('hidden');
    if (e.target === viewerModal) viewerModal.classList.add('hidden');
    if (e.target === resultModal) resultModal.classList.add('hidden');
    if (e.target === congratsModal) congratsModal.classList.add('hidden');
});