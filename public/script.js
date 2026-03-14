const socket = io();

// Ключ сохранения
const SAVE_KEY = 'lab_save';

// Состояние игры
let gameState = {
    level: 1,
    currentBalance: 1500000,
    balanceHistory: [],
    availableTasks: [],
    currentCards: [],
    selectedTaskId: null,
    gameCompleted: false
};

// DOM элементы
const levelSpan = document.getElementById('current-level');
const balanceSpan = document.getElementById('current-balance');
const cardsContainer = document.getElementById('cards-container');
const historyDiv = document.getElementById('history-list');
const poolStatsDiv = document.getElementById('pool-stats');
const resetBtn = document.getElementById('reset-btn');
const applyBalanceBtn = document.getElementById('apply-start-balance');
const taskModal = document.getElementById('task-modal');
const taskDesc = document.getElementById('task-description');
const newBalanceInput = document.getElementById('new-balance');
const completeBtn = document.getElementById('complete-task');
const failBtn = document.getElementById('fail-task');
const completionModal = document.getElementById('completion-modal');
const finalMessage = document.getElementById('final-message');
const finalBalanceSpan = document.getElementById('final-balance');
const completionResetBtn = document.getElementById('completion-reset-btn');
const rulesModal = document.getElementById('rules-modal');
const dontShowCheckbox = document.getElementById('dont-show-rules');
const startQuestBtn = document.getElementById('start-quest-btn');

let selectedTaskInProgress = false;
let isAnimating = false;
let pendingState = null;

// ------------------- Функции сохранения -------------------
function saveGameState() {
    try {
        const saveData = {
            ...gameState,
            timestamp: Date.now()
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    } catch (e) {}
}

function loadGameState() {
    try {
        const saved = localStorage.getItem(SAVE_KEY);
        if (!saved) return null;
        const data = JSON.parse(saved);
        if (Date.now() - data.timestamp > 24*60*60*1000) {
            localStorage.removeItem(SAVE_KEY);
            return null;
        }
        return data;
    } catch (e) {
        return null;
    }
}

function clearSavedGame() {
    localStorage.removeItem(SAVE_KEY);
}

// ------------------- Подключение к серверу -------------------
socket.on('connect', () => {
    const saved = loadGameState();
    if (saved && !saved.gameCompleted) {
        if (confirm('Найден сохранённый эксперимент. Восстановить?')) {
            gameState = saved;
            updateUI();
            updatePoolStats();
            return;
        } else {
            clearSavedGame();
        }
    }
    socket.emit('reset', 1500000);
});

socket.on('state', (serverState) => {
    if (isAnimating) {
        pendingState = serverState;
    } else {
        // Копируем пул заданий, историю, баланс
        gameState.currentBalance = serverState.currentBalance;
        gameState.balanceHistory = serverState.balanceHistory;
        gameState.availableTasks = serverState.availableTasks;
        // Генерируем карточки для текущего уровня
        generateCardsForLevel();
        updateUI();
        updatePoolStats();
        saveGameState();
    }
});

function generateCardsForLevel() {
    if (gameState.availableTasks.length === 0) {
        gameState.currentCards = [];
        return;
    }
    // Берём 3 случайных задания из пула
    const shuffled = [...gameState.availableTasks].sort(() => 0.5 - Math.random());
    gameState.currentCards = shuffled.slice(0, 3).map(task => ({
        ...task,
        selected: false,
        completed: false
    }));
}

function updateUI() {
    levelSpan.textContent = gameState.level;
    renderCards();
    renderHistory();
    balanceSpan.textContent = gameState.currentBalance;
    if (gameState.level >= 30) {
        resetBtn.classList.remove('hidden');
    } else {
        resetBtn.classList.add('hidden');
    }
}

function updatePoolStats() {
    const counts = { '1★': 0, '2★': 0, '3★': 0, '4★': 0, '5★': 0, '6★': 0 };
    gameState.availableTasks.forEach(task => {
        const key = task.difficulty + '★';
        counts[key] = (counts[key] || 0) + 1;
    });
    poolStatsDiv.innerHTML = `
        <span>🧪 1★: ${counts['1★']}</span>
        <span>🧪 2★: ${counts['2★']}</span>
        <span>🧪 3★: ${counts['3★']}</span>
        <span>🧪 4★: ${counts['4★']}</span>
        <span>🧪 5★: ${counts['5★']}</span>
        <span>🧪 6★: ${counts['6★']}</span>
    `;
}

function renderCards() {
    cardsContainer.innerHTML = '';
    if (gameState.selectedTaskId) {
        // Режим одной выбранной карточки (после выбора)
        const task = gameState.currentCards.find(t => t.id === gameState.selectedTaskId);
        if (task) {
            const card = createCardElement(task, true);
            cardsContainer.appendChild(card);
        }
    } else {
        gameState.currentCards.forEach(task => {
            const card = createCardElement(task, false);
            cardsContainer.appendChild(card);
        });
    }
}

function createCardElement(task, isSelected) {
    const card = document.createElement('div');
    card.className = `card ${task.selected ? 'selected' : ''} ${task.completed ? 'completed' : ''}`;
    card.dataset.id = task.id;

    const stars = '★'.repeat(task.difficulty) + '☆'.repeat(6 - task.difficulty);
    const difficultyHTML = `<div class="difficulty" style="color: ${getColorForDifficulty(task.difficulty)}">${stars}</div>`;
    const taskText = `<div class="task-text">${task.description}</div>`;

    let buttons = '';
    if (!task.selected && !task.completed && !gameState.selectedTaskId) {
        buttons = `<button class="select-btn">🧪 Выбрать</button>`;
    } else if (task.selected && !task.completed) {
        buttons = `
            <button class="complete-btn">✅ Успех</button>
            <button class="penalty-btn">💥 Взрыв</button>
        `;
    } else if (task.completed) {
        buttons = `<button disabled>✔ Выполнено</button>`;
    }

    card.innerHTML = difficultyHTML + taskText + `<div class="card-actions">${buttons}</div>`;

    // Обработчики
    if (!task.selected && !task.completed && !gameState.selectedTaskId) {
        card.querySelector('.select-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            selectTask(task.id);
        });
    } else if (task.selected && !task.completed) {
        card.querySelector('.complete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            openTaskModal(task.id);
        });
        card.querySelector('.penalty-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            applyPenalty(task.id);
        });
    }
    return card;
}

function getColorForDifficulty(diff) {
    const colors = ['#0f0', '#ff0', '#f90', '#f0f', '#0ff', '#f00'];
    return colors[diff-1] || '#fff';
}

function selectTask(taskId) {
    const task = gameState.currentCards.find(t => t.id === taskId);
    if (!task) return;

    // Помечаем выбранную карту, остальные сжигаем (анимация)
    gameState.currentCards.forEach(t => {
        if (t.id !== taskId) {
            t.completed = true; // для анимации сгорания
        }
    });
    renderCards();

    // Добавляем класс burn для невыбранных
    document.querySelectorAll('.card').forEach(c => {
        if (c.dataset.id !== taskId) {
            c.classList.add('burn');
        }
    });

    isAnimating = true;
    setTimeout(() => {
        // После анимации оставляем только выбранную карту
        gameState.currentCards = [task];
        task.selected = true;
        gameState.selectedTaskId = taskId;
        renderCards();
        isAnimating = false;
        if (pendingState) {
            gameState.currentBalance = pendingState.currentBalance;
            gameState.balanceHistory = pendingState.balanceHistory;
            gameState.availableTasks = pendingState.availableTasks;
            generateCardsForLevel();
            updateUI();
            updatePoolStats();
            pendingState = null;
        }
    }, 500);

    socket.emit('selectTask', taskId);
}

function openTaskModal(taskId) {
    const task = gameState.currentCards.find(t => t.id === taskId);
    if (!task) return;
    gameState.currentTaskId = taskId;
    taskDesc.textContent = task.description;
    newBalanceInput.value = gameState.currentBalance;
    taskModal.classList.remove('hidden');
}

function completeTask(success) {
    const newBalance = parseFloat(newBalanceInput.value);
    if (isNaN(newBalance)) return;

    const change = newBalance - gameState.currentBalance;
    const taskId = gameState.currentTaskId;

    if (success) {
        socket.emit('completeTask', taskId, change);
        addHistoryEntry(`✅ Эксперимент успешен: ${change>0?'+'+change:change} 🔬`);
    } else {
        socket.emit('penaltyWithBalance', taskId, newBalance);
        addHistoryEntry(`💥 Взрыв! Потеряно реактивов`);
    }

    // Обновляем карточку
    const task = gameState.currentCards.find(t => t.id === taskId);
    if (task) {
        task.completed = true;
        task.selected = false;
    }
    gameState.selectedTaskId = null;
    gameState.currentTaskId = null;

    // Переход на следующий уровень
    if (gameState.level < 30) {
        gameState.level++;
        generateCardsForLevel();
    } else {
        // Завершение игры
        gameState.gameCompleted = true;
        endGame();
    }

    taskModal.classList.add('hidden');
    updateUI();
    updatePoolStats();
    saveGameState();
}

function applyPenalty(taskId) {
    openTaskModal(taskId);
}

function addHistoryEntry(text) {
    const entry = document.createElement('div');
    entry.className = 'history-item';
    entry.textContent = text;
    historyDiv.appendChild(entry);
    historyDiv.scrollTop = historyDiv.scrollHeight;
}

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

function endGame() {
    finalMessage.textContent = 'Эксперимент завершён!';
    finalBalanceSpan.textContent = gameState.currentBalance;
    completionModal.classList.remove('hidden');
    clearSavedGame();
}

function resetGame() {
    gameState = {
        level: 1,
        currentBalance: 1500000,
        balanceHistory: [],
        availableTasks: [],
        currentCards: [],
        selectedTaskId: null,
        gameCompleted: false
    };
    socket.emit('reset', 1500000);
    clearSavedGame();
    updateUI();
    updatePoolStats();
}

// ------------------- Обработчики -------------------
applyBalanceBtn.addEventListener('click', () => {
    const newBal = prompt('Введите новый начальный баланс:', gameState.currentBalance);
    if (newBal && !isNaN(newBal)) {
        gameState.currentBalance = parseFloat(newBal);
        balanceSpan.textContent = gameState.currentBalance;
        socket.emit('addBalance', 'Изменение баланса', 0);
    }
});

resetBtn.addEventListener('click', () => {
    if (confirm('Начать новый эксперимент?')) {
        resetGame();
    }
});

completeBtn.addEventListener('click', () => completeTask(true));
failBtn.addEventListener('click', () => completeTask(false));

completionResetBtn.addEventListener('click', () => {
    completionModal.classList.add('hidden');
    resetGame();
});

// Правила
if (!localStorage.getItem('quest_rules_hidden')) {
    setTimeout(() => rulesModal.classList.remove('hidden'), 500);
}
startQuestBtn.addEventListener('click', () => {
    if (dontShowCheckbox.checked) localStorage.setItem('quest_rules_hidden', 'true');
    rulesModal.classList.add('hidden');
});
// кнопка для правил добавится позже
// пока можно через консоль открыть

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.add('hidden');
    }
});

// Анимация сгорания
(function addBurnAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        .card.burn {
            animation: burn 0.5s forwards;
            pointer-events: none;
        }
        @keyframes burn {
            0% { opacity:1; transform:scale(1); filter:brightness(1); }
            100% { opacity:0; transform:scale(0) rotate(10deg); filter:brightness(2); }
        }
    `;
    document.head.appendChild(style);
})();

// ------------------- Анимация пузырьков на заднем фоне -------------------
(function initBubbles() {
    const canvas = document.getElementById('bubbles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    const bubbles = [];
    const BUBBLE_COUNT = 50;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < BUBBLE_COUNT; i++) {
        bubbles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 10 + 5,
            speed: Math.random() * 0.5 + 0.2,
            opacity: Math.random() * 0.5 + 0.3,
            color: `rgba(100, 255, 100, ${Math.random()*0.3+0.2})`
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        bubbles.forEach(b => {
            b.y -= b.speed;
            if (b.y + b.radius < 0) {
                b.y = height + b.radius;
                b.x = Math.random() * width;
            }
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.fillStyle = b.color;
            ctx.shadowColor = '#0f0';
            ctx.shadowBlur = 15;
            ctx.fill();
            ctx.shadowBlur = 0;
        });
        requestAnimationFrame(animate);
    }
    animate();
})();