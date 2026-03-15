const socket = io();

const SAVE_KEY = 'lab_save';

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
const flaskGagBtn = document.getElementById('flask-gag-btn');
const completionResetBtn = document.getElementById('completion-reset-btn');
const rulesModal = document.getElementById('rules-modal');
const dontShowCheckbox = document.getElementById('dont-show-rules');
const startQuestBtn = document.getElementById('start-quest-btn');

let selectedTaskInProgress = false;
let isAnimating = false;
let pendingState = null;

function getReagentClass(diff) {
    const classes = ['F', 'D', 'C', 'B', 'A', 'S'];
    return classes[diff-1] || '?';
}

function getClassColor(diff) {
    const colors = ['f', 'd', 'c', 'b', 'a', 's'];
    return colors[diff-1] || 'f';
}

function saveGameState() {
    try {
        const saveData = { ...gameState, timestamp: Date.now() };
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
    } catch (e) { return null; }
}

function clearSavedGame() {
    localStorage.removeItem(SAVE_KEY);
}

function generateCardsForLevel() {
    if (gameState.gameCompleted) return;
    if (gameState.availableTasks.length === 0) {
        gameState.currentCards = [];
        return;
    }

    let message = '';
    let filteredTasks = gameState.availableTasks;

    if (gameState.level % 10 === 0) {
        filteredTasks = gameState.availableTasks.filter(t => t.difficulty >= 4);
        message = `🔥 Этап ${gameState.level}: Критические эксперименты (классы B, A, S)`;
    } else if (gameState.level % 5 === 0) {
        filteredTasks = gameState.availableTasks.filter(t => t.difficulty === 3 || t.difficulty === 4);
        message = `⚗️ Этап ${gameState.level}: Синтез сложных соединений (классы C и B)`;
    }

    if (message) {
        showToast(message);
    }

    if (filteredTasks.length < 3) {
        filteredTasks = gameState.availableTasks;
    }

    const shuffled = [...filteredTasks].sort(() => 0.5 - Math.random());
    gameState.currentCards = shuffled.slice(0, 3).map(task => ({
        ...task,
        selected: false,
        completed: false
    }));
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

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
    if (gameState.gameCompleted) return;

    if (isAnimating) {
        pendingState = serverState;
    } else {
        gameState.level = serverState.level;
        gameState.currentBalance = serverState.currentBalance;
        gameState.balanceHistory = serverState.balanceHistory;
        gameState.availableTasks = serverState.availableTasks;

        if (!gameState.selectedTaskId && gameState.currentCards.length === 0) {
            if (gameState.level >= 30) {
                if (gameState.availableTasks.length === 0) {
                    endGame();
                    return;
                } else {
                    generateCardsForLevel();
                }
            } else {
                generateCardsForLevel();
            }
        }

        updateUI();
        updatePoolStats();
        saveGameState();
    }
});

function updateUI() {
    levelSpan.textContent = gameState.level;
    balanceSpan.textContent = gameState.currentBalance;
    renderCards();
    renderHistory();
    resetBtn.classList.toggle('hidden', gameState.level < 30);
}

function updatePoolStats() {
    const counts = { F:0, D:0, C:0, B:0, A:0, S:0 };
    gameState.availableTasks.forEach(task => {
        const cls = getReagentClass(task.difficulty);
        counts[cls]++;
    });
    poolStatsDiv.innerHTML = Object.entries(counts).map(([cls, num]) => `
        <div class="stat-item">
            <span class="reagent-class ${cls.toLowerCase()}">${cls}</span>
            <span>${num}</span>
        </div>
    `).join('');
}

function renderCards() {
    cardsContainer.innerHTML = '';
    if (gameState.selectedTaskId) {
        // не показываем карточки
        return;
    }
    gameState.currentCards.forEach(task => {
        cardsContainer.appendChild(createCardElement(task));
    });
}

function createCardElement(task) {
    const card = document.createElement('div');
    card.className = `card ${task.completed ? 'completed' : ''}`;
    card.dataset.id = task.id;

    const reagentClass = getReagentClass(task.difficulty);
    const classColor = getClassColor(task.difficulty);
    card.innerHTML = `
        <div class="reagent-class ${classColor}">${reagentClass}</div>
        <div class="task-text">${task.description}</div>
        <div class="card-actions">
            <button class="select-btn">🧪 Выбрать</button>
        </div>
    `;

    card.querySelector('.select-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        selectTask(task.id);
    });

    return card;
}

function selectTask(taskId) {
    const task = gameState.currentCards.find(t => t.id === taskId);
    if (!task) return;

    gameState.currentCards.forEach(t => {
        if (t.id !== taskId) {
            t.completed = true;
        }
    });
    renderCards();

    document.querySelectorAll('.card').forEach(c => {
        if (c.dataset.id !== taskId) {
            c.classList.add('burn');
        }
    });

    isAnimating = true;
    setTimeout(() => {
        gameState.currentCards = [];
        gameState.selectedTaskId = taskId;
        task.selected = true;
        renderCards();
        isAnimating = false;
        if (pendingState) {
            gameState.level = pendingState.level;
            gameState.currentBalance = pendingState.currentBalance;
            gameState.balanceHistory = pendingState.balanceHistory;
            gameState.availableTasks = pendingState.availableTasks;
            updateUI();
            updatePoolStats();
            pendingState = null;
        }
        openTaskModal(taskId);
    }, 500);

    socket.emit('selectTask', taskId);
}

function openTaskModal(taskId) {
    const task = gameState.availableTasks.find(t => t.id === taskId);
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

    gameState.selectedTaskId = null;
    gameState.currentTaskId = null;

    if (gameState.level === 30 && gameState.currentCards.length === 0 && !gameState.gameCompleted) {
        endGame();
    }

    taskModal.classList.add('hidden');
    updateUI();
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
    if (gameState.gameCompleted) return;
    gameState.gameCompleted = true;
    finalMessage.innerHTML = '🎉 Поздравляем! Вы прошли все 30 этапов и одолели злого учёного!<br>' +
        'Но будьте начеку… кажется, он оставил одну странную колбу.';
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
    if (confirm('Начать новый эксперимент?')) resetGame();
});

completeBtn.addEventListener('click', () => completeTask(true));
failBtn.addEventListener('click', () => completeTask(false));

if (flaskGagBtn) {
    flaskGagBtn.addEventListener('click', () => {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = 'Накид брюнеточке, мяу';
            toast.classList.remove('hidden');
            setTimeout(() => toast.classList.add('hidden'), 3000);
        }
    });
}

if (completionResetBtn) {
    completionResetBtn.addEventListener('click', () => {
        completionModal.classList.add('hidden');
        resetGame();
    });
}

// Правила
if (!localStorage.getItem('quest_rules_hidden')) {
    setTimeout(() => rulesModal.classList.remove('hidden'), 500);
}
startQuestBtn.addEventListener('click', () => {
    if (dontShowCheckbox.checked) localStorage.setItem('quest_rules_hidden', 'true');
    rulesModal.classList.add('hidden');
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) e.target.classList.add('hidden');
});

// Анимация пузырьков
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