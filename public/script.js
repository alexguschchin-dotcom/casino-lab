const socket = io();

// Конфигурация поля Monopoly (40 клеток)
const BOARD_CELLS = 40;
const CELL_NAMES = [
    "Старт", "Балтийская ул.", "Обществ. казна", "Восток. ул.", "Налог",
    "Ж/д вокзал", "Орловская ул.", "Шанс", "Гоголевская ул.", "Тюрьма",
    "Петроградская ул.", "Электричество", "Пушкинская ул.", "Невский пр.", "Ж/д вокзал",
    "Каменноостровский", "Обществ. казна", "Московский пр.", "Шанс", "Бесплатная стоянка",
    "Тверская ул.", "Шанс", "Малая Бронная", "Ж/д вокзал", "Арбат",
    "Налог", "Ул. Горького", "Водопровод", "Большая Полянка", "Ж/д вокзал",
    "Кутузовский пр.", "Обществ. казна", "Шанс", "Ленинский пр.", "Смоленская пл.",
    "Шанс", "Профсоюзная ул.", "Налог", "Ж/д вокзал", "Воробьёвы горы"
];
const CELL_COLORS = [
    "#8B4513", "#8B4513", "#DDD", "#87CEEB", "#DDD",
    "#000", "#87CEEB", "#DDD", "#87CEEB", "#666",
    "#FF69B4", "#DDD", "#FF69B4", "#FF69B4", "#000",
    "#FF8C00", "#DDD", "#FF8C00", "#DDD", "#EEE",
    "#DC143C", "#DDD", "#DC143C", "#000", "#DC143C",
    "#DDD", "#FFFF00", "#DDD", "#FFFF00", "#000",
    "#00FF00", "#DDD", "#DDD", "#00FF00", "#00FF00",
    "#DDD", "#4169E1", "#DDD", "#000", "#4169E1"
]; // упрощённо, но для демо

let gameState = {
    playerPosition: 0,
    currentBalance: 1500000,
    balanceHistory: [],
    availableTasks: [],
    currentTaskId: null,
    gameCompleted: false,
    playerToken: '🚗' // можно выбрать случайно
};

// DOM элементы
const canvas = document.getElementById('boardCanvas');
const ctx = canvas.getContext('2d');
const balanceSpan = document.getElementById('current-balance');
const historyDiv = document.getElementById('history-list');
const dice1 = document.getElementById('dice1');
const dice2 = document.getElementById('dice2');
const rollBtn = document.getElementById('roll-dice');
const resetBtn = document.getElementById('reset-btn');
const applyBalanceBtn = document.getElementById('apply-start-balance');
const playerTokenSpan = document.getElementById('playerToken');
const playerPositionSpan = document.getElementById('player-position');
const taskModal = document.getElementById('task-modal');
const taskDesc = document.getElementById('task-description');
const newBalanceInput = document.getElementById('new-balance');
const completeBtn = document.getElementById('complete-task');
const failBtn = document.getElementById('fail-task');
const completionModal = document.getElementById('completion-modal');
const finalMessage = document.getElementById('final-message');
const finalBalanceSpan = document.getElementById('final-balance');
const completionResetBtn = document.getElementById('completion-reset-btn');

// Выбор случайной фишки
const tokens = ['🚗', '🐕', '🚢', '🧵', '👞', '🎩'];
gameState.playerToken = tokens[Math.floor(Math.random() * tokens.length)];
playerTokenSpan.textContent = gameState.playerToken;

// ------------------- Отрисовка поля -------------------
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width/2;
    const centerY = canvas.height/2;
    const radius = 320; // радиус круга
    const cellWidth = 60;
    const cellHeight = 40;

    // Рисуем клетки по кругу
    for (let i = 0; i < BOARD_CELLS; i++) {
        const angle = (i / BOARD_CELLS) * Math.PI * 2 - Math.PI/2; // начинаем с верхней точки
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        // Прямоугольник клетки (повёрнутый)
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle + Math.PI/2); // чтобы текст читался
        ctx.fillStyle = CELL_COLORS[i % CELL_COLORS.length];
        ctx.strokeStyle = 'gold';
        ctx.lineWidth = 3;
        ctx.fillRect(-cellWidth/2, -cellHeight/2, cellWidth, cellHeight);
        ctx.strokeRect(-cellWidth/2, -cellHeight/2, cellWidth, cellHeight);
        ctx.restore();

        // Номер клетки
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(i+1, x, y-10);
    }

    // Рисуем фишку игрока
    const playerAngle = (gameState.playerPosition / BOARD_CELLS) * Math.PI * 2 - Math.PI/2;
    const px = centerX + radius * Math.cos(playerAngle);
    const py = centerY + radius * Math.sin(playerAngle);
    ctx.font = '48px "Segoe UI Emoji"';
    ctx.fillStyle = 'black';
    ctx.shadowColor = 'gold';
    ctx.shadowBlur = 15;
    ctx.fillText(gameState.playerToken, px-20, py-20);
    ctx.shadowBlur = 0;
}

// ------------------- Бросок кубиков -------------------
function rollDice() {
    if (gameState.gameCompleted) return;
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    dice1.textContent = ['⚀','⚁','⚂','⚃','⚄','⚅'][d1-1];
    dice2.textContent = ['⚀','⚁','⚂','⚃','⚄','⚅'][d2-1];
    const steps = d1 + d2;
    movePlayer(steps);
}

function movePlayer(steps) {
    gameState.playerPosition = (gameState.playerPosition + steps) % BOARD_CELLS;
    playerPositionSpan.textContent = `Клетка ${gameState.playerPosition+1}`;
    drawBoard();

    // Анимация движения можно добавить позже

    // Открываем задание для текущей клетки
    openTaskModal();
}

// ------------------- Задание -------------------
function openTaskModal() {
    if (gameState.availableTasks.length === 0) {
        alert('Нет заданий');
        return;
    }
    const task = gameState.availableTasks[Math.floor(Math.random() * gameState.availableTasks.length)];
    gameState.currentTaskId = task.id;
    taskDesc.textContent = task.description;
    newBalanceInput.value = gameState.currentBalance;
    taskModal.classList.remove('hidden');
}

function completeTask(success) {
    const newBalance = parseFloat(newBalanceInput.value);
    if (isNaN(newBalance)) return;

    const change = newBalance - gameState.currentBalance;
    if (success) {
        socket.emit('completeTask', gameState.currentTaskId, change);
        addHistoryEntry(`✅ Сделка закрыта: ${change>0?'+'+change:change}₽`);
    } else {
        socket.emit('penaltyWithBalance', gameState.currentTaskId, newBalance);
        addHistoryEntry(`❌ Банкротство: ${change}₽`);
    }
    taskModal.classList.add('hidden');
}

function addHistoryEntry(text) {
    const entry = document.createElement('div');
    entry.className = 'history-item';
    entry.textContent = text;
    historyDiv.appendChild(entry);
    historyDiv.scrollTop = historyDiv.scrollHeight;
}

function endGame(message) {
    gameState.gameCompleted = true;
    finalMessage.textContent = message;
    finalBalanceSpan.textContent = gameState.currentBalance;
    completionModal.classList.remove('hidden');
}

function resetGame() {
    gameState.playerPosition = 0;
    gameState.currentBalance = 1500000;
    gameState.gameCompleted = false;
    playerPositionSpan.textContent = 'Клетка 1';
    historyDiv.innerHTML = '';
    socket.emit('reset', gameState.currentBalance);
    drawBoard();
}

// ------------------- Socket -------------------
socket.on('connect', () => {
    socket.emit('reset', 1500000);
});

socket.on('state', (serverState) => {
    gameState.currentBalance = serverState.currentBalance;
    gameState.balanceHistory = serverState.balanceHistory;
    gameState.availableTasks = serverState.availableTasks;
    balanceSpan.textContent = gameState.currentBalance;
    renderHistory();
    drawBoard();
});

function renderHistory() {
    historyDiv.innerHTML = '';
    gameState.balanceHistory.slice().reverse().forEach(entry => {
        const date = new Date(entry.timestamp);
        const time = date.toLocaleTimeString();
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `<strong>${time}</strong> ${entry.desc} (${entry.change>0?'+'+entry.change:entry.change})`;
        historyDiv.appendChild(div);
    });
}

// ------------------- Обработчики -------------------
rollBtn.addEventListener('click', rollDice);
completeBtn.addEventListener('click', () => completeTask(true));
failBtn.addEventListener('click', () => completeTask(false));
resetBtn.addEventListener('click', resetGame);
applyBalanceBtn.addEventListener('click', () => {
    const newBal = prompt('Введите новый начальный баланс:', gameState.currentBalance);
    if (newBal && !isNaN(newBal)) {
        gameState.currentBalance = parseFloat(newBal);
        balanceSpan.textContent = gameState.currentBalance;
        socket.emit('addBalance', 'Изменение капитала', 0);
    }
});
completionResetBtn.addEventListener('click', () => {
    completionModal.classList.add('hidden');
    resetGame();
});

// Инициализация
drawBoard();