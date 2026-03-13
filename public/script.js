const socket = io();

// Состояние игры
let gameState = {
    playerPosition: 0,          // индекс текущей клетки (0-29)
    boardSize: 30,              // количество клеток
    currentBalance: 1500000,
    balanceHistory: [],
    availableTasks: [],
    currentTaskId: null,
    gameCompleted: false
};

// DOM элементы
const balanceSpan = document.getElementById('current-balance');
const historyDiv = document.getElementById('history-list');
const rollDiceBtn = document.getElementById('roll-dice');
const diceResultSpan = document.getElementById('dice-result');
const resetBtn = document.getElementById('reset-btn');
const applyBalanceBtn = document.getElementById('apply-start-balance');
const taskModal = document.getElementById('task-modal');
const cellNumberSpan = document.getElementById('cell-number');
const taskDesc = document.getElementById('task-description');
const newBalanceInput = document.getElementById('new-balance');
const completeBtn = document.getElementById('complete-task');
const failBtn = document.getElementById('fail-task');
const completionModal = document.getElementById('completion-modal');
const finalMessage = document.getElementById('final-message');
const finalBalanceSpan = document.getElementById('final-balance');
const completionResetBtn = document.getElementById('completion-reset-btn');

// Canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ------------------- Отрисовка поля -------------------
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cellCount = gameState.boardSize;
    const radius = 250;
    const centerX = canvas.width/2;
    const centerY = canvas.height/2;

    // Рисуем круглое поле
    for (let i = 0; i < cellCount; i++) {
        const angle = (i / cellCount) * Math.PI * 2 - Math.PI/2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        // Клетка
        ctx.fillStyle = i === gameState.playerPosition ? '#ffaa00' : '#2a2440';
        ctx.strokeStyle = 'gold';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, 2*Math.PI);
        ctx.fill();
        ctx.stroke();

        // Номер клетки
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Cinzel';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(i+1, x, y);
    }

    // Финишная клетка (последняя)
    const finalAngle = ((cellCount-1) / cellCount) * Math.PI*2 - Math.PI/2;
    const fx = centerX + radius * Math.cos(finalAngle);
    const fy = centerY + radius * Math.sin(finalAngle);
    ctx.fillStyle = 'gold';
    ctx.font = 'bold 24px Cinzel';
    ctx.fillText('🏁', fx, fy-40);
}

// ------------------- Бросок кубика -------------------
function rollDice() {
    if (gameState.gameCompleted) return;
    const dice = Math.floor(Math.random() * 6) + 1;
    diceResultSpan.textContent = dice;
    movePlayer(dice);
}

function movePlayer(steps) {
    gameState.playerPosition = (gameState.playerPosition + steps) % gameState.boardSize;
    drawBoard();

    // Если попали на финиш (последняя клетка) и обошли круг
    if (gameState.playerPosition === gameState.boardSize-1) {
        // Можно сделать финиш бонусным
        addHistoryEntry('🏁 Вы на финишной клетке!');
    }

    // Открываем модалку с заданием
    openTaskModal();
}

// ------------------- Задание -------------------
function openTaskModal() {
    if (gameState.availableTasks.length === 0) {
        alert('Нет заданий!');
        return;
    }
    const task = gameState.availableTasks[Math.floor(Math.random() * gameState.availableTasks.length)];
    gameState.currentTaskId = task.id;
    cellNumberSpan.textContent = gameState.playerPosition + 1;
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
        addHistoryEntry(`✅ Задание выполнено (изменение: ${change>0?'+'+change:change})`);
    } else {
        socket.emit('penaltyWithBalance', gameState.currentTaskId, newBalance);
        addHistoryEntry(`❌ Провал задания`);
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
    diceResultSpan.textContent = '0';
    historyDiv.innerHTML = '';
    socket.emit('reset', gameState.currentBalance);
    drawBoard();
}

// ------------------- Подключение к серверу -------------------
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
rollDiceBtn.addEventListener('click', rollDice);
completeBtn.addEventListener('click', () => completeTask(true));
failBtn.addEventListener('click', () => completeTask(false));
resetBtn.addEventListener('click', resetGame);
applyBalanceBtn.addEventListener('click', () => {
    const newBal = prompt('Введите новый начальный баланс:', gameState.currentBalance);
    if (newBal && !isNaN(newBal)) {
        gameState.currentBalance = parseFloat(newBal);
        balanceSpan.textContent = gameState.currentBalance;
        socket.emit('addBalance', 'Изменение баланса', 0);
    }
});
completionResetBtn.addEventListener('click', () => {
    completionModal.classList.add('hidden');
    resetGame();
});