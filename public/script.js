const socket = io();

let topics = [];
let gameState = {
    selectedTopic: null,
    selectedDifficulty: null,
    asked: false,
    score: 0
};

let answeredCells = new Set(); // храним отвеченные ячейки как "topic|difficulty"

// DOM элементы
const gameBoard = document.getElementById('game-board');
const questionPanel = document.getElementById('question-panel');
const questionText = document.getElementById('question-text');
const taskInfo = document.getElementById('task-info');
const answerInput = document.getElementById('answer-input');
const submitBtn = document.getElementById('submit-answer');
const helpChat = document.getElementById('help-chat');
const helpVika = document.getElementById('help-vika');
const helpBatya = document.getElementById('help-batya');
const helpResultDiv = document.getElementById('help-result');
const messageDiv = document.getElementById('message');
const scoreSpan = document.getElementById('score');
const resetBtn = document.getElementById('reset-game');
const modal = document.getElementById('result-modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalTask = document.getElementById('modal-task');
const closeModalBtn = document.getElementById('close-modal');

function renderBoard() {
    gameBoard.innerHTML = '';
    // Заголовки тем (первые 5 ячеек в строке)
    const headerRow = document.createElement('div');
    headerRow.className = 'topic-row';
    topics.forEach(topic => {
        const headerCell = document.createElement('div');
        headerCell.className = 'topic-header';
        headerCell.textContent = topic;
        headerRow.appendChild(headerCell);
    });
    gameBoard.appendChild(headerRow);

    // 5 строк сложности (от 1 до 5)
    for (let diff = 1; diff <= 5; diff++) {
        const row = document.createElement('div');
        row.className = 'topic-row';
        topics.forEach(topic => {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = diff;
            const cellKey = `${topic}|${diff}`;
            if (answeredCells.has(cellKey)) {
                cell.classList.add('disabled');
                cell.textContent = '✓';
            } else {
                cell.addEventListener('click', () => {
                    if (gameState.asked) {
                        showMessage('Сначала ответьте на текущий вопрос', 'error');
                        return;
                    }
                    socket.emit('selectCell', topic, diff);
                });
            }
            row.appendChild(cell);
        });
        gameBoard.appendChild(row);
    }
}

function showMessage(msg, type = 'info') {
    messageDiv.textContent = msg;
    messageDiv.style.color = type === 'error' ? '#ff6666' : '#ffd700';
    setTimeout(() => { messageDiv.textContent = ''; }, 3000);
}

function showHelp(text) {
    helpResultDiv.textContent = text;
    helpResultDiv.classList.remove('hidden');
    setTimeout(() => helpResultDiv.classList.add('hidden'), 5000);
}

// Сокет события
socket.on('init', (data) => {
    topics = data.topics;
    gameState = data.gameState;
    scoreSpan.textContent = gameState.score;
    renderBoard();
    if (gameState.asked) {
        // если уже есть активный вопрос (при перезагрузке)
        // лучше запросить заново, но для простоты просто скроем панель
        questionPanel.classList.add('hidden');
    } else {
        questionPanel.classList.add('hidden');
    }
});

socket.on('questionSelected', (data) => {
    gameState.asked = true;
    gameState.selectedTopic = data.topic;
    gameState.selectedDifficulty = data.difficulty;
    questionText.textContent = `Вопрос (сложность ${data.difficulty}): ${data.question}`;
    taskInfo.textContent = `🎲 Задание в казино: ${data.task}`;
    questionPanel.classList.remove('hidden');
    answerInput.value = '';
    helpResultDiv.classList.add('hidden');
    messageDiv.textContent = '';
    // Очищаем предыдущие подсказки
});

socket.on('answerResult', (data) => {
    gameState.asked = false;
    gameState.score = data.score;
    scoreSpan.textContent = gameState.score;
    // Отмечаем ячейку как отвеченную
    const cellKey = `${gameState.selectedTopic}|${gameState.selectedDifficulty}`;
    answeredCells.add(cellKey);
    renderBoard();
    questionPanel.classList.add('hidden');
    // Показываем модалку с результатом
    modalTitle.textContent = data.isCorrect ? '✅ Правильно!' : '❌ Неправильно';
    modalMessage.textContent = data.resultMessage;
    modalTask.textContent = data.taskModifier;
    modal.classList.remove('hidden');
});

socket.on('helpResult', (data) => {
    showHelp(data.helpText);
});

socket.on('resetComplete', () => {
    gameState = {
        selectedTopic: null,
        selectedDifficulty: null,
        asked: false,
        score: 0
    };
    answeredCells.clear();
    scoreSpan.textContent = 0;
    renderBoard();
    questionPanel.classList.add('hidden');
    modal.classList.add('hidden');
    showMessage('Игра сброшена!');
});

socket.on('error', (msg) => {
    showMessage(msg, 'error');
});

// Кнопки
submitBtn.addEventListener('click', () => {
    const answer = answerInput.value.trim();
    if (!answer) {
        showMessage('Введите ответ', 'error');
        return;
    }
    socket.emit('answer', answer);
});

helpChat.addEventListener('click', () => socket.emit('useHelp', 'chat'));
helpVika.addEventListener('click', () => socket.emit('useHelp', 'vika'));
helpBatya.addEventListener('click', () => socket.emit('useHelp', 'batya'));

resetBtn.addEventListener('click', () => {
    if (confirm('Начать новую игру? Весь прогресс будет сброшен.')) {
        socket.emit('reset');
    }
});

closeModalBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
});

// Инициализация
renderBoard();