(function() {
    // ======================== ЗАДАНИЯ ========================
    // Здесь можно будет легко менять задания. Я добавил разнообразие:
    // спины, покупка бонусов, специальные режимы, live-игры.
    const TASKS = [
        { id: 1, title: "Le Bandit", desc: "40 спинов в Le Bandit (Hacksaw Gaming). Цель: максимальный множитель ≥ x50. Дополнительно: если выпадет радуга (Rainbow) — бонус x2 к очкам.", multiplier: 1.5 },
        { id: 2, title: "Chaos Crew 2", desc: "30 спинов в Chaos Crew 2 (Hacksaw Gaming). Цель: поймать бонусный раунд (любой).", multiplier: 2 },
        { id: 3, title: "Mental", desc: "50 спинов в Mental (NoLimit City). Цель: максимальный множитель ≥ x100.", multiplier: 2 },
        { id: 4, title: "San Quentin xWays", desc: "40 спинов в San Quentin xWays (NoLimit City). Цель: активировать xWays (любой) и получить множитель ≥ x50.", multiplier: 1.5 },
        { id: 5, title: "Tomb of Nefertiti", desc: "35 спинов в Tomb of Nefertiti (Play'n GO). Цель: выигрыш > 50$ (при ставке 1$).", multiplier: 1 },
        { id: 6, title: "Reactoonz 2", desc: "45 спинов в Reactoonz 2 (Play'n GO). Цель: поймать Gargantoon (огромный символ).", multiplier: 2 },
        { id: 7, title: "Jammin' Jars 2", desc: "30 спинов в Jammin' Jars 2 (Push Gaming). Цель: максимальный множитель ≥ x200.", multiplier: 2 },
        { id: 8, title: "Razor Returns", desc: "40 спинов в Razor Returns (Push Gaming). Цель: поймать акулу (бонусный раунд с акулами).", multiplier: 1.5 },
        { id: 9, title: "Money Train 4", desc: "Купить бонус за 100x ставки в Money Train 4 (Relax Gaming). Цель: окупить бонус (получить ≥ 100x).", multiplier: 2 },
        { id: 10, title: "Temple Tumble 2", desc: "50 спинов в Temple Tumble 2 (Relax Gaming). Цель: максимальный множитель ≥ x75.", multiplier: 1.5 },
        { id: 11, title: "Fruit Party 2", desc: "35 спинов в Fruit Party 2 (Pragmatic Play). Цель: максимальный множитель ≥ x50.", multiplier: 1 },
        { id: 12, title: "Starz MegaWays", desc: "40 спинов в Starz MegaWays (Red Tiger). Цель: выигрыш > 30$ (при ставке 1$).", multiplier: 1 },
        { id: 13, title: "Dragon's Fire", desc: "30 спинов в Dragon's Fire (Red Tiger). Цель: поймать бонусный раунд с драконом.", multiplier: 1.5 },
        { id: 14, title: "Book of Shadows", desc: "45 спинов в Book of Shadows (NoLimit City). Цель: максимальный множитель ≥ x150.", multiplier: 2 },
        { id: 15, title: "Punk Rocker", desc: "30 спинов в Punk Rocker (NoLimit City). Цель: поймать бонус (любой).", multiplier: 1.5 },
        { id: 16, title: "Рулетка", desc: "3 ставки на красное/чёрное в рулетке. Цель: выиграть 2 из 3.", multiplier: 1 },
        { id: 17, title: "Блэкджек", desc: "3 раздачи в блэкджеке. Цель: выиграть 2 из 3.", multiplier: 1 },
        { id: 18, title: "Wild Walker", desc: "40 спинов в Wild Walker (Play'n GO). Цель: максимальный множитель ≥ x60.", multiplier: 1.5 },
        { id: 19, title: "Gorilla Kingdom", desc: "35 спинов в Gorilla Kingdom (NetEnt). Цель: поймать бонус с гориллой.", multiplier: 1.5 },
        { id: 20, title: "Vikings Go Berzerk", desc: "40 спинов в Vikings Go Berzerk (Yggdrasil). Цель: максимальный множитель ≥ x80.", multiplier: 1.5 }
    ];

    // ======================== СОСТОЯНИЕ ========================
    let state = {
        playerName: '',
        completed: [],      // id выполненных заданий
        results: {},        // { id: result }
        totalScore: 0,
        bonusCount: 0
    };

    let currentTaskId = null;

    // ======================== DOM ========================
    const gridEl = document.getElementById('gridContainer');
    const modalOverlay = document.getElementById('taskModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const resultInput = document.getElementById('resultInput');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalSaveBtn = document.getElementById('modalSaveBtn');
    const doneCountEl = document.getElementById('doneCount');
    const totalScoreEl = document.getElementById('totalScore');
    const progressBar = document.getElementById('progressBar');
    const lbName = document.getElementById('lbName');
    const lbScore = document.getElementById('lbScore');
    const lbDone = document.getElementById('lbDone');
    const bonusCountEl = document.getElementById('bonusCount');
    const playerNameInput = document.getElementById('playerName');
    const applyNameBtn = document.getElementById('applyNameBtn');
    const resetBtn = document.getElementById('resetBtn');

    // ======================== API ========================
    async function loadPlayer(name) {
        try {
            const res = await fetch(`/api/player/${encodeURIComponent(name)}`);
            if (!res.ok) throw new Error('Ошибка загрузки');
            const data = await res.json();
            return data;
        } catch (err) {
            console.warn('Не удалось загрузить данные, используем локальное состояние', err);
            return null;
        }
    }

    async function savePlayer(name, data) {
        try {
            const res = await fetch(`/api/player/${encodeURIComponent(name)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('Ошибка сохранения');
            return await res.json();
        } catch (err) {
            console.warn('Не удалось сохранить данные на сервере', err);
        }
    }

    // ======================== ФУНКЦИИ ========================
    async function refreshState() {
        const name = state.playerName.trim();
        if (!name) return;
        const serverData = await loadPlayer(name);
        if (serverData) {
            // объединяем с локальным, но серверный приоритет
            state.completed = serverData.completed || [];
            state.results = serverData.results || {};
            state.totalScore = serverData.totalScore || 0;
            state.bonusCount = serverData.bonusCount || 0;
        } else {
            // если сервер не ответил, используем локальное
        }
        // пересчёт очков на всякий случай
        recalcScore();
        renderAll();
    }

    function recalcScore() {
        state.totalScore = state.completed.reduce((sum, id) => {
            const task = TASKS.find(t => t.id === id);
            const result = state.results[id] || 0;
            return sum + (result * (task ? task.multiplier : 1));
        }, 0);
        state.bonusCount = Math.floor(state.completed.length / 5);
    }

    function renderAll() {
        renderGrid();
        updateStats();
    }

    function renderGrid() {
        gridEl.innerHTML = '';
        TASKS.forEach(task => {
            const cell = document.createElement('div');
            cell.className = 'cell';
            const isDone = state.completed.includes(task.id);
            if (isDone) cell.classList.add('done');
            cell.dataset.id = task.id;

            const numSpan = document.createElement('div');
            numSpan.className = 'cell-number';
            numSpan.textContent = isDone ? '✔' : task.id;
            cell.appendChild(numSpan);

            if (isDone) {
                const res = state.results[task.id] || 0;
                const resSpan = document.createElement('div');
                resSpan.className = 'cell-result';
                resSpan.textContent = `${res} очков`;
                cell.appendChild(resSpan);
            }

            cell.addEventListener('click', () => openTask(task.id));
            gridEl.appendChild(cell);
        });
    }

    function updateStats() {
        const done = state.completed.length;
        doneCountEl.textContent = done;
        totalScoreEl.textContent = state.totalScore;
        const progress = (done / TASKS.length) * 100;
        progressBar.style.width = progress + '%';
        lbName.textContent = state.playerName || '—';
        lbScore.textContent = state.totalScore;
        lbDone.textContent = `${done}/${TASKS.length}`;
        bonusCountEl.textContent = state.bonusCount;
    }

    function openTask(id) {
        if (state.completed.includes(id)) return;
        const task = TASKS.find(t => t.id === id);
        if (!task) return;
        currentTaskId = id;
        modalTitle.textContent = `Задание #${id}: ${task.title}`;
        modalDesc.innerHTML = `${task.desc}<br><br><span style="color:#8892a0;">Сложность: x${task.multiplier}</span>`;
        resultInput.value = '';
        modalOverlay.classList.add('active');
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        currentTaskId = null;
    }

    async function saveResult() {
        const id = currentTaskId;
        if (id === null) return;
        const task = TASKS.find(t => t.id === id);
        if (!task) return;
        const value = parseFloat(resultInput.value);
        if (isNaN(value) || value < 0) {
            alert('Введите положительное число (множитель или сумму выигрыша)');
            return;
        }

        // Обновляем состояние
        state.completed.push(id);
        state.results[id] = value;
        recalcScore();

        // Сохраняем на сервер
        const name = state.playerName.trim();
        if (name) {
            await savePlayer(name, {
                completed: state.completed,
                results: state.results,
                totalScore: state.totalScore,
                bonusCount: state.bonusCount
            });
        }

        renderAll();
        closeModal();
    }

    async function resetGame() {
        if (!confirm('Сбросить весь прогресс для этого участника?')) return;
        const name = state.playerName.trim();
        if (name) {
            // Очищаем на сервере
            await savePlayer(name, { completed: [], results: {}, totalScore: 0, bonusCount: 0 });
        }
        state.completed = [];
        state.results = {};
        state.totalScore = 0;
        state.bonusCount = 0;
        renderAll();
    }

    async function applyName() {
        const name = playerNameInput.value.trim();
        if (!name) {
            alert('Введите имя участника');
            return;
        }
        state.playerName = name;
        await refreshState();
        // после загрузки обновляем интерфейс
        renderAll();
    }

    // ======================== ИНИЦИАЛИЗАЦИЯ ========================
    async function init() {
        // Проверяем сохранённое имя в localStorage (для удобства)
        const savedName = localStorage.getItem('questPlayerName');
        if (savedName) {
            playerNameInput.value = savedName;
            state.playerName = savedName;
            await refreshState();
            renderAll();
        } else {
            // показываем пустое состояние
            renderAll();
        }

        // События
        applyNameBtn.addEventListener('click', applyName);
        resetBtn.addEventListener('click', resetGame);
        modalCloseBtn.addEventListener('click', closeModal);
        modalSaveBtn.addEventListener('click', saveResult);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
            if (e.key === 'Enter' && modalOverlay.classList.contains('active')) {
                saveResult();
            }
        });
        playerNameInput.addEventListener('change', () => {
            localStorage.setItem('questPlayerName', playerNameInput.value.trim());
        });
    }

    init();
})();
